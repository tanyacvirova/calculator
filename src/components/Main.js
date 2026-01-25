import { useState, useEffect } from 'react';
import { CurrentUserContext } from '../context/Context.js';
import Form from './Form.js';
import Content from './Content.js';
import Cover from './Cover.js';
import Footer from './Footer.js';
import * as d3 from "d3";

function Main() {
    const [currentUserData, setCurrentUserData] = useState({});
    const [isFormFilled, setIsFormFilled] = useState(false);
    const [regionsData, setRegionsData] = useState([]);

    useEffect(() => {
    const dataFetch = async () => {
      const data = (
        await d3.csv(process.env.PUBLIC_URL + "/data_v20251216.csv", (d) => {
          return {
            sum: +d.sum,
            sum_corr: +d.sum_corr,
            share: +d.share,
            step: +d.step_share,
            code: +d.region_code,
            region: d.region_short_name,
          };
        })
      ).sort((a, b) => a.code - b.code); // Можно отсортировать по цепочке методов, если дождаться await в скобках
      
      setRegionsData(data);
    };
    dataFetch();
    }, []);

    
    function calculate(formData) {
        formData.perCapitaIncome = +formData.income / +formData.period / +formData.members
        setCurrentUserData(formData);
        setIsFormFilled(true);
    }

    return (
        <CurrentUserContext.Provider value={currentUserData}>
            <main className='content'>
                <Cover />
                <Form onSubmit={(data) => calculate(data)} />
                {(isFormFilled && (Boolean(regionsData.length))) && <Content userData={currentUserData} data={regionsData}/>}
                <Footer />
            </main>
        </CurrentUserContext.Provider>
    );
};

export default Main;