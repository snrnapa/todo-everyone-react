import { Button, TextField } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';

import { auth } from '../libs/firebase';
import { showErrorAlert, showSuccessAlert } from '../model/Utils';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';

// Register（初期登録）画面で使用するinputの型を宣言
type RegisterInputs = {
  email: string;
  password: string;
  retypePassword: string;
  submit: any;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<RegisterInputs>();

  // submitが押下されたタイミングで行う動作
  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    if (data.password != data.retypePassword) {
      await showErrorAlert(
        '入力したパスワードが異なります',
        '再度確認して再入力してください',
      );
      return;
    }

    try {
      // メール認証により、firebase authenticationに登録するとともに、その情報をuserCredential変数に保持
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      var idToken;
      var userId;
      if (userCredential.user != null) {
        idToken = await userCredential.user.getIdToken();
        userId = userCredential.user.uid;
        localStorage.setItem('firebaseToken', idToken);
        localStorage.setItem('firebaseUserId', userId);
      } else {
        throw new Error('ユーザー情報が取得できませんでした');
      }
      const response = await fetch('http://localhost:8080/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        await deleteUser(auth.currentUser);
        throw new Error('サーバーエラーが発生しました');
      }
    } catch (error) {
      showErrorAlert('登録失敗', `登録に失敗しました : ${error}`);
    }
  };

  return (
    <div className="p-3 space-y-5">
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
          <Button type="submit" variant="contained" disableElevation>
            登録
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
