import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Button, IconButton, TextField } from '@mui/material';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import useCurrentUser from './hooks/UseCurrentUser';
import { db } from '../libs/firebase';
import TodoList from './TodoList';
import Swal from 'sweetalert2';

type PostInput = {
  context: string;
  detail: string;
  place: string;
  placeUrl: string;
  timeLimit: Date;
};

const Todo = () => {
  const [postFlg, setPostFlg] = useState<Boolean>(false);
  const [reloadCount, setReloadCount] = useState<Number>(0);
  const currentUser = useCurrentUser();
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<PostInput>();

  const onSubmit: SubmitHandler<PostInput> = async (data) => {
    console.log('post内容を登録しようとしています。');
    console.log(data);

    try {
      await addDoc(collection(db, 'todo'), {
        user_id: currentUser?.uid,
        context: data.context,
        detail: data.detail,
        place: data.place,
        placeUrl: data.placeUrl,
        timeLimit: data.timeLimit,
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      Swal.fire({
        title: 'Todoの登録の際にエラーが発生しました。管理者にお知らせください',
        text: '${error}',
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 7000,
      });
    }
    Swal.fire({
      title: 'Todo登録完了',
      text: '',
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 7000,
    });
    setReloadCount(reloadCount + 1);
  };

  const dispPost = () => {
    setPostFlg(!postFlg);
  };

  return (
    <>
      <div className="p-1 space-y-2">
        {!postFlg ? (
          <IconButton onClick={dispPost}>
            <ExpandMoreIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton onClick={dispPost}>
            <ExpandLessIcon fontSize="large" />
          </IconButton>
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
                  {...register('context', {
                    required: '内容を入力してください',
                    maxLength: {
                      value: 30,
                      message: '３０文字以内で簡潔に書きましょう',
                    },
                  })}
                  id="filled-basic"
                  label="Todo"
                  variant="filled"
                  className="bg-white"
                ></TextField>
                {errors.context?.message && (
                  <p className="text-red-800 text-sm">
                    {errors.context?.message}
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
                    {errors.context?.message}
                  </p>
                )}
                {/* 場所 */}
                <TextField
                  type="text"
                  {...register('place', {
                    maxLength: {
                      value: 100,
                      message: '100文字以内で入力してください。',
                    },
                  })}
                  id="filled-basic"
                  label="place"
                  variant="filled"
                  className="bg-white"
                  multiline
                ></TextField>
                {errors.place?.message && (
                  <p className="text-red-800 text-sm">
                    {errors.place?.message}
                  </p>
                )}

                {/* 場所URL */}
                <TextField
                  type="text"
                  {...register('placeUrl', {})}
                  id="filled-basic"
                  label="placeUrl"
                  variant="filled"
                  className="bg-white"
                  multiline
                ></TextField>

                {/* 締切日 */}
                <TextField
                  type="date"
                  {...register('timeLimit', {})}
                  id="filled-basic"
                  variant="filled"
                  className="bg-white"
                ></TextField>
                {errors.placeUrl?.message && (
                  <p className="text-red-800 text-sm">
                    {errors.timeLimit?.message}
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

      <TodoList user_id={currentUser?.uid || ''} reloadCount={reloadCount} />
    </>
  );
};

export default Todo;
