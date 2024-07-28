import { useState, useRef } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';

interface PlaceInfo {
  name: string;
  formatted_address: string;
  rating?: number;
  opening_hours?: {
    open_now: boolean;
  };
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

const PlaceByGoogle = () => {
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null);
  const placeRef = useRef<HTMLInputElement | null>(null);

  const fetchData = async () => {
    try {
      if (!placeRef.current) {
        throw new Error('URLから場所の名前を取得できませんでした');
      }
      const placeName = placeRef.current?.value; // オプショナルチェイニングを使用して安全にアクセス
      if (!placeName) {
        throw new Error('入力されたURLが無効です');
      }
      const response = await axios.get<{ candidates: PlaceInfo[] }>(
        'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
        {
          params: {
            input: placeName,
            inputtype: 'textquery',
            fields: 'formatted_address,name,rating,opening_hours,geometry',
            key: 'AIzaSyCX5ODZGD9jYIyndMzwUbliLk5tiJoQLDc',
          },
        },
      );
      setPlaceInfo(response.data.candidates[0]);
    } catch (error) {
      toast.error('場所情報の取得に失敗しました');
    }
  };

  return (
    <div>
      {placeInfo ? (
        <div>
          <h2>場所の情報:</h2>
          <p>名前: {placeInfo.name}</p>
          <p>住所: {placeInfo.formatted_address}</p>
        </div>
      ) : (
        <div>
          <p>取得した位置のGoogleMapのURLを張り付けてください</p>
          <input type="text" ref={placeRef}></input>
          <Button onClick={fetchData}>検索</Button>
        </div>
      )}
    </div>
  );
};

export default PlaceByGoogle;

// ブラウザにはこんな感じで打ち込むと場所の情報がかえってくる
// https://maps.googleapis.com/maps/api/place/findplacefromtext/json
//   ?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry
//   &input=ソナタ１
//   &inputtype=textquery
//   &key=AIzaSyCX5ODZGD9jYIyndMzwUbliLk5tiJoQLDc
