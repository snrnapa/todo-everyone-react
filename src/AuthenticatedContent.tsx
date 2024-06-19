import SignIn from './components/SignIn';
import { useEffect, useState } from 'react';
import Todo from './components/Todo';
import Register from './components/Register';
import { Button, CircularProgress } from '@mui/material';
import { auth } from './libs/firebase';

const AuthenticatedContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDispRegister, setIsDispRegister] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // ユーザーのログイン状態を確認する
    const checkAuthState = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setIsAuthenticated(true); // ユーザーがログインしている場合、isAuthenticatedをtrueに設定する
          const idToken = await user.getIdToken();
          const userId = user.uid;
          localStorage.setItem('firebaseToken', idToken);
          localStorage.setItem('firebaseUserId', userId);
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Error checking auth state:', error)
      } finally {
        setIsLoading(false)
      }
    };
    setIsLoading(true);
    checkAuthState();

    // ログイン状態の変更を監視するリスナーを追加する
    // 認証状態の変更を監視するリスナー
    const unsubscribe = auth.onAuthStateChanged(async () => {
      setIsLoading(true);  // 状態が変わった時点でロード中に設定
      await checkAuthState();  // 状態を再チェック
    });
    // コンポーネントがアンマウントされるときにリスナーをクリーンアップする
    return () => unsubscribe();
  }, []);


  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <CircularProgress />
        <p>自動ログイン中・・・</p>
      </div>
    )
  } else {
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
  }
};

export default AuthenticatedContent;
