# 課題 1

## 回答

https://dbdiagram.io/d/db_modeling3-65c0e2dfac844320ae79745b

## 要件

### ドキュメント

- `documents`テーブルの作成

### いつ、誰が、どんなテキスト情報を保存したのか管理する

- `user_id`と`created_at`で判断可能

### ドキュメントは必ず何らかのディレクトリに属する

- `directories`テーブルを作成
- `documents`が`directory_id`を外部キーとして持つことにより「どのディレクトリに属するか」を管理

### ディレクトリ

- `directories`テーブルの作成

### 一つ以上のドキュメントを含む階層構造

- `directory_closures` テーブルを作成して階層構造を表現

### ディレクトリは無制限にサブディレクトリを持つことができる

- ディレクトリ間の親子関係を `ancestor_directory_id` と `descendant_directory_id` で表現
- `depth` 列を追加して階層の深さを管理した

### ディレクトリ構造は柔軟に変更可能。ディレクトリが移動してサブディレクトリになることもあり得る

- `directory_closures`テーブルを更新することでディレクトリ構造を変更可能
  - `ancestor_directory_id` と `descendant_directory_id` と `depth` を更新する

### ユーザ

- `users`テーブルの作成

### ドキュメントを CRUD（作成、参照、更新、削除）できる

- これはアプリケーションの機能では？
  - 権限管理的な機能も必要ってことだろうか

### ディレクトリを CRUD できる

- 同上
