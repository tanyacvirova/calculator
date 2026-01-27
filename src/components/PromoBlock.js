import { promoCards } from "../constants/constants";

function PromoBlock() {
    const allCards = promoCards.map(({tag, date, link, title, subtitle}, i) => {
        return (
            <div className="promo__card" key={i}>
                <div className="card__tags">
                    <div className="card__tag">
                        <p className="card__text">{tag}</p>
                    </div>
                    <p className="card__text">{date}</p>
                </div>
                <a className="card__link" href={link} target='_blank' rel="noopener noreferrer">
                    <h3 className="card__title">{title}<span className="extra"> {subtitle}</span></h3>
                </a>
            </div>
        );
    })
    return(
        <div className="promo">
            {allCards}
        </div>
    );
};

export default PromoBlock;