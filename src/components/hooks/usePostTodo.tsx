import { API_URL } from '../../config';
import { SubmitHandler } from 'react-hook-form';
import { showErrorAlert, showSuccessAlert } from '../../model/Utils';
import { refreshFirebaseToken } from '../../model/token';
import { PostInput } from '../../model/TodoTypes';



const usePostTodo = (
) => {

  const postTodo: SubmitHandler<PostInput> = async (data) => {
    try {
      const token = await refreshFirebaseToken()
      const userId = localStorage.getItem('firebaseUserId')
      if (!userId) {
        throw new Error("ユーザーIDが取得できませんでした。ページの再読み込みをしてください")
      }
      if (!token) {
        throw new Error("認証Tokenが取得できませんでした。ページの再読み込みをしてください")
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    } catch (error) {
      showErrorAlert(
        'サーバー処理中に問題が発生しました',
        `詳細：${error}`,
      );
    }
  };
  return { postTodo };
};

export default usePostTodo;
