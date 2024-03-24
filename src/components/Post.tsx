import AddIcon from '@mui/icons-material/Add';
import { IconButton, TextField } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import { useForm, SubmitHandler } from 'react-hook-form';

type PostInput = {
  context: string;
  updated_at: Timestamp;
};

const Post = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostInput>();

  const onSubmit: SubmitHandler<PostInput> = async (data) => {
    console.log('post内容を登録しようとしています。');
    const targetPost = console.log(data);
  };

  return (
    <div className="p-3 space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-4">
        <IconButton type="submit">
          <AddIcon fontSize="large" />
        </IconButton>
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
      </form>
    </div>
  );
};

export default Post;
