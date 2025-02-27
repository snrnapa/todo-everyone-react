import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

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
        const response = await fetch(`${API_URL}/comment`, {
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
          toast.success('コメントを登録しました');
          event?.target.reset();
          setErrorMessage(null);
        }
      } catch {
        toast.error('コメントの登録中にエラーが発生しました');
      }
    }
  };

  return { postComment, errorMessage };
};

export default usePostComment;
