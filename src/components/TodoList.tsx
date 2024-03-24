import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Card, IconButton } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../libs/firebase';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

type Todo = {
  user_id: string;
  context: string;
  updated_at: string;
};

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    const todosInfo = collection(db, 'todo');

    getDocs(todosInfo).then((snapShot) => {
      const info: Todo[] = snapShot.docs.map((doc) => ({
        ...(doc.data() as Todo),
      }));
      setTodos(info);
    });
  }, []);

  const copyTodo = (todo: Todo) => {
    console.log('copyボタンが押されました');

    console.log(todo);
  };

  const deleteTodo = (todo: Todo) => {
    console.log('deleteボタンが押されました');

    console.log(todo);
  };

  return (
    <div className="flex justify-center space-x-3">
      <div className="bg-blue-400 border border-black rounded-xl w-5/12 shadow-2xl">
        <p className="text-xl text-center">あなたのTodo</p>

        {todos.length > 0 ? (
          todos.map((todo) => (
            <Card className="flex flex-col justify-center p-3 m-2 shadow-2xl space-y-3">
              <p className="">{todo.context}</p>
              <div className="flex justify-start space-x-3">
                <IconButton onClick={() => copyTodo(todo)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => deleteTodo(todo)}>
                  <DeleteForeverIcon fontSize="small" />
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
      <div className="bg-green-50 border border-black rounded-xl w-5/12 shadow-2xl">
        <p className="text-xl text-center ">みんなのTodo</p>
        {todos.length > 0 ? (
          todos.map((todo) => (
            <Card className="flex flex-col justify-center p-3 m-2 shadow-2xl space-y-3">
              <p className="">{todo.context}</p>
              <div className="flex justify-start space-x-3">
                <IconButton onClick={() => copyTodo(todo)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => deleteTodo(todo)}>
                  <DeleteForeverIcon fontSize="small" />
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
