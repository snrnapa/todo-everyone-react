import { Link } from 'react-router-dom';
import { Envelope, SignOut, LockKey, HouseLine } from 'phosphor-react';
import { showSuccessAlert } from '../model/Utils';
import { auth } from '../libs/firebase';

const Header = () => {
  const logout = async () => {
    await auth.signOut();
    localStorage.removeItem('firebaseToken');
    localStorage.removeItem('firebaseUserId');
    await showSuccessAlert('ログアウトしました', '');
    window.location.reload();
  };

  return (
    <header className="fixed top-0 w-full h-12 bg-personaBlue shadow-lg flex items-center justify-center px-4">
      <div className="font-Darumadrop text-xl flex items-center space-x-9 text-gray-200">
        <Link to="/" className='flex items-center'>
          <div className="mr-2 text-personaTextWhite">きょう、なにしますか??</div>
          <HouseLine size={32} className="text-gray-300" />
        </Link>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <Link to="/contact">
              <Envelope size={26} weight="light" className="text-personaTextWhite" />
            </Link>
            <p className="text-xs text-personaTextWhite">といあわせ</p>
          </div>
          <div className="flex flex-col items-center">
            <Link to="/privacy">
              <LockKey size={26} weight="light" className="text-personaTextWhite" />
            </Link>
            <p className="text-xs text-personaTextWhite">ぽりしー</p>
          </div>
          <div className="flex flex-col items-center">
            <button onClick={logout} className="h-7 text-personaTextWhite">
              <SignOut size={26} weight="light" />
            </button>
            <p className="text-xs text-personaTextWhite">ろぐあうと</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
