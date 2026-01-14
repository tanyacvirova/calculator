import { useCallback } from "react";

function Buttons({ onClick, corr }) {
    const handleToggle = useCallback(() => {
        onClick(!corr);
    }, [onClick, corr]);

    const status1 = corr ? "button-disabled" : "button-active";
    const status2 = corr ? "button-active" : "button-disabled";

    return(
        <div className="buttons_container">
            <button className={status1} onClick={handleToggle}>Не нормировать</button>
            <button className={status2} onClick={handleToggle}>Нормировать</button>
        </div>
    );
}

export default Buttons;