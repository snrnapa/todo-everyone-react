import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { showErrorAlert, showSuccessAlert } from '../../model/Utils';

interface CommentInput {
  commentText: string;
}

const usePostComment = (
  userId: string | null,
  todoId: string | null,
  token: string | null,
) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const postComment: SubmitHandler<CommentInput> = async (data, event) => {
    if (userId && token) {
      const commentData = {
        user_id: userId,
        todo_id: todoId,
        commentText: data.commentText,
      };
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(commentData),
        });
        const responseData = await response.json();
        if (responseData.error) {
          setErrorMessage(responseData.error);
        } else {
          showSuccessAlert('登録完了', 'コメントを登録しました');
          event?.target.reset();
          setErrorMessage(null);
        }
      } catch {
        showErrorAlert(
          'サーバー処理中に問題が発生しました',
          errorMessage || '',
        );
      }
    }
  };

  return { postComment, errorMessage };
};

export default usePostComment;
