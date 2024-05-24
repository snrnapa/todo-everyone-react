import { useForm, SubmitHandler } from 'react-hook-form';
import { NotePencil, PaperPlane } from 'phosphor-react';
import { IconButton } from '@mui/material';
import useCurrentUser from '../components/hooks/UseCurrentUser';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../libs/firebase';
import { showErrorAlert, showSuccessAlert } from '../model/Utils';

type ContactInput = {
  context: string;
};

const Contact = () => {
  const { register, handleSubmit } = useForm<ContactInput>();
  const currentUser = useCurrentUser();

  const onSubmit: SubmitHandler<ContactInput> = async (data) => {
    try {
      await addDoc(collection(db, 'contact'), {
        user_id: currentUser?.uid,
        user_email: currentUser?.email,
        context: data.context,
      });
      await showSuccessAlert(
        'ご連絡いただき、ありがとうございます！',
        '問い合わせ内容を送信しました。トップ画面に戻ります。',
      );
      window.location.href = 'http://localhost:5173/';
    } catch (error) {
      await showErrorAlert(
        '送信中にエラーが発生しました。',
        '再度実行してください。それでも解決しない場合は、管理者に問い合わせてください。${error}',
      );
    }
  };
  return (
    <div className="flex flex-col justify-center space-y-5">
      <p className="text-2xl">Contact</p>
      <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="flex space-x-5">
            <p>お問い合わせ内容</p>
            <NotePencil size={32} color="#120fd2" weight="thin" />
          </div>

          <textarea
            {...register('context', {
              required: '内容を入力してください',
              maxLength: {
                value: 200,
                message: '200文字以内で簡潔に書きましょう',
              },
            })}
            className="border border-blue-200 w-full h-96 rounded-md py-2 px-3 mt-1 focus:outline-none focus:ring focus:border-blue-300 placeholder-blue-400"
          ></textarea>
        </div>
        <div className="flex justify-center">
          <IconButton type="submit" onClick={() => {}}>
            <PaperPlane size={52} color="#120fd2" weight="thin" />
          </IconButton>
        </div>
      </form>
    </div>
  );
};

export default Contact;
