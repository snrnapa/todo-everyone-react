import { API_URL } from '../../config';
import { showErrorAlert } from '../../model/Utils';
import { refreshFirebaseToken } from '../../model/token';

const useUpdateAddition = (
  todoId: number | null,
  userId: string | null,
  isCheered: boolean | null,
  isBooked: boolean | null,
) => {
  const updateAddition = async () => {
    const token = await refreshFirebaseToken()
    if (userId && token) {
      const additionInfo = {
        todo_id: todoId,
        user_id: userId,
        is_cheered: isCheered,
        is_booked: isBooked,
      };
      try {
        await fetch(`${API_URL}/addition`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(additionInfo),
        });
      } catch (error) {
        showErrorAlert(
          'サーバー処理中に問題が発生しました',
          `詳細：${error}`,
        );
      }
    }
  };
  return { updateAddition };
};

export default useUpdateAddition;
