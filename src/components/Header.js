import { useTheme } from '../hooks/useTheme';

// Components
import Input from '../components/Input';

// Styles
import './Header.scss';

// Images
import Moon from '../images/icon-moon.svg';
import Sun from '../images/icon-sun.svg';

export default function Header({ check, setCheck }) {
  const { changeMode, mode } = useTheme();
  const url = '#';

  const toggleMode = () => {
    changeMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <header
      className={mode === 'light' ? 'header wrapper' : 'header wrapper dark'}
    >
      <div className="header__inner">
        <nav className="header__nav">
          <a href={url} className="header__logo">
            <h1 className="header__logo--title">TODO</h1>
          </a>
          <button
            className="header__btn"
            onClick={toggleMode}
            aria-labelledby="theme-toggle"
          >
            <img
              src={mode === 'light' ? Moon : Sun}
              alt={mode === 'light' ? 'Light Mode' : 'Dark Mode'}
              id="theme-toggle"
            />
          </button>
        </nav>
        <Input check={check} setCheck={setCheck} />
      </div>
    </header>
  );
}
