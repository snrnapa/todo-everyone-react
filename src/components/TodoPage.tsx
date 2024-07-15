import { NotePencil, ArrowsInLineVertical } from 'phosphor-react';
import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import TodoInputForm from './form/TodoInputForm';
import TodoList from './template/TodoList';
import { WeeklyCalender } from './template/WeeklyCalender';
import { ButtonStyle } from './styles/ButtonStyles';
import { Todo } from '../model/TodoTypes';
import { refreshFirebaseToken } from '../model/token';
import useTodos from './hooks/useTodos';
import useSummaries from './hooks/useSummary';

const TodoPage = () => {

  const [postFlg, setPostFlg] = useState<boolean>(false);
  const userId = localStorage.getItem('firebaseUserId');

  const [headers, setHeaders] = useState<{ Authorization: string }>({ Authorization: '' });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await refreshFirebaseToken();
        setHeaders({
          Authorization: `Bearer ${token}`,
        });
        setInitialized(true);
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    }
    fetchToken()
  }, [])

  const { todos, fetchTodos, postTodo, deleteTodo, updateTodo, copyTodo } = useTodos([], headers)
  const { summaries, setSummaries, fetchSummaries } = useSummaries([], headers)
  useEffect(() => {
    if (initialized) {
      fetchTodos()
    }
  }, [initialized, fetchTodos]);

  if (userId == null) {
    return <div>Loading Now......</div>;
  }

  return (
    <>
      <div className="p-1 space-y-2 w-full justify-center">
        <WeeklyCalender summaries={summaries} setSummaries={setSummaries} fetchSummaries={fetchSummaries} />
        {!postFlg ? (
          <div className="flex items-center justify-start">
            <IconButton
              onClick={() => {
                setPostFlg(!postFlg);
              }}
              className={`${ButtonStyle.base} ${ButtonStyle.primary}`}
            >
              <NotePencil size={32} color="#120fd2" weight="thin" />
              <p className={`${ButtonStyle.text}`}>やることを書く</p>
          </div>
        ) : (
          <div
            onClick={() => {
              setPostFlg(!postFlg);
            }}
            className={`${ButtonStyle.base} ${ButtonStyle.primary}`}
          >
            <ArrowsInLineVertical size={32} color="#120fd2" weight="thin" />
            <p className={`${ButtonStyle.text}`}>とじる</p>
          </div>
        )}

        {postFlg ? (
          <div className="space-y-2 ">
            <TodoInputForm postTodo={postTodo} fetchSummaries={fetchSummaries()} />
          </div>
        ) : (
          <div></div>
        )}
        <TodoList todos={todos} deleteTodo={deleteTodo} updateTodo={updateTodo} copyTodo={copyTodo} fetchSummaries={fetchSummaries} headers={headers} />
      </div>

      {postFlg ? (
        <div className="space-y-2 ">
          <TodoInputForm postTodo={postTodo} />
        </div>
      ) : (
        <div></div>
      )}
      <TodoList todos={todos} deleteTodo={deleteTodo} updateTodo={updateTodo} copyTodo={copyTodo} />
    </div >
    </>
  );
};

export default TodoPage;
