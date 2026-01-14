import * as d3 from "d3";
import { margin, chartParams } from "../constants/constants";

const WIDTH = 200;
const FULL_HEIGHT = 140;
const SHORT_HEIGHT = 80;

function Tooltip({ interactionData, chartWidth }) {

  if (!interactionData) {
    return null;
  }

  const top = interactionData.y - SHORT_HEIGHT - margin(false).bottom - margin(false).top / 4;
  const left = interactionData.x + 5;

  if (interactionData.value > chartParams.threshold) {
    return (
      <div className="tooltip_container" style={{ 
        width: `${WIDTH}px`,
        height: `${SHORT_HEIGHT}px`,
        top: top > 0 ? top : 20,
        right: 5
      }}>
        <p className="tooltip_text">
          <span className="tooltip_text accent">{d3.format(".1f")(interactionData.sum)}%</span> жителей зарабатывают больше ₽250 тыс. в месяц
        </p>
      </div>
    );
  };

  if (interactionData.value <= chartParams.threshold) {
    return (
      <div className="tooltip_container" style={{ 
        width: `${WIDTH}px`,
        height: `${FULL_HEIGHT}px`,
        top: interactionData.y - FULL_HEIGHT - margin(false).bottom - margin(false).top / 4,
        left: left > chartWidth - WIDTH ? chartWidth - WIDTH : left
      }}>
        <p className="tooltip_text">
          <span className="tooltip_text accent">{d3.format(".1f")(interactionData.sum)}%</span> жителей зарабатывают ₽{(interactionData.value - 5000) / 1000}–{interactionData.value / 1000} тыс. в месяц
        </p>
        <p className="tooltip_text">
          В сумме <span className="tooltip_text accent">{d3.format(".1f")(interactionData.cum)}%</span> жителей зарабатывают до ₽{interactionData.value / 1000} тыс. в месяц
        </p>
      </div>
    );
  };
};

export default Tooltip;