import { NotePencil, ArrowsInLineVertical } from 'phosphor-react';
import { Button, IconButton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

type PostInput = {
  title: string;
  detail: string;
  completed: boolean;
  limit: string;
  // place: string;
  // placeUrl: string;
};

type UserInfo = {
  ID: number;
  email: string;
  CreatedAt: string;
};

const currentToken = localStorage.getItem('token');
const headers = {
  'Content-Type': 'application/json',
  ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
};

const Todo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [postFlg, setPostFlg] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    // watch,
    formState: { errors },
  } = useForm<PostInput>();

  useEffect(() => {
    fetch('http://localhost:8080/current-user', {
      method: 'POST',
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((data: UserInfo) => {
        setUserInfo(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // submitが押下されると、todoを登録する
  const onSubmit: SubmitHandler<PostInput> = async (data) => {
    if (userInfo) {
      const todoData = {
        user_id: userInfo.ID.toString(),
        title: data.title,
        detail: data.detail,
        completed: data.completed,
        limit: new Date(data.limit).toISOString(),
      };

      fetch('http://localhost:8080/v1/todo', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(todoData),
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.error) {
            setErrorMessage(responseData.error);
          } else {
            Swal.fire({
              title: '登録完了',
              text: 'Todoを登録しました',
              icon: 'success',
              confirmButtonText: 'OK',
              timer: 7000,
            });
            reset();
            setErrorMessage(null);
          }
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage('サーバーに問題が発生しました');
        });
    }
  };

  if (loading) {
    return <div>Loading Now......</div>;
  }

  return (
    <>
      <div className="p-1 space-y-2">
        <div className="max-w-sm w-full bg-white shadow-md rounded-lg p-6 ">
          <p>{userInfo!.email}</p>
          <p>{userInfo!.ID}</p>
        </div>

        {!postFlg ? (
          <div className="flex items-center justify-center">
            <IconButton
              onClick={() => {
                setPostFlg(!postFlg);
              }}
            >
              <NotePencil size={52} color="#120fd2" weight="thin" />
            </IconButton>
            <p>やることを書く</p>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <IconButton
              onClick={() => {
                setPostFlg(!postFlg);
              }}
            >
              <ArrowsInLineVertical size={52} color="#120fd2" weight="thin" />
            </IconButton>
            <p>とじる</p>
          </div>
        )}

        {postFlg ? (
          <div className="space-y-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-x-4"
            >
              <div className="flex flex-col space-y-2 m-2 p-3 bg-blue-200 border border-black rounded-xl shadow-2xl">
                {/* 題名 */}
                <TextField
                  type="text"
                  {...register('title', {
                    required: 'タイトルを入力してください',
                    maxLength: {
                      value: 30,
                      message: '100文字以内',
                    },
                  })}
                  id="filled-basic"
                  label="Todo"
                  variant="filled"
                  className="bg-white"
                ></TextField>
                {errors.title?.message && (
                  <p className="text-red-800 text-sm">
                    {errors.title?.message}
                  </p>
                )}
                {/* 詳細 */}
                <TextField
                  type="text"
                  {...register('detail', {
                    required: '内容を入力してください',
                    maxLength: {
                      value: 200,
                      message: '200文字以内で簡潔に書きましょう',
                    },
                  })}
                  id="filled-basic"
                  label="detail"
                  variant="filled"
                  className="bg-white"
                  multiline
                ></TextField>
                {errors.detail?.message && (
                  <p className="text-red-800 text-sm">
                    {errors.detail?.message}
                  </p>
                )}

                {/* 締切日 */}
                <TextField
                  type="date"
                  {...register('limit', {})}
                  id="filled-basic"
                  variant="filled"
                  className="bg-white"
                ></TextField>
                {errors.limit?.message && (
                  <p className="text-red-800 text-sm">
                    {errors.limit?.message}
                  </p>
                )}
                <Button type="submit">追加</Button>
              </div>
            </form>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
};

export default Todo;
