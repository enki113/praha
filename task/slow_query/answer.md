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

- 最も頻度の高いもの

```sql
mysqldumpslow -s c -t 1 /var/lib/mysql/4c311fa9a949-slow.log
```

- 最も実行時間が長いもの

```sql
mysqldumpslow -s t -t 1 /var/lib/mysql/4c311fa9a949-slow.log
```

- 最もロック時間が長いもの

```sql
mysqldumpslow -s l -t 1 /var/lib/mysql/4c311fa9a949-slow.log
```

# 課題３

- 最も頻度が高いものを解消する

```sql
CREATE INDEX idx_last_name ON employees(last_name);
```

- 最も実行時間が長いものを解消する

```sql
CREATE INDEX idx_salary ON salaries(salary);
```

# 課題４

### なぜ limit 1 で遅いのか

- LIMIT 句はクエリの実行処理の一番最後に実行されるために、結局条件に合致するレコードに対してフルスキャンが走ってしまうから。

### ON で絞った方が良いのか？

- 前提として、実行順序は ON => JOIN => WHERE の順番(JOIN が行われる前に ON が評価され、JOIN 後の結果に WHERE が適用される)
- ただ、

  - ON 句: 結合条件
  - WHERE 句: フィルタリング条件
  - なので、今回の場合だと結合条件(ON の対象)としては emp_no のみが該当し、残りの gender と birth_date はフィルタリング条件(WHERE の対象)になるべき
  - また、実際に実行した場合でもオプティマイザが適切に実行計画を考えてくれるのでパフォーマンスの違いもない
  - さらに、OUTER JOIN を使用して ON 句に条件を指定すると、結合前に条件による絞り込みが行われるために結合元テーブルのレコードが全て取得される(=>結合先の関連がない婆は null 埋めされて出力される)ので、明確に結果が異なってくる
  - 以上の理由によりこの場合については ON ではなく WHERE を使用する方が適切である

  補足※: [[実行順序を ON=>JOIN=>WHERE と書いたが、SQL をオプティマイザが最適化する過程で WHERE で絞った状態で JOIN されることもあるようだ](https://ryuichi1208.hateblo.jp/entry/2022/11/13/103003)
