import { Card } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../libs/firebase';

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
      const info = snapShot.docs.map((doc) => ({ ...doc.data() }));
      setTodos(info);
    });
  }, []);

  return (
    <div>
      <p className="text-2xl text-center">みんなのTodo</p>

      {todos.length > 0 ? (
        todos.map((todo) => (
          <Card className="flex justify-center p-3 m-2">
            <p className="text-xl">{todo.context}</p>
          </Card>
        ))
      ) : (
        <Card></Card>
      )}
    </div>
  );
};

export default TodoList;
