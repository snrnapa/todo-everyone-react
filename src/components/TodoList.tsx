import React, { useState } from 'react';

import { SubmitHandler } from 'react-hook-form';
import { showErrorAlert, showSuccessAlert } from '../model/Utils';
import { Todo } from '../model/TodoTypes';
import useGetTodos from './hooks/useGetTodos';
import TodoItem from './TodoItem';

interface TodoListProps {
  reloadCount: number;
  setReloadCount: React.Dispatch<React.SetStateAction<number>>;
}

const TodoList: React.FC<TodoListProps> = ({ reloadCount, setReloadCount }) => {
  const user_id = localStorage.getItem('firebaseUserId');
  const token = localStorage.getItem('firebaseToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const todos = useGetTodos(reloadCount, headers);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedTodo, setEditedTodo] = useState<Todo>();

  const handleEdit = (todo: Todo) => {
    setEditedTodo(todo);
    setEditMode(true);
  };

  const onCancel = () => {
    setEditedTodo(undefined);
    setEditMode(false);
  };

  const handleDelete = async (todo: Todo) => {
    fetch('http://localhost:8080/v1/todo', {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify(todo),
    }).then((response) => {
      if (!response.ok) {
        showErrorAlert(
          '削除中にエラーが発生',
          'todoの削除中にエラーが発生しました。',
        );
      } else {
        showSuccessAlert('削除完了', 'todoの削除が完了しました。');
        setReloadCount(reloadCount + 1);
      }
    });
  };

  const handleSubmit: SubmitHandler<Todo> = async (data) => {
    if (!editedTodo) return;

    const todoData: Todo = {
      ...editedTodo,
      title: data.title,
      detail: data.detail,
      limit: new Date(data.limit).toISOString(),
    };

    fetch('http://localhost:8080/v1/todo', {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(todoData),
    }).then((response) => {
      if (response.ok) {
        showSuccessAlert('更新完了', 'todoの更新が完了しました');
        setEditedTodo(undefined);
        setEditMode(false);
        setReloadCount(reloadCount + 1);
      } else {
        showErrorAlert('更新失敗', 'todoの更新中にエラーが発生しました');
      }
    });
  };

  const copyTodo = async (todo: Todo) => {
    if (user_id == null) {
      showErrorAlert('todoコピー失敗', 'todoのコピー中に失敗しました');
      return;
    }
    todo.user_id = user_id;
    fetch('http://localhost:8080/v1/todo', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(todo),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.error) {
          showErrorAlert('todoのコピーに失敗しました', '');
          return;
        } else {
          showSuccessAlert('登録完了', 'Todoを登録しました');
          setReloadCount((prev) => prev + 1);
        }
      });
  };

  return (
    <div className="flex justify-center space-x-2 p-1">
      <div className="bg-blue-400 border border-black rounded-xl w-6/12 shadow-2xl py-2 space-y-2">
        <p className="text-xl text-center font-Darumadrop">あなたのよてい</p>
        {todos.length > 0 ? (
          todos
            .filter((todo) => todo.user_id === user_id)
            .map((todo) => (
              <TodoItem
                key={todo.ID}
                todo={todo}
                onEdit={() => handleEdit(todo)}
                onSubmit={handleSubmit}
                onCancel={() => onCancel()}
                onDelete={() => handleDelete(todo)}
                editMode={editMode}
                editedTodo={editedTodo}
              />
            ))
        ) : (
          <div>
            <p>やることがありません🥺🥺</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
