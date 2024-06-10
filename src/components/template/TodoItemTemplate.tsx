import React from 'react';
import { Todo } from '../../model/TodoTypes';
import { IconButton } from '@mui/material';
import {
  Trash,
  Pen,
  Copy,
  Bookmark,
  Heart,
  Confetti,
  Chat,
} from 'phosphor-react';

interface TodoItemTemplateProps {
  myTodoFlg: boolean;
  todo: Todo;
  isCheered: boolean;
  isFavo: boolean;
  isBooked: boolean;
  handleIsCheered: () => void;
  handleIsFavo: () => void;
  handleIsBooked: () => void;
  handleIsCompleted: () => void;
  handleDispComment: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onEdit: () => void;
}

const TodoItemTemplate: React.FC<TodoItemTemplateProps> = ({
  myTodoFlg,
  todo,
  isCheered,
  isFavo,
  isBooked,
  handleIsCheered,
  handleIsFavo,
  handleIsBooked,
  handleDispComment,
  onDelete,
  onCopy,
  onEdit,
}) => {
  if (myTodoFlg) {
    return (
      <div className="flex flex-col space-x-3">
        <div className="flex justify-start space-x-3">
          <div className="flex items-center">
            <IconButton onClick={handleIsCheered}>
              <Confetti
                size={15}
                color={isCheered ? '#DC143C' : '#A9A9A9'}
                weight={isCheered ? 'fill' : 'thin'}
              />
            </IconButton>
            <p className="text-xs text-slate-700">{todo.cheered_count}</p>
          </div>

          <div className="flex items-center">
            <IconButton onClick={handleIsFavo}>
              <Heart
                size={15}
                color={isFavo ? '#DC143C' : '#A9A9A9'}
                weight={isFavo ? 'fill' : 'thin'}
              />
            </IconButton>
            <p className="text-xs text-slate-700">{todo.favorite_count}</p>
          </div>

          <div className="flex items-center">
            <IconButton onClick={handleIsBooked}>
              <Bookmark
                size={15}
                color={isBooked ? '#DC143C' : '#A9A9A9'}
                weight={isBooked ? 'fill' : 'thin'}
              />
            </IconButton>
            <p className="text-xs text-slate-700">{todo.booked_count}</p>
          </div>
        </div>

        <div className="flex justify-start space-x-3">
          <IconButton onClick={handleDispComment}>
            <Chat size={20} color="#120fd2" weight="thin" />
          </IconButton>

          <IconButton onClick={onDelete}>
            <Trash size={20} color="#120fd2" weight="thin" />
          </IconButton>
          <IconButton onClick={onEdit}>
            <Pen size={20} color="#120fd2" weight="thin" />
          </IconButton>
        </div>
      </div>
    );
  }

  if (!myTodoFlg) {
    <div className="flex flex-col items-start  space-x-3">
      <div className="flex justify-start space-x-3">
        <div className="flex items-center">
          <IconButton onClick={handleIsCheered}>
            <Confetti
              size={15}
              color={isCheered ? '#DC143C' : '#A9A9A9'}
              weight={isCheered ? 'fill' : 'thin'}
            />
          </IconButton>
          <p className="text-xs text-slate-700">{todo.cheered_count}</p>
        </div>

        <div className="flex items-center">
          <IconButton onClick={handleIsFavo}>
            <Heart
              size={15}
              color={isFavo ? '#DC143C' : '#A9A9A9'}
              weight={isFavo ? 'fill' : 'thin'}
            />
          </IconButton>
          <p className="text-xs text-slate-700">{todo.favorite_count}</p>
        </div>

        <div className="flex items-center">
          <IconButton onClick={handleIsBooked}>
            <Bookmark
              size={15}
              color={isBooked ? '#DC143C' : '#A9A9A9'}
              weight={isBooked ? 'fill' : 'thin'}
            />
          </IconButton>
          <p className="text-xs text-slate-700">{todo.booked_count}</p>
        </div>
      </div>
      <div className="flex justify-start space-x-3">
        <IconButton onClick={onCopy}>
          <Copy size={20} color="#120fd2" weight="thin" />
        </IconButton>

        <div className="flex items-center">
          <IconButton onClick={handleDispComment}>
            <Chat size={20} color="#120fd2" weight="thin" />
          </IconButton>
          <p className="text-xs text-slate-700">{todo.comment_count}</p>
        </div>
      </div>
    </div>;
  }
};

export default TodoItemTemplate;
