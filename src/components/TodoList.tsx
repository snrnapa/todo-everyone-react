import { Trash, Pen, XCircle, Check, Timer } from 'phosphor-react';
import { Card, IconButton, TextField } from '@mui/material';

import React, { useEffect, useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';
import {
  formatDateForInput,
  showErrorAlert,
  showSuccessAlert,
} from '../model/Utils';
import Todo from './Todo';

type Todo = {
  user_id: string;
  title: string;
  limit: string;
  detail: string;
  completed: boolean;
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
};

type PostInput = {
  title: string;
  detail: string;
  limit: Date;
};

interface TodoListProps {
  reloadCount: number;
  setReloadCount: React.Dispatch<React.SetStateAction<number>>;
}

const TodoList: React.FC<TodoListProps> = ({ reloadCount, setReloadCount }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedTodo, setEditedTodo] = useState<Todo>();
  const user_id = localStorage.getItem('firebaseUserId');
  const token = localStorage.getItem('firebaseToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<PostInput>();

  useEffect(() => {
    const getTodos = async () => {
      try {
        const response = await fetch('http://localhost:8080/v1/todos', {
          method: 'GET',
          headers: headers,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        setTodos(responseData);
      } catch (error) {
        showErrorAlert('errorが発生しました', `${error}`);
      }
    };
    getTodos();
  }, [reloadCount]);

  const onSubmit: SubmitHandler<PostInput> = async (data) => {
    const userId = editedTodo?.user_id;
    const completed = editedTodo?.completed;
    const ID = editedTodo?.ID;
    if (userId == null || completed == null || ID == null) {
      showErrorAlert('更新失敗', 'todoの更新中にエラーが発生しました');
      return;
    }
    const todoData: Todo = {
      user_id: userId,
      title: data.title,
      detail: data.detail,
      limit: new Date(data.limit).toISOString(),
      completed: completed,
      ID: ID,
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

  // todoの削除
  const deleteTodo = async (todo: Todo) => {
    fetch('http://localhost:8080/v1/todo', {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify(todo),
    }).then((response) => {
      if (!response.ok) {
        showErrorAlert(
          'エラーが発生しました',
          'todoの削除中にエラーが発生しました',
        );
      } else {
        showSuccessAlert('削除完了', 'todoの削除が完了しました');
        setReloadCount(reloadCount + 1);
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
              <Card
                key={todo.ID}
                className="flex flex-col justify-center p-1 m-1 shadow-2xl space-y-1"
              >
                {/* 編集状態の場合 */}
                {editMode && todo.ID === editedTodo!.ID ? (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col p-1 space-y-1 bg-gray-200">
                      <p className="text-sm">Title</p>
                      <textarea
                        className="border text-xs rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 border-black"
                        {...register('title', {
                          required: '内容を入力してください',
                          maxLength: {
                            value: 30,
                            message: '３０文字以内で簡潔に書きましょう',
                          },
                        })}
                        defaultValue={editedTodo!.title}
                      />
                      {errors.title?.message && (
                        <p className="text-red-800 text-sm">
                          {errors.title?.message}
                        </p>
                      )}
                      <p className="text-sm">詳細</p>
                      <textarea
                        className="border text-xs rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 border-black"
                        {...register('detail', {
                          required: '内容を入力してください',
                          maxLength: {
                            value: 200,
                            message: '200文字以内で簡潔に書きましょう',
                          },
                        })}
                        defaultValue={editedTodo!.detail}
                      />
                      {errors.detail?.message && (
                        <p className="text-red-800 text-sm">
                          {errors.detail?.message}
                        </p>
                      )}

                      {/* 締切日 */}
                      <TextField
                        type="date"
                        {...register('limit', {})}
                        id="filled-basic"
                        variant="filled"
                        className="bg-white"
                        defaultValue={
                          editedTodo ? formatDateForInput(editedTodo.limit) : ''
                        }
                      ></TextField>
                      {errors.limit?.message && (
                        <p className="text-red-800 text-sm">
                          {errors.limit?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-center space-x-3">
                      <IconButton
                        onClick={() => {
                          setEditMode(false);
                          reset();
                        }}
                      >
                        <XCircle size={28} color="#120fd2" weight="thin" />
                      </IconButton>
                      <IconButton type="submit">
                        <Check size={28} color="#120fd2" weight="thin" />
                      </IconButton>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm">{todo.title}</p>
                    <p className="text-gray-400 text-sm">{todo.detail}</p>

                    {todo.limit ? (
                      <div className="flex">
                        <Timer size={20} color="#120fd2" weight="thin" />
                        <p className="text-sm">
                          {formatDateForInput(todo.limit)}
                        </p>
                      </div>
                    ) : (
                      <div className="flex"></div>
                    )}
                    <div className="flex justify-start space-x-3">
                      <IconButton onClick={() => deleteTodo(todo)}>
                        <Trash size={28} color="#120fd2" weight="thin" />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setEditMode(true);
                          setEditedTodo(todo);
                        }}
                      >
                        <Pen size={28} color="#120fd2" weight="thin" />
                      </IconButton>
                    </div>
                  </div>
                )}
              </Card>
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
