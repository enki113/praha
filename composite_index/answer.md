# 課題 1

### 説明

- 複合インデックスとは、複数の列を組み合わせて作成されるインデックスのこと。1 つのインデックスによって複数の列を検索することができるため、より高速にデータを取得することができる。例えば名前と年齢の列を持つテーブルがあるとする場合、複合インデックスを使用することで、名前と年齢の両方の列を検索するクエリを高速に実行することができる。

### フルテーブルスキャンの解消法

- 結論から書くと下記のようにすれば良い

```sql
CREATE INDEX employees_name ON employees (last_name, first_name)
```

- 複合インデックスは２つ目以降のインデックスのみで使用できないため、元の定義だと last_name(姓)だけの検索をかけた場合
  インデックスが効かずフルスキャンが走ることになってしまう。

# 課題 2

## select クエリ 3 つ

### １つ目

```sql
select * from `employees`
where first_name = 'Georgi'
and birth_date BETWEEN DATE('1960-01-01') AND DATE('1960-12-31')
```

=>86.8ms

インデックスを張る

```sql
CREATE INDEX idx_first_name_birth_date ON employees(first_name, birth_date);
```

再度実行

```sql
select * from `employees`
where first_name = 'Georgi'
and birth_date BETWEEN DATE('1960-01-01') AND DATE('1960-12-31')
```

=>2.2ms

### ２つ目

```sql
select * from `employees`
where first_name = "Duangkaew"
and last_name = "Piveteau";
```

=> 106ms

インデックスを張る

```sql
CREATE INDEX idx_first_name_last_name ON employees(first_name, last_name);
```

再度実行

```sql
select * from `employees`
where first_name = "Duangkaew"
and last_name = "Piveteau";
```

=> 1.6ms

### ３つ目

```sql
select * FROM salaries WHERE salary='80013' && from_date LIKE '1992%';
```

=>512ms

インデックスを張る

```sql
CREATE INDEX idx_salary_from_date ON salaries(salary, from_date);
```

再度実行

```sql
select * FROM salaries WHERE salary='80013' && from_date LIKE '1992%';
```

=>2.1ms
