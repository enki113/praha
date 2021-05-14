# 問題 1

## curl

```
curl -H 'X-Test:hello' https://httpbin.org/headers
```

## postman

![image1](https://user-images.githubusercontent.com/30624076/118224866-f01ab480-b4be-11eb-9688-815cd754078c.png)

# 問題 2

## curl

```
curl -X POST -d '{"name":"hoge"}' -H 'Content-Type:application/json' https://httpbin.org/post
```

## postman

![image2](https://user-images.githubusercontent.com/30624076/118224874-f315a500-b4be-11eb-8865-a57f12a37ff8.png)

# 問題 3

## curl

```
curl -X POST -d '{"name":"hoge"}' -H 'Content-Type:application/x-www-form-urlencoded' https://httpbin.org/post
```

## postman

![image3](https://user-images.githubusercontent.com/30624076/118224877-f3ae3b80-b4be-11eb-97b4-d71e7be629fc.png)

# 問題 4

## curl

```
curl -X POST -d '{"userA":{"name":"hoge", "age":29}}' -H 'Content-Type:application/json' https://httpbin.org/post
```

## postman

![image4](https://user-images.githubusercontent.com/30624076/118224878-f446d200-b4be-11eb-9a33-383954cca900.png)

# クイズ

## curl

1. 問題 1 で実行したコマンドを修正し、下記のようにレスポンスヘッダの情報だけを出力するようにしてください

```
HTTP/2 200
date: Wed, 12 May 2021 11:11:39 GMT
content-type: application/json
content-length: 197
server: gunicorn/19.9.0
access-control-allow-origin: *
access-control-allow-credentials: true
```

2. https://httpbin.org/ を使って、以下の base64 エンコードされた文字列をデコードしてください。

   (コマンドと、結果の両方を回答すること)

```
KCgoKMK044O7z4njg7sp44OOcHJhaGEgY2hh
bGxlbmdl
```

3. curl で https://httpbin.org/get に向けて GET した結果から User-Agent だけ抜き出して出力してください。
   (grep でもできないことはないですが、jq コマンドにつなげる方法が一般的だと思うのでこちらを使用してください)

※出力結果

```
"curl/7.64.1"
```

※参考: jq

https://qiita.com/Nakau/items/272bfd00b7a83d162e3a

## Postman

1. クイズ curl の問１を Postman を使用して同様の結果を得てください

2. Postman の環境変数 INITIAL VALUE と CURRENT VALUE の違いを説明してください

3. Postman の環境変数に以下が設定されているとき、https://httpbin.org/get に向けて GET するときのパスはどのように書き換えることができるでしょう？

```
VARIABLE: PATH
CURRENT VALUE: https://httpbin.org
```
