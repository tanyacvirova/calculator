import { useMemo } from 'react';
import { margin } from '../constants/constants';
//y1={mini ? -height : -height + margins.top + margins.bottom}

function AxisBottom({ xScale, height, mini, side }) {

    const ticks = useMemo(() => {
        return xScale.ticks(mini ? 3 : 5).map((value) => ({
            value,
            xOffset: xScale(value),
        }));
    }, [xScale, mini]);

    return (
        <>
            {ticks.map(({ value, xOffset }, i) => (
                <g key={value} transform={`translate(${xOffset}, 0)`}>
                <line y1={-height + margin(mini, side).top + margin(mini, side).bottom} stroke="rgba(217, 217, 217, 0.5)" />
                <text
                    className={mini ? "axis__text mini" : "axis__text"}
                    key={value}
                    style={{
                        transform: `translateY(${mini ? 15 : 20}px)`
                    }}
                >
                    {(i === ticks.length - 1) ? "₽" + value / 1000 + " тыс." : value / 1000}
                </text>
                </g>
            ))}
        </>
    );
};

export default AxisBottom;