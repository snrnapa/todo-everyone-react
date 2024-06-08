import React, { useState } from 'react';
import { Card, CardActions, IconButton } from '@mui/material';
import {
  Trash,
  Pen,
  Timer,
  Copy,
  Bookmark,
  Heart,
  Confetti,
  Chat,
} from 'phosphor-react';
import { Todo } from '../model/TodoTypes';
import { formatDateForInput, showErrorAlert } from '../model/Utils';
import TodoForm from './form/TodoForm';
import CommentForm from './form/CommentForm';
import { useNavigate } from 'react-router-dom';

type AdditionInput = {
  todo_id: number;
  user_id: string;
  is_favorite: boolean;
  is_booked: boolean;
  is_cheered: boolean;
};

type Comment = {
  user_id: string;
  todo_id: number;
  text: string;
};

interface TodoItemProps {
  todo: Todo;
  onEdit: () => void;
  onSubmit: (data: Todo) => void;
  onCancel: () => void;
  onDelete: () => void;
  onCopy: () => void;
  editMode: boolean;
  editedTodo?: Todo;
  myTodoFlg: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onEdit,
  onSubmit,
  onCancel,
  onDelete,
  onCopy,
  editMode,
  editedTodo,
  myTodoFlg,
}) => {
  const [isComment, setIsComment] = useState(false);
  const [isCheered, setIsCheered] = useState(todo.is_cheered_me);
  const [isFavo, setIsFavo] = useState(todo.is_favorite_me);
  const [isBooked, setIsBooked] = useState(todo.is_booked_me);
  const token = localStorage.getItem('firebaseToken');

  const navigate = useNavigate();

  const updateAddition = (todo: Todo) => {
    const targetInfo: AdditionInput = {
      todo_id: todo.id,
      user_id: todo.user_id,
      is_favorite: todo.is_favorite_me,
      is_cheered: todo.is_cheered_me,
      is_booked: todo.is_booked_me,
    };

    fetch('http://localhost:8080/v1/addition', {
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
        console.log(response.ok);
      }
    });
  };

  const handleDispComment = () => {
    setIsComment(!isComment);
  };

  const handleIsCheered = () => {
    todo.is_cheered_me = !isCheered;
    updateAddition(todo);
    setIsCheered(todo.is_cheered_me);
  };
  const handleIsFavo = () => {
    todo.is_favorite_me = !isFavo;
    updateAddition(todo);
    setIsFavo(todo.is_favorite_me);
  };
  const handleIsBooked = () => {
    todo.is_booked_me = !isBooked;
    updateAddition(todo);
    setIsBooked(todo.is_booked_me);
  };

  const navigateTodoInfo = (todoId) => {
    navigate(`/todo/${todoId}`);
  };
  return (
    <div>
      {editMode && editedTodo.id == todo.id ? (
        <TodoForm
          key={todo.id}
          defaultValues={todo}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      ) : (
        <Card className="flex flex-col justify-center p-1 m-1 shadow-2xl space-y-1">
          <CardActions
            onClick={() => {
              navigateTodoInfo(todo.id);
            }}
          >
            <div className="flex flex-col space-y-1">
              <p className="text-sm">{todo.title}</p>
              <p className="text-gray-400 text-sm">{todo.detail}</p>
              <div className="flex">
                <Timer size={20} color="#120fd2" weight="thin" />
                <p className="text-sm">{formatDateForInput(todo.deadline)}</p>
              </div>

              {myTodoFlg ? (
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
                      <p className="text-xs text-slate-700">
                        {todo.cheered_count}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <IconButton onClick={handleIsFavo}>
                        <Heart
                          size={15}
                          color={isFavo ? '#DC143C' : '#A9A9A9'}
                          weight={isFavo ? 'fill' : 'thin'}
                        />
                      </IconButton>
                      <p className="text-xs text-slate-700">
                        {todo.favorite_count}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <IconButton onClick={handleIsBooked}>
                        <Bookmark
                          size={15}
                          color={isBooked ? '#DC143C' : '#A9A9A9'}
                          weight={isBooked ? 'fill' : 'thin'}
                        />
                      </IconButton>
                      <p className="text-xs text-slate-700">
                        {todo.booked_count}
                      </p>
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
              ) : (
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
                      <p className="text-xs text-slate-700">
                        {todo.cheered_count}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <IconButton onClick={handleIsFavo}>
                        <Heart
                          size={15}
                          color={isFavo ? '#DC143C' : '#A9A9A9'}
                          weight={isFavo ? 'fill' : 'thin'}
                        />
                      </IconButton>
                      <p className="text-xs text-slate-700">
                        {todo.favorite_count}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <IconButton onClick={handleIsBooked}>
                        <Bookmark
                          size={15}
                          color={isBooked ? '#DC143C' : '#A9A9A9'}
                          weight={isBooked ? 'fill' : 'thin'}
                        />
                      </IconButton>
                      <p className="text-xs text-slate-700">
                        {todo.booked_count}
                      </p>
                    </div>
                  </div>
                  <div>
                    <IconButton onClick={onCopy}>
                      <Copy size={20} color="#120fd2" weight="thin" />
                    </IconButton>
                    {/* <IconButton component={Link} to={`/todo/${todo.id}`}>
                    <Chat size={20} color="#120fd2" weight="thin" />
                  </IconButton> */}
                    <IconButton onClick={handleDispComment}>
                      <Chat size={20} color="#120fd2" weight="thin" />
                    </IconButton>
                  </div>
                </div>
              )}

              {isComment ? (
                <CommentForm onCancel={handleDispComment} todoId={todo.id} />
              ) : (
                <div></div>
              )}
            </div>
          </CardActions>
        </Card>
      )}
    </div>
  );
};

export default TodoItem;
