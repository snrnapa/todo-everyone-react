/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // 他に必要な環境変数があれば、ここに追加します
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}