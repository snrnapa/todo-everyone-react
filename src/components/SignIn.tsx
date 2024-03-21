import { Button, TextField } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../libs/firebase';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmitLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert('エラーが発生しました：' + error);
      return;
    }
    alert('loginが成功しました');
    window.location.reload();
  };

  return (
    <div className="p-3 space-y-5">
      <p className="text-3xl zenKurenaido">ログイン</p>
      <form onSubmit={handleSubmitLogin}>
        <div className="flex flex-col space-y-5">
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" disableElevation>
            ログイン
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
