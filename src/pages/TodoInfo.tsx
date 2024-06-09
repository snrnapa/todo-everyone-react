import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { showErrorAlert } from '../model/Utils';
import { Card } from '@mui/material';

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
  favorite_count: number;
  booked_count: number;
  cheered_count: number;
  comment_count: number;
  is_favorite_me: boolean;
  is_booked_me: boolean;
  is_cheered_me: boolean;
  comments: Comment[];
}

const TodoInfo = () => {
  const params = useParams();
  const id = params.id;
  const token = localStorage.getItem('firebaseToken');
  const [todoInfo, setTodoInfo] = useState<TodoInfo>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTodoInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/v1/todo/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error(`HTTP Error! status : ${response.status} `);
        }
        const responseData: TodoInfo = await response.json();
        console.log(responseData);
        setTodoInfo(responseData);
        setIsLoading(false);
      } catch (error) {
        showErrorAlert('todoの詳細取得に失敗しました', `${error}`);
      }
    };
    getTodoInfo();
  }, []);

  if (!todoInfo) {
    return <p>データが見つかりません</p>;
  }

  return (
    <div>
      <Card className="flex flex-col justify-center p-1 m-1 shadow-2xl space-y-1">
        <div>
          <p className="text-sm">{todoInfo.title}</p>
          <p className="text-gray-400 text-sm">{todoInfo.detail}</p>
          <p className="text-gray-400 text-sm">{todoInfo.deadline}</p>
          <p className="text-gray-400 text-sm">{todoInfo.booked_count}</p>
          <p className="text-gray-400 text-sm">{todoInfo.cheered_count}</p>
          <p className="text-gray-400 text-sm">{todoInfo.comment_count}</p>
          <p className="text-gray-400 text-sm">{todoInfo.favorite_count}</p>
          <p className="text-gray-400 text-sm">{todoInfo.favorite_count}</p>
          <div className="space-y-3 ">
            {(todoInfo.comments ?? []).map((comment) => (
              <Card className="p-2">
                <p className="text-sm">{comment.user_id}</p>
                <p className="text-sm">{comment.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TodoInfo;
