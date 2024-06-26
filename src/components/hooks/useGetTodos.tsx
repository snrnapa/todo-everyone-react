import { useEffect, useState } from 'react';
import { showErrorAlert } from '../../model/Utils';
import { Todo } from '../../model/TodoTypes';
import { auth } from '../../libs/firebase';



// トークンの有効期限をチェックし、必要に応じてリフレッシュする関数
const checkTokenAndRefresh = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    const tokenResult = await user.getIdTokenResult();
    const expirationTime = tokenResult.expirationTime;

    // トークンの有効期限をチェック
    if (new Date(expirationTime) < new Date()) {
      const newToken = await user.getIdToken(true);
      localStorage.setItem('token', newToken);
      return newToken;
    } else {
      return tokenResult.token;
    }
  }
  return null;
};


const useGetTodos = (reloadCount: number, headers: HeadersInit): Todo[] => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const userId = localStorage.getItem('firebaseUserId');

  useEffect(() => {
    const getTodos = async () => {
      try {
        let token = localStorage.getItem('token') || await checkTokenAndRefresh();

        if (!token) {
          throw new Error('トークンの取得に失敗しました');
        }

        // ヘッダーにトークンを設定
        const authHeaders = {
          ...headers,
          Authorization: `Bearer ${token}`
        };

        const response = await fetch(
          `https://napalog.com/every-todo/v1/todos/${userId}`,
          {
            method: 'GET',
            headers: authHeaders,
          },
        );
        if (!response.ok) {
          if (response.status === 401) { // トークンが期限切れの場合
            token = await checkTokenAndRefresh();
            if (token) {
              localStorage.setItem('token', token);
              // 新しいトークンで再試行
              const retryResponse = await fetch(
                `https://napalog.com/every-todo/v1/todos/${userId}`,
                {
                  method: 'GET',
                  headers: {
                    ...authHeaders,
                    Authorization: `Bearer ${token}`
                  },
                }
              );
              if (!retryResponse.ok) {
                throw new Error(`HTTP Error! status : ${retryResponse.status}`);
              }
              const retryData = await retryResponse.json();
              setTodos(retryData);
              return;
            }
          }
          throw new Error(`HTTP Error! status : ${response.status}`);
        }
        const responseData = await response.json();
        setTodos(responseData);
      } catch (error) {
        showErrorAlert('todoの取得に失敗しました', `${error}`);
      }
    };
    getTodos();
  }, [reloadCount]);

  return todos;
};

export default useGetTodos;
