# 1

```
TABLE Student {

id: varchar

name: varchar

status: varchar CHECK(status IN ("studying", "graduated", "suspended"))

}
```

- どのような問題があるか
  - status の中にどのような値が入りうるのか、DB のスキーマを確認しないと判断がつかない
  - DB の移植の際に問題になることがある
    - 例えば MySQL の CHECK 制約は 8.0 で追加された
  - 制約の内容を後から変更することが困難になってしまう(以下詳細)
    - あるテーブルの X カラムに当初「A/B/C」の３つの値のみ取りうる CHECK 制約が入っていた
    - ここで X=C をもつレコードを挿入したとする
    - この後テーブルの設定を変更し、X カラムの取りうる値を「A/B/D」にしようとしても、X=C のレコードが存在している関係で変更が失敗してしまう

# 2

マスタテーブルを別途用意するのが良い

```
Table Students {
  id int PK
  name string
  student_status_id int [null, ref: > StudentStatuses.id]
}

Table StudentStatuses {
  id int PK
  value string
  deleted boolean [default: false]
}
```

https://dbdiagram.io/d/64413ded6b31947051ec3862

- StudentStatuses テーブルを追加した
  - スキーマを見なくてもどのような値が含まれうるかわかる
- DB の種類によらないステータス管理ができる
  - CHECK 制約などの特別な機能を使用していない
- 後からカラムの内容を変更することができる
  - マスタ側だけ編集すれば、自動的に外部キーを持つレコードの設定まで変更することになる
    　- 論理削除のカラムを追加することにより、使用しなくなったステータスの削除も可能 - 合わせて student_status_id カラムも null 許可している
