import SignIn from './components/SignIn';
import { useEffect, useState } from 'react';
import Todo from './components/Todo';
import Register from './components/Register';
import { Button } from '@mui/material';
import { auth } from './libs/firebase';

const AuthenticatedContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDispRegister, setIsDispRegister] = useState(false);

  useEffect(() => {
    // ユーザーのログイン状態を確認する
    const checkAuthState = async () => {
      const user = auth.currentUser;
      if (user) {
        setIsAuthenticated(true); // ユーザーがログインしている場合、isAuthenticatedをtrueに設定する
        try {
          const idToken = await user.getIdToken();
          const userId = user.uid;
          localStorage.setItem('firebaseToken', idToken);
          localStorage.setItem('firebaseUserId', userId);
        } catch (error) {
          console.error('Error fetching ID token:', error);
        }
      } else {
        setIsAuthenticated(false); // ユーザーがログインしていない場合、isAuthenticatedをfalseに設定する
      }
    };

    checkAuthState(); // コンポーネントがマウントされたときにログイン状態を確認する
    // ログイン状態の変更を監視するリスナーを追加する
    const unsubscribe = auth.onAuthStateChanged(checkAuthState);
    // コンポーネントがアンマウントされるときにリスナーをクリーンアップする
    return () => unsubscribe();
  }, []);

  return (
    <div className="h-screen">
      {isAuthenticated ? (
        <Todo />
      ) : (
        <div>
          <SignIn />
          <Button
            onClick={() => {
              setIsDispRegister(!isDispRegister);
            }}
          >
            初めての方はこちら
          </Button>

          {isDispRegister ? <Register /> : <div></div>}
        </div>
      )}
    </div>
  );
};

export default AuthenticatedContent;
