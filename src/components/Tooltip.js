import * as d3 from "d3";
import { margin, chartParams } from "../constants/constants";

const WIDTH = 150;
const HEIGHT = 80;

function Tooltip({interactionData}) {

  if (!interactionData) {
    return null;
  }

  if (interactionData.value > chartParams.threshold) {
    return null;
  }

  return (
    <div className="tooltip_container" style={{ 
      width: `${WIDTH}px`,
      height: `${HEIGHT}px`,
      top: interactionData.y - HEIGHT - margin(false).bottom - margin(false).top / 4,
      left: interactionData.x + 5 
    }}>
        <p className="tooltip_text">
          <span className="tooltip_text accent">{d3.format(".1f")(interactionData.cum)}%</span> жителей зарабатывают до ₽{interactionData.value / 1000} тыс. в месяц
        </p>
    </div>
  );
};

export default Tooltip;