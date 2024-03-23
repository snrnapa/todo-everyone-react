import './App.css';
import { Button, Card, Divider } from '@mui/material';
// import SignIn from './components/SignIn';
// import Register from './components/Register';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './libs/firebase';
import { User } from 'firebase/auth';
import SignIn from './components/SignIn';
import Register from './components/Register';
// import Home from './components/Home';

function App() {
  const [registerFlg, setRegisterFlg] = useState(false);
  const [loginUser, setLoginUser] = useState<User | null>(null);
  const dispRegister = () => {
    setRegisterFlg(!registerFlg);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setLoginUser(authUser);
        console.log(authUser.email);
        console.log(authUser.uid);
      } else {
        console.log('現在はログインしていません');
      }
    });
  }, []);

  return (
    <div className="bg-gray-200">
      <Header />
      <div className="h-20"></div>

      <div className="flex flex-col p-2">
        {loginUser != null ? (
          <Card className="p-3">
            <p>下記のユーザーでログインしています</p>
            <p>{loginUser.email}</p>

            <p>{loginUser.uid}</p>
          </Card>
        ) : (
          <div>
            <SignIn />
            <Button onClick={dispRegister}>初めての登録はこちら</Button>
            <Divider />
            {registerFlg ? <Register /> : <div></div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
