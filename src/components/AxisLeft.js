import { margin } from '../constants/constants';
//transform={`translate(${mini ? 0 : margins.left}, ${yScale(value)})`}
//x1={mini ? width : width - margins.left - margins.right}

function AxisLeft({ yScale, width, mini, side }) {
    return (
        <>
            {yScale.ticks(mini ? 2 : 4).map((value, i, array) => (
                <g key={value} transform={`translate(${margin(mini, side).left}, ${yScale(value)})`}>
                <line x1={width - margin(mini, side).left - margin(mini, side).right} stroke="rgba(217, 217, 217, 0.5)" />
                {(!mini || side) && <text
                    className={side ? "axis__text mini" : "axis__text"}
                    key={value}
                    style={{
                        transform: `translateX(-${side ? 15 : 20}px)`
                    }}
                >
                    {(i === array.length - 1) ? value + "%" : value}
                </text>}
                </g>
            ))}
        </>
    );
};

export default AxisLeft;