import React, { useEffect, useState } from 'react';
import { Todo } from '../../model/TodoTypes';
import { IconButton } from '@mui/material';
import { Pen, Confetti, Chat } from 'phosphor-react';
import { showErrorAlert } from '../../model/Utils';
import TodoDeleteButton from '../button/TodoDeleteButton';
import TodoCopyButton from '../button/TodoCopyButton';
import { refreshFirebaseToken } from '../../model/token';

type AdditionInput = {
  todo_id: number;
  user_id: string;
  is_booked: boolean;
  is_cheered: boolean;
};

interface TodoItemTemplateProps {
  myTodoFlg: boolean;
  todo: Todo;
  handleIsCompleted: () => void;
  handleDispComment: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onEdit: () => void;
}

const TodoItemTemplate: React.FC<TodoItemTemplateProps> = ({
  myTodoFlg,
  todo,
  handleDispComment,
  onDelete,
  onCopy,
  onEdit,
}) => {
  const [isCheered, setIsCheered] = useState(todo.is_cheered_me);
  const firebaseUserId = localStorage.getItem('firebaseUserId');

  const [token, setToken] = useState<string | null>(null); // トークンの状態を保持するstateを追加する
  // ページが読み込まれた時にトークンを取得する
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await refreshFirebaseToken();
        setToken(token);
      } catch (error) {
        console.error('Error fetching Firebase token:', error);
        setToken(null);
      }
    };

    fetchToken();
  }, []); // 一度だけ実行される

  const handleIsCheered = () => {
    todo.is_cheered_me = !isCheered;
    updateAddition(todo);
    setIsCheered(todo.is_cheered_me);
  };

  // const handleIsBooked = () => {
  //   todo.is_booked_me = !isBooked;
  //   updateAddition(todo);
  //   setIsBooked(todo.is_booked_me);
  // };

  const updateAddition = (todo: Todo) => {
    if (!firebaseUserId) {
      return;
    }
    const targetInfo: AdditionInput = {
      todo_id: todo.id,
      user_id: firebaseUserId,
      is_cheered: todo.is_cheered_me,
      is_booked: todo.is_booked_me,
    };

    fetch(`${process.env.REACT_APP_API_URL}/addition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(targetInfo),
    }).then((response) => {
      if (!response.ok) {
        showErrorAlert(
          '更新エラー',
          `ステータス更新中にエラーが発生しました。${response.json}`,
        );
      } else {
      }
    });
  };

  if (myTodoFlg) {
    return (
      <div className="flex flex-col space-x-3">
        <div className="flex justify-start space-x-3">
          <div className="flex items-center">
            <IconButton onClick={handleDispComment}>
              <Chat size={20} color="#120fd2" weight="thin" />
            </IconButton>
            <p className="text-xs text-slate-700">{todo.comment_count}</p>
          </div>
          <div className="flex items-center">
            <IconButton onClick={handleIsCheered}>
              <Confetti
                size={20}
                color={isCheered ? '#DC143C' : '#A9A9A9'}
                weight={isCheered ? 'fill' : 'thin'}
              />
            </IconButton>
            <p className="text-xs text-slate-700">{todo.cheered_count}</p>
          </div>

          {/* <div className="flex items-center">
            <IconButton onClick={handleIsBooked}>
              <Bookmark
                size={20}
                color={isBooked ? '#DC143C' : '#A9A9A9'}
                weight={isBooked ? 'fill' : 'thin'}
              />
            </IconButton>
            <p className="text-xs text-slate-700">{todo.booked_count}</p>
          </div> */}
        </div>

        <div className="flex justify-evenly space-x-3">
          <TodoDeleteButton onDelete={onDelete} />
          <IconButton onClick={onEdit}>
            <Pen size={20} color="#120fd2" weight="thin" />
          </IconButton>
        </div>
      </div>
    );
  }

  if (!myTodoFlg) {
    return (
      <div className="flex flex-col items-start  space-x-3">
        <div className="flex justify-start space-x-3">
          <div className="flex items-center">
            <IconButton onClick={handleDispComment}>
              <Chat size={20} color="#120fd2" weight="thin" />
            </IconButton>
            <p className="text-xs text-slate-700">{todo.comment_count}</p>
          </div>
          <div className="flex items-center">
            <IconButton onClick={handleIsCheered}>
              <Confetti
                size={20}
                color={isCheered ? '#DC143C' : '#A9A9A9'}
                weight={isCheered ? 'fill' : 'thin'}
              />
            </IconButton>
            <p className="text-xs text-slate-700">{todo.cheered_count}</p>
          </div>

          {/* <div className="flex items-center">
            <IconButton onClick={handleIsBooked}>
              <Bookmark
                size={20}
                color={isBooked ? '#DC143C' : '#A9A9A9'}
                weight={isBooked ? 'fill' : 'thin'}
              />
            </IconButton>
            <p className="text-xs text-slate-700">{todo.booked_count}</p>
          </div> */}
        </div>
        <div className="flex justify-start space-x-3">
          <TodoCopyButton onCopy={onCopy} />
        </div>
      </div>
    );
  }
};

export default TodoItemTemplate;
