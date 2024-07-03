import { NotePencil, ArrowsInLineVertical } from 'phosphor-react';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import TodoInputForm from './form/TodoInputForm';
import TodoList from './template/TodoList';
import { WeeklyCalender } from './template/WeeklyCalender';

const Todo = () => {
  const [postFlg, setPostFlg] = useState<boolean>(false);
  const [reloadCount, setReloadCount] = useState(0);
  const userId = localStorage.getItem('firebaseUserId');

  if (userId == null) {
    return <div>Loading Now......</div>;
  }

  return (
    <>
      <div className="p-1 space-y-2 w-full justify-center">
        <WeeklyCalender />
        {!postFlg ? (
          <div className="flex items-center justify-start">
            <IconButton
              onClick={() => {
                setPostFlg(!postFlg);
              }}
            >
              <NotePencil size={32} color="#120fd2" weight="thin" />
            </IconButton>
            <p className='text-base text-black'>やることを書く</p>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <IconButton
              onClick={() => {
                setPostFlg(!postFlg);
              }}
            >
              <ArrowsInLineVertical size={32} color="#120fd2" weight="thin" />
            </IconButton>
            <p>とじる</p>
          </div>
        )}

        {postFlg ? (
          <div className="space-y-2 ">
            <TodoInputForm />
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
