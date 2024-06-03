import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { showErrorAlert, showSuccessAlert } from '../../model/Utils';

interface PostInput {
  title: string;
  detail: string;
  limit: string;
  completed: boolean;
}

type UserInfo = {
  userId: string;
};

const usePostTodo = (
  userInfo: UserInfo | null,
  token: string | null,
  setReloadCount: React.Dispatch<React.SetStateAction<number>>,
) => {
  const [errorMassage, setErrorMessage] = useState<string | null>(null);

  const postTodo: SubmitHandler<PostInput> = async (data, event) => {
    if (userInfo && token) {
      const todoData = {
        user_id: userInfo.userId,
        title: data.title,
        detail: data.detail,
        completed: data.completed,
        limit: new Date(data.limit).toISOString(),
      };
      try {
        const response = await fetch('http://localhost:8080/v1/todo', {
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
