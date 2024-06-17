import { useEffect, useState } from 'react';
import { showErrorAlert } from '../../model/Utils';

type Todo = {
  user_id: string;
  title: string;
  deadline: string;
  detail: string;
  completed: boolean;
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
};

const useGetTodos = (reloadCount: number, headers: HeadersInit) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const userId = localStorage.getItem('firebaseUserId');

  useEffect(() => {
    const getTodos = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/v1/todos/${userId}`,
          {
            method: 'GET',
            headers: headers,
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP Error! status : ${response.status} `);
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
