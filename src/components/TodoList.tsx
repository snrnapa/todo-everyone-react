import SaveAltIcon from '@mui/icons-material/SaveAlt';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Card, IconButton, TextField } from '@mui/material';
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../libs/firebase';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { convertTimestampToString } from '../model/Utils';
import Swal from 'sweetalert2';

type Todo = {
  doc_id: string;
  user_id: string;
  context: string;
  place: string;
  placeUrl: string;
  detail: string;
  updated_at: Timestamp;
};

type ComponentsProps = {
  user_id: string;
  reloadCount: number;
};

const TodoList: React.FC<ComponentsProps> = ({ user_id, reloadCount }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editTodoId, setEditTodoId] = useState<string>(null);
  const [editedTodo, setEditedTodo] = useState<string>();
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosCollection = collection(db, 'todo');
        const todosSnapshot = await getDocs(todosCollection);
        const todosData = todosSnapshot.docs.map((doc) => ({
          doc_id: doc.id,
          user_id: doc.data().user_id,
          context: doc.data().context,
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

    fetchTodos();
  }, [reloadCount]);

  const copyTodo = async (todo: Todo) => {
    console.log('copyボタンが押されました');
    console.log('あなたのID' + user_id);

    const nowTime = Timestamp.now();

    try {
      await addDoc(collection(db, 'todo'), {
        user_id: user_id,
        context: todo.context,
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
      doc_id: null,
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

  const handleEdit = (todo: Todo) => {
    console.log('editボタンが押されました');

    setEditMode(true);
    setEditTodoId(todo.doc_id);
  };

  const saveTodo = (todo: Todo) => {
    console.log('saveボタンが押下されました');
    console.log(todo);
    setEditMode(false);
  };

  return (
    <div className="flex justify-center space-x-3">
      <div className="bg-blue-400 border border-black rounded-xl w-5/12 shadow-2xl">
        <p className="text-xl text-center">あなたのTodo</p>

        {todos.length > 0 ? (
          todos
            .filter((todo) => todo.user_id === user_id)
            .map((todo) => (
              <Card
                key={todo.doc_id}
                className="flex flex-col justify-center p-3 m-2 shadow-2xl space-y-3"
              >
                {editMode && todo.doc_id === editTodoId ? (
                  <TextField
                    value={editedTodo}
                    onChange={(e) => setEditedTodo(e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                ) : (
                  <p className="">{todo.context}</p>
                )}
                {editMode && todo.doc_id === editTodoId ? (
                  <div className="flex justify-center space-x-3">
                    <SaveAltIcon onClick={() => saveTodo(todo)}>
                      <DeleteForeverIcon fontSize="small" />
                    </SaveAltIcon>
                  </div>
                ) : (
                  <div className="flex justify-start space-x-3">
                    <IconButton onClick={() => deleteTodo(todo)}>
                      <DeleteForeverIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(todo)}>
                      <EditNoteIcon fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </Card>
            ))
        ) : (
          <div>
            <p>todoがありません</p>
          </div>
        )}
      </div>
      <div className="bg-green-50 border border-black rounded-xl w-5/12 shadow-2xl">
        <p className="text-xl text-center ">みんなのTodo</p>
        {todos.length > 0 ? (
          todos
            .filter((todo) => todo.user_id !== user_id)
            .map((todo) => (
              <Card
                key={todo.doc_id}
                className="flex flex-col justify-center p-3 m-2 shadow-2xl space-y-3"
              >
                <p className="">{todo.context}</p>
                <div className="flex justify-start space-x-3">
                  <IconButton onClick={() => copyTodo(todo)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
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
