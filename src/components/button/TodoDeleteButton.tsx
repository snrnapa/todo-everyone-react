import { Trash, X, Check } from 'phosphor-react';
import React, { useState } from 'react';
import { IconButton } from '@mui/material';

interface TodoDeleteButtonProps {
  onDelete: () => void;
}

const TodoDeleteButton: React.FC<TodoDeleteButtonProps> = ({ onDelete }) => {
  const [dispConfimButton, setDispConfimButton] = useState<boolean>(false);

  const onDeleteConfirm = () => {
    onDelete;
    setDispConfimButton(false);
  };

  if (dispConfimButton) {
    return (
      <div className="bg-red-200 rounded-lg flex flex-col">
        <p className="text-xs p-2 font-bold ">削除しますか？</p>
        <div className="flex justify-center">
          <IconButton onClick={onDelete}>
            <Check size={20} color="#120fd2" weight="thin" />
          </IconButton>
          <IconButton onClick={onDeleteConfirm}>
            <X size={20} color="#120fd2" weight="thin" />
          </IconButton>
        </div>
      </div>
    );
  }

  if (!dispConfimButton) {
    return (
      <div>
        <IconButton
          onClick={() => {
            setDispConfimButton(true);
          }}
        >
          <Trash size={20} color="#120fd2" weight="thin" />
        </IconButton>
      </div>
    );
  }
};

export default TodoDeleteButton;
