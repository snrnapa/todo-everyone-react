import { Button, Divider } from '@mui/material';
import Todo from './components/Todo';
import useCurrentUser from './components/hooks/UseCurrentUser';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './libs/firebase';
import { useState, useEffect } from 'react';
import { convertTimestampToString } from './model/Utils';
import SignIn from './components/SignIn';
import Register from './components/Register';

type DispUser = {
  user_id: string;
  user_name: string;
  updated_at: string;
};

const AuthenticatedContent = () => {
  const currentUser = useCurrentUser();
  const [dispUser, setDispUser] = useState<DispUser | null>(null);
  const [registerFlg, setRegisterFlg] = useState(false);

  const dispRegister = () => {
    setRegisterFlg(!registerFlg);
  };

  useEffect(() => {
    if (currentUser) {
      const userInfo = collection(db, 'user');
      const getQuery = query(userInfo, where('user_id', '==', currentUser.uid));
      getDocs(getQuery).then((snapShot) => {
        const info = snapShot.docs.map((doc) => ({ ...doc.data() }));
        const dispUserData: DispUser = {
          user_id: info[0].user_id,
          user_name: info[0].user_name,
          updated_at: convertTimestampToString(info[0].updated_at),
        };
        setDispUser(dispUserData);
      });
    }
  }, [currentUser]);

  return (
    <div className="h-screen">
      <div className="h-10"></div>
      <div className="flex flex-col">
        {dispUser != null ? (
          <div>
            <div className="p-3 space-y-2 max-w-md mx-auto  rounded-xl shadow-md overflow-hidden  ">
              <p>下記のユーザーでログインしています</p>
              <div className="flex space-x-3">
                <div>
                  <p className="text-sm text-gray-800">ID</p>
                  <p className="text-sm text-gray-800">あどれす</p>
                  <p className="text-sm text-gray-800">アカウント作成日</p>
                </div>
                <div className="">
                  <p className="text-sm text-gray-800">{dispUser.user_id}</p>
                  <p className="text-sm text-gray-800">{currentUser?.email}</p>
                  <p className="text-sm text-gray-800">{dispUser.updated_at}</p>
                </div>
              </div>
            </div>
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
};

export default AuthenticatedContent;
