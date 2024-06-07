import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CommentInput } from '../../model/TodoTypes';
import { Check, XCircle } from 'phosphor-react';
import { IconButton } from '@mui/material';

interface CommentInput {
  commentText: string;
}

type Comment = {
  user_id: string;
  todo_id: number;
  text: string;
};

interface CommentFormProps {
  // onSubmit: SubmitHandler<CommentInput>;
  todoId: number;
  onCancel: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ todoId, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentInput>();

  const postComment = (data) => {
    const token = localStorage.getItem('firebaseToken');
    const userId = localStorage.getItem('firebaseUserId');
    if (userId == null) {
      return;
    }

    const targetComment: Comment = {
      user_id: userId,
      todo_id: todoId,
      text: data.commentText,
    };
    fetch('http://localhost:8080/v1/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(targetComment),
    });
  };

  return (
    <form onSubmit={handleSubmit(postComment)}>
      <div className="flex flex-col p-1 space-y-1 bg-gray-200">
        <textarea
          className="border text-xs rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 border-black"
          {...register('commentText', {
            required: '内容を入力してください',
            maxLength: {
              value: 30,
              message: '３０文字以内で簡潔に書きましょう',
            },
          })}
        />
        {errors.commentText?.message && (
          <p className="text-red-800 text-sm">{errors.commentText?.message}</p>
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

export default CommentForm;
