import { Timestamp } from 'firebase/firestore';
import Swal from 'sweetalert2';

// firebaseのタイムスタンプを文字列の日付に変換する関数
export const convertTimestampToString = (timestamp: Timestamp): string => {
  const date = new Date(timestamp.seconds * 1000); // タイムスタンプをミリ秒に変換してDateオブジェクトに渡す
  return date.toLocaleString(); // ローカルの日付文字列に変換して返す
};

export const showSuccessAlert = (title: string, text: string) => {
  Swal.fire({
    title: title || '成功',
    text: text || '操作が完了しました',
    icon: 'success',
    confirmButtonText: 'OK',
    timer: 7000,
  });
};

export const showErrorAlert = (title: string, text: string) => {
  Swal.fire({
    title: title || 'エラー',
    text: text || '操作に失敗しました',
    icon: 'error',
    confirmButtonText: 'OK',
    timer: 7000,
  });
};

export const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatTodayForInput = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDatetoYYYYMMDD = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}/${month}/${day}`;
  return formattedDate;
};


export const getColorForDeadline = (deadline: string) => {
  const today: Date = new Date()
  const deadlineDate: Date = new Date(deadline)

  const diffrenceInTime = deadlineDate.getTime() - today.getTime();
  const diffrenceInDays = diffrenceInTime / (1000 * 3600 * 24);

  if (diffrenceInDays < -1) {
    return "bg-red-200 font-bold"
  } else if (diffrenceInDays <= 0) {
    return "bg-yellow-200 font-bold"
  } else if (diffrenceInDays <= 1) {
    return ""
  }

}

export const getColorForToday = (index: number) => {
  if (index == 0) {
    return "bg-blue-200 font-bold"
  }

}