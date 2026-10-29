# Compute participants' bonuses for the experiments run on Prolific.
#
# A participant starts with a $1 bonus. Each time they hand out the flyer, the
# bonus changes by the trial's expected benefit divided by 10; the bonus paid is at least $0. 
# `bonus_no_cap` is the bonus without this floor, as used in the analysis of performance.
#
# For each experiment folder, reads the trials and participants' decisions from
# data/ and writes bonuses.csv to output/<folder>/.
#
# The expert study (experiment11&12) was not paid by performance, and its bonuses
# are computed in the R analysis.
#
# Usage: julia --project=. compute_bonuses.jl

using CSV, DataFrames

const DATA_DIR = joinpath(@__DIR__, "..", "..", "data")
const OUTPUT_DIR = joinpath(@__DIR__, "output")

const START_BONUS = 1.0
const BENEFIT_TO_DOLLARS = 0.1

# Experiment folders with the prefix of their data files, the column recording whether the participant 
# handed out the flyer (1 = yes), and the conditions included in the bonus analysis (left/right refers 
# to the position of the data on screen, which doesn't affect the bonus)
const EXPERIMENTS = [
    (folder="experiment1&2", prefix="counterfactual_inference", decision=:button_pressed,
     conditions=["observational_left", "experimental_left"]),
    (folder="experiment3&4", prefix="counterfactual_inference", decision=:button_pressed,
     conditions=["observational_left_feedback", "experimental_left_feedback"]),
    (folder="experiment5&6", prefix="counterfactual_inference_exp3", decision=:flyer,
     conditions=["observational_left", "experimental_left"]),
    (folder="experiment9&10", prefix="counterfactual_inference_exp4", decision=:flyer,
     conditions=["observational_left", "experimental_left"]),
]


"""
Bonus of each participant in `experiment`, as a `DataFrame` with columns
`prolific_participant_id`, `bonus` and `bonus_no_cap`.
"""
function participant_bonuses(experiment)
    dir = joinpath(DATA_DIR, experiment.folder)
    read(name) = CSV.read(joinpath(dir, "$(experiment.prefix)-$name.csv"), DataFrame)

    trials = CSV.read(joinpath(dir, "experiment_trials.csv"), DataFrame)
    decisions = read("merged")
    participants = rightjoin(read("workerids"), read("participants"), on=:workerid)
    filter!(row -> row["proliferate.condition"] in experiment.conditions, participants)

    bonuses = DataFrame(prolific_participant_id=String[], bonus=Float64[], bonus_no_cap=Float64[])
    for participant in eachrow(participants)
        # Decisions ordered by trial, matching the rows of experiment_trials.csv
        decisions_made = sort(decisions[decisions.workerid .== participant.workerid, :], :trial)
        handed_out = trials[decisions_made[:, experiment.decision] .== 1, :]
        bonus_no_cap = round(START_BONUS + BENEFIT_TO_DOLLARS * sum(handed_out.obj), digits=2)
        push!(bonuses, (participant.prolific_participant_id, max(0, bonus_no_cap), bonus_no_cap))
    end
    return bonuses
end


function main()
    for experiment in EXPERIMENTS
        bonuses = participant_bonuses(experiment)
        mkpath(joinpath(OUTPUT_DIR, experiment.folder))
        CSV.write(joinpath(OUTPUT_DIR, experiment.folder, "bonuses.csv"), bonuses)

        println(experiment.folder, ": ", nrow(bonuses), " participants")
        println(describe(bonuses[:, [:bonus, :bonus_no_cap]], :mean, :median, :std, :min, :max))
    end
end

main()
