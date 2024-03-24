import { useEffect, useState } from 'react';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';

// カスタムフックの定義
const useCurrentUser = (): User | null => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Firebaseの認証状態が変更されたら呼ばれるコールバック関数
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setCurrentUser(user); // ユーザー情報をstateにセット
    });

    // コンポーネントのアンマウント時にunsubscribeする
    return () => unsubscribe();
  }, []);

  return currentUser; // 現在のユーザー情報を返す
};

export default useCurrentUser;
