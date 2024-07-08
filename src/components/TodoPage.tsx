import { NotePencil, ArrowsInLineVertical } from 'phosphor-react';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import TodoInputForm from './form/TodoInputForm';
import TodoList from './template/TodoList';
import { WeeklyCalender } from './template/WeeklyCalender';
import { ButtonStyle } from './styles/ButtonStyles';
import { Todo } from '../model/TodoTypes';

const TodoPage = () => {

  const [postFlg, setPostFlg] = useState<boolean>(false);
  const userId = localStorage.getItem('firebaseUserId');

  if (userId == null) {
    return <div>Loading Now......</div>;
  }

  return (
    <>
      <div className="p-1 space-y-2 w-full justify-center">
        <WeeklyCalender />
        <div className="flex items-center justify-start">
          {!postFlg ? (
            <div
              onClick={() => {
                setPostFlg(!postFlg);
              }}
              className={`${ButtonStyle.base} ${ButtonStyle.primary}`}
            >
              <NotePencil size={32} color="#120fd2" weight="thin" />
              <p className={`${ButtonStyle.text}`}>やることを書く</p>
            </div>
          ) : (
            <div
              onClick={() => {
                setPostFlg(!postFlg);
              }}
              className={`${ButtonStyle.base} ${ButtonStyle.primary}`}
            >
              <ArrowsInLineVertical size={32} color="#120fd2" weight="thin" />
              <p className={`${ButtonStyle.text}`}>とじる</p>
            </div>
          )}
        </div>

        {postFlg ? (
          <div className="space-y-2 ">
            <TodoInputForm />
          </div>
        ) : (
          <div></div>
        )}
        <TodoList todos={todos} setTodos={setTodos} />
      </div >
    </>
  );
};

export default TodoPage;
