import { useCallback, useState } from 'react';
import { PostInput, Todo } from '../../model/TodoTypes';
import { API_URL } from '../../config';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';

const useTodos = (initialTodos: Todo[], headers: Record<string, string>) => {

  const [todos, setTodos] = useState<Todo[]>(initialTodos)

  const fetchTodos = useCallback(async () => {
    try {
      const userId = localStorage.getItem('firebaseUserId');
      if (!userId) {
        throw new Error('userIdが取得できませんでした。解決しない場合は、再度ログインをしてください');
      }
      const response = await fetch(
        `${API_URL}/todos/${userId}`,
        {
          method: 'GET',
          headers: headers,
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP Error! status : ${response.status}`);
      }
      const responseData = await response.json();
      setTodos(responseData);
    } catch (error) {
      toast.error('todoの取得に失敗しました');
      console.log(error)
    }
  }, [headers])


  const postTodo = useCallback<SubmitHandler<PostInput>>(async (data) => {
    try {
      const userId = localStorage.getItem('firebaseUserId')
      if (!userId) {
        throw new Error("ユーザーIDが取得できませんでした。ページの再読み込みをしてください")
      }
      const todoData = {
        user_id: userId,
        title: data.title,
        detail: data.detail,
        completed: data.completed,
        deadline: new Date(data.deadline).toISOString(),
      };

      const response = await fetch(`${API_URL}/todo`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(todoData),
      });
      console.log(JSON.stringify(todoData))

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      toast.success('Todoの登録が完了しました');

      console.log(`${API_URL}/todo`)
      const responseData = await response.json();
      console.log(responseData)
      setTodos(responseData);
    } catch (error) {
      toast.error('Todoの登録に失敗しました');
    }
  }, [headers])

  const updateTodo = useCallback(async (todo: Todo, setEditedTodo: any, setEditMode: any) => {
    const response = await fetch(`${API_URL}/todo`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(todo),
    })

    try {
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      toast.success('Todoの更新が完了しました');
      setEditedTodo(undefined);
      setEditMode(false);

    } catch (error) {
      toast.error('Todoの更新に失敗しました');
    }
  }, [headers])


  const copyTodo = useCallback(async (todo: Todo) => {

    try {
      const response = await fetch(`${API_URL}/todo`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(todo),
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      toast.success('Todoのコピーが完了しました');
      setTodos((prevTodos) => [...prevTodos, todo])

    } catch (error) {
      toast.error('Todoのコピーに失敗しました');
    }

  }, [headers]);

  const deleteTodo = useCallback(async (todo: Todo) => {

    try {
      const response = await fetch(`${API_URL}/todo`, {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify(todo),
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      toast.success('Todoの削除が完了しました');
      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));

    } catch (error) {
      toast.error('Todoの削除に失敗しました');
    }

  }, [headers])


  return { todos, fetchTodos, postTodo, deleteTodo, updateTodo, copyTodo };
};

export default useTodos;
