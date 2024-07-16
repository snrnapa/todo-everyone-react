import { SubmitHandler, useForm } from 'react-hook-form';
import { IconButton, TextField } from '@mui/material';
import { formatTodayForInput } from '../../model/Utils';
import { PostInput } from '../../model/TodoTypes';
import React from 'react';
import { CloudCheck } from 'phosphor-react';


interface TodoInputFormProps {
  postTodo: any
  fetchSummaries: any
}

const TodoInputForm: React.FC<TodoInputFormProps> = ({ postTodo, fetchSummaries }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostInput>();
  const today = formatTodayForInput;


  const onSubmit: SubmitHandler<PostInput> = async (data) => {
    await postTodo(data)
    await fetchSummaries()
  }

  const TextFieldStyle = "bg-white rounded-sm "

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-x-4 items-center"
    >
      <div className="w-96 flex flex-col space-y-2 m-2 p-3 bg-personaBlue  border-white rounded-xl shadow-2xl sm:w-5/12">
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
          className={`${TextFieldStyle}`}
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
          className={`${TextFieldStyle}`}
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
          className={`${TextFieldStyle}`}
          InputProps={{ className: 'focus:ring-blue-500' }}
        />
        {errors.deadline?.message && (
          <p className="text-red-800 text-sm">{errors.deadline?.message}</p>
        )}
        <IconButton className='' type='submit'>
          <CloudCheck size={40} color="#ffffff" />
        </IconButton>
      </div>
    </form>
  );
};

export default TodoInputForm;
