import { useState, useEffect, useCallback } from "react";
import * as d3 from "d3";

// Move validateNumeric outside component to avoid recreation
const validateNumeric = (name, value) => {
    if (value === "") {
        return "Введите число";
    }
    if (!/^\d+$/.test(value)) {
        return "Можно вводить только цифры";
    }
    return "";
};

function Form(props) {
    const [formData, setFormData] = useState({
        region: { code: "37", name: "Курганская обл."},
        income: "50000",
        period: "1",
        members: "1",
        status: "3"
    });
    const [errors, setErrors] = useState({ income: "", members: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [codes, setCodes] = useState([]);

    useEffect(() => {
        const fetchCsv = async() => {
            try {
                const data = await d3.csv(process.env.PUBLIC_URL + '/codes.csv', (d) => {
                    return {
                        region: d.region,
                        name: d.name,
                        code: +d.code
                    }
                });
                setCodes(d3.sort(data, (d) => d.name));
            } catch (error) {
                console.log(error);
            }
        };
        fetchCsv();
    }, []);

    const handleChange = useCallback((evt) => {
        const { name, value, type } = evt.target;
        
        if (isSubmitting) {
            setIsSubmitting(false);
        }

        if (type === "select-one" && name === "region") {
            const selectedOption = evt.target.options[evt.target.selectedIndex];
            setFormData(prevFormData => ({ ...prevFormData, [name]: {code: value, name: selectedOption.text} }));
            return;
        }

        if (type === "radio") {
            setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
            return;
        }

        if (name === "income" || name === "members") {
            const errorMsg = validateNumeric(name, value);
            setErrors(prevErrors => ({ ...prevErrors, [name]: errorMsg }));
            setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
            return;
        }

        setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    }, [isSubmitting]);

    const handleSubmit = useCallback((evt) => {
        evt.preventDefault();
        const incomeError = validateNumeric("income", formData.income);
        const membersError = validateNumeric("members", formData.members);

        if (incomeError || membersError) {
            setErrors({ income: incomeError, members: membersError });
            return;
        }

        const payload = {
            ...formData,
            income: Number(formData.income),
            period: Number(formData.period),
            members: Number(formData.members),
            status: Number(formData.status),
            perCapitaIncome: +formData.income / +formData.period / +formData.members // Лучше посчитать здесь, и "наружу" передавать уже готовое значение
        };
        
        props.onSubmit(payload);
        setIsSubmitting(true);
    }, [formData, props]);

    const hasErrors = !!errors.income || !!errors.members || formData.income === "" || formData.members === "";

    return (
        <div className="form">
            <h2 className="form__title">Расскажите о себе</h2>
            <p className="form__text">Ответьте на&nbsp;четыре вопроса, мы&nbsp;рассчитаем ваш среднедушевой доход и&nbsp;сравним его с&nbsp;доходом остальных жителей России.</p>
            <p className="form__text">Среднедушевой доход семьи&nbsp;&mdash; это условный показатель, отношение суммы доходов всех членов семьи за&nbsp;определенный период к&nbsp;количеству человек. Он&nbsp;используется для оценки материального положения семьи при назначении социальных льгот, пособий и&nbsp;других мер поддержки. Деление общего дохода на&nbsp;всех членов семьи&nbsp;&mdash; включая тех, кто не&nbsp;работает&nbsp;&mdash; позволяет точнее оценить уровень жизни.</p>
            <form className="form__body" onSubmit={handleSubmit} noValidate>
                <span className="form__label">Ваш регион:</span>
                <select
                    className="form__input"
                    name="region"
                    value={formData.region.code}
                    onChange={handleChange}
                >
                    {codes.map((region, i) => (
                        <option key={i} value={region.code}>{region.name}</option>
                    ))}
                </select>
                <span className="form__label">Доход семьи, ₽:</span>
                <div className="form__group">
                    <div className="form__line">
                        <input
                            className="form__input income"
                            name="income"
                        type="number"
                            value={formData.income}
                            onChange={handleChange}
                            min="0"
                            max="10000000000"
                            step="50000"
                        />
                    {/*{errors.income && <p className="form__caption form__caption-warning">{errors.income}</p>}*/}
                        <div className="form__toggle">
                            <label className="form__radio">
                                <input 
                                    className="form__radio-input"
                                    id="month"
                                    name="period"
                                    type="radio"
                                    value="1"
                                    onChange={handleChange}
                                    checked={formData.period === "1"}
                                />
                                <span className="form__radio-label" aria-hidden="true">В месяц</span>
                            </label>
                            <label className="form__radio">
                                <input 
                                    className="form__radio-input"
                                    id="year"
                                    name="period"
                                    type="radio"
                                    value="12"
                                    onChange={handleChange}
                                />
                                <span className="form__radio-label" aria-hidden="true">В год</span>
                            </label>
                        </div>
                    </div>
                    <p className="form__caption">Сложите все денежные доходы всех членов семьи. Включаются зарплаты, пенсии, пособия, стипендии, алименты, доходы от&nbsp;предпринимательской деятельности.</p>
                </div>
                <span className="form__label">Состав семьи:</span>
                <div className="form__group">
                    <input
                        className="form__input members"
                        name="members"
                        type="number"
                        value={formData.members}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        step="1"
                    />
                    {/*{errors.members && <p className="form__caption form__caption-warning">{errors.members}</p>}*/}
                    <p className="form__caption">Считаются родители, их супруги, несовершеннолетние дети, а&nbsp;также дети до&nbsp;23&nbsp;лет, обучающиеся на&nbsp;очной форме обучения, и&nbsp;дети, находящиеся под опекой.</p>
                </div>
                <span className="form__label">Оцените свое положение:</span>
                <select
                    className="form__input stretched"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="1">Не хватает денег даже на еду</option>
                    <option value="2">Хватает только на еду</option>
                    <option value="3">Хватает только на еду и одежду</option>
                    <option value="4">Хватает на еду, одежду и бытовую технику</option>
                    <option value="5">Можете позволить себе все, даже квартиру</option>
                </select>
                <span className="form__label"></span>
                <button className="form__button" type="submit" onSubmit={handleSubmit} disabled={isSubmitting || hasErrors}>Посчитать</button>
            </form>
        </div>
    )
}

export default Form;