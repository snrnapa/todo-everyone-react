import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { IconButton, TextField } from '@mui/material';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import useCurrentUser from './hooks/UseCurrentUser';
import { db } from '../libs/firebase';
import TodoList from './TodoList';

type PostInput = {
  context: string;
};

const Todo = () => {
  const [postFlg, setPostFlg] = useState<Boolean>(false);
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

    // console.log(currentUser?.uid);

    try {
      await addDoc(collection(db, 'todo'), {
        user_id: currentUser?.uid,
        context: data.context,
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      alert(
        'Todoの登録の際にエラーが発生しました。管理者にお知らせください' +
          error,
      );
    }
    alert('todo登録完了');
  };

  const dispPost = () => {
    setPostFlg(!postFlg);
  };

  return (
    <>
      <div className="p-3 space-y-2">
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
            <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-4">
              <TextField
                type="text"
                {...register('context', {
                  required: '内容を入力してください',
                  maxLength: {
                    value: 50,
                    message: '３０文字以内で簡潔に書きましょう',
                  },
                })}
                id="filled-basic"
                label="Todo"
                variant="filled"
                className="w-96"
              ></TextField>

              <IconButton type="submit">
                <AddIcon fontSize="large" />
              </IconButton>
            </form>
            {errors.context?.message && (
              <p className="text-red-800 text-lg">{errors.context?.message}</p>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <TodoList />
    </>
  );
};

export default Todo;
