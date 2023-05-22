# 課題 1

## スロークエリログを有効にする

```sql
--- 有効かどうか確認
SHOW GLOBAL VARIABLES LIKE '%slow_query%';
--- => 無効だった


--- 有効にする
SET GLOBAL slow_query_log = 'ON';
```

## 実行に 0.1 秒以上かかったクエリを対象にする

```sql
SET GLOBAL long_query_time = 0.1 ;
```

## 実行時間が 0.1 秒未満のクエリを 3 つ

- MySQL クライアント上で３つ実行した
  - どんなものが軽いクエリかわからなかったので、とりあえず `limit 1` した

```sql
SELECT * FROM salaries limit 1;

SELECT * FROM employees limit 1;

SELECT * FROM titles limit 1;

```

## 実行時間が 0.1 秒より長いクエリを 3 つ

- MySQL クライアント上で３つ実行した

```sql
SELECT * FROM employees WHERE birth_date > '1953-09-02';

SELECT * FROM titles WHERE title = 'Senior Engineer';

SELECT * FROM salaries WHERE salary = 60117;
```

- コンテナに入ってログファイルを cat する(less は入ってなかった&入れるのが面倒だった)

```shell
docker exec -it コンテナID bash
cat /var/lib/mysql/4c311fa9a949-slow.log # おそらくコンテナID-slow.logのような形式のファイルになっているのだと思われる
```

- 結果はそれぞれ以下
  - log ファイルに出力されていることが確認できる
  - `limit 1`したクエリのものは出力されていなかった

```shell
# Time: 2023-05-22T13:57:01.092849Z
# User@Host: root[root] @  [172.17.0.1]  Id:     6
# Query_time: 1.402843  Lock_time: 0.000174 Rows_sent: 263462  Rows_examined: 300027
SET timestamp=1684763821;
SELECT * FROM employees WHERE birth_date > '1953-09-02';

# Time: 2023-05-22T13:57:24.154659Z
# User@Host: root[root] @  [172.17.0.1]  Id:     6
# Query_time: 0.789526  Lock_time: 0.000094 Rows_sent: 97750  Rows_examined: 443308
SET timestamp=1684763844;
SELECT * FROM titles WHERE title = 'Senior Engineer';

# Time: 2023-05-22T13:55:34.021273Z
# User@Host: root[root] @  [172.17.0.1]  Id:     6
# Query_time: 1.549578  Lock_time: 0.000113 Rows_sent: 65  Rows_examined: 2844047
SET timestamp=1684763734;
SELECT * FROM `salaries` WHERE `salary` = 60117;
```

# 課題 2
