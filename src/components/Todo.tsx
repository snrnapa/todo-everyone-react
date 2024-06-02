import { NotePencil, ArrowsInLineVertical } from 'phosphor-react';
import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { showErrorAlert, showSuccessAlert } from '../model/Utils';
import TodoInputForm from './form/TodoInputForm';
import TodoList from './TodoList';

type UserInfo = {
  userId: string;
};

interface PostInput {
  title: string;
  detail: string;
  limit: string;
  completed: boolean;
}

const Todo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [postFlg, setPostFlg] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const userId = localStorage.getItem('firebaseUserId');
  const token = localStorage.getItem('firebaseToken');
  const [reloadCount, setReloadCount] = useState(0);

  // submitが押下されると、todoを登録する
  const postTodo: SubmitHandler<PostInput> = async (data, event) => {
    if (userInfo) {
      const todoData = {
        user_id: userInfo.userId,
        title: data.title,
        detail: data.detail,
        completed: data.completed,
        limit: new Date(data.limit).toISOString(),
      };

      fetch('http://localhost:8080/v1/todo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(todoData),
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.error) {
            setErrorMessage(responseData.error);
          } else {
            showSuccessAlert('登録完了', 'Todoを登録しました');
            event?.target.reset();
            setErrorMessage(null);
            setReloadCount((prev) => prev + 1);
          }
        })
        .catch(() => {
          showErrorAlert(
            'サーバー処理中に問題が発生しました',
            '${errorMessage}',
          );
        });
    }
  };

  useEffect(() => {
    if (userId == null) {
      throw new Error('User ID not found in local storage.');
    }
    const user: UserInfo = {
      userId: userId,
    };
    setUserInfo(user);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading Now......</div>;
  }

  return (
    <>
      <div className="p-1 space-y-2">
        {!postFlg ? (
          <div className="flex items-center justify-center">
            <IconButton
              onClick={() => {
                setPostFlg(!postFlg);
              }}
            >
              <NotePencil size={52} color="#120fd2" weight="thin" />
            </IconButton>
            <p>やることを書く</p>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <IconButton
              onClick={() => {
                setPostFlg(!postFlg);
              }}
            >
              <ArrowsInLineVertical size={52} color="#120fd2" weight="thin" />
            </IconButton>
            <p>とじる</p>
          </div>
        )}

        {postFlg ? (
          <div className="space-y-2">
            <TodoInputForm onSubmit={postTodo} />
          </div>
        ) : (
          <div></div>
        )}
        <TodoList reloadCount={reloadCount} />
      </div>
    </>
  );
};

export default Todo;
