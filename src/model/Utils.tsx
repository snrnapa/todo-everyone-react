import { Timestamp } from 'firebase/firestore';

// firebaseのタイムスタンプを文字列の日付に変換する関数
export const convertTimestampToString = (timestamp: Timestamp): string => {
  const date = new Date(timestamp.seconds * 1000); // タイムスタンプをミリ秒に変換してDateオブジェクトに渡す
  return date.toLocaleString(); // ローカルの日付文字列に変換して返す
};
