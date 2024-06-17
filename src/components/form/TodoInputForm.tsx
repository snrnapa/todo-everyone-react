import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import { formatTodayForInput } from '../../model/Utils';

interface FormValue {
  title: string;
  detail: string;
  deadline: string;
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

  const today = formatTodayForInput;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-x-4 items-center"
    >
      <div className="flex flex-col space-y-2 m-2 p-3 bg-gray-200 border border-gray-300 rounded-xl shadow-2xl sm:w-5/12">
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
          id="title"
          label="Todo"
          variant="filled"
          className="bg-cyan-100"
          InputProps={{ className: 'focus:ring-blue-500' }}
        />
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
          id="detail"
          label="detail"
          variant="filled"
          className="bg-cyan-100"
          InputProps={{ className: 'focus:ring-blue-500' }}
          multiline
        />
        {errors.detail?.message && (
          <p className="text-red-800 text-sm">{errors.detail?.message}</p>
        )}

        {/* 締切日 */}
        <TextField
          type="date"
          {...register('deadline', {})}
          id="deadline"
          variant="filled"
          defaultValue={today}
          className="bg-cyan-100"
          InputProps={{ className: 'focus:ring-blue-500' }}
        />
        {errors.deadline?.message && (
          <p className="text-red-800 text-sm">{errors.deadline?.message}</p>
        )}
        <Button type="submit">追加</Button>
      </div>
    </form>
  );
};

export default TodoInputForm;
