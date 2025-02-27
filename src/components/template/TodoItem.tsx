import React, { useEffect, useState } from 'react';
import { Card } from '@mui/material';
import { Timer } from 'phosphor-react';
import { Todo } from '../../model/TodoTypes';
import { formatDateForInput, getColorForDeadline } from '../../model/Utils';
import TodoForm from '../form/TodoForm';
import CommentForm from '../form/CommentForm';
import { useNavigate } from 'react-router-dom';
import CompletedCheck from '../button/CompletedCheck';
import TodoItemTemplate from './TodoItemTemplate';
import { refreshFirebaseToken } from '../../model/token';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

interface TodoItemProps {
  todo: Todo;
  onEdit: () => void;
  onSubmit: (data: Todo) => void;
  onCancel: () => void;
  onDelete: () => void;
  onCopy: () => void;
  editMode: boolean;
  editedTodo?: Todo | undefined;
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

  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const firebaseUserId = localStorage.getItem('firebaseUserId');
  const deadlineColorClass = getColorForDeadline(todo.deadline)
  const [token, setToken] = useState<string | null>(null); // トークンの状態を保持するstateを追加する
  // ページが読み込まれた時にトークンを取得する
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await refreshFirebaseToken();
        setToken(token);
      } catch (error) {
        toast.error('Firebaseトークンの取得に失敗しました。再度ログインしてください');
        setToken(null);
      }
    };

    fetchToken();
  }, []); // 一度だけ実行される

  const navigate = useNavigate();

  const updateCompleted = (todo: Todo) => {
    fetch(`${API_URL}/todo`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(todo),
    });

  };

  const handleDispComment = () => {
    setIsComment(!isComment);
  };

  const handleIsCompleted = () => {
    if (firebaseUserId && firebaseUserId == todo.user_id) {
      todo.completed = !isCompleted;
      updateCompleted(todo);
      setIsCompleted(todo.completed);
    }
  };

  const navigateTodoInfo = (todoId: number) => {
    navigate(`/todo/${todoId}`);
  };

  return (
    <div>
      {editMode && editedTodo != null && editedTodo.id == todo.id ? (
        <TodoForm
          key={todo.id}
          defaultValues={todo}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      ) : (
        <Card className="flex flex-col justify-center p-1 m-1 shadow-2xl space-y-1">
          <div className="flex flex-col space-y-1">
            <CompletedCheck todo={todo} handleIsCompleted={handleIsCompleted} />
            <div
              className="flex flex-col space-y-2"
              onClick={() => {
                navigateTodoInfo(todo.id);
              }}
            >
              <p className="text-sm font-bold ">{todo.title}</p>
              <div className={`flex space - x - 2 rounded - lg p - 1 ${deadlineColorClass}`}>
                <Timer size={20} color="#120fd2" weight="thin" />
                <p className='text-sm'>{formatDateForInput(todo.deadline)}</p>
              </div>
            </div>

            <TodoItemTemplate
              myTodoFlg={myTodoFlg}
              todo={todo}
              handleIsCompleted={handleIsCompleted}
              handleDispComment={handleDispComment}
              onDelete={onDelete}
              onCopy={onCopy}
              onEdit={onEdit}
            />

            {isComment ? (
              <CommentForm onCancel={handleDispComment} todoId={todo.id} />
            ) : (
              <div></div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TodoItem;
