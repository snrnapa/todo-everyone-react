import { useEffect, useState } from 'react';
import { showErrorAlert } from '../../model/Utils';
import { Todo } from '../../model/TodoTypes';


const useGetTodos = (reloadCount: number, headers: HeadersInit): Todo[] => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const userId = localStorage.getItem('firebaseUserId');

  useEffect(() => {
    const getTodos = async () => {
      try {
        const response = await fetch(
          `https://napalog.com/every-todo/v1/todos/${userId}`,
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
