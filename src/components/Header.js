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
                <a href="https://t.me/tochno_st" target="_blank" rel="noreferrer"><img className="header__logo" alt="Ссылка на телеграм-канал Если быть точным" src={telegram} /></a>
                <a href="https://vk.com/tochno_st" target="_blank" rel="noreferrer"><img className="header__logo" alt="Ссылка на сообщество Если быть точным Вконтакте" src={vkontakte} /></a>
                <a href="https://dzen.ru/tochnost" target="_blank" rel="noreferrer"><img className="header__logo" alt="Ссылка на Дзен-канал Если быть точным" src={dzen} /></a>
            </div>
        </header>
    );
};

export default Header;