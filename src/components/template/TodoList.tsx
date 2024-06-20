import React, { useState } from 'react';

import { SubmitHandler } from 'react-hook-form';
import { showErrorAlert, showSuccessAlert } from '../../model/Utils';

import useGetTodos from '../hooks/useGetTodos';
import TodoItem from './TodoItem';
import { Todo } from '../../model/TodoTypes';
import FilterButtons from '../button/FilterButtons';

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

  const [activeFilter, setActiveFilter] = useState<string>('all')
  let filterdTodos: Todo[] = [];
  if (activeFilter == 'all') {
    filterdTodos = todos;
  } else if (activeFilter == 'completed') {
    filterdTodos = todos.filter((todos) => todos.completed)
  } else if (activeFilter == 'incomplete') {
    filterdTodos = todos.filter((todos) => !todos.completed)
  }

  const handleEdit = (todo: Todo) => {
    setEditedTodo(todo);
    setEditMode(true);
  };

  const onCancel = () => {
    setEditedTodo(undefined);
    setEditMode(false);
  };

  const handleDelete = async (todo: Todo) => {
    fetch('https://napalog.com/every-todo/v1/todo', {
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
      deadline: new Date(data.deadline).toISOString(),
    };

    fetch('https://napalog.com/every-todo/v1/todo', {
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

  const onCopy = async (todo: Todo) => {
    if (user_id == null) {
      showErrorAlert('todoコピー失敗', 'todoのコピー中に失敗しました');
      return;
    }

    const newTodo = {
      user_id: user_id,
      title: todo.title,
      detail: todo.detail,
      deadline: todo.deadline,
    };
    fetch('https://napalog.com/every-todo/v1/todo', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.error) {
          showErrorAlert(
            'todoのコピー失敗',
            `todoのコピー中にエラーが発生しました${responseData.error}`,
          );
          return;
        } else {
          showSuccessAlert('登録完了', 'Todoを登録しました');
          setReloadCount((prev) => prev + 1);
        }
      });
  };

  return (

    <div className="flex justify-center space-x-2 p-1">

      <div className="bg-personaBlue border border-black rounded-xl w-6/12 shadow-2xl py-2 space-y-2">
        <p className="text-xl text-center font-Darumadrop">あなたのよてい</p>
        <FilterButtons activeFilter={activeFilter} onHandleFilterClick={setActiveFilter} />
        {filterdTodos && filterdTodos.length > 0 ? (
          filterdTodos
            .filter((todo) => todo.user_id === user_id)
            .map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onEdit={() => handleEdit(todo)}
                onSubmit={handleSubmit}
                onCancel={() => onCancel()}
                onDelete={() => handleDelete(todo)}
                onCopy={() => onCopy(todo)}
                editMode={editMode}
                editedTodo={editedTodo}
                myTodoFlg={true}
              />
            ))
        ) : (
          <div>
            <p>やることがありません🥺🥺</p>
          </div>
        )}
      </div>
      <div className="bg-orange-200 border border-black rounded-xl w-6/12 shadow-2xl py-2 space-y-2">
        <p className="text-xl text-center font-Darumadrop">みんなのよてい</p>
        {todos && todos.length > 0 ? (
          todos
            .filter((todo) => todo.user_id != user_id)
            .map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onEdit={() => handleEdit(todo)}
                onSubmit={handleSubmit}
                onCancel={() => onCancel()}
                onDelete={() => handleDelete(todo)}
                onCopy={() => onCopy(todo)}
                editMode={editMode}
                editedTodo={editedTodo}
                myTodoFlg={false}
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
