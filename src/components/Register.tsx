import { Button, TextField } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, db } from '../libs/firebase';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { showErrorAlert, showSuccessAlert } from '../model/Utils';

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

    // firebase autehnticationによりメール登録を行う
    var userCredential;
    try {
      // メール認証により、firebase authenticationに登録するとともに、その情報をuserCredential変数に保持
      userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      // ユーザー登録後に確認メールを手動で送信する
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
      } else {
        throw new Error('ユーザーがログインしていません');
      }
    } catch (error) {
      await showErrorAlert(
        '入力情報に誤りがあり、失敗しました。',
        '正しい情報を入力してください',
      );
      return;
    }

    const { user } = userCredential;
    const { uid } = user;
    const currentTimestamp = Timestamp.now();

    try {
      await addDoc(collection(db, 'user'), {
        user_id: uid,
        user_name: 'ゆーざー',
        updated_at: currentTimestamp,
      });
    } catch (error) {
      await showErrorAlert(
        '登録においてエラーが発生しました。',
        '管理者にお知らせください。  ${error}',
      );
    }
    showSuccessAlert(
      'accountが正常に登録されました。',
      '登録したアドレスのメールボックスを確認してください。',
    );
    window.location.reload();
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
