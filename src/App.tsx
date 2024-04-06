import './App.css';
import { Button, Card, Divider } from '@mui/material';

import { useEffect, useState } from 'react';
import Header from './components/Header';
import { db } from './libs/firebase';
import SignIn from './components/SignIn';
import Register from './components/Register';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Todo from './components/Todo';
import useCurrentUser from './components/hooks/UseCurrentUser';
import { convertTimestampToString } from './model/Utils';

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
      const getQuery = query(userInfo, where('user_id', '==', currentUser.uid));
      getDocs(getQuery).then((snapShot) => {
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

  return (
    <div className="bg-gray-200 ">
      <Header />
      <div className="h-20"></div>

      <div className="flex flex-col ">
        {dispUser != null ? (
          <div>
            <Card className="p-3 space-y-2">
              <p>下記のユーザーでログインしています</p>
              <div className="flex space-x-3">
                <div>
                  <p className="text-sm">ID</p>
                  <p className="text-sm">なまえ</p>
                  <p className="text-sm">アカウント作成日</p>
                </div>
                <div className="">
                  <p className="text-sm">{dispUser.user_id}</p>
                  <p className="text-sm">{dispUser.user_name}</p>
                  <p className="text-sm">{dispUser.updated_at}</p>
                </div>
              </div>
            </Card>
            {/* <PlaceByGoogle /> */}
            <Todo />
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
