import React, { useState } from 'react';
import { Todo } from '../../model/TodoTypes';
import { IconButton } from '@mui/material';
import { Pen, Confetti, Chat } from 'phosphor-react';
import TodoDeleteButton from '../button/TodoDeleteButton';
import TodoCopyButton from '../button/TodoCopyButton';
import useUpdateAddition from '../hooks/useUpdateAddition';


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
  const [cheeredCount, setCheeredCount] = useState(todo.cheered_count)

  const handleIsCheered = () => {
    if (isCheered) {
      setCheeredCount(cheeredCount - 1)
    } else {
      setCheeredCount(cheeredCount + 1)
    }
    todo.is_cheered_me = !isCheered;
    const userId = localStorage.getItem('firebaseUserId')
    const { updateAddition } = useUpdateAddition(todo.id, userId, todo.is_cheered_me, todo.is_booked_me)
    updateAddition();
    setIsCheered(todo.is_cheered_me);
  };

  // const handleIsBooked = () => {
  //   todo.is_booked_me = !isBooked;
  //   updateAddition(todo);
  //   setIsBooked(todo.is_booked_me);
  // };


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
            <p className="text-xs text-slate-700">{cheeredCount}</p>
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
            <p className="text-xs text-slate-700">{cheeredCount}</p>
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
