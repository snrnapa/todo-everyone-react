import { IconButton } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../libs/firebase';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { Envelope, SignOut, LockKey } from 'phosphor-react';

const Header = () => {
  const logout = async () => {
    await signOut(auth);
    await Swal.fire({
      title: 'ログアウトしました',
      text: '',
      icon: 'info',
      confirmButtonText: 'OK',
      timer: 7000,
    });
    window.location.reload();
  };

  return (
    <header className="fixed top-0 w-full h-12 bg-white shadow-md flex items-center justify-center  px-4">
      <div className="font-Darumadrop text-xl flex items-center space-x-9">
        <Link to="/">
          <div className="flex ">きょう、なにしますか??</div>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <Link to="/contact">
              <Envelope size={26} color="#120fd2" weight="thin" />
            </Link>
            <p className="text-xs">といあわせ</p>
          </div>
          <div className="flex flex-col items-center">
            <Link to="/privacy">
              <LockKey size={26} color="#120fd2" weight="thin" />
            </Link>
            <p className="text-xs">ぽりしー</p>
          </div>
          <div className="flex flex-col items-center">
            <IconButton onClick={logout} size="small" className="h-7">
              <SignOut size={26} color="#120fd2" weight="thin" />
            </IconButton>
            <p className="text-xs">ろぐあうと</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
