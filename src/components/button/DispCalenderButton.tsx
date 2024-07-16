import { CalendarBlank } from 'phosphor-react';
import React from 'react';
import { ButtonStyle } from '../styles/ButtonStyles';

interface DispCalenderButtonProps {
  dispCalender: boolean;
  onDisp: (isDisp: boolean) => void;
}

// スタイルクラスの定義

const DispCalenderButton: React.FC<DispCalenderButtonProps> = ({ dispCalender, onDisp }) => {
  return (
    <div
      className={`${ButtonStyle.base} ${ButtonStyle.primary}`}
      onClick={() => { onDisp(!dispCalender); }}
    >
      <CalendarBlank size={24} />
      <p className={`${ButtonStyle.text}`}>
        {dispCalender ? 'カレンダーの非表示' : 'カレンダーの表示'}
      </p>
    </div>
  );
};

export default DispCalenderButton;