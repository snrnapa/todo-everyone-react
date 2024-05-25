import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';

interface FormValue {
  title: string;
  detail: string;
  limit: string;
  completed: boolean;
}
interface TodoInputFormProps {
  onSubmit: SubmitHandler<FormValue>;
}

const TodoInputForm: React.FC<TodoInputFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-x-4">
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
          <p className="text-red-800 text-sm">{errors.title?.message}</p>
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
          <p className="text-red-800 text-sm">{errors.detail?.message}</p>
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
          <p className="text-red-800 text-sm">{errors.limit?.message}</p>
        )}
        <Button type="submit">追加</Button>
      </div>
    </form>
  );
};

export default TodoInputForm;
