import { NotePencil, ArrowsInLineVertical } from 'phosphor-react';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import TodoInputForm from './form/TodoInputForm';
import TodoList from './TodoList';
import usePostTodo from './hooks/usePostTodo';

const Todo = () => {
  // const { userInfo, loading } = useUserInfo();
  const [postFlg, setPostFlg] = useState<boolean>(false);
  const token = localStorage.getItem('firebaseToken');
  const [reloadCount, setReloadCount] = useState(0);
  const userId = localStorage.getItem('firebaseUserId');

  const { postTodo } = usePostTodo(userId, token, setReloadCount);

  if (userId == null) {
    return <div>Loading Now......</div>;
  }

  return (
    <>
      <div className="p-1 space-y-2 w-full justify-center">
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
          <div className="space-y-2 ">
            <TodoInputForm onSubmit={postTodo} />
          </div>
        ) : (
          <div></div>
        )}
        <TodoList reloadCount={reloadCount} setReloadCount={setReloadCount} />
      </div>
    </>
  );
};

export default Todo;
