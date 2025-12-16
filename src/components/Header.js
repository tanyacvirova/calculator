import logo from '../images/logo.svg';
import telegram from '../images/telegram.svg';
import vkontakte from '../images/vkontakte.svg';
import dzen from '../images/dzen.svg';

function Header() {
    return (
        <header className="header">
            <div className='header__container'>
                <img className="header__logo" alt="Логотип Если быть точным" src={logo} />
                <a className='header__link' href="https://tochno.st/" target="_blank" rel="noreferrer">Если быть точным</a>
            </div>
            <div className='header__container'>
                <img className="header__logo" alt="Ссылка на телеграм-канал Если быть точным" src={telegram} />
                <img className="header__logo" alt="Ссылка на сообщество Если быть точным Вконтакте" src={vkontakte} />
                <img className="header__logo" alt="Ссылка на Дзен-канал Если быть точным" src={dzen} />
            </div>
        </header>
    );
};

export default Header;