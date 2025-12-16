import { useSpring, animated, config } from "@react-spring/web";
import { useContext } from "react";
import { CurrentUserContext } from "../context/Context";

function AnimatedRect({ x, y, rectWidth, rectHeight, value, cum, onHover}) {
    const userData = useContext(CurrentUserContext);
    const springProps = useSpring({
        to: { x, y, rectWidth, rectHeight },
        config: config.gentle,
    });

    return(
        <animated.rect 
            fill={userData.perCapitaIncome >= value ? "#FF6A3D" : "#D9D9D9"}
            x={springProps.x}
            y={springProps.y}
            width={springProps.rectWidth}
            height={springProps.rectHeight}
            onMouseEnter={() =>
                onHover({
                    x: x,
                    y: y, 
                    width: rectWidth,
                    height: rectHeight,
                    value: value,
                    cum: cum
                })
            }
            onMouseLeave={() => onHover(null)}
        />
    );

};

export default AnimatedRect;