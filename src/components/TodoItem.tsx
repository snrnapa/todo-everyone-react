import React from 'react';
import { Card, IconButton } from '@mui/material';
import { Trash, Pen, Timer } from 'phosphor-react';
import { Todo } from '../model/TodoTypes';
import { formatDateForInput } from '../model/Utils';

interface TodoItemProps {
  todo: Todo;
  onEdit: () => void;
  onDelete: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit, onDelete }) => {
  return (
    <div>
      <Card className="flex flex-col justify-center p-1 m-1 shadow-2xl space-y-1">
        <div className="flex flex-col space-y-1">
          <p className="text-sm">{todo.title}</p>
          <p className="text-gray-400 text-sm">{todo.detail}</p>
          {todo.limit ? (
            <div className="flex">
              <Timer size={20} color="#120fd2" weight="thin" />
              <p className="text-sm">{formatDateForInput(todo.limit)}</p>
            </div>
          ) : (
            <div className="flex"></div>
          )}
          <div className="flex justify-start space-x-3">
            <IconButton onClick={onDelete}>
              <Trash size={28} color="#120fd2" weight="thin" />
            </IconButton>
            <IconButton onClick={onEdit}>
              <Pen size={28} color="#120fd2" weight="thin" />
            </IconButton>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TodoItem;
