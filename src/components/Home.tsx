// import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
// import { IconButton } from '@mui/material';
// import { onAuthStateChanged } from 'firebase/auth';
// import { useEffect, useState } from 'react';
// import { auth } from '../libs/firebase';
// import { db } from '../libs/firebase';
// import { collection, getDocs } from 'firebase/firestore';

// const Home = () => {
//   const [registerFlg, setRegisterFlg] = useState(false);
//   const [loginUser, setLoginUser] = useState();
//   const [allUser, setAllUser] = useState([]);
//   const userCount = 100;
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       // 現在のログインユーザーのauthenticationを取得する（監視）
//       onAuthStateChanged(auth, (user) => {
//         if (user) {
//           setLoginUser(user);
//         } else {
//           console.log('現在はログインしておりません');
//         }
//       });
//       // userテーブルから、存在するユーザー情報をすべてダウンロードする。
//       const userInfo = collection(db, 'user');
//       const snapShot = await getDocs(userInfo);
//       setAllUser(snapShot.docs.map((doc) => ({ ...doc.data() })));
//       setLoading(false);
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="p-3 space-y-5">
//       {loading ? (
//         <div>ナウローディング</div>
//       ) : (
//         <div className="space-y-10">
//           <p className="text-3xl zenKurenaido">
//             ・・・・・・待ち画面・・・・・・・・
//           </p>
//           <p className="text-2xl">あなたのなまえ :: {loginUser.email}</p>
//           <p className="text-2xl">待機している人数 :: {userCount}</p>

//           <div>
//             <p className="text-xl font-zenKurenaido">まっちんぐ開始</p>
//             <IconButton>
//               <SatelliteAltIcon fontSize="large" color="primary" />
//             </IconButton>
//           </div>

//           <div>
//             <p className="text-xl font-zenKurenaido">まちユーザー情報</p>

//             {allUser.map((users) => (
//               <div>
//                 <h1>{users.user_name}</h1>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;
