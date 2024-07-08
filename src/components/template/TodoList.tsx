import React, { useEffect, useState } from 'react';

import { SubmitHandler } from 'react-hook-form';
import { showErrorAlert, showSuccessAlert } from '../../model/Utils';

import TodoItem from './TodoItem';
import { Todo } from '../../model/TodoTypes';
import FilterButtons from '../button/FilterButtons';
import { API_URL } from '../../config';
import useTodos from '../hooks/useGetTodos';
import { refreshFirebaseToken } from '../../model/token';

interface TodoListProps {
  todos: Todo[]
  deleteTodo: any
  updateTodo: any
}


const TodoList: React.FC<TodoListProps> = ({ todos: todos, deleteTodo: deleteTodo, updateTodo: updateTodo
}) => {

  const user_id = localStorage.getItem('firebaseUserId')

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
    deleteTodo(todo)
  };

  const handleSubmit: SubmitHandler<Todo> = async (data) => {
    if (!editedTodo) return;

    const todoData: Todo = {
      ...editedTodo,
      title: data.title,
      detail: data.detail,
      deadline: new Date(data.deadline).toISOString(),
    };

    updateTodo(todoData, setEditedTodo, setEditMode)

  };

  const onCopy = async (todo: Todo) => {
    if (user_id == null) {
      showErrorAlert('todoコピー失敗', 'todoのコピー中に失敗しました');
      return;
    }

    const token = await refreshFirebaseToken()
    const headers = {
      Authorization: `Bearer ${token}`,
    }
    const newTodo = {
      user_id: user_id,
      title: todo.title,
      detail: todo.detail,
      deadline: todo.deadline,
    };
    fetch(`${API_URL}/todo`, {
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
