// Expected benefit of acting, combining observational and experimental data.
//
// Bounds on the probability of benefit, P(benefit) = P(y_x, y'_x') (i.e. the
// proportion of compliers), follow Tian & Pearl (2000) as presented in
// Mueller & Pearl (2022), "Personalized Decision Making -- A Conceptual
// Introduction" (arXiv:2208.09558), Eq. (tian). The proportion of the remaining
// counterfactual types follows from P(benefit) and the experimental data:
//
//   P(harm)          = P(benefit) - ATE                (defiers)
//   P(always-taker)  = P(y_x)  - P(benefit)
//   P(never-taker)   = P(y'_x') - P(benefit)
//
// so the expected benefit
//
//   B = beta * P(complier) + gamma * P(always) + theta * P(never) + delta * P(defier)
//
// is linear in P(benefit) with slope sigma = beta - gamma - theta + delta, and its
// bounds are attained at the bounds of P(benefit) (Li & Pearl, 2019, Theorem 1).
// If sigma = 0 ("gain equality"), B is point-identified from experimental data.
//
// With observational data only, consistency fixes y_x for people who chose x
// and y_x' for people who chose x', but leaves their other potential outcome
// unconstrained. E.g. a chooser of x who got y is a complier or an
// always-taker in any proportion. B is extremal when each such group is
// assigned entirely to its best (or worst) type:
//
//   max B = P(x,y)  * max(beta, gamma)  + P(x,y')  * max(theta, delta)
//         + P(x',y) * max(gamma, delta) + P(x',y') * max(beta, theta)
//
// (min analogously). The implied bounds on P(benefit) are [0, P(x,y) + P(x',y')].

