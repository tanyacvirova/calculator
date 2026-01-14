import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { chartParams, rosstatData } from "../constants/constants";
import { useDimensions } from '../hooks/useDimensions';
import { calculating } from '../utils/calculations';
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
    const containerDimensions = useDimensions(regionsContainerRef);
    const [columnsPerRow, setColumnsPerRow] = useState(5);

    const { allRegionsData, customRegion, russiaData, chuckotkaData, limits } = useMemo(() => {
        const regions = d3.group(data, (d) => d.code);
        const codes = Array.from(new Set(data.map((d => d.code))));
        const allRegions = codes.slice(1).map(d => {
            return calculating(regions.get(d), chartParams, userData);
        });
        const custom = calculating(regions.get(+userData.region.code), chartParams, userData);
        const russia = calculating(regions.get(0), chartParams, userData);
        const chuckotka = calculating(regions.get(77), chartParams, userData);
        const regionLimits = allRegions.map((region) => {
            return region.maxBase;
        });

        return {
            allRegionsData: allRegions,
            customRegion: custom,
            russiaData: russia,
            chuckotkaData: chuckotka,
            limits: regionLimits
        };
    }, [data, userData]);

    const sortedRegions = useMemo(() => {
        return d3.sort(allRegionsData, (d) => d.belowBase);
    }, [allRegionsData]);

    const handleClick = useCallback((value) => {
        setCorr(value);
    }, []);

    const handleShowAllClick = useCallback(() => {
        setShowAll(prev => !prev);
    }, []);

    const initialVisibleCount = useMemo(() => {
        return columnsPerRow * 4;
    }, [columnsPerRow]);

    const totalRegions = 85;
    
    const remainingCount = useMemo(() => {
        return totalRegions - initialVisibleCount;
    }, [initialVisibleCount]);

    useEffect(() => {
        const containerWidth = containerDimensions.width;

        if (containerWidth < 500) {
            setColumnsPerRow(1);
            return;
        }

        const firstItemWidth = 235;
        const regularItemWidth = 205;
        const gap = 20;
        
        let availableWidth = containerWidth - firstItemWidth;
        let columns = 1;
        
        while (availableWidth >= regularItemWidth + gap) {
            availableWidth -= (regularItemWidth + gap);
            columns++;
        }
        
        setColumnsPerRow(Math.max(1, columns));
        
    }, [containerDimensions.width]);
    
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
                <p className='user__text'>С&nbsp;2013 года неравенство начало постепенно снижаться. Главная причина&nbsp;&mdash; увеличение <a href='https://voprstat.elpub.ru/jour/article/view/1818' target='_blanc' rel="noopener noreferrer">социальной поддержки</a> граждан, особенно семей с&nbsp;детьми, на&nbsp;которые <a href='https://tochno.st/materials/v-god-nuzhno-chtoby-vyvesti-iz-bednosti-semi-s-detmi' target='_blanc' rel="noopener noreferrer">приходится</a> подавляющая часть малоимущих. Важную роль также сыграло <a href='https://www.econorus.org/repec/journl/2024-65-267-275r.pdf' target='_blanc' rel="noopener noreferrer">сокращение</a> разрыва в&nbsp;оплате труда между людьми с&nbsp;разным уровнем образования и&nbsp;жителями разных регионов.</p>
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
                <p className='user__text'>Ваш среднедушевой доход выше, чем у <span className="user__title-accent">{d3.format(".0f")(corr ? chuckotkaData.belowScaled : chuckotkaData.belowBase)}%</span> жителей</p>
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