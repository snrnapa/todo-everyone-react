import { useEffect, useState } from 'react';

type UserInfo = {
  userId: string;
};

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const userId = localStorage.getItem('firebaseUserId');
  useEffect(() => {
    if (userId == null) {
      throw new Error('User ID not found in local storage');
    }
    setUserInfo({ userId });
    setLoading(false);
  }, [userId]);

  return { userInfo, loading };
};

export default useUserInfo;
