import { useEffect } from 'react';
import { initTokenHeader } from '../model/Utils';
import { useParams } from 'react-router-dom';

const TodoInfo = () => {
  const params = useParams();
  console.log(params.id);
  const id = params.id;
  const header = initTokenHeader;

  useEffect(() => {
    fetch(`http://localhost:8080/v1/todo/${id}`, {
      headers: header,
      method: 'GET',
    });
  }, []);

  return <div>詳細ページ</div>;
};

export default TodoInfo;
