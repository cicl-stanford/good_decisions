# Julia code

Code for the counterfactual decision model (CDM) from the paper *Making good
decisions: Inferring counterfactual probabilities from experimental and
observational data*. It computes:

- the probability that a person is a complier, always-goer, never-goer, or defier,
  given experimental and observational data (Equations 1-4),
- the expected benefit of handing out a flyer (Equation 6), which is the CDM's prediction for each trial,
- the 22 trials shown to participants, and
- participants' performance-based bonuses.

The statistical analysis of the experiments is done in R (`../R/analysis`).

## Setup

Requires Julia (developed with 1.13). From this directory, install the pinned dependencies once:

```bash
julia --project=. -e 'using Pkg; Pkg.instantiate()'
```

## Scripts

Run every script from this directory with `julia --project=. <script>.jl`. Each
script writes its results to `output/`.

| Script | What it does | Output | Paper |
|---|---|---|---|
| `select_trials.jl` | Searches all possible combinations of observational and experimental probabilities and selects the 22 trials | `output/selected_trials.csv` | Trial design (Experiment 1, Design) |
| `compute_trial_model.jl` | Computes the CDM's expected benefit, its bounds, and the probability of each type for every trial, along with the range of possible bonuses | `output/<experiment>/experiment_trial_objs.csv`, `benefit_proportions.csv` | Table 1, Table B1 (normative columns), Figure 3 (bonus range and random baseline), CDM predictor in Tables 2-3 and Figure 4 |
| `compute_bonuses.jl` | Computes each participant's bonus from their decisions | `output/<experiment>/bonuses.csv` | Figure 3, Table C1 |

`<experiment>` is the folder in `data/`. The folders correspond to the paper as
follows:

| Folder | Paper |
|---|---|
| `experiment1&2` | Experiment 1, "no feedback" |
| `experiment3&4` | Experiment 1, "feedback" |
| `experiment5&6` | Experiment 2, "people inference" (novices) |
| `experiment9&10` | Experiment 2, "data composition" |
| `experiment11&12` | Experiment 3, experts |

(`experiment7&8` was planned but never run.) The trials are the same in every
experiment but are presented in a different order; the trial CSVs and outputs keep
the order used in the R analysis, whereas Table 1 in the paper sorts them by
expected benefit. Bonuses for the expert study were not paid by performance and are
computed in the R analysis.

## Model code

- `objectives.jl` implements the CDM.
  - `benefit_bounds` gives lower and upper bounds on the expected benefit
    (Theorem 1 of Li & Pearl; a single value under gain equality, Theorem 4).
  - `expected_benefit` is the midpoint of the bounds. It is the CDM's decision
    variable, and it is used when the data don't identify the benefit exactly (for
    example trials 6 and 20 in the paper).
  - `type_probabilities` and `complier_bounds` give the probability of each type
    (Equations 1-4).
  - `PAYOFFS` holds the payoffs used in the experiments.
- `scenarios.jl` enumerates the possible experiments used by `select_trials.jl`.

For example, the "Zeus Theater" scenario from the paper:

```julia
include("objectives.jl")

# P(y|x) = 1, P(y|x') = 1, P(y|do(x)) = 0.7, P(y|do(x')) = 0.5
expected_benefit(1.0, 1.0, 0.7, 0.5, PAYOFFS...)   # -1.5
type_probabilities(1.0, 1.0, 0.7, 0.5)             # complier 0.5, always 0.2, never 0, defier 0.3
```

The observational probability of the action `P(x)` defaults to 0.5 (`px` keyword),
as in the experiments.

## Notes

- `benefit_bounds` accepts small floating-point errors (`atol=1e-9`) when checking
  that the probabilities are possible; pass `atol=0` to turn the tolerance off.
  `select_trials.jl` uses `atol=0`. With the tolerance, 4,763 combinations of
  probabilities are possible under the paper's payoffs; without it, 291 of them are
  left out because of rounding error, which gives the pool the 22 trials were
  originally selected from. None of the selected trials is affected. See the
  comment at the top of `select_trials.jl`.
- The eight groups of experimental probabilities that the trials are drawn from
  were chosen by hand among the highest-ranked ones, to balance trials with
  positive and negative expected benefit.
