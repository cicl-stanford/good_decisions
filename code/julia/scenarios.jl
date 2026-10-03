# Enumerate the space of possible experiments (a combination of observational and experimental probabilities) 
# and compare how much the observational data changes the CDM's expected benefit. 
# Used to select the trials for the experiments (see select_trials.jl).

using DataFrames

include("objectives.jl")

# Column names shared with the experiment_trials.csv files
const TRIAL_PROB_COLS = [Symbol("P(y|x)"), Symbol("P(y|x')"), Symbol("P(y|do(x))"), Symbol("P(y|do(x'))")]
const EXP_PROB_COLS = TRIAL_PROB_COLS[3:4]


"""
    valid_scenarios(probs, β, γ, θ, δ; px=0.5, atol=1e-9)

Enumerate every combination of `P(y|x)`, `P(y|x')`, `P(y|do(x))` and
`P(y|do(x'))` drawn from `probs` and keep those that are jointly possible (see
`benefit_bounds`). Returns a `DataFrame` with one row per valid scenario: the four
probabilities, the payoffs, the benefit `lower` and `upper` bounds, their
midpoint `obj` (the CDM's expected benefit), and `width = upper - lower`.
"""
function valid_scenarios(probs, β, γ, θ, δ; px=0.5, atol=1e-9)
    rows = NamedTuple[]
    for pYX in probs, pYXp in probs, pyx in probs, pyxp in probs
        bounds = try
            benefit_bounds(pYX, pYXp, pyx, pyxp, β, γ, θ, δ; px, atol)
        catch e
            e isa ArgumentError || rethrow()
            continue    # impossible combination of probabilities
        end
        push!(rows, (; pYX, pYXp, pyx, pyxp, β, γ, θ, δ, lower=bounds[1], upper=bounds[2]))
    end
    df = DataFrame(rows)
    rename!(df, [:pYX, :pYXp, :pyx, :pyxp] .=> TRIAL_PROB_COLS)
    df.obj = (df.lower + df.upper) / 2
    df.width = df.upper - df.lower
    return df
end


"""
    groupby_experiment(df)

Group scenarios by their experimental data (`P(y|do(x))`, `P(y|do(x'))`), keeping
only groups where different observational data give different `obj` values,
i.e. where the observational data changes the expected benefit.
"""
function groupby_experiment(df)
    gdf = groupby(df, EXP_PROB_COLS)
    return filter(g -> nrow(unique(g, :obj)) > 1, gdf)
end


"""
    sort_by_difference(df, col)

For each group from `groupby_experiment`, compute the largest difference in
`col` (e.g. `:obj` or `:width`) across the group and keep the rows with the
minimum and maximum value. Returns a vector of `(difference, rows)` sorted from
largest to smallest difference.
"""
function sort_by_difference(df, col)
    diffs = [
        (
            maximum(g[:, col]) - minimum(g[:, col]),
            filter(row -> row[col] in (minimum(g[:, col]), maximum(g[:, col])), g)
        )
        for g in groupby_experiment(df)
    ]
    return sort(diffs, by=first, rev=true)
end
