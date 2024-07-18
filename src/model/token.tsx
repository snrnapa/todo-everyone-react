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
        console.error('Error refreshing Firebase token:', error);
        // `auth/quota-exceeded` エラーの場合の特別なハンドリング
        if (error.code === 'auth/quota-exceeded') {
            console.warn('Quota exceeded. Consider reducing the refresh frequency or upgrading your Firebase plan.');
        }
        return null;
    }
}