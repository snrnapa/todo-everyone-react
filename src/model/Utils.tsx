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
