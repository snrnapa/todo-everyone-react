import SignIn from './components/SignIn';
import { useEffect, useState } from 'react';
import Todo from './components/Todo';
import Register from './components/Register';
import { Button } from '@mui/material';

const AuthenticatedContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDispRegister, setIsDispRegister] = useState(false);

  const currentToken = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
  };

  // current-user APIにTokneを送信し、現在のユーザー情報を取得する。取得できれば、Todo画面へ、できなければ、ログイン画面へ。
  useEffect(() => {
    fetch('http://localhost:8080/current-user', {
      method: 'POST',
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          setIsAuthenticated(true);
          console.log(response);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  return (
    <div className="h-screen">
      {isAuthenticated ? (
        <Todo />
      ) : (
        <div>
          <SignIn />
          <Button
            onClick={() => {
              setIsDispRegister(!isDispRegister);
            }}
          >
            初めての方はこちら
          </Button>

          {isDispRegister ? <Register /> : <div></div>}
        </div>
      )}
    </div>
  );
};

export default AuthenticatedContent;
