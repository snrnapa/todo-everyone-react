import './App.css';
import { Button, Divider } from '@mui/material';
// import SignIn from './components/SignIn';
// import Register from './components/Register';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './libs/firebase';
import SignIn from './components/SignIn';
import Register from './components/Register';
// import Home from './components/Home';

function App() {
  const [registerFlg, setRegisterFlg] = useState(false);
  const [loginUser, setLoginUser] = useState();
  const dispRegister = () => {
    setRegisterFlg(!registerFlg);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoginUser(user);
      } else {
        console.log('現在はログインしていません');
      }
    });
  }, []);

  return (
    <div className="bg-gray-200">
      <Header />
      <div className="h-10"></div>

      <div className="flex flex-col ">
        <SignIn />
        <Button onClick={dispRegister}>初めての登録はこちら</Button>
        <Divider />
        {registerFlg ? <Register /> : <div></div>}
      </div>
    </div>
  );
}

export default App;
