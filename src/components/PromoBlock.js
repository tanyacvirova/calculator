import { promoCards } from "../constants/constants";

function PromoBlock() {
    const allCards = promoCards.map((card, i) => {
        return (
            <div className="promo__card" key={i}>
                <div className="card__tags">
                    <div className="card__tag">
                        <p className="card__text">{card.tag}</p>
                    </div>
                    <p className="card__text">{card.date}</p>
                </div>
                <a className="card__link" href={card.link} target='_blanc' rel="noopener noreferrer">
                    <h3 className="card__title">{card.title}<span className="extra"> {card.subtitle}</span></h3>
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