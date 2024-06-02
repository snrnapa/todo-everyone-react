import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import { showErrorAlert, showSuccessAlert } from '../model/Utils';
import { auth } from '../libs/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

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

  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // submitが押下されたタイミングで行う動作
  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const loginUser = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const token = await loginUser.user.getIdToken;
      const userId = loginUser.user.uid;
      localStorage.setItem('firebaseToken', token);
      localStorage.setItem('firebaseUserId', userId);

      showSuccessAlert('ログイン成功', 'ログインに成功しました。');
    } catch (error) {
      showErrorAlert('ログイン失敗', `ログインに失敗しました。${error}`);
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
