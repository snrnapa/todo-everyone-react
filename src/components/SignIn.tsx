import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../libs/firebase';
import swal from 'sweetalert2';

// Login画面で使用するinputの型を宣言
type LoginInputs = {
  email: string;
  password: string;
  submit: any;
};

const SignIn = () => {
  // React-form-hookの初期化
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginInputs>();

  // submitが押下されたタイミングで行う動作
  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await swal.fire({
        title: 'ログインが完了しました',
        text: 'OKボタンを押してください',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 7000,
      });
    } catch (error: any) {
      await swal.fire({
        title:
          'エラーが発生しました。解決しない場合は、管理者に下記を伝えてください。',
        text: error.toString(),
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 7000,
      });

      return;
    }

    window.location.reload();
    console.log(data.email);
  };

  // watch
  const email = watch('email');
  const password = watch('password');

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
