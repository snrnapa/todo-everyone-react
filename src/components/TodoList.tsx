import {Trash ,Pen ,XCircle,Check , Globe , MapTrifold  } from "phosphor-react";
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CancelIcon from '@mui/icons-material/Cancel';
import { Card, IconButton } from '@mui/material';
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../libs/firebase';

import Swal from 'sweetalert2';
import { SubmitHandler, useForm } from 'react-hook-form';

type Todo = {
  doc_id: string;
  user_id: string;
  context: string;
  place: string;
  placeUrl: string;
  detail: string;
  updated_at: Timestamp;
};

type PostInput = {
  context: string;
  detail: string;
  place: string;
  placeUrl: string;
  timeLimit: Date;
};

type ComponentsProps = {
  user_id: string;
  reloadCount: number;
};

const TodoList: React.FC<ComponentsProps> = ({ user_id, reloadCount }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedTodo, setEditedTodo] = useState<Todo>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostInput>();

  const fetchTodos = async () => {
    try {
      const todosCollection = collection(db, 'todo');
      const todosSnapshot = await getDocs(todosCollection);
      const todosData = todosSnapshot.docs.map((doc) => ({
        doc_id: doc.id,
        user_id: doc.data().user_id,
        context: doc.data().context,
        detail: doc.data().detail,
        place: doc.data().place,
        placeUrl: doc.data().placeUrl,
        updated_at: doc.data().updated_at,
      }));

      todosData.map((doc) => {
        console.log(doc.doc_id);
      }),
        setTodos(todosData);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [reloadCount]);

  const onSubmit: SubmitHandler<PostInput> = async (data) => {
    console.log('todoの編集内容を更新します');
    console.log(data);

    try {
      const todoRef = doc(db, 'todo', editedTodo!.doc_id);
      await updateDoc(todoRef, {
        context: data.context,
        detail: data.detail,
        place: data.place,
        placeUrl: data.placeUrl,
        // timeLimit: editedTodo!.timeLimit,
        updated_at: Timestamp.now(),
      });
      fetchTodos();
    } catch (error) {
      Swal.fire({
        title: 'Todoの更新の際にエラーが発生しました。管理者にお知らせください',
        text: '${error}',
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 7000,
      });
    }
    Swal.fire({
      title: 'Todo更新完了',
      text: '',
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 7000,
    });
    // Todoのリストを最新に更新する

    setEditMode(false);
  };

  const copyTodo = async (todo: Todo) => {
    console.log('copyボタンが押されました');
    console.log('あなたのID' + user_id);

    const nowTime = Timestamp.now();

    try {
      await addDoc(collection(db, 'todo'), {
        user_id: user_id,
        context: todo.context,
        place: todo.place,
        placeUrl: todo.placeUrl,
        detail: todo.detail,
        updated_at: nowTime,
      });
    } catch (error) {
      alert(
        'TodoのCopy時にエラーが起きました。下記を管理者に連絡してください。' +
          error,
      );
      return;
    }

    const newTodo: Todo = {
      doc_id: '',
      user_id: user_id,
      context: todo.context,
      place: todo.place,
      placeUrl: todo.placeUrl,
      detail: todo.detail,
      updated_at: nowTime,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const deleteTodo = async (todo: Todo) => {
    console.log('deleteボタンが押されました');
    console.log(todo.doc_id);
    await deleteDoc(doc(db, 'todo', todo.doc_id))
      .then(() => {
        console.log('Successfully deleted!!!' + todo);
        setTodos(todos.filter((elemment) => elemment.doc_id !== todo.doc_id));
      })
      .catch((error) => {
        Swal.fire({
          title: 'delete中にエラーが発生しました',
          text: error,
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 7000,
        });
      });
  };

  return (
    <div className="flex justify-center space-x-2 p-1">
      <div className="bg-blue-400 border border-black rounded-xl w-6/12 shadow-2xl py-2 space-y-2">
        <p className="text-xl text-center font-Darumadrop" >あなたのよてい</p>

        {todos.length > 0 ? (
          todos
            .filter((todo) => todo.user_id === user_id)
            .map((todo) => (
              <Card
                key={todo.doc_id}
                className="flex flex-col justify-center p-1 m-1 shadow-2xl space-y-1"
              >
                {editMode && todo.doc_id === editedTodo!.doc_id ? (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col p-1 space-y-1 bg-gray-200">
                      <p className="text-sm">題名</p>
                      <textarea
                        className="border text-xs rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 border-black"
                        {...register('context', {
                          required: '内容を入力してください',
                          maxLength: {
                            value: 30,
                            message: '３０文字以内で簡潔に書きましょう',
                          },
                        })}
                        defaultValue={editedTodo!.context}
                      />
                      {errors.context?.message && (
                        <p className="text-red-800 text-sm">
                          {errors.context?.message}
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
                          {errors.context?.message}
                        </p>
                      )}

                      <p className="text-sm">場所</p>
                      <textarea
                        className="border text-xs rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 border-black"
                        {...register('place', {
                          maxLength: {
                            value: 100,
                            message: '100文字以内で入力してください。',
                          },
                        })}
                        defaultValue={editedTodo!.place}
                      />
                      {errors.place?.message && (
                        <p className="text-red-800 text-sm">
                          {errors.place?.message}
                        </p>
                      )}

                      <p className="text-sm">サイトURL</p>
                      <textarea
                        className="border text-xs rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 border-black"
                        {...register('placeUrl', {})}
                        defaultValue={editedTodo!.placeUrl}
                      />
                    </div>

                    <div className="flex justify-center space-x-3">
                      <IconButton onClick={() => setEditMode(false)}>
                      <XCircle size={28} color="#120fd2" weight="thin" />
                      </IconButton>
                      <IconButton type="submit">
                      <Check size={28} color="#120fd2" weight="thin" />
                      </IconButton>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm">{todo.context}</p>
                    <p className="text-gray-400 text-sm">{todo.detail}</p>
                    <div className="flex">
                    <MapTrifold size={20} color="#120fd2" weight="thin" />
                      <p className="text-xs ">{todo.place}</p>
                    </div>
                    {todo.placeUrl ? (
                      <div className="flex">
                        <Globe size={20} color="#120fd2" weight="thin" />
                        <a
                          href={todo.placeUrl}
                          className="text-xs text-gray-400"
                          target="_blank"
                        >
                          サイトURL
                        </a>
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
      <div className="bg-orange-200 border border-black rounded-xl w-6/12 shadow-2xl py-2 space-y-2">
        <p className="text-xl text-center font-Darumadrop">みんなのよてい</p>
        {todos.length > 0 ? (
          todos
            .filter((todo) => todo.user_id !== user_id)
            .map((todo) => (
              <Card
                key={todo.doc_id}
                className="flex flex-col justify-center p-1 m-1 shadow-2xl space-y-3"
              >
                {/* 共通化コンポーネント */}
                <div className="flex flex-col space-y-1 ">
                  <p className="text-sm">{todo.context}</p>
                  <p className="text-gray-400 text-sm">{todo.detail}</p>
                  <div className="flex">
                  <MapTrifold size={20} color="#120fd2" weight="thin" />
                    <p className="text-xs ">{todo.place}</p>
                  </div>
                  {todo.placeUrl ? (
                    <div className="flex">
                      <Globe size={20} color="#120fd2" weight="thin" />
                      <a href={todo.placeUrl} className="text-xs text-gray-400"   target="_blank">
                        サイトURL
                      </a>
                    </div>
                  ) : (
                    <div className="flex"></div>
                  )}
                </div>

                <div className="flex justify-center space-x-3">
                  <button
                    className="px-2 py-1 bg-pink-200 text-sm text-green-700 font-extrabold rounded "
                    onClick={() => copyTodo(todo)}
                  >
                    私も！
                  </button>
                </div>
              </Card>
            ))
        ) : (
          <div>
            <p>todoがありません</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
