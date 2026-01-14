import * as d3 from 'd3';
import { useState, useMemo, useCallback } from "react";
import { margin, chartParams } from '../constants/constants';
import AxisBottom from './AxisBottom';
import AxisLeft from './AxisLeft';
import Tooltip from './Tooltip.js';
import AnimatedRect from './AnimatedRect.js';

function AnimatedHistogram({ width, height, mini, content }) {
    const data = content.data;
    const corr = content.corr;
    const side = content.side ? content.side : false;
    const max = mini ? Math.max(...content.max) : Math.max(...[data.maxScaled, data.maxBase]);
    const [tooltipData, setTooltipData] = useState(null);

    const binValues = useMemo(() => {
        return corr ? data.binsScaled : data.binsBase;
    }, [corr, data]);

    const xScale = useMemo(() => {
        return d3.scaleLinear()
            .domain([binValues[0].x0, binValues[binValues.length - 1].x1])
            .range([margin(mini, side).left, width - margin(mini, side).right]);
    }, [binValues, width, mini, side]);

    const yScale = useMemo(() => {
        return d3.scaleLinear()
            .domain([0, max]).nice()
            .range([height - margin(mini, side).bottom, margin(mini, side).top]);
    }, [height, max, mini, side]);

    const handleHover = useCallback((rectData) => {
        setTooltipData(rectData);
    }, []);

    const allRects = useMemo(() => {
        return binValues.map((bin, i) => {
            if (xScale.range()[-1] < 0 && yScale.range()[-1] < 0) {
                return null;
            }
            
            if (height <= 0) {
                return null;
            }

            const x = xScale(bin.x0) + (mini ? 0 : 1);
            const y = yScale(bin.sum);
            const rectWidth = xScale(bin.x1) - xScale(bin.x0) - (mini ? 0 : 1);
            const rectHeight = height - (margin(mini, side).bottom) - yScale(bin.sum);
            const value = bin.x1;
            const cum = bin.cumSum;

            return (
                <AnimatedRect
                    key={i}    
                    x={x}
                    y={y}
                    rectWidth={rectWidth}
                    rectHeight={rectHeight}
                    value={value}
                    cum={cum}
                    sum={bin.sum}
                    onHover={handleHover}
                />
            );
        });
    }, [binValues, xScale, yScale, height, mini, side, handleHover]);

    return (
        <div style={{ position: "relative"}}>
            <svg width={width} height={height}>
                <AxisLeft yScale={yScale} width={width} mini={mini} side={content.side}/>
                <g transform={`translate(0, ${height - margin(mini, side).bottom})`}>
                    <AxisBottom xScale={xScale} height={height} width={width} mini={mini} side={content.side}/>
                </g>
                {allRects}
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

export default AnimatedHistogram;