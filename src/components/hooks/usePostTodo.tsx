import { API_URL } from '../../config';
import { SubmitHandler } from 'react-hook-form';
import { showErrorAlert } from '../../model/Utils';
import { refreshFirebaseToken } from '../../model/token';

interface PostInput {
  title: string;
  detail: string;
  deadline: string;
  completed: boolean;
}

const usePostTodo = (
  userId: string | null,
) => {

  const postTodo: SubmitHandler<PostInput> = async (data) => {
    const token = await refreshFirebaseToken()
    if (userId && token) {
      const todoData = {
        user_id: userId,
        title: data.title,
        detail: data.detail,
        completed: data.completed,
        deadline: new Date(data.deadline).toISOString(),
      };
      try {
        console.log(`${API_URL}/todo`)
        await fetch(`${API_URL}/todo`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(todoData),
        });
        // const responseData = await response.json();
      } catch (error) {
        showErrorAlert(
          'サーバー処理中に問題が発生しました',
          `詳細：${error}`,
        );
      }
    }
  };
  return { postTodo };
};

export default usePostTodo;
