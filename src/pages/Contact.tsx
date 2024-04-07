import { useForm, SubmitHandler } from 'react-hook-form';
import { NotePencil, Envelope, PaperPlane } from 'phosphor-react';
import { IconButton } from '@mui/material';

type ContactInput = {
  from: string;
  context: string;
};

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>();
  return (
    <div className="flex flex-col justify-center space-y-5">
      <p className="text-2xl">Contact</p>
      <form className="space-y-10">
        <div>
          <div className="flex space-x-5">
            <p>あなたのアドレス</p>
            <Envelope size={32} color="#120fd2" weight="thin" />
          </div>
          <textarea
            {...register('from', {
              required: '内容を入力してください',
              maxLength: {
                value: 50,
                message: '100文字以内で簡潔に書きましょう',
              },
            })}
            className="border border-blue-200 w-full rounded-md py-2 px-3 mt-1 focus:outline-none focus:ring focus:border-blue-300 placeholder-blue-400"
          ></textarea>
        </div>
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
                message: '100文字以内で簡潔に書きましょう',
              },
            })}
            className="border border-blue-200 w-full h-96 rounded-md py-2 px-3 mt-1 focus:outline-none focus:ring focus:border-blue-300 placeholder-blue-400"
          ></textarea>
        </div>
        <div className="flex justify-center">
          <IconButton onClick={() => {}}>
            <PaperPlane size={52} color="#120fd2" weight="thin" />
          </IconButton>
        </div>
      </form>
    </div>
  );
};

export default Contact;
