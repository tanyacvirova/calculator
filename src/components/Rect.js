import { CurrentUserContext } from "../context/Context";
import { useContext } from "react";
import { margin } from "../constants/constants";

function Rect({ bins, xScale, yScale, height, mini, onHover }) {
    const userData = useContext(CurrentUserContext);
    const allRects = bins.map((bin, i) => {
        if (xScale.range()[-1] < 0 && yScale.range()[-1] < 0) {
            return null;
        }
        if (height <= 0) {
            return null;
        }
        return (
            <rect 
                key={i}
                fill={userData.perCapitaIncome >= bin.x1 ? "#FF6A3D" : "#D9D9D9"}
                x={xScale(bin.x0) + (mini ? 0 : 1)}
                width={xScale(bin.x1) - xScale(bin.x0) - (mini ? 0 : 1)}
                y={yScale(bin.sum)}
                height={height - margin(mini).bottom - yScale(bin.sum)}
                onMouseEnter={() =>
                    onHover({
                        x: xScale(bin.x0) + (mini ? 0 : 1),
                        y: yScale(bin.sum),
                        sum: bin.sum,
                        value: bin.x1,
                        cum: bin.cumSum,
                        width: xScale(bin.x1) - xScale(bin.x0) - (mini ? 0 : 1),
                        height: height - margin(mini).bottom - yScale(bin.sum)
                    })
                }
                onMouseLeave={() => onHover(null)}
            />
        );
    });

    return (
        <>
            <g transform={`translate(0, 0)`}>
                {allRects}
            </g>
        </>
    );
};

export default Rect;