import { useState } from 'react';
import arrowSvg from '../images/arrow.svg';

function ExpandedBlock() {
    const [isExpanded, setIsExpanded] = useState(false);

    function handleClick() {
        setIsExpanded(!isExpanded);
    }

    return (
        <section className="howto">
            <div className="howto__container" onClick={handleClick}>
                <h2 className="howto__title">Как мы считали</h2>
                <img src={arrowSvg} alt="" className={isExpanded ? "howto__arrow open" : "howto__arrow"} />
            </div>
            {isExpanded && <div>
                <p className="howto__text">Мы&nbsp;использовали официальные данные Росстата о&nbsp;доходах россиян за&nbsp;2024&nbsp;год. Они не&nbsp;содержат детальной информации о&nbsp;распределении по&nbsp;доходам (доступны только <a href='https://rosstat.gov.ru/storage/mediabank/UROV_31.xlsx' target='_blanc' rel="noopener noreferrer">данные</a> по&nbsp;довольно широким интервалам), но&nbsp;ее&nbsp;можно восстановить.</p>
                <p className="howto__text">Чтобы оценить распределение россиян по&nbsp;уровню дохода, Росстат берет результаты выборочных обследований домохозяйств (в&nbsp;которых они сами сообщают о&nbsp;своих доходах) и&nbsp;корректирует их&nbsp;так, чтобы среднедушевой доход совпал со&nbsp;значением из&nbsp;макроэкономической статистики. Последний показатель считается как сумма доходов из&nbsp;всех источников (компании, государство, банки), деленная на&nbsp;численность населения. Показатель из&nbsp;макростатистики всегда оказывается больше, чем показатель из&nbsp;выборочных обследований. Например, из-за того, что в&nbsp;обследованиях обеспеченные домохозяйства почти не&nbsp;участвуют.</p>
                <p className="howto__text">Итоговое распределение по&nbsp;доходам <a href='https://rosstat.gov.ru/storage/mediabank/metodika_bednost.docx' target='_blanc' rel="noopener noreferrer">описывается</a> специальной формулой, в&nbsp;которой всего два параметра. Росстат не&nbsp;публикует эти значения, но&nbsp;их&nbsp;можно восстановить по&nbsp;известным значениям <a href='https://rosstat.gov.ru/storage/mediabank/Nb_Gb_1-1.xlsx' target='_blanc' rel="noopener noreferrer">границы бедности</a>, <a href='https://rosstat.gov.ru/storage/mediabank/UROV_52.xlsx' target='_blanc' rel="noopener noreferrer">уровня бедности</a> и&nbsp;<a href='https://rosstat.gov.ru/storage/mediabank/urov_10subg-nm.xlsx' target='_blanc' rel="noopener noreferrer">среднедушевого дохода</a>. Среднедушевой доход&nbsp;&mdash; это один из&nbsp;параметров формулы распределения по&nbsp;доходам. А&nbsp;второй параметр можно посчитать, зная границу бедности и&nbsp;уровень бедности. Мы&nbsp;взяли такие оценки за&nbsp;2024&nbsp;год, и&nbsp;восстановили распределение россиян по&nbsp;доходам для каждого региона.</p>
                <p className="howto__text">Код, с&nbsp;помощью которого, зная уровень бедности, границу бедности и&nbsp;среднедушевой доход, можно восстановить распределение по&nbsp;доходам, опубликован в&nbsp;нашем <a href='https://github.com/tochno-st/poverty_hack' target='_blanc' rel="noopener noreferrer">открытом репозитории на&nbsp;Github</a>.</p>
                <p className="howto__text">Также мы&nbsp;решили учесть, что в&nbsp;разных регионах России сильно различается уровень жизни. Например, на&nbsp;100&nbsp;000 рублей в&nbsp;Чукотке можно купить существенно меньше товаров, чем во&nbsp;Владимирской области. В&nbsp;итоге, если сравнивать номинальные среднедушевые доходы, то&nbsp;может показаться, что жители Чукотки сильно богаче жителей Владимирской области. Однако, с&nbsp;учетом высоких цен позволить себе они могут не&nbsp;так много. Чтобы это учесть, мы&nbsp;скорректировали среднедушевые доходы но&nbsp;относительную стоимость потребительской корзины в&nbsp;каждом из&nbsp;регионов.</p>
            </div>}
        </section>
    );
};

export default ExpandedBlock;