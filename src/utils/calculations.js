import * as d3 from "d3";

export function bining(data, attr) {
    let cumSum = 0;
    const exp = d3.range(0, attr.threshold / attr.step + 1, 1).map((d, i) => {
        cumSum = cumSum + data.get(d);
        return {
            x0: d * attr.step,
            x1: (d + 1) * attr.step,
            sum: data.get(d),
            cumSum: cumSum
        }
    })
    return exp;
}

export function calculating(region, attr, userData) {
    // Calculating intervals. 
    const addGroup = region.map(obj => {
        const max = Math.floor(attr.threshold / attr.step);
        const currentBase = Math.floor(obj.sum / attr.step);
        const currentScaled = Math.floor(obj.sum_corr / attr.step);
        
        return {
            ...obj,
            groupBase: currentBase <= max ? currentBase : max,
            groupScaled: currentScaled <= max ? currentScaled : max
        }
    });

    // Calculating sum for each bin.
    const calcShareBase = d3.rollup(addGroup, (D) => d3.sum(D, (d) => d.step), (d) => d.groupBase);
    const calcShareScaled = d3.rollup(addGroup, (D) => d3.sum(D, (d) => d.step), (d) => d.groupScaled);

    // Calculating share of families with income below user data.
    const index = Math.floor((userData.perCapitaIncome - 1000) / 500);
    const belowBase = (() => {
        if (index >= 1000) {
            return region[999];
        } else if (index < 0) {
            return region[0];
        } else {
            return region[index];
        }
    })();

    const findShareCorr = d3.minIndex(region.map(obj => {
        return {
            ...obj,
            diff: Math.abs(obj.sum_corr - userData.perCapitaIncome)
        }
    }), (d) => d.diff);
    const belowScaled = region[findShareCorr];

    // Bining.
    const binsBase = bining(calcShareBase, attr);
    const binsScaled = bining(calcShareScaled, attr);

    return {
        code: belowBase.code,
        region: belowBase.region,
        belowBase: belowBase.share,
        belowScaled: belowScaled.share,
        sumBase: Math.ceil(d3.sum(binsBase, (d) => d.sum)) === 100,
        sumScaled: Math.ceil(d3.sum(binsScaled, (d) => d.sum)) === 100,
        maxBase: d3.max(binsBase, (d) => d.sum),
        maxScaled: d3.max(binsScaled, (d) => d.sum),
        binsBase: binsBase,
        binsScaled: binsScaled
    };
}
