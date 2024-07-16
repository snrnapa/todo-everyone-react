import React, { useState } from 'react';

import { SubmitHandler } from 'react-hook-form';
import { showErrorAlert } from '../../model/Utils';

import TodoItem from './TodoItem';
import { Todo } from '../../model/TodoTypes';
import FilterButtons from '../button/FilterButtons';

interface TodoListProps {
  todos: Todo[]
  deleteTodo: any
  updateTodo: any
  copyTodo: any
  fetchSummaries: any
  headers: any
}


const TodoList: React.FC<TodoListProps> = ({ todos: todos, deleteTodo: deleteTodo, updateTodo: updateTodo, copyTodo: copyTodo, fetchSummaries: fetchSummaries, headers: headers
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
    await deleteTodo(todo)
    await fetchSummaries()
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
      showErrorAlert('エラー', 'ユーザーIDが取得できず、失敗しました');
      return;
    }
    const newTodo = {
      user_id: user_id,
      title: todo.title,
      detail: todo.detail,
      deadline: todo.deadline,
    };
    await copyTodo(newTodo)
    await fetchSummaries(headers)
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
