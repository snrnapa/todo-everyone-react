import React from 'react';
import { Todo } from '../../model/TodoTypes';
import { CheckSquare, Square } from 'phosphor-react';

interface CompletedCheckProps {
  todo: Todo;
  handleIsCompleted: () => void;
}

const CompletedCheck: React.FC<CompletedCheckProps> = ({
  todo,
  handleIsCompleted,
}) => {
  if (todo.completed) {
    return (
      <div
        className="flex justify-center items-center bg-blue-300"
        onClick={() => {
          handleIsCompleted();
        }}
      >
        <CheckSquare size={30} color="#120fd2" weight="thin" />
        <p className="text-lg font-Darumadrop">かんりょう</p>
      </div>
    );
  }

  if (!todo.completed) {
    return (
      <div
        className="flex justify-center items-center bg-gray-300"
        onClick={() => {
          handleIsCompleted();
        }}
      >
        <Square size={30} color="#120fd2" weight="thin" />
        <p className="text-lg font-Darumadrop">とちゅう</p>
      </div>
    );
  }
};

export default CompletedCheck;
