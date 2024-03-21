import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'firebase/auth';
import { auth } from '../libs/firebase';

const Header = () => {
  const logout = async () => {
    await signOut(auth);
    alert('ログアウトしました');
    window.location.reload();
  };
  return (
    <header className="fixed top-0 w-full h-12  shadow bg-lime-700 flex items-center justify-center">
      <div className="font-zenKurenaido text-2xl">きょう、なにしますか？</div>
      <IconButton onClick={logout}>
        <LogoutIcon fontSize="medium" />
      </IconButton>
    </header>
  );
};

export default Header;
