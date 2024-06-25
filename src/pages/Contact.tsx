import { useForm, SubmitHandler } from 'react-hook-form';
import { NotePencil, PaperPlane } from 'phosphor-react';
import { IconButton } from '@mui/material';
import { showErrorAlert, showSuccessAlert } from '../model/Utils';
import ContactCategoryButton from '../components/button/ContactCategoryButton';
import { useState } from 'react';

type ContactInput = {
  context: string;
};

const Contact = () => {
  const { register, handleSubmit } = useForm<ContactInput>();
  const firebaseUserId = localStorage.getItem('firebaseUserId')
  const firebaseToken = localStorage.getItem('firebaseToken')

  const [selectedCategory, setSelectedCategory] = useState<string>('feature-request')
  const [context, setContext] = useState<string>('')
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category)
  }

  const handleContextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContext(event.target.value)
  }

  const onSubmit: SubmitHandler<ContactInput> = async (data) => {
    if (firebaseUserId && firebaseToken) {
      const contactData = {
        user_id: firebaseUserId,
        text: data.context,
        category: selectedCategory
      };
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${firebaseToken}`,
          },
          body: JSON.stringify(contactData),
        });
        showSuccessAlert('送信成功', '問い合わせ内容の送信に成功しました')
      } catch (error) {
        showErrorAlert(
          'サーバー処理中に問題が発生しました',
          `${error}`,
        );
      }
    }
  };
  return (
    <div className="flex flex-col justify-center space-y-5 p-2">
      <p className="text-2xl">Contact</p>
      <ContactCategoryButton selectedCategory={selectedCategory} onSelected={handleCategoryClick} />
      <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="flex space-x-5 items-center">
            <NotePencil size={32} color="#120fd2" weight="thin" />
            <p>お問い合わせ内容 </p>
          </div>

          <textarea
            {...register('context', {
              required: '内容を入力してください',
              maxLength: {
                value: 200,
                message: '200文字以内で簡潔に書きましょう',
              },
            })}
            className="border border-blue-200 w-full h-80 rounded-md py-2 px-3 mt-1 focus:outline-none focus:ring focus:border-blue-300 placeholder-blue-400"
            value={context}
            onChange={handleContextChange}
          ></textarea>
          <div className='flex justify-end space-x-1'>
            <p className='text-right text-sm text-personaBlue font-bold'>
              {context.length}
            </p>
            <p className='text-right text-sm text-gray-600'>
              / 200文字
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <IconButton type="submit" onClick={() => { }}>
            <PaperPlane size={52} color="#120fd2" weight="thin" />
          </IconButton>
          <p className='text-lg'>送信</p>
        </div>
      </form>
    </div>
  );
};

export default Contact;
