import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import { showErrorAlert, showSuccessAlert } from '../model/Utils';

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
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      const token = responseData.token;

      if (token) {
        localStorage.setItem('token', token);
        await showSuccessAlert('ログインが完了しました。', '');
      }
    } catch (error: any) {
      await showErrorAlert(
        'エラーが発生しました。解決しない場合は、管理者に下記を伝えてください。',
        '${error.toString()}',
      );
      return;
    }
    window.location.reload();
  };

  // // watch
  // const email = watch('email');
  // const password = watch('password');

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
