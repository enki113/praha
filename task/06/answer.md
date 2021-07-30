# 課題 1

### 説明

CORS = Cross Origin Resource Sharing

通常ブラウザは、同一オリジンポリシーによってオリジン間 HTTP リクエストを制限している。
CORS は、追加の HTTP ヘッダを使用することで、同一オリジンポリシーによるリソース間のアクセスの制限を緩和するためのブラウザの機能。
"access-control-allow-origin"ヘッダにより、 ドメイン間アクセスを許可する必要がある。

### ワイルドカード指定の問題

不特定多数の別オリジンからのリクエストで、そのアプリケーションのデータを取得できてしまう可能性がある。
また、この場合 Cookie の送信が不可能になってしまう。

### シンプルリクエスト

- メソッドが`GET`, `HEAD`, `POST` のいずれかであること

- `Accept`,`Accept-Language`,`Content-Language`,`Content-Type`以外のヘッダを含まないこと

- `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`以外の content-type ヘッダの値を含まないこと

### ブラウザの挙動

ネットワークエラーが発生する

### クッキーを含める場合

Access-Control-Allow-Credentials: true 　をヘッダに設定する

# 課題 2

- Access-Control-Allow-Methods ヘッダの役割を説明してください

- https://hogehoge.com:8080 から https://hogehoge.com:8081 へのアクセスはクロスオリジンリクエストでしょうか
  また、その理由を簡単にお答えください

#　課題 3

実装を参照ください

# 課題 4

CORS はブラウザの仕様なので、ブラウザ以外からのリクエストでは CORS の制約は適用されません
