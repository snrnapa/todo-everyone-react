import { IconButton } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../libs/firebase';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import {Envelope ,SignOut } from "phosphor-react";


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
    <header className="fixed top-0 w-full h-12 bg-white shadow-md flex items-center justify-center px-4">
      <div className="font-Darumadrop text-2xl">きょう、なにしますか??</div>
      <Link to="/contact">
      <Envelope size={32} color="#120fd2" weight="thin" />
        </Link>
      <IconButton onClick={logout}>
      <SignOut size={32} color="#120fd2" weight="thin" />
      </IconButton>
    </header>
  );
};

export default Header;
