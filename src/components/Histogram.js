import * as d3 from 'd3';
import { useState, useMemo, useCallback } from "react";
import { margin, chartParams } from '../constants/constants.js';
import AxisBottom from './AxisBottom.js';
import AxisLeft from './AxisLeft.js';
import Tooltip from './Tooltip.js';
import Rect from './Rect.js';

function Histogram({ width, height, mini, content }) {
    const data = content.data;
    const max = content.max;
    const [tooltipData, settooltipData] = useState(null);

    const xScale = useMemo(() => {
        return d3.scaleLinear()
            .domain([data.binsBase[0].x0, data.binsBase[data.binsBase.length - 1].x1])
            .range((mini) ? [0, width] : [margin(mini).left, width - margin(mini).right]);
    }, [data.binsBase, width, mini]);

    const yScale = useMemo(() => {
        return d3.scaleLinear()
            .domain([0, Math.max(...max)]).nice()
            .range((mini) ? [height, 0] : [height - margin(mini).bottom, margin(mini).top]);
    }, [height, max, mini]);

    const handleHover = useCallback((rectData) => {
        settooltipData(rectData);
    }, []);

    return (
        <div style={{ position: "relative"}}>
            <svg width={width} height={height}>
                <AxisLeft yScale={yScale} width={width} mini={mini} />
                <g transform={`translate(0, ${mini ? height : height - margin(mini).bottom})`}>
                    <AxisBottom xScale={xScale} height={height} width={width} mini={mini}/>
                </g>
                <Rect 
                    bins={data.binsBase}
                    xScale={xScale}
                    yScale={yScale}
                    height={height}
                    mini={mini}
                    onHover={handleHover}
                />
            </svg>
            {!mini && <div style={{
                position: "absolute",
                width,
                height,
                top: 0,
                left: 0,
                pointerEvents: "none"
            }}>
                <Tooltip interactionData={tooltipData} chartWidth={width}/>
                {(tooltipData && tooltipData.value <= chartParams.threshold) && <div style={{ 
                    position: "absolute",
                    top: tooltipData.y,
                    left: tooltipData.x,
                    width: tooltipData.width,
                    height: tooltipData.height,
                    opacity: 0.2,
                    backgroundColor: "#151623"
                }}/>}
            </div>}
        </div>
    );
};

export default Histogram;