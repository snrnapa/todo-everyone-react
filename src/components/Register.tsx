import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../libs/firebase';
import { Timestamp, addDoc, collection } from 'firebase/firestore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [passWord, setPassWord] = useState('');
  const [retypePassWord, setRetypePassWord] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (passWord != retypePassWord) {
      alert('入力したパスワードが異なります。再度確認して再入力してください。');
      return;
    }
    console.log('これから登録を行います');

    // firebase autehnticationによりメール登録を行う
    var userCredential;
    try {
      // メール認証により、firebase authenticationに登録するとともに、その情報をuserCredential変数に保持
      userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        passWord,
      );
    } catch (error) {
      alert('正しく情報を入力してください');
      console.log(error);
      return;
    }

    const { user } = userCredential;
    const { uid } = user;
    const currentTimestamp = Timestamp.now();

    try {
      const docRef = await addDoc(collection(db, 'user'), {
        user_id: uid,
        user_name: 'ゆーざー',
        updated_at: currentTimestamp,
      });
    } catch (error) {
      alert(
        '登録においてエラーが発生しました。管理者にお知らせください。' + error,
      );
    }
    alert(
      'アカウントが正常に登録されました。登録したアドレスのメールボックスを確認してください。',
    );
    window.location.reload();
  };
  return (
    <div className="p-3 space-y-5">
      <p className="text-3xl zenKurenaido">初期登録</p>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <TextField
            id="filled-basic"
            label="メールアドレス"
            variant="filled"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="filled-basic"
            label="パスワード"
            variant="filled"
            onChange={(e) => setPassWord(e.target.value)}
          />
          <TextField
            id="filled-basic"
            label="パスワードの再入力"
            variant="filled"
            onChange={(e) => setRetypePassWord(e.target.value)}
          />
          <Button type="submit" variant="contained" disableElevation>
            登録
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
