import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { auth } from '../libs/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { API_URL } from '../config';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

type RegisterInputs = {
  email: string;
  password: string;
  retypePassword: string;
  agree: boolean;
  agreePublic: boolean;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterInputs>();

  const agree = watch('agree', false);
  const agreePublic = watch('agreePublic', false);

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    if (!agree || !agreePublic) {
      toast.error('規約に同意いただく必要があります');
      return;
    }

    if (data.password !== data.retypePassword) {
      toast.error('入力したパスワードが異なります');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const user = userCredential.user;
      try {
        await sendEmailVerification(user);
      } catch (verificationError) {
        toast.error('確認メールの送信に失敗しました.管理者にお問い合わせください。');
      }
      toast.success('確認メールが送信されました.メールより、認証を行ってください。');

      const idToken = await user.getIdToken();
      const userId = user.uid;

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error('サーバーエラーが発生しました');
      }
      reset();
    } catch (error) {
      toast.error(`登録に失敗しました;${error}`);
    }
  };

  return (
    <div className="p-3 space-y-5 bg-sky-50">
      <p className="text-3xl zenKurenaido">初期登録</p>
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-5"
        >
          <TextField
            type="text"
            {...register('email', { required: 'メールアドレスは必須です' })}
            id="filled-basic"
            label="メールアドレス"
            variant="filled"
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
            id="filled-basic"
            label="パスワード"
            variant="filled"
          />
          {errors.password?.message && (
            <p className="text-red-800">{errors.password?.message}</p>
          )}
          <TextField
            type="password"
            {...register('retypePassword', {
              required: '確認のためパスワードを再入力してください',
              minLength: {
                value: 4,
                message: '４文字以上必要です。',
              },
            })}
            id="filled-basic"
            label="パスワードの再入力"
            variant="filled"
          />
          {errors.retypePassword?.message && (
            <p className="text-red-800">{errors.retypePassword?.message}</p>
          )}
          <div className='flex flex-col space-y-2'>
            <FormControlLabel
              control={<Checkbox {...register('agree', { required: '同意が必要です' })} />}
              label={
                <Link to="/privacy" className="text-blue-500 text-sm">
                  利用規約に同意します。
                </Link>
              }
            />
            {errors.agree?.message && (
              <p className="text-red-800">{errors.agree?.message}</p>
            )}
            <FormControlLabel
              control={<Checkbox {...register('agreePublic', { required: '同意が必要です' })} />}
              label={
                <p className='text-sm'>
                  本アプリは匿名性のTodo公開形式のアプリで、Todoは他のユーザーによって閲覧される可能性があります。
                  アプリが公開されることに同意します。公開されることにより生じるトラブルについて、本アプリは一切の責任を負いません。
                </p>
              }
            />
            {errors.agreePublic?.message && (
              <p className="text-red-800">{errors.agreePublic?.message}</p>
            )}
          </div>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            disabled={!agree || !agreePublic}
          >
            登録
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;