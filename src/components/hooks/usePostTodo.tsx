import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { showErrorAlert, showSuccessAlert } from '../../model/Utils';

interface PostInput {
  title: string;
  detail: string;
  deadline: string;
  completed: boolean;
}

const usePostTodo = (
  userId: string | null,
  token: string | null,
  setReloadCount: React.Dispatch<React.SetStateAction<number>>,
) => {
  const [errorMassage, setErrorMessage] = useState<string | null>(null);

  const postTodo: SubmitHandler<PostInput> = async (data, event) => {
    if (userId && token) {
      const todoData = {
        user_id: userId,
        title: data.title,
        detail: data.detail,
        completed: data.completed,
        deadline: new Date(data.deadline).toISOString(),
      };
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/todo`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(todoData),
        });
        const responseData = await response.json();
        if (responseData.error) {
          setErrorMessage(responseData.error);
        } else {
          showSuccessAlert('登録完了', 'Todoを登録しました');
          event?.target.reset();
          setErrorMessage(null);
          setReloadCount((prev) => prev + 1);
        }
      } catch {
        showErrorAlert(
          'サーバー処理中に問題が発生しました',
          errorMassage || '',
        );
      }
    }
  };
  return { postTodo, errorMassage };
};

export default usePostTodo;
