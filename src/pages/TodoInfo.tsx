import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { showErrorAlert } from '../model/Utils';
import { Card } from '@mui/material';

const TodoInfo = () => {
  const params = useParams();
  const id = params.id;
  const token = localStorage.getItem('firebaseToken');
  const [todoInfo, setTodoInfo] = useState();

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
        const responseData = await response.json();
        console.log(responseData[0]);
        setTodoInfo(responseData[0]);
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
        </div>
      </Card>
    </div>
  );
};

export default TodoInfo;
