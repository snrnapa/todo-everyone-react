import { toast } from "react-toastify";
import { auth } from "../libs/firebase";


export async function refreshFirebaseToken(): Promise<string | null> {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('No user logged in');
        }

        // トークンを取得
        const idToken = await currentUser.getIdToken(/* forceRefresh */ true);

        // 新しいトークンを返す
        return idToken;
    } catch (error) {
        toast.error('トークンの更新に失敗しました');
        return null;
    }
}