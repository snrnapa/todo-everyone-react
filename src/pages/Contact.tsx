import { useForm, SubmitHandler } from 'react-hook-form';
import { NotePencil, PaperPlane } from 'phosphor-react';
import { IconButton } from '@mui/material';
import useCurrentUser from '../components/hooks/UseCurrentUser';

type ContactInput = {
  context: string;
};

const Contact = () => {
  const { register, handleSubmit } = useForm<ContactInput>();
  const currentUser = useCurrentUser();

  const onSubmit: SubmitHandler<ContactInput> = async (data) => {
    console.log(data);
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
