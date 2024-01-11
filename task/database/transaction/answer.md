## 課題１（質問）

### デッドロック

- 複数のトランザクションの処理がもう一方の処理が終わるのをお互いに待ち続けることで、どちらも処理を先に進めることができなくなること

### 事例

- メルカリでの事例
- 売り手と買い手がそれぞれのトランザクション内で同じデータを更新しようととして、相互にロックを待つ状況が生じてしまった
- 解決策としては、データ更新時にユーザー ID をキーにソートをかけ、書き込み順を揃える方法がとられた

### ISOLATION LEVEL についての説明

#### ISOLATION LEVEL

- トランザクションの独立性の水準を表すもの
- 独立性を高めるほど同時実行性能が落ち、同時実行性能を上げるほど独立性は低くなり、不整合が起こる可能性が増加することになる
- 各レベルの説明は以下

- READ UNCOMMITTED
  - コミット されていない変更を他のトランザクションから参照することが可能
    - 「ダーティリード」が発生するということ
- READ COMMITTED
  - トランザクションが コミット した変更を他のトランザクションから参照することが可能
  - PostgreSQL のデフォルトのレベルはここ
- REPEATABLE READ
  - コミット された追加・削除を他のトランザクションから参照することが可能
  - 同じデータを何度読み取っても同じことが保証される
- SERIALIZABLE
  - 強制的にトランザクションを順序付けて処理するもっとも高い分離レベル
    - 「ロストアップデート」が発生しない

| レベル           | ダーティリード | ファジーリード | ファントムリード | ロストアップデート |
| ---------------- | -------------- | -------------- | ---------------- | ------------------ |
| READ UNCOMMITTED | 発生           | 発生           | 発生             | 発生               |
| READ COMMITTED   | 起きない       | 発生           | 発生             | 発生               |
| REPEATABLE READ  | 起きない       | 起きない       | 発生             | 発生               |
| SERIALIZABLE     | 起きない       | 起きない       | 起きない         | 起きない           |

ただし、MySQL の InnoDB では、例外的に REPEATABLE READ でもファントムリードが生じない。(PostgreSQL も 9.1 以降は発生しない)

### 行レベルのロック、テーブルレベルのロックの違い

- テーブルレベルのロック
  - テーブルを対象にロックするため、テーブル内のレコード全てが対象に取られる
- 行レベルのロック

  - 行(レコード)単位でロックを取る
  - １行の場合もあれば複数行にまたがることもあり、全ての行を対象にするとテーブルロックと同じことになる

### 悲観ロックと楽観ロックの違い

- 楽観ロック

  - ロック自体は行わずに、更新対象のデータが、データ取得時と同じ状態であることを確認してから更新することで、データの整合性を担保する手法
  - 更新対象のデータがデータ取得時と同じ状態であることを判断するために、「version カラム」を利用する
  - 更新時に、データ取得時の バージョン と更新時の バージョン を同じとすることで、データの整合性が満たされる

- 悲観ロック
  - 更新対象のデータを取得する際に「ロック」をかけることで、他のトランザクションから更新されないようにする手法
  - トランザクションが開始された直後に更新対象となるレコードのロックを取得する
  - トランザクションの中でコミットやロールバックがされるまで、他のトランザクションからも更新されることもないため、データの整合性が満たされる

### 共有ロックと排他ロックの違い

- 共有ロック
  - ロック対象への参照以外のアクセスを禁止する
  - 他のトランザクションから参照でアクセス可能
  - 読み込みロックと呼ばれることもある
- 排他ロック
  - ロック対象への全てのアクセスを禁止する
  - SELECT, INSERT, UPDATE, DELETE の全てができない
  - 書き込みロックと呼ばれることもある

### ファジーリードとファントムリードの違い

- ファジーリード
  - トランザクションの途中に、他のトランザクションがコミットした変更が見えてしまう
- ファントムリード
  　- 他のトランザクションがコミットした追加・削除が見えてしまう
- つまり、「既存のデータの変更」に関するか、「行数の変更」に関するかの違いがある

## 課題２（実装）

### Dirty Read

```sql
mysql(1)> SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
Query OK, 0 rows affected (0.01 sec)
mysql(2)> SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
Query OK, 0 rows affected (0.01 sec)

mysql(1)> START TRANSACTION;

mysql(1)> update employees set first_name = 'Shiota' where emp_no = 10001;
Query OK, 1 row affected (0.00 sec)

mysql(2)>  select * from employees limit 1;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Shiota     | Facello   | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.01 sec)
```

=> 片方のトランザクションでコミットしていない変更が、もう片方のトランザクションから見えてしまっていることがわかる

### Non-repeatable read

```sql
mysql(1)> SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
Query OK, 0 rows affected (0.01 sec)
mysql(2)> SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
Query OK, 0 rows affected (0.01 sec)

mysql(1)> START TRANSACTION;
mysql(2)> START TRANSACTION;

mysql(1)> update employees set first_name = 'Shiota' where emp_no = 10001;
Query OK, 1 row affected (0.00 sec)

mysql(2)>  select * from employees limit 1;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.01 sec)

mysql(1)> commit;

mysql(2)>  select * from employees limit 1;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Shiota     | Facello   | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.01 sec)

```

=> トランザクションの途中に、他のトランザクションがコミットした変更が見えてしまっていることがわかる

### Phantom read

```sql
mysql(1)> SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
Query OK, 0 rows affected (0.01 sec)
mysql(2)> SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
Query OK, 0 rows affected (0.01 sec)

mysql(1)> START TRANSACTION;
mysql(2)> START TRANSACTION;

mysql(1)> select COUNT(*) from employees;
+----------+
| COUNT(*) |
+----------+
|   300027 |
+----------+
1 row in set (0.06 sec)

mysql(2)> delete from employee where emp_no = 10001;
Query OK, 0 rows affected (0.01 sec)

mysql(2)> commit;

mysql(1)> select COUNT(*) from employees;
+----------+
| COUNT(*) |
+----------+
|   300026 |
+----------+
1 row in set (0.05 sec)

```

=> トランザクションの途中に、他のトランザクションがコミットしたレコードの削除が見えてしまっていることがわかる

### 映画のチケットについて

- 楽観ロックを採用すると思う

  - 競合が発生する確率が非常に低いと考えられるため
  - ただ楽観ロックの利点はパフォーマンスとリソース効率に優れる点だと思うので、個人店のようなパフォーマンスを特に意識しなくていい場合だと逆に悲観ロックの採用でもいいのかもしれない・・

- ざっくり実装方針

  1. DB からチケット情報を取得
  2. 選択したチケットが購入されているかどうかのチェック処理

  - 既に購入済みであれば例外をスロー

  3. DB に更新する前にバージョンをチェック

  - バージョンチェックに失敗した場合は例外をスロー

  4. 外部 API か何かしらを使っての支払い処理
  5. 支払い後、席を購入済みに更新(バージョンも更新)
