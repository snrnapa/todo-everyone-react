import './App.css';
import { Button, Card, Divider } from '@mui/material';

import { useEffect, useState } from 'react';
import Header from './components/Header';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './libs/firebase';
import SignIn from './components/SignIn';
import Register from './components/Register';
import { Timestamp, collection, getDocs } from 'firebase/firestore';

function App() {
  type DispUser = {
    user_id: string;
    user_name: string;
    updated_at: string;
  };

  const [registerFlg, setRegisterFlg] = useState(false);
  const [dispUser, setDispUser] = useState<DispUser>();
  const dispRegister = () => {
    setRegisterFlg(!registerFlg);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const userInfo = collection(db, 'user');
        getDocs(userInfo).then((snapShot) => {
          const userData = snapShot.docs.map((doc) => ({ ...doc.data() }))[0];
          const dispUserData: DispUser = {
            user_id: userData.user_id,
            user_name: userData.user_name,
            updated_at: convertTimestampToString(userData.updated_at),
          };
          setDispUser(dispUserData);
        });
      } else {
        console.log('現在はログインしていません');
      }
    });
  }, []);

  // firebaseのタイムスタンプを文字列の日付に変換する関数
  const convertTimestampToString = (timestamp: Timestamp): string => {
    const date = new Date(timestamp.seconds * 1000); // タイムスタンプをミリ秒に変換してDateオブジェクトに渡す
    return date.toLocaleString(); // ローカルの日付文字列に変換して返す
  };

  return (
    <div className="bg-gray-200">
      <Header />
      <div className="h-20"></div>

      <div className="flex flex-col p-2">
        {dispUser != null ? (
          <Card className="p-3">
            <p>下記のユーザーでログインしています</p>
            <p>{dispUser.user_id}</p>
            <p>{dispUser.user_name}</p>
            <p>{dispUser.updated_at}</p>
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
