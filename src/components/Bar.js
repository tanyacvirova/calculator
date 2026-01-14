import { useMemo } from "react";
import * as d3 from "d3";
import { margin, rosstatData } from "../constants/constants";
import { CurrentUserContext } from "../context/Context";
import { useContext } from "react";

function Bar({ width, height, mini }) {
    const userData = useContext(CurrentUserContext);
    const groups = rosstatData.map((d) => d.title);
    const chartWidth = width > 800 ? 800 : width;

    const yScale = useMemo(() => {
        return d3.scaleBand()
            .domain(groups)
            .range([0, height - margin(mini).top - margin(mini).bottom])
            .padding(0.05);
    }, [groups, height, mini]);

    const xScale = useMemo(() => {
        const max = d3.extent(rosstatData.map((d) => d.value))[1];
        return d3.scaleLinear()
            .domain([0, max])
            .range([0, chartWidth - margin(mini).right]);
    }, [mini, chartWidth]);

    const allBars = rosstatData.map((d, i) => {
        const y = yScale(d.title);

        if (y === undefined) {
            return null;
        };

        if (height <= 0) {
            return null;
        };

        return(
            <g key={i}>
                <rect
                    x={xScale(0)}
                    y={yScale(d.title)}
                    width={xScale(d.value)}
                    height={yScale.bandwidth()}
                    fill={+userData.status === d.key ? "#FF6A3D" : "#D9D9D9"}
                />
                <text
                    x={10}
                    y={y + yScale.bandwidth() / 2}
                    textAnchor="start"
                    alignmentBaseline="central"
                    fontSize={18}
                >
                    {`${d3.format(".2f")(d.value)}% — ${d.title}`}
                </text>
            </g>
        );
    });
    
    return(
        <svg width={chartWidth} height={height}>
            <g 
                width={chartWidth - margin(mini).right}
                height={height - margin(mini).top - margin(mini).bottom}
                transform={`translate(${[0, margin(mini).top].join(",")})`}
            >
                {allBars}
            </g>
        </svg>
    );
};

export default Bar;
