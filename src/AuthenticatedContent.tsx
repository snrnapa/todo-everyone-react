import SignIn from './components/SignIn';
import { useEffect, useState } from 'react';
import Todo from './components/TodoPage';
import Register from './components/Register';
import { Button, CircularProgress } from '@mui/material';
import { auth } from './libs/firebase';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const AuthenticatedContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDispRegister, setIsDispRegister] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // ユーザーのログイン状態を確認する
    const checkAuthState = async () => {
      localStorage.removeItem('firebaseToken');
      localStorage.removeItem('firebaseUserId');
      try {
        const user = auth.currentUser;
        if (user) {
        } else {
          setIsAuthenticated(false)
          return;
        }
        // メール認証が完了しているかを確認する
        if (!user.emailVerified) {
          throw new Error('メール認証が完了していません')
        }
        const idToken = await user.getIdToken();
        const userId = user.uid;
        localStorage.setItem('firebaseToken', idToken);
        localStorage.setItem('firebaseUserId', userId);
        setIsAuthenticated(true);
      } catch (error) {
        toast.error(`${error.message}`);

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
  }

  if (!isLoading && isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="h-screen flex flex-col"
      >
        <Todo />
      </motion.div>
    )
  }

  if (!isLoading && !isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="h-screen flex flex-col"
      >
        <SignIn />
        <Button
          onClick={() => {
            setIsDispRegister(!isDispRegister);
          }}
        >
          初めての方はこちら
        </Button>
        {isDispRegister ? <Register /> : <div></div>}
      </motion.div>
    )
  }
}

export default AuthenticatedContent;
