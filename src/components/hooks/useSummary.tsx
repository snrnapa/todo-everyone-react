import { useCallback, useState } from 'react';
import { showErrorAlert } from '../../model/Utils';
import { API_URL } from '../../config';

interface Summary {
  id: number;
  user_id: string;
  title: string;
  deadline: Date;
  completed: boolean;
}

const useSummaries = (initialSummarys: Summary[], headers: Record<string, string>) => {
  const [summaries, setSummaries] = useState<Summary[]>(initialSummarys)
  const fetchSummaries = useCallback(async () => {
    try {
      const userId = localStorage.getItem('firebaseUserId');
      if (!userId) {
        throw new Error('userIdが取得できませんでした。解決しない場合は、再度ログインをしてください');
      }
      const response = await fetch(
        `${API_URL}/summary/${userId}`,
        {
          method: 'GET',
          headers: headers,
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP Error! status dededede: ${response.status}`);
      }
      const responseData = await response.json();
      var summariesWithDates;
      if (responseData && responseData.length > 0) {
        summariesWithDates = responseData.map((item: any) => ({
          ...item,
          deadline: new Date(item.deadline)
        }))
      }
      setSummaries(summariesWithDates)
    } catch (error) {
      showErrorAlert('summaryの取得に失敗しました', `${error}`);
    }
  }, [headers])
  return { summaries, setSummaries, fetchSummaries };
};

export default useSummaries;
