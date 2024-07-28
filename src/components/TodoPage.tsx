import { ArrowsInLineVertical } from 'phosphor-react';
import { useEffect, useState } from 'react';
import TodoInputForm from './form/TodoInputForm';
import TodoList from './template/TodoList';
import { WeeklyCalender } from './template/WeeklyCalender';
import { ButtonStyle } from './styles/ButtonStyles';
import { refreshFirebaseToken } from '../model/token';
import useTodos from './hooks/useTodos';
import useSummaries from './hooks/useSummary';
import { toast } from 'react-toastify';

const TodoPage = () => {

  const [postFlg, setPostFlg] = useState<boolean>(false);
  const userId = localStorage.getItem('firebaseUserId');

  const [headers, setHeaders] = useState<{ Authorization: string }>({ Authorization: '' });
  const [initialized, setInitialized] = useState(false);


  const fetchToken = async () => {
    try {
      const token = await refreshFirebaseToken();
      setHeaders({
        Authorization: `Bearer ${token}`,
      });
      setInitialized(true);
    } catch (error) {
      toast.error(`Firebaseトークンの取得に失敗しました。再度ログインしてください${error}`);
    }
  }

  useEffect(() => {
    fetchToken();

    const interval = setInterval(fetchToken, 15 * 60 * 1000); // 15分ごとにトークンをリフレッシュ
    return () => clearInterval(interval); // クリーンアップ
  }, []);

  const { todos, fetchTodos, postTodo, deleteTodo, updateTodo, copyTodo } = useTodos([], headers)
  const { summaries, setSummaries, fetchSummaries } = useSummaries([], headers)
  useEffect(() => {
    if (initialized) {
      fetchTodos()
      fetchSummaries()
    }
  }, [initialized, fetchTodos, fetchSummaries]);

  if (userId == null) {
    return <div>Loading Now......</div>;
  }

  return (
    <>
      <div className="p-1 space-y-5 w-full flex flex-col items-center ">
        <WeeklyCalender summaries={summaries} setSummaries={setSummaries} fetchSummaries={fetchSummaries} headers={headers} />
        {!postFlg ? (
          <div
            onClick={() => {
              setPostFlg(!postFlg);
            }}
            className={`${ButtonStyle.base} ${ButtonStyle.primary} `}
          >
            <ArrowsInLineVertical size={32} color="#120fd2" weight="thin" />
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
            <TodoInputForm postTodo={postTodo} fetchSummaries={fetchSummaries} />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <TodoList todos={todos} deleteTodo={deleteTodo} updateTodo={updateTodo} copyTodo={copyTodo} fetchSummaries={fetchSummaries} headers={headers} />
    </>
  );
};

export default TodoPage;
