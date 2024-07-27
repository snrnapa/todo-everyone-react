import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import { auth } from '../libs/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import { toast } from 'react-toastify';

// Login画面で使用するinputの型を宣言
type LoginInputs = {
  email: string;
  password: string;
  submit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const SignIn = () => {
  // React-form-hookの初期化
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  // submitが押下されたタイミングで行う動作
  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const loginUser = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const user = loginUser.user;
      if (!user.emailVerified) {

        throw new Error('メール認証が完了していません');
      }
      const token = await user.getIdToken();
      const userId = user.uid;
      localStorage.setItem('firebaseToken', token);
      localStorage.setItem('firebaseUserId', userId);
      toast.success('ログインに成功しました');
    } catch (error) {
      await auth.signOut();
      localStorage.removeItem('firebaseToken');
      localStorage.removeItem('firebaseUserId');
      toast.error(`${error.message}`);
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      // window.location.reload();
    }
  };

  return (
    <div className="p-3 space-y-5">
      <p className="text-3xl zenKurenaido">ログイン</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-5">
          <TextField
            type="text"
            {...register('email', { required: 'メールアドレスは必須です' })}
          />
          {errors.email?.message && (
            <p className="text-red-800">{errors.email?.message}</p>
          )}
          <TextField
            type="password"
            {...register('password', {
              required: 'パスワードは必須です',
              minLength: {
                value: 4,
                message: '４文字以上必要です。',
              },
            })}
          />
          {errors.password && (
            <p className="text-red-800">{errors.password?.message}</p>
          )}

          <Button type="submit" variant="contained" disableElevation>
            ログイン
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
