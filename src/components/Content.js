import { useState, useRef, useEffect, useMemo } from 'react';
import { chartParams, rosstatData } from "../constants/constants";
import * as d3 from "d3";
import Buttons from "./Buttons";
import ResponsiveBlock from './ResponsiveBlock';
import AnimatedHistogram from './AnimatedHistogram';
import Histogram from './Histogram';
import Bar from './Bar';
import ExpandedBlock from './ExpandedBlock';
import PromoBlock from './PromoBlock';
import arrowSvg from '../images/arrow.svg';

function Content({ userData, data }) {
    const [corr, setCorr] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const regionsContainerRef = useRef(null);
    const [columnsPerRow, setColumnsPerRow] = useState(5);

    function bining(data, attr) {
        let cumSum = 0;
        const exp = d3.range(0, attr.threshold / attr.step + 1, 1).map((d, i) => {
            cumSum = cumSum + data.get(d);
            return {
                x0: d * attr.step,
                x1: (d + 1) * attr.step,
                sum: data.get(d),
                cumSum: cumSum
            }
        })
        return exp;
    }

    function calculating(region, attr, userData) {

        // Calculating intervals. 
        const addGroup = region.map(obj => {
            const max = Math.floor(attr.threshold / attr.step);
            const currentBase = Math.floor(obj.sum / attr.step);
            const currentScaled = Math.floor(obj.sum_corr / attr.step);
            
            return {
                ...obj,
                groupBase: currentBase <= max ? currentBase : max,
                groupScaled: currentScaled <= max ? currentScaled : max
            }
        });

        // Calculating sum for each bin.
        const calcShareBase = d3.rollup(addGroup, (D) => d3.sum(D, (d) => d.step), (d) => d.groupBase);
        const calcShareScaled = d3.rollup(addGroup, (D) => d3.sum(D, (d) => d.step), (d) => d.groupScaled);

        // Calculating share of families with income below user data.
        const index = Math.floor((userData.perCapitaIncome - 1000) / 500);
        const belowBase = (() => {
            if (index >= 1000) {
                return region[999];
            } else if (index < 0) {
                return region[0];
            } else {
                return region[index];
            }
        })();

        const findShareCorr = d3.minIndex(region.map(obj => {
            return {
                ...obj,
                diff: Math.abs(obj.sum_corr - userData.perCapitaIncome)
            }
        }), (d) => d.diff);
        const belowScaled = region[findShareCorr];

        // Bining.
        const binsBase = bining(calcShareBase, attr);
        const binsScaled = bining(calcShareScaled, attr);

        return {
            code: belowBase.code,
            region: belowBase.region,
            belowBase: belowBase.share,
            belowScaled: belowScaled.share,
            sumBase: Math.ceil(d3.sum(binsBase, (d) => d.sum)) === 100,
            sumScaled: Math.ceil(d3.sum(binsScaled, (d) => d.sum)) === 100,
            maxBase: d3.max(binsBase, (d) => d.sum),
            maxScaled: d3.max(binsScaled, (d) => d.sum),
            binsBase: binsBase,
            binsScaled: binsScaled
        };
    }

    const regions = d3.group(data, (d) => d.code);
    const codes = Array.from(new Set(data.map((d => d.code))));
    const allRegionsData = codes.slice(1).map(d => {
        return calculating(regions.get(d), chartParams, userData);
    });
    const customRegion = calculating(regions.get(+userData.region.code), chartParams, userData);
    const russiaData = calculating(regions.get(0), chartParams, userData);
    const chuckotkaData = calculating(regions.get(77), chartParams, userData);
    const limits = allRegionsData.map((region) => {
        return region.maxBase;
    });

    // Memoize sorted regions to avoid recalculating on every render
    const sortedRegions = useMemo(() => {
        return d3.sort(allRegionsData, (d) => d.belowBase);
    }, [allRegionsData]);

    // Calculate initial visible count based on columns (5 rows initially)
    const initialVisibleCount = columnsPerRow * 4;
    const totalRegions = 85;
    const remainingCount = totalRegions - initialVisibleCount;

    function handleClick(value) {
        setCorr(value);
    }

    function handleShowAllClick() {
        setShowAll(!showAll);
    }

    // Calculate columns per row based on container width for responsive left-axis detection
    useEffect(() => {
        const calculateColumns = () => {
            if (!regionsContainerRef.current) return;
            
            const containerWidth = regionsContainerRef.current.offsetWidth;
            const firstItemWidth = 235; // regions__region-side width
            const regularItemWidth = 205; // regions__region width
            const gap = 20; // column-gap from CSS
            
            // Calculate how many items fit: first item + regular items
            let availableWidth = containerWidth - firstItemWidth;
            let columns = 1;
            
            while (availableWidth >= regularItemWidth + gap) {
                availableWidth -= (regularItemWidth + gap);
                columns++;
            }
            
            setColumnsPerRow(Math.max(1, columns));
        };

        calculateColumns();

        const resizeObserver = new ResizeObserver(() => {
            calculateColumns();
        });

        if (regionsContainerRef.current) {
            resizeObserver.observe(regionsContainerRef.current);
        }

        window.addEventListener('resize', calculateColumns);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', calculateColumns);
        };
    }, []);
    
    return (
        <section className="user">
            <div className='user__container'>
                <h2 className="user__title">Ваш среднедушевой доход выше, чем у <span className="user__title-accent">{d3.format(".0f")(russiaData.belowBase)}%</span> россиян</h2>
                <p className='user__caption'>&uarr;Доля семей с&nbsp;определенным доходом</p>
                <ResponsiveBlock component={Histogram} extraPropData={{ data: russiaData, max: [russiaData.maxBase, customRegion.maxBase]}} maxHeight={300} mini={false}/>
                <p className='user__caption' style={{ textAlign: 'right' }}>&rarr; Среднедушевой доход семей</p>
            </div>
            <div className='user__container'>
            <h2 className="user__title">И чем у <span className="user__title-accent">{d3.format(".0f")(customRegion.belowBase)}%</span> жителей вашего региона: <span className="user__title-bold">{userData.region.name}</span></h2>
                <p className='user__caption'>&uarr;Доля семей с&nbsp;определенным доходом</p>
                <ResponsiveBlock component={Histogram} extraPropData={{ data: customRegion, max: [russiaData.maxBase, customRegion.maxBase]}} maxHeight={300} mini={false}/>
                <p className='user__caption' style={{ textAlign: 'right' }}>&rarr; Среднедушевой доход семей</p>
            </div>
            <div className='user__container'>
                <p className='user__text'>До&nbsp;конца нулевых экономическое неравенство в&nbsp;России увеличивалось: доходы <a href='https://www.hse.ru/data/2014/04/10/1320216966/ovcharova.pdf.pdf' target='_blanc' rel="noopener noreferrer">перераспределялись</a> в&nbsp;пользу богатых, а&nbsp;бедным государство не&nbsp;могло обеспечить адресную поддержку.</p>
                <p className='user__text'>С&nbsp;2013 года неравенство начало постепенно снижаться. Главная причина&nbsp;&mdash; увеличение <a href='https://voprstat.elpub.ru/jour/article/view/1818' target='_blanc' rel="noopener noreferrer">социальной поддержк</a> граждан, особенно семей с&nbsp;детьми, на&nbsp;которые <a href='https://tochno.st/materials/v-god-nuzhno-chtoby-vyvesti-iz-bednosti-semi-s-detmi' target='_blanc' rel="noopener noreferrer">приходится</a> подавляющая часть малоимущих. Важную роль также сыграло <a href='https://www.econorus.org/repec/journl/2024-65-267-275r.pdf' target='_blanc' rel="noopener noreferrer">сокращение</a> разрыва в&nbsp;оплате труда между людьми с&nbsp;разным уровнем образования и&nbsp;жителями разных регионов.</p>
                <p className='user__text'>Тем не&nbsp;менее, среднедушевые доходы в&nbsp;России до&nbsp;сих пор распределены неравномерно. Средний подушевой доход в&nbsp;стране в&nbsp;2024 году&nbsp;&mdash; 62&nbsp;490&nbsp;рублей, но&nbsp;большая часть населения получает до&nbsp;50&nbsp;тысяч рублей в&nbsp;месяц.</p>
            </div>
            <div className='user__container'>
                <h2 className="user__title">Остальные регионы</h2>
                <p className='user__text'>Доходы и&nbsp;цены в&nbsp;разных регионах России сильно отличаются.&nbsp;50&nbsp;тысяч рублей в&nbsp;Москве, на&nbsp;Чукотке или в&nbsp;Ингушетии&nbsp;&mdash; это совершенно разный уровень жизни. Чтобы это учесть, доходы нормируют на&nbsp;стоимость потребительской корзины в&nbsp;конкретном регионе.</p>
                <p className='user__text'>Потребительская корзина&nbsp;&mdash; это условный набор товаров и&nbsp;услуг, необходимых для жизни: еда, одежда, транспорт. Если соотнести доходы со&nbsp;стоимостью корзины, можно понять, какая часть зарплаты в&nbsp;среднем уйдет у&nbsp;жителя региона на&nbsp;базовые нужды. Такой подход помогает сравнивать регионы между собой и&nbsp;понять, где люди действительно могут позволить себе более высокий уровень жизни, а&nbsp;где высокие зарплаты съедаются высокими&nbsp;же расходами.</p>
                <p className='user__text'>После такой корректировки гистограмма Чукотки смещается влево, в&nbsp;сторону более низких доходов. А&nbsp;доля тех, чей среднедушевой доход превышает 250&nbsp;тысяч рублей в&nbsp;месяц, снижается.</p>
            </div>
            <div className='user__container'>
                <h3 className='user__text sub'>Чукотский автономный округ</h3>
                <p className='user__text'>Ваш среднедушевой доход выше, чем у <span className="user__title-accent">{d3.format(".0f")(corr ? chuckotkaData.belowScaled : chuckotkaData.belowBase)}%</span> жителей</p>
                <Buttons onClick={(value) => handleClick(value)} corr={corr} />
                <p className='user__caption'>&uarr;Доля семей с&nbsp;определенным доходом</p>
                <ResponsiveBlock component={AnimatedHistogram} extraPropData={{ data: chuckotkaData, corr: corr }} maxHeight={300} mini={false}/>
                <p className='user__caption' style={{ textAlign: 'right' }}>&rarr; Среднедушевой доход семей</p>
                <p className='user__text'>Ниже&nbsp;&mdash; распределение доходов для всех регионов России. Яркая цифра под названием каждого региона&nbsp;&mdash; это доля семей, чей среднедушевой доход в&nbsp;месяц меньше вашего.</p>
                <div className={`regions__wrapper ${showAll ? 'expanded' : ''}`}>
                    <div className='regions' ref={regionsContainerRef}>
                        {sortedRegions.slice(0, showAll ? totalRegions : initialVisibleCount).map((region, i) => {
                            const side = i % columnsPerRow === 0;
                            return (<div key={region.code} className={side ? "regions__region-side" : "regions__region"}>
                                <h3 className={side ? "regions__title shift" : "regions__title"}>{region.region}</h3>
                                <span className={side ? "regions__accent shift" : "regions__accent"}>{corr ? d3.format(".0f")(region.belowScaled) : d3.format(".0f")(region.belowBase)}%</span>
                                <ResponsiveBlock key={region.code} component={AnimatedHistogram} extraPropData={{ data: region, max: limits, side: side, corr: corr}} maxHeight={100} mini={true} />
                            </div>)
                        })}
                    </div>
                </div>
                <button className={`regions__button ${showAll ? 'expanded' : ''}`} onClick={handleShowAllClick}>
                    {showAll ? `Только ${initialVisibleCount} регионов` : `Остальные ${remainingCount} регионов России`}
                    <img src={arrowSvg} alt="" className="regions__button-arrow" />
                </button>
            </div>
            <div className='user__container'>
                <h2 className="user__title">Вы оцениваете свое финансовое положение также, как <span className="user__title-accent">{d3.format(".0f")(rosstatData[userData.status - 1].value)}%</span> россиян</h2>
                <ResponsiveBlock component={Bar} extraPropData={{ }} maxHeight={400} mini={false}/>
                <p className='user__text'>Есть разные способы оценить уровень дохода. Например, можно спросить у&nbsp;человека, на&nbsp;что ему хватает денег&nbsp;&mdash; такая шкала есть в&nbsp;обследовании Росстата <a href='https://rosstat.gov.ru/folder/11110/document/13271' target='_blanc' rel="noopener noreferrer">&laquo;Доходы, расходы и&nbsp;потребление домашних хозяйств&raquo;</a>. Эта оценка помогает понять, насколько финансово устойчиво чувствуют себя люди, и&nbsp;как это ощущение меняется со&nbsp;временем или в&nbsp;зависимости от&nbsp;региона.</p>
                <p className='user__text'>Половине россиян (46,5%) хватает денег на&nbsp;еду и&nbsp;одежду, но&nbsp;позволить себе покупку бытовой техники или мебели они не&nbsp;могут.</p>
            </div>
            <ExpandedBlock />
            <div className='user__container'>
                <h2 className="user__title">Читать по теме</h2>
                <PromoBlock />
            </div>
        </section>
    );
};

export default Content;