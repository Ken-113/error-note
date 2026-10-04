## ErrorNote
プログラミング学習者・個人開発者向けに、発生したエラーについて、原因や試したこと、解決方法、解決にかかった時間などを記録・管理できるサービスです。
一度解決したエラーを後から検索して振り返ることで、同じエラーが発生した際に過去の記録を確認できるようにしています。

## 本番URL
https://error-note.vercel.app

※登録なしでゲストログインにて閲覧可能です。

## トップページ
<img width="1409" height="746" alt="LP" src="https://github.com/user-attachments/assets/19b5a88b-c37a-463f-aaaa-2e15f8713480" />

## 開発経緯
プログラミング学習や個人開発に取り組む中で、自分自身がエラーの原因を調査し、試行錯誤しながら解決する機会が増え、 
一度解決したエラーでも時間が経つと原因や解決方法を思い出せず、再度調べ直すことがあるという課題を感じこのErrorNoteを開発しました。

## 使用技術
FW
Next.js
React
Tailwind CSS

ライブラリ
React Hook Form
SWR
React Testing Library

BE
Supabase 
Prisma
PostgreSQL 

認証
NextAuth.js

その他ツール
Vercel 
GitHub
VSCode
Slack

## 機能一覧
・エラー情報の登録 
・エラー情報の編集・削除 
・エラー情報の検索 
・エラー内容・解決方法の記録 
・技術情報の登録・管理 

## 設計のこだわり
シンプルでわかりやすいアプリにしたかったため、不要な機能を実装せずMVPでの作成を意識しました。
全体の平均解決時間を取得して可視化することで、エラーにかかった時間の全体確認できるようにしました。

