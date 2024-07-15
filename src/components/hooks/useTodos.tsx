import { useCallback, useState } from 'react';
import { showErrorAlert, showSuccessAlert } from '../../model/Utils';
import { PostInput, Todo } from '../../model/TodoTypes';
import { API_URL } from '../../config';
import { SubmitHandler } from 'react-hook-form';



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
      showErrorAlert('todoの取得に失敗しました', `${error}`);
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
      showSuccessAlert(
        '完了',
        `Todoの登録が完了しました。`,
      );
      console.log(`${API_URL}/todo`)
      const responseData = await response.json();
      console.log(responseData)
      setTodos(responseData);
    } catch (error) {
      showErrorAlert(
        'サーバー処理中に問題が発生しました',
        `詳細：${error}`,
      );
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
      showSuccessAlert(
        '完了',
        `Todoの登録が完了しました。`,
      );
      setEditedTodo(undefined);
      setEditMode(false);
      // // 【要対応】更新された Todo の情報を取得
      // const updatedTodo = await response.json();

      // // 更新された Todo を反映してリストを更新
      // setTodos((prevTodos) => {
      //   // 更新対象の Todo を見つけて、新しい updatedTodo で置き換える
      //   return prevTodos.map((t) =>
      //     t.id === updatedTodo.id ? updatedTodo : t
      //   );
      // });
    } catch (error) {
      showErrorAlert(
        'サーバー処理中に問題が発生しました',
        `詳細：${error}`,
      );
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
      showSuccessAlert('コピー完了', 'Todoをコピーが完了しました');
      setTodos((prevTodos) => [...prevTodos, todo])

    } catch (error) {
      showErrorAlert(
        'todoのコピー失敗',
        `todoのコピー中にエラーが発生しました${error}`,
      );
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
      showSuccessAlert(
        '削除完了',
        `todoの削除が完了しました`,
      );
      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));

    } catch (error) {
      showErrorAlert(
        'サーバー処理中に問題が発生しました',
        `詳細：${error}`,
      );
    }

  }, [headers])


  return { todos, fetchTodos, postTodo, deleteTodo, updateTodo, copyTodo };
};

export default useTodos;
