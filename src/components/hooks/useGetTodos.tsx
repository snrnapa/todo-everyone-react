import { useEffect, useState } from 'react';
import { showErrorAlert } from '../../model/Utils';
import { Todo } from '../../model/TodoTypes';
import { refreshFirebaseToken } from '../../model/token';
import { API_URL } from '../../config';

const useGetTodos = (reloadCount: number, headers: HeadersInit): Todo[] => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const userId = localStorage.getItem('firebaseUserId');
  useEffect(() => {
    const getTodos = async () => {
      try {
        const token = await refreshFirebaseToken();
        // ヘッダーにトークンを設定
        const authHeaders = {
          ...headers,
          Authorization: `Bearer ${token}`
        };

        const response = await fetch(
          `${API_URL}/todos/${userId}`,
          {
            method: 'GET',
            headers: authHeaders,
          },
        );
        if (!response.ok) {
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
