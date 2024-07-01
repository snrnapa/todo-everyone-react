import { useEffect, useState } from 'react';
import { Note, Timer, Confetti, Chat } from 'phosphor-react';
import { useParams } from 'react-router-dom';
import { formatDateForInput, showErrorAlert } from '../model/Utils';
import { Card, CircularProgress, Divider, IconButton } from '@mui/material';
import { refreshFirebaseToken } from '../model/token';
import { API_URL } from '../config';
import useUpdateAddition from '../components/hooks/useUpdateAddition';
import CommentForm from '../components/form/CommentForm';

// Commentの型定義
interface Comment {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  todo_id: number;
  user_id: string;
  text: string;
}

// TodoInfoの型定義
interface TodoInfo {
  id: number;
  user_id: string;
  title: string;
  detail: string;
  deadline: string; // 期限 (
  completed: boolean;
  booked_count: number;
  cheered_count: number;
  comment_count: number;
  is_booked_me: boolean;
  is_cheered_me: boolean;
  comments: Comment[];
}

const TodoInfo = () => {
  const params = useParams();
  const id = params.id;


  const [todoInfo, setTodoInfo] = useState<TodoInfo>();
  const [isCheered, setIsCheered] = useState<boolean>(false)
  const [cheeredCount, setCheeredCount] = useState(0)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dispComment, setDispComment] = useState<boolean>(false)
  const handleIsCheered = () => {
    if (todoInfo) {
      if (isCheered) {
        setCheeredCount(cheeredCount - 1)
      } else {
        setCheeredCount(cheeredCount + 1)

      }
      todoInfo.is_cheered_me = !isCheered;
      const userId = localStorage.getItem('firebaseUserId')
      const { updateAddition } = useUpdateAddition(todoInfo.id, userId, todoInfo.is_cheered_me, todoInfo.is_booked_me)
      updateAddition();
      setIsCheered(todoInfo.is_cheered_me);
    }
  };

  const handleDispComment = () => {
    setDispComment(!dispComment)
  }

  useEffect(() => {
    const getTodoInfo = async () => {
      const token = await refreshFirebaseToken();
      const userId = localStorage.getItem('firebaseUserId')
      try {
        const response = await fetch(`${API_URL}/todo/${id}?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error(`HTTP Error! status : ${response.status} `);
        }
        const responseData: TodoInfo = await response.json();
        setTodoInfo(responseData);
        console.log(`${API_URL}/todo/${id}`)
        setIsCheered(responseData.is_cheered_me);
        setCheeredCount(responseData.cheered_count);
        setIsLoading(false);
      } catch (error) {
        showErrorAlert('todoの詳細取得に失敗しました', `${error}`);
      }
    };
    getTodoInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
        <p>ロード中...</p>
      </div>
    )
  }

  if (!todoInfo) {
    return <p>データが見つかりません</p>;
  }

  return (
    <div>
      <div className="flex flex-col justify-center p-1 m-1 shadow-2xl space-y-1  rounded-lg">
        <p className="text-base font-bold">{todoInfo.title}</p>

        <div className="flex flex-col bg-sky-100 rounded-2xl p-2 text-sm">
          <Note size={20} />
          <p className="">{todoInfo.detail}</p>
        </div>

        <div className="flex space-x-2">
          <Timer size={25} />
          <p className=" ">
            {formatDateForInput(todoInfo.deadline)}
          </p>
        </div>

        <div className="flex space-x-4">
          <div className="flex items-center">
            <IconButton onClick={handleIsCheered}>
              <Confetti
                size={20}
                color={isCheered ? '#DC143C' : '#A9A9A9'}
                weight={isCheered ? 'fill' : 'thin'}
              />
            </IconButton>
            <p className="text-xs text-slate-700">{cheeredCount}</p>
          </div>

          {/* <div className="flex space-x-1">
            <Bookmark size={25} />
            <p className="text-gray-400 text-sm">{todoInfo.booked_count}</p>
          </div> */}

          <div className="flex items-center">
            <IconButton onClick={handleDispComment}>
              <Chat size={20} color="#120fd2" weight="thin" />
            </IconButton>
            <p className="text-xs text-slate-700">{todoInfo.comment_count}</p>
          </div>
        </div>
        {dispComment ? <CommentForm todoId={todoInfo.id} onCancel={() => {
          handleDispComment()
        }} /> : <div></div>}

      </div>

      <Divider />
      <div className="space-y-3 p-3 ">
        {(todoInfo.comments ?? []).map((comment) => (
          <Card className="p-2 space-y-2">
            {/* <p className="text-sm text-gray-500">{comment.user_id}</p> */}
            <p className="text-sm">{comment.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TodoInfo;
