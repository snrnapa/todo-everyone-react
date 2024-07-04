import { CalendarBlank } from 'phosphor-react';
import React from 'react';

interface DispCalenderButtonProps {
  dispCalender: boolean;
  onDisp: (isDisp: boolean) => void;
}

// スタイルクラスの定義

const DispCalenderButton: React.FC<DispCalenderButtonProps> = ({ dispCalender, onDisp }) => {
  return (
    <div
      className='flex justify-center w-56 items-center space-x-2 bg-personaBlue text-white text-bold rounded-md px-4 py-2 transition duration-300 ease-in-out hover:bg-blue-700 hover:scale-105 focus:outline-none'
      onClick={() => { onDisp(!dispCalender); }}
    >
      <CalendarBlank size={24} />
      <p className='text-base text-blue text-bold'>
        {dispCalender ? 'カレンダーの非表示' : 'カレンダーの表示'}
      </p>
    </div>
  );
};

export default DispCalenderButton;