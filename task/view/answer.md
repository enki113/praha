## 課題 1

### ビューの仕組み

- SELECT 文によるクエリを定義し、それを保存したもの
- ビューは物理的にはデータを保存しない「仮想的なテーブル」を作る
- 実際のテーブルからデータを取得するためのクエリの定義があるのみなので、ビューをクエリする度に、実テーブルから最新データが取得される

### メリット

- 複雑なクエリやテーブル結合を隠蔽することで、ユーザーはビューを通して、必要なデータに簡単にアクセスすることができる
- 作成するときに、一部のデータを除いたビューを定義することにより、特定のユーザーに対してデータへのアクセスを制限することもできる(セキュリティ面の強化)

### マテリアライズドビューとの比較

- 通常のビューは「仮想的なテーブル」である
  - データ自体を保存するのではなく、データを取得するための SQL クエリを保存する
- 一方で、マテリアライズドビューは、結果を物理的に データ 保存する特別なビューである
  - 毎回クエリを走らせる必要がないため、パフォーマンス上の利点がある
  - ただ結果セットが古くなりがちな危険もあるため、更新頻度などの方針決めが重要になる

参考: https://stackoverflow.com/questions/93539/what-is-the-difference-between-views-and-materialized-views-in-oracle

## 課題 2

「インデックスを理解する」「複合インデックスを理解する」の課題で作成した SELECT 文を１つ選んでください
上記の SELECT 文を VIEW として、実行できるようにしてみましょう
同じクエリの実行結果を返すビューを作成して、作成したビューからデータを取得するようにしてください。クエリのパフォーマンスはどのように変化したでしょうか？

### 対象クエリ

単純なものしかなかった・・・

```sql
select * from `employees`
where first_name = "Duangkaew"
and last_name = "Piveteau";
```

=> 現在 2.5ms

### view を作成してみる

```sql
CREATE VIEW view_employee AS
SELECT *
FROM employees
WHERE first_name = 'Duangkaew'
AND last_name = 'Piveteau';
```

### 実行

```sql
SELECT * FROM view_employee_duangkaew_piveteau;
```

=> 2.4ms

### パフォーマンスの違い

- 結果にほとんど差はなかった
  - SELECT 文を保存しているだけなので、内部的には同じクエリが実行されているので当然