(function (root) {
  const EPS = 1e-9;

  // obs: counts or probabilities {xy, xyp, xpy, xpyp}
  //      P(x, y), P(x, y'), P(x', y), P(x', y') -- normalized to sum to 1
  // exp: counts or probabilities {xy, xyp, xpy, xpyp}
  //      P(y | do(x)), P(y' | do(x)), P(y | do(x')), P(y' | do(x')) --
  //      normalized within each arm
  // rewards: {complier, always, never, defier}
  function compute(obs, exp, rewards) {
    const errors = [];
    const obsTotal = obs.xy + obs.xyp + obs.xpy + obs.xpyp;
    const armX = exp.xy + exp.xyp;
    const armXp = exp.xpy + exp.xpyp;
    const all = [obs.xy, obs.xyp, obs.xpy, obs.xpyp, exp.xy, exp.xyp, exp.xpy, exp.xpyp];
    if (all.some((v) => !Number.isFinite(v) || v < 0)) {
      errors.push("All probabilities must be non-negative numbers.");
    }
    if (!(obsTotal > 0)) errors.push("Observational values must not all be zero.");
    if (!(armX > 0)) errors.push("Experimental values for the 'with flyer' arm must not both be zero.");
    if (!(armXp > 0)) errors.push("Experimental values for the 'without flyer' arm must not both be zero.");
    if (errors.length) return { errors };

    // observational (joint) probabilities
    const Pxy = obs.xy / obsTotal;
    const Pxyp = obs.xyp / obsTotal;
    const Pxpy = obs.xpy / obsTotal;
    const Pxpyp = obs.xpyp / obsTotal;
    const Px = Pxy + Pxyp;
    const Py = Pxy + Pxpy;

    // experimental probabilities
    const Pyx = exp.xy / armX; // P(y_x)
    const Pyxp = exp.xpy / armXp; // P(y_x')
    const ATE = Pyx - Pyxp;

    // Consistency: P(x, y) <= P(y_x) <= 1 - P(x, y') and likewise for x'.
    if (Pxy > Pyx + EPS || Pyx > 1 - Pxyp + EPS) {
      errors.push(
        `Observational and experimental data are inconsistent: need P(x,y) ≤ P(y<sub>x</sub>) ≤ 1 − P(x,y'), ` +
          `i.e. ${fmt(Pxy)} ≤ ${fmt(Pyx)} ≤ ${fmt(1 - Pxyp)}.`
      );
    }
    if (Pxpy > Pyxp + EPS || Pyxp > 1 - Pxpyp + EPS) {
      errors.push(
        `Observational and experimental data are inconsistent: need P(x',y) ≤ P(y<sub>x'</sub>) ≤ 1 − P(x',y'), ` +
          `i.e. ${fmt(Pxpy)} ≤ ${fmt(Pyxp)} ≤ ${fmt(1 - Pxpyp)}.`
      );
    }

    // Tian-Pearl bounds on P(benefit). Labels are HTML: they are rendered in the
    // calculator's explanation table.
    const lowerTerms = [
      { label: "0", value: 0 },
      { label: "P(y<sub>x</sub>) − P(y<sub>x'</sub>)", value: ATE },
      { label: "P(y) − P(y<sub>x'</sub>)", value: Py - Pyxp },
      { label: "P(y<sub>x</sub>) − P(y)", value: Pyx - Py },
    ];
    const upperTerms = [
      { label: "P(y<sub>x</sub>)", value: Pyx },
      { label: "P(y'<sub>x'</sub>)", value: 1 - Pyxp },
      { label: "P(x,y) + P(x',y')", value: Pxy + Pxpyp },
      { label: "P(y<sub>x</sub>) − P(y<sub>x'</sub>) + P(x,y') + P(x',y)", value: ATE + Pxyp + Pxpy },
    ];
    const pnsLo = Math.max(...lowerTerms.map((t) => t.value));
    const pnsHi = Math.min(...upperTerms.map((t) => t.value));

    // experimental data only
    const expLo = Math.max(0, ATE);
    const expHi = Math.min(Pyx, 1 - Pyxp);

    if (!errors.length && pnsLo > pnsHi + EPS) {
      errors.push(`Lower bound on P(benefit) (${fmt(pnsLo)}) exceeds upper bound (${fmt(pnsHi)}).`);
    }

    const sigma = rewards.complier - rewards.always - rewards.never + rewards.defier;
    const types = (pc) => ({
      complier: pc,
      always: Pyx - pc,
      never: 1 - Pyxp - pc,
      defier: pc - ATE,
    });
    const benefit = (pc) => {
      const t = types(pc);
      return (
        rewards.complier * t.complier +
        rewards.always * t.always +
        rewards.never * t.never +
        rewards.defier * t.defier
      );
    };
    const interval = (lo, hi) => {
      const b1 = benefit(lo);
      const b2 = benefit(hi);
      const low = Math.min(b1, b2);
      const high = Math.max(b1, b2);
      return { low, high, mid: (low + high) / 2 };
    };

    // observational data only
    const obsBound = (pick) =>
      Pxy * pick(rewards.complier, rewards.always) +
      Pxyp * pick(rewards.never, rewards.defier) +
      Pxpy * pick(rewards.always, rewards.defier) +
      Pxpyp * pick(rewards.complier, rewards.never);
    const obsLow = obsBound(Math.min);
    const obsHigh = obsBound(Math.max);

    return {
      errors,
      obs: { Pxy, Pxyp, Pxpy, Pxpyp, Px, Py, Pyx_obs: Pxy / Px, Pyxp_obs: Pxpy / (1 - Px) },
      exp: { Pyx, Pyxp, ATE },
      pns: { lo: pnsLo, hi: pnsHi, lowerTerms, upperTerms },
      pnsExp: { lo: expLo, hi: expHi },
      pnsObs: { lo: 0, hi: Pxy + Pxpyp },
      typesLo: types(pnsLo),
      typesHi: types(pnsHi),
      sigma,
      benefit: interval(pnsLo, pnsHi),
      benefitExp: interval(expLo, expHi),
      benefitObs: { low: obsLow, high: obsHigh, mid: (obsLow + obsHigh) / 2 },
    };
  }

  function fmt(x) {
    return (Math.round(x * 1000) / 1000).toString();
  }

  const api = { compute };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Benefit = api;
})(this);
