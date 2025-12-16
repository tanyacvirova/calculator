import { useState } from "react";

function Buttons({ onClick, corr }) {
    const [isCorr, setIsCorr] = useState(corr);

    const handleToggle = () => {
        onClick(!isCorr);
        setIsCorr(!isCorr);
    };

    const status1 = isCorr ? "button-disabled" : "button-active";
    const status2 = isCorr ? "button-active" : "button-disabled";

    return(
        <div className="buttons_container">
            <button className={status1} onClick={handleToggle}>Не нормировать</button>
            <button className={status2} onClick={handleToggle}>Нормировать</button>
        </div>
    );
}

export default Buttons;