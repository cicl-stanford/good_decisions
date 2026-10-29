# Select the 22 trials shown to participants.
#
# 1. Enumerate every possible combination of observational and experimental
#    probabilities on a 0.1 grid, and compute the CDM's expected benefit.
# 2. Find experimental data for which the observational data changes the
#    expected benefit the most (groups ranked by the difference in benefit).
# 3. From eight of those groups (listed in EXPERIMENTS below), keep the
#    observational data giving the lowest and highest expected benefit.
#
# The eight groups were chosen by hand among the highest-ranked ones, to
# balance trials with positive and negative expected benefit (11 each) and to
# vary the experimental data. Groups are identified by their experimental
# probabilities, since several groups tie in rank.
#
# Writes output/selected_trials.csv.
#
# Usage: julia --project=. select_trials.jl

using CSV, DataFrames

include("scenarios.jl")

const PROBS = collect(0:0.1:1)
const OUTPUT_DIR = joinpath(@__DIR__, "output")

# (P(y|do(x)), P(y|do(x'))) of the selected groups
const EXPERIMENTS = [
    (0.5, 0.5), (0.6, 0.5), (0.7, 0.5), (0.6, 0.4),
    (0.5, 0.3), (0.5, 0.2), (0.7, 0.3), (0.5, 0.4),
]


"""
Keep the observational data with the lowest and highest expected benefit
within a group. If several rows tie, keep the one with the widest bounds
(the most uncertainty about the benefit).
"""
function extreme_rows(group)
    extremes = filter(row -> row.obj in extrema(group.obj), group)
    return combine(groupby(extremes, :obj)) do rows
        filter(row -> row.width == maximum(rows.width), rows)
    end
end


function select_trials(scenarios)
    ranked = sort_by_difference(scenarios, :obj)
    groups = Dict(Tuple(g[1, EXP_PROB_COLS]) => g for (_, g) in ranked)
    trials = reduce(vcat, [extreme_rows(groups[exp]) for exp in EXPERIMENTS])
    return select(trials, names(scenarios))    # same column order as the scenarios
end


function main()
    # atol=0 gives the pool of scenarios the trials were originally selected from (see README)
    scenarios = valid_scenarios(PROBS, PAYOFFS...; atol=0)
    println("Valid scenarios: ", nrow(scenarios))

    trials = select_trials(scenarios)
    println("Selected trials: ", nrow(trials),
            " (", count(trials.obj .> 0), " positive, ",
            count(trials.obj .< 0), " negative expected benefit)")

    mkpath(OUTPUT_DIR)
    CSV.write(joinpath(OUTPUT_DIR, "selected_trials.csv"), trials)
end

main()
