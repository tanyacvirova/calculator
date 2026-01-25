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
        <div className="social-list">
          {[
            {
              href: "https://t.me/tochno_st",
              src: telegram,
              alt: "Ссылка на телеграм-канал Если быть точным",
            },
            {
              href: "https://vk.com/tochno_st",
              src: vkontakte,
              alt: "Ссылка на сообщество Если быть точным Вконтакте",
            },
            {
              href: "https://dzen.ru/tochnost",
              src: dzen,
              alt: "Ссылка на Дзен-канал Если быть точным",
            },
          ].map(({ href, src, alt }) => (
            <a
              className="social-list__item"
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              <img className="social-list__logo" alt={alt} src={src} />
            </a>
          ))}
        </div>
            </div>
        </header>
    );
};

export default Header;