# Compute the counterfactual decision model (CDM) for the experiment trials.
#
# For each experiment folder in data/, reads experiment_trials.csv (the 22 trials
# in the order they are indexed in the R analysis) and writes to output/<folder>/:
#   experiment_trial_objs.csv   the CDM's expected benefit (cf_mean) and its lower and upper bounds (cf_min, cf_max)
#   benefit_proportions.csv     probability of each counterfactual type plus the benefit
#
# It also prints the range of possible bonuses and the expected bonus of random responding.
#
# Usage: julia --project=. compute_trial_model.jl

using CSV, DataFrames

include("objectives.jl")

const DATA_DIR = joinpath(@__DIR__, "..", "..", "data")
const OUTPUT_DIR = joinpath(@__DIR__, "output")
const EXPERIMENT_FOLDERS = [
    "experiment1&2", "experiment3&4", "experiment5&6", "experiment9&10", "experiment11&12",
]
const TRIAL_PROB_COLS = [Symbol("P(y|x)"), Symbol("P(y|x')"), Symbol("P(y|do(x))"), Symbol("P(y|do(x'))")]

# Participants start with a $1 bonus, which changes by the benefit of each decision divided by 10.
const START_BONUS = 1.0
const BENEFIT_TO_DOLLARS = 0.1


"""
CDM expected benefit (`cf_mean`) and its bounds (`cf_min`, `cf_max`) for each
trial, keeping the trials' probabilities.
"""
function model_predictions(trials)
    bounds = [benefit_bounds(Tuple(row[TRIAL_PROB_COLS])..., PAYOFFS...) for row in eachrow(trials)]
    predictions = trials[:, TRIAL_PROB_COLS]
    predictions.cf_mean = [(lower + upper) / 2 for (lower, upper) in bounds]
    predictions.cf_min = first.(bounds)
    predictions.cf_max = last.(bounds)
    return predictions
end


"""
Probability of each counterfactual type for each trial, along with the expected benefit and its bounds.
"""
function benefit_proportions(trials)
    proportions = trials[:, TRIAL_PROB_COLS]
    types = [type_probabilities(Tuple(row[TRIAL_PROB_COLS])...) for row in eachrow(trials)]
    predictions = model_predictions(trials)
    proportions.benefit = predictions.cf_mean
    proportions.lowerbound = predictions.cf_min
    proportions.upperbound = predictions.cf_max
    proportions.p_alwaystaker = [t.always for t in types]
    proportions.p_complier = [t.complier for t in types]
    proportions.p_defier = [t.defier for t in types]
    proportions.p_nevertaker = [t.never for t in types]
    return proportions
end


"""
Best, worst, and expected (random responding) bonus given the trials' expected
benefits. A participant hands out the flyer on a trial, and receives its benefit, 
or does not, and receives nothing. A random responder hands out the flyer half of the time.
"""
function bonus_bounds(cf_mean)
    bonus(total) = START_BONUS + BENEFIT_TO_DOLLARS * total
    return (
        best=bonus(sum(max.(cf_mean, 0))),
        worst=bonus(sum(min.(cf_mean, 0))),
        random=bonus(sum(cf_mean) / 2),
    )
end


function main()
    for folder in EXPERIMENT_FOLDERS
        trials = CSV.read(joinpath(DATA_DIR, folder, "experiment_trials.csv"), DataFrame)
        outputs = [
            "experiment_trial_objs.csv" => model_predictions(trials),
            "benefit_proportions.csv" => benefit_proportions(trials),
        ]
        mkpath(joinpath(OUTPUT_DIR, folder))
        for (filename, output) in outputs
            CSV.write(joinpath(OUTPUT_DIR, folder, filename), output)
        end
    end

    cf_mean = model_predictions(CSV.read(
        joinpath(DATA_DIR, EXPERIMENT_FOLDERS[1], "experiment_trials.csv"), DataFrame)).cf_mean
    bonus = bonus_bounds(cf_mean)
    println("\nBonus if every decision is correct:   ", round(bonus.best, digits=3))
    println("Bonus if every decision is incorrect: ", round(bonus.worst, digits=3))
    println("Expected bonus of random responding:  ", round(bonus.random, digits=3))
end

main()
