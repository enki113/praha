## 課題 1

### インデックスの仕組み

インデックスとは、その名の通り「索引」のことになります。

例えば辞書で「プログラミング」という言葉を検索する際に、
１ページ目から順番にページをめくっていって目的の単語「プログラミング」を探そうとすると途方もない時間がかかってしまうと思います。

そこで、通常は以下のような手段を取るはずです。

1. 「索引」を使って辞書の何ページに「プログラミング」があるのかを確かめる。
2. 上記の該当ページに遷移する
3. 該当ページ上で改めて目的の単語「プログラミング」を探す

この手順と同じようなことを行うのがデータベースにおける「インデックス」という仕組みになります。

### slow query log を調べる意味

そもそも闇雲に INDEX を貼ることはアンチパターンです。

これは俗に「インデックスショットガン」と呼ばれます。

このアンチパターンの問題として、例えば INDEX を貼ると「INSERT/UPDATE/DELETE が遅くなる」という問題があります。

つまりインデックスを貼ればその分 DB 全体のパフォーマンスが落ちることに繋がってしまうのです。

これを避けるために、(コード上どのクエリがボトルネックになっているか不明な状況での)パフォーマンス改善のためには slow query log を調べることが通常です。

slow query log には実際に問題のある(遅い)クエリが残っているので、それらクエリに対して EXPLAIN をかけ実行計画を確認して、適切にインデックスがかかっているかどうかを確認することになります。

その上で必要十分かつ最低限のインデックスをかけることが重要です。

### カーディナリティとは

「列に格納されるデータの値にどのくらいの種類があるのか？」をカーディナリティといいます。

例えばユーザー ID はユニークであり、かつサービスの規模が大きくなるにつれユーザー ID も増えていきますのでカーディナリティが高いと言えます。

逆に性別のような値は「男/女/(その他など)」くらいしかありませんのでカーディナリティは低いと言えます。

カーディナリティが低い列に対する INDEX は有効活用できないため避けるべきです。

極端な例ですが、例えば男女比が 99:1 であり、そこに where 条件で「男」を指定して検索をかける場合、INDEX を使用してもテーブル全体の 99 %に対して検索をかけることになってしまうのでフルスキャンとほぼ変わらない効率になってしまいます。

### カバリングインデックスとは

INDEX に含まれているデータのみが必要な場合は、つまり INDEX を読み込むだけで良くなるため、実際のテーブルを読み込まずに結果を返せることになります。

これがカバリングインデックスと呼ばれるものです。
(INDEX が実行するクエリ全体をカバーしている、という意味合い)

## 課題 2

### SELECT クエリを 3 つ

```sql
select * from `employees` where `first_name` = 'Georgi';
```

```sql
select * from `salaries` where `salary` = 43466;
```

```sql
select * from `titles` where `from_date` = '1996-08-03';
```

### 速度確認

```sql
SELECT SQL_TEXT, EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000, 6) AS Duration FROM performance_schema.events_statements_history;
```

### 結果

上記それぞれ

- 257.509400
- 1991.739800
- 291.801500

それぞれ

- 4.249300
- 2155.414500
  - 36.880700(正しくインデックスが効いた後)
- 6.990200

salaries に貼った index が効かない。。。
explain した結果の type が ALL になっているのでフルスキャンになっていそうだが原因がわからない。。
=>解決した!

## 課題 3

INSERT と DELETE を実行する

```sql
INSERT INTO salaries value(10001, 10000, '2022-10-24', '2023-10-24');
DELETE FROM salaries WHERE salary = 10000;
```

- インデックスを張った場合

  - INSERT: 73.5ms
  - DELETE: 12.8ms

- インデックスを消した場合

  - INSERT: 4.5ms
    - インデックス無しの場合に比べて処理が速くなった。理由：インデックスが張ってある場合は、データの挿入+インデックス情報への書き込みも行う必要があるが、無い場合はデータの挿入のみとなるため。
  - DELETE: 3.4s
    - インデックス無しの場合に比べて遅くなってしまった。理由：条件に WHERE を指定したことによると思われる。インデックスありの場合は、DELETE する前に WHERE で絞り込むが、その際にインデックスを使用していた。

## クイズ

1. last_name が Avouris の従業員を birth_date の昇順で取得するクエリ
2. hire_date が 1990 年の 1 月 である従業員の数を男女ごとに分けて取得するクエリ(結果の列には gender とその数の２列を出力してください)

3. emp_no の ２倍の数が 「950000 以上」 である従業員を取得するクエリ(※emp_no には元々 index が張られているので、その index が効くようなクエリを書いてください。)

## 以下メモ(みていただく必要ないです)

```sql
select * from `employees` where `first_name` = 'Georgi';

explain select * from `salaries` where `salary` = 43466;

explain select * from `titles` where `from_date` = '1996-08-03';


SELECT SQL_TEXT, EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000, 6) AS Duration FROM performance_schema.events_statements_history;


SHOW INDEX FROM employees;
show index from salaries;

ALTER TABLE employees ADD INDEX idx_forst_name(`first_name`);

ALTER TABLE salaries ADD INDEX idx_salary(salary);


ALTER TABLE titles ADD INDEX idx_from_data(from_date);

select * from `employees` where `first_name` = 'Georgi';

ALTER TABLE salaries ADD INDEX idx_salary(salary);

ALTER TABLE employees ADD INDEX idx_first_name(`first_name`);

ALTER TABLE salaries ADD INDEX idx_salary(`salary`);

DROP INDEX idx_salary ON salaries;

ALTER TABLE titles ADD INDEX idx_from_data(`from_date`);



select * from `employees` where `first_name` = 'Georgi';


select * from `titles` where `from_date` = '1996-08-03';

select * from `salaries` where `salary` = 43466;

select count(*) from salaries;

show indexes from salaries;

analyze table salaries;

```
