import './App.css';
import { Button, Card, Divider, IconButton } from '@mui/material';

import { useEffect, useState } from 'react';
import Header from './components/Header';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './libs/firebase';
import SignIn from './components/SignIn';
import Register from './components/Register';
import { Timestamp, collection, getDocs } from 'firebase/firestore';
import Home from './components/Home';
import Post from './components/Post';
import useCurrentUser from './components/hooks/UseCurrentUser';

type DispUser = {
  user_id: string;
  user_name: string;
  updated_at: string;
};
function App() {
  // カスタムhooksのuseCurrentUserを使用して、現在のログインユーザーの情報を取得（authenticationより）
  const currentUser = useCurrentUser();
  const [dispUser, setDispUser] = useState<DispUser | null>(null);

  const [registerFlg, setRegisterFlg] = useState(false);
  const dispRegister = () => {
    setRegisterFlg(!registerFlg);
  };

  useEffect(() => {
    // currentUserが取得できているか確認
    if (currentUser) {
      // currentUserから必要なユーザーデータを取得して、dispUserにセット

      const userInfo = collection(db, 'user');
      getDocs(userInfo).then((snapShot) => {
        const info = snapShot.docs.map((doc) => ({ ...doc.data() }));
        console.log(info);
        const dispUserData: DispUser = {
          user_id: info[0].user_id,
          user_name: info[0].user_name,
          updated_at: convertTimestampToString(info[0].updated_at),
        };
        setDispUser(dispUserData);
      });
    }
  }, [currentUser]); // currentUserが変更されたときに再実行

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
          <div>
            <Card className="p-3">
              <p>下記のユーザーでログインしています</p>
              <p>{dispUser.user_id}</p>
              <p>{dispUser.user_name}</p>
              <p>{dispUser.updated_at}</p>
            </Card>
            <Post />

            <Home />
          </div>
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
