import { useCallback, useState } from 'react';
import { showErrorAlert, showSuccessAlert } from '../../model/Utils';
import { PostInput, Todo } from '../../model/TodoTypes';
import { refreshFirebaseToken } from '../../model/token';
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

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      showSuccessAlert(
        '完了',
        `Todoの登録が完了しました。`,
      );
      // 【要対応】新しい Todo を取得してリストに追加
      // const createdTodo = await response.json();
      // setTodos((prevTodos) => [...prevTodos, createdTodo]);
    } catch (error) {
      showErrorAlert(
        'サーバー処理中に問題が発生しました',
        `詳細：${error}`,
      );
    }
  }, [headers])


  return { todos, fetchTodos, postTodo };
};

export default useTodos;
