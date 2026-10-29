# Counterfactual decision model (CDM)
#
# Given experimental and observational data about a binary action x and binary
# outcome y, the CDM bounds the probability of each counterfactual type of
# person (complier, always-goer, never-goer, defier) and, from these, the
# expected benefit of taking the action.
#
# Notation (matches the paper):
#   pYX   = P(y | x)      observational probability of y given x
#   pYXp  = P(y | x')     observational probability of y given x'
#   pyx   = P(y_x)        experimental probability of y under do(x)
#   pyxp  = P(y_x')       experimental probability of y under do(x')
#   px    = P(x)          probability of x in the observational data
#   β, γ, θ, δ            benefit of acting on a complier, always-goer,
#                         never-goer, and defier, respectively


# Payoffs used in the paper's experiments (Figure 1): handing out a flyer earns
# $10 from a complier and $0, minus a $0.50 flyer cost; a defier costs $20 (lost
# profit and reputation) plus the flyer.
const PAYOFFS = (β=9.5, γ=-0.5, θ=-0.5, δ=-20.5)


"""
    benefit_bounds(pYX, pYXp, pyx, pyxp, β, γ, θ, δ; px=0.5, atol=1e-9)

Lower and upper bounds `(lower, upper)` on the expected benefit
`β·P(complier) + γ·P(always-goer) + θ·P(never-goer) + δ·P(defier)`
(Equation 6) of acting, given both observational and experimental data.

The bounds follow Theorem 1 of Li & Pearl. When the payoffs satisfy gain
equality (`β + δ == γ + θ`), the benefit is identified from the experimental
data alone (Theorem 4) and `lower == upper`.

Throws an `ArgumentError` if any probability is outside `[0, 1]`, or if the
probabilities are jointly impossible (the experimental probability `pyx` must
lie in `[P(x,y), P(x,y) + P(x')]`, and the resulting bounds must not cross).
"""
function benefit_bounds(pYX, pYXp, pyx, pyxp, β, γ, θ, δ; px=0.5, atol=1e-9)
    all(p -> 0 <= p <= 1, (pYX, pYXp, pyx, pyxp, px)) ||
        throw(ArgumentError("Probabilities must be in range [0,1]"))

    # Gain equality (Theorem 4): benefit is point-identified by experimental data
    if β + δ == γ + θ
        benefit = (β-θ)*pyx + (γ-β)*pyxp + θ
        return (benefit, benefit)
    end
    σ = β - γ - θ + δ   # nonzero whenever gain equality fails

    # Joint observational probabilities P(x,y), P(x',y), P(x,y'), P(x',y')
    p_xy, p_xpy = pYX*px, pYXp*(1-px)
    p_xyp, p_xpyp = (1-pYX)*px, (1-pYXp)*(1-px)
    p_y = p_xy + p_xpy

    # Experimental probabilities of the complementary outcome
    pypx, pypxp = 1-pyx, 1-pyxp

    # Possibility region: P(x,y) <= P(y_x) <= P(x,y) + P(x')
    p_xy - atol <= pyx <= p_xy + 1 - px + atol ||
        throw(ArgumentError("Impossible probabilities: P(y_x)=$pyx is outside [$p_xy, $(p_xy + 1 - px)]"))

    # Candidate bounds from Theorem 1. Depending on the sign of σ, the terms in
    # `A` are lower bounds and those in `B` upper bounds, or vice versa.
    a5 = (γ-δ)*pyx + δ*pyxp + θ*pypxp
    a6 = (β-θ)*pyx - (β-γ-θ)*pyxp + θ*pypxp
    a7 = (γ-δ)*pyx - (β-γ-θ)*pyxp + θ*pypxp + σ*p_y
    a8 = (β-θ)*pyx + δ*pyxp + θ*pypxp - σ*p_y
    b1 = (β-θ)*pyx + δ*pyxp + θ*pypxp
    b2 = γ*pyx + δ*pypx + (β-γ)*pypxp
    b3 = a5 + σ*(p_xy + p_xpyp)
    b4 = a6 + σ*(p_xpy + p_xyp)
    A = (a5, a6, a7, a8)
    B = (b1, b2, b3, b4)

    lower, upper = σ > 0 ? (maximum(A), minimum(B)) : (maximum(B), minimum(A))
    tol = atol * max(1, abs(β), abs(γ), abs(θ), abs(δ))
    lower <= upper + tol ||
        throw(ArgumentError("Impossible probabilities: lower bound ($lower) exceeds upper bound ($upper)"))
    lower <= upper || (lower = upper = (lower + upper) / 2)
    return (lower, upper)
end


"""
    expected_benefit(pYX, pYXp, pyx, pyxp, β, γ, θ, δ; px=0.5)

Expected benefit of acting, used as the CDM's decision variable: the midpoint of
`benefit_bounds`. When the data identify the benefit exactly the bounds
coincide; otherwise (e.g. trials 6 and 20 in the paper) the midpoint is used.
"""
function expected_benefit(pYX, pYXp, pyx, pyxp, β, γ, θ, δ; px=0.5)
    lower, upper = benefit_bounds(pYX, pYXp, pyx, pyxp, β, γ, θ, δ; px)
    return (lower + upper) / 2
end


"""
    type_probabilities(pYX, pYXp, pyx, pyxp; px=0.5)

Probability of each counterfactual type as a `NamedTuple`
`(complier, always, never, defier)`.

The complier probability is the midpoint of the bounds in Equation 1 (the bounds
coincide when the data identify it). The remaining types follow from
Equations 2-4:

    always  = P(y_x)  - complier
    defier  = complier - (P(y_x) - P(y_x'))
    never   = P(y'_x) - defier
"""
function type_probabilities(pYX, pYXp, pyx, pyxp; px=0.5)
    lower, upper = complier_bounds(pYX, pYXp, pyx, pyxp; px)
    complier = (lower + upper) / 2
    always = pyx - complier
    defier = complier - (pyx - pyxp)
    never = (1 - pyx) - defier
    return (; complier, always, never, defier)
end


"""
    complier_bounds(pYX, pYXp, pyx, pyxp; px=0.5)

Bounds `(lower, upper)` on P(complier) = P(y_x, y'_x') from Equation 1, using
both experimental and observational data. Throws an `ArgumentError` under the
same conditions as `benefit_bounds`.
"""
function complier_bounds(pYX, pYXp, pyx, pyxp; px=0.5)
    # A complier has benefit 1 and every other type 0, so the benefit bounds are
    # exactly the complier bounds.
    return benefit_bounds(pYX, pYXp, pyx, pyxp, 1, 0, 0, 0; px)
end
