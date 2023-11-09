## 問題 1

### SELECT NULL = 0;

=> NULL

- NULL は比較できない

### NULL = NULL

=> NULL

- NULL 同士の比較はできない

### NULL <> NULL

=> NULL

- NULL 同士の比較はできない

### NULL AND TRUE

=> NULL

- AND 条件は両辺が TRUE であれば TRUE を返すところ、比較対象に NULL が入っているため比較できない

### NULL AND FALSE

=> FALSE

- AND 条件 では、片辺が FALSE であれば FALSE を返すため

### NULL OR TRUE

=> TRUE

- OR 条件では、片辺が TRUE であれば TRUE を返すため

### NULL IS NULL

=> TRUE

- NULL と比較するための「IS NULL」演算子を使用しているため、「NULL は NULL であるか」という式になり、全体として TRUE になる

## 問題 2

```sql
TABLE assignee {

id: varchar NOT NULL

}

TABLE Issue {

id: varchar NOT NULL

text: varchar NOT NULL

assigned_to_id: varchar -- NULL になり得る

}
```

NULL が入らないように改善した結果が以下

```sql
TABLE assignee {
id: varchar NOT NULL
}

TABLE issue {
id: varchar NOT NULL
text: varchar NOT NULL
}

TABLE issue_assignee {
id: varchar NOT NULL
issue_id: varchar NOT NULL
assignee_id: varchar NOT NULL
}
```

- assignee と issue の中間テーブルとしての issue_assignee を作成した形
  - assignee : issue_assignee = 1 : 多
  - issue : issue_assignee = 1 : 多

https://dbdiagram.io/d/6453b4a4dca9fb07c481ebac

## 問題 3
