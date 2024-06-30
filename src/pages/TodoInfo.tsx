import { useEffect, useState } from 'react';
import { Note, Timer, Confetti, Chat } from 'phosphor-react';
import { useParams } from 'react-router-dom';
import { formatDateForInput, showErrorAlert } from '../model/Utils';
import { Card, CircularProgress, Divider } from '@mui/material';
import { refreshFirebaseToken } from '../model/token';
import { API_URL } from '../config';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTodoInfo = async () => {
      const token = await refreshFirebaseToken();
      // API_URL の確認
      console.log(`API_URL: "${API_URL}"`);
      // id の確認
      console.log(`ID: "${id}"`);
      try {
        const response = await fetch(`${API_URL}/todo/${id}`, {
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
          <div className="flex space-x-1">
            <Confetti size={25} />
            <p className="text-gray-400 text-sm">{todoInfo.cheered_count}</p>
          </div>

          {/* <div className="flex space-x-1">
            <Bookmark size={25} />
            <p className="text-gray-400 text-sm">{todoInfo.booked_count}</p>
          </div> */}

          <div className="flex space-x-1">
            <Chat size={25} />
            <p className="text-gray-400 text-sm">{todoInfo.comment_count}</p>
          </div>
        </div>
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
