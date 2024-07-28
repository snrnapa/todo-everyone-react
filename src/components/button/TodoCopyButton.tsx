import { Copy, X, Check } from 'phosphor-react';
import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { toast } from 'react-toastify';

interface TodoCopyButtonProps {
  onCopy: () => void;
}

const TodoCopyButton: React.FC<TodoCopyButtonProps> = ({ onCopy }) => {
  const [dispConfimButton, setDispConfimButton] = useState<boolean>(false);

  const onCopyConfirm = async () => {
    try {
      await onCopy();
    } catch (error) {
      toast.error('予定のコピーに失敗しました');
    }

    setDispConfimButton(false);
  };

  if (dispConfimButton) {
    return (
      <div className="bg-green-200 rounded-lg flex flex-col">
        <p className="text-xs p-2 font-bold ">自分の予定にコピーしますか？</p>
        <div className="flex justify-center">
          <IconButton onClick={onCopyConfirm}>
            <Check size={20} color="#120fd2" weight="thin" />
          </IconButton>
          <IconButton onClick={() => {
            setDispConfimButton(false)
          }}>
            <X size={20} color="#120fd2" weight="thin" />
          </IconButton>
        </div>
      </div >
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
          <Copy size={20} color="#120fd2" weight="thin" />
        </IconButton>
      </div>
    );
  }
};

export default TodoCopyButton;
