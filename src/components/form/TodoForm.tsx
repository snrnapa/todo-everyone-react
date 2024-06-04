import { IconButton, TextField } from '@mui/material';
import { Check, XCircle } from 'phosphor-react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Todo } from '../../model/TodoTypes';

interface TodoFormProps {
  defaultValues: Todo;
  onSubmit: SubmitHandler<Todo>;
  onCancel: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
}) => {
  const formattedDefaultValues = {
    ...defaultValues,
    deadline: defaultValues.deadline.split('T')[0],
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Todo>({ defaultValues: formattedDefaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col p-1 space-y-1 bg-gray-200">
        <p className="text-sm">Title</p>
        <textarea
          className="border text-xs rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 border-black"
          {...register('title', {
            required: '内容を入力してください',
            maxLength: {
              value: 30,
              message: '３０文字以内で簡潔に書きましょう',
            },
          })}
        />
        {errors.title?.message && (
          <p className="text-red-800 text-sm">{errors.title?.message}</p>
        )}
        <p className="text-sm">詳細</p>
        <textarea
          className="border text-xs rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 border-black"
          {...register('detail', {
            required: '内容を入力してください',
            maxLength: {
              value: 200,
              message: '200文字以内で簡潔に書きましょう',
            },
          })}
        />
        {errors.detail?.message && (
          <p className="text-red-800 text-sm">{errors.detail?.message}</p>
        )}
        <TextField
          type="date"
          {...register('deadline', {})}
          id="filled-basic"
          variant="filled"
          className="bg-white"
        />
        {errors.deadline?.message && (
          <p className="text-red-800 text-sm">{errors.deadline?.message}</p>
        )}
      </div>
      <div className="flex justify-center space-x-3">
        <IconButton onClick={onCancel}>
          <XCircle size={28} color="#120fd2" weight="thin" />
        </IconButton>
        <IconButton type="submit">
          <Check size={28} color="#120fd2" weight="thin" />
        </IconButton>
      </div>
    </form>
  );
};

export default TodoForm;
