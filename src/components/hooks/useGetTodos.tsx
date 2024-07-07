import React, { useEffect, useState } from 'react';
import { showErrorAlert } from '../../model/Utils';
import { Todo } from '../../model/TodoTypes';
import { refreshFirebaseToken } from '../../model/token';
import { API_URL } from '../../config';

interface useTodosProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const useTodos : React.FC<useTodosProps> = ({setTodos}) => {

  useEffect(() => {
    const getTodos = async () => {
      try {
        const userId = localStorage.getItem('firebaseUserId');
        const token = await refreshFirebaseToken();
        if(!userId){
          throw new Error('userIdが取得できませんでした。解決しない場合は、再度ログインをしてください');
        }
        if(!token){
          throw new Error('認証Tokenが取得できませんでした。解決しない場合は、再度ログインをしてください');
        }
        const headers = {
          Authorization: `Bearer ${token}`,
        };

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
      }
    };

    getTodos();
  }, [setTodos]);

  return null;
};

export default useTodos;
