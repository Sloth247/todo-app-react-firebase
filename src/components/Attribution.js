import './Attribution.scss';

export default function Attribution() {
  const url = 'https://www.frontendmentor.io?ref=challenge';
  const mypage = 'https://www.frontendmentor.io/profile/Sloth247';
  return (
    <footer>
      <div className="attribution">
        Challenge by{' '}
        <a href={url} target="_blank" rel="noopener noreferrer">
          Frontend Mentor
        </a>
        . Coded by <a href={mypage}>Yuko Horita</a>.
      </div>
    </footer>
  );
}
