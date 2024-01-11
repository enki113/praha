## 課題 1（SOLID）

### 各要素の説明

#### Single Responsibility Principle

- 単一責任の原則
- 「あるクラスの責任は、たったひとつであるべき」という原則
  - 例えば、「通知を行う」のようなクラス`Notice`がある場合に、その中で「メール通知」「slack 通知」のように２つの責任があるため違反と言える

#### Open/Closed principle

- 開放閉鎖の原則
- クラスや関数はその拡張に対して開かれており、修正に対しては閉じられていなければならないという原則
  - 変更が発生した際に、なるべく既存のコードを修正せずにコードの追加だけで対応できるようにすべき」ということ

#### Liskov substitution principle

- リスコフの置換原則
- 「子クラスは親クラスと置換可能でなければいけない」という原則
  - サブクラスでオーバーライドしたメソッドは、スーパークラスのメソッドと同様の引数を取り、同じ型の返り値を返さなければいけないということ
  - スーパークラスで例外を返さないのであれば、サブクラスでも例外を返してはいけない

#### Interface segregation principle

- インターフェース分離の原則
- そのクラスにとって必要なメソッドだけを定義しなければならないという原則
  - => 必要なメソッドは定義してはいけないということ

#### Dependency inversion principle

- 依存性逆転の原則
- 上位モジュールは下位モジュールに依存してはならず、どちらのモジュールも抽象に依存すべきであるという原則
  - ここでいう「上位のモジュール」は「下位モジュールを使う側」を指す(下位のモジュールは上位モジュールに使われる側と言える)
  - 「抽象」とは「インターフェース」のこと

### どのようなメリットがあるのか？

- ソフトウェア設計をより平易かつ柔軟にして保守しやすくすることがメリット

### 単一責任の原則と、単純にファイルを細かなファイルに分解することの違い

- 単一責任の原則は「機能の修正や仕様変更に強くすること(凝集度を高めること)」にある一方で、単純なファイル分割は逆に凝集度を下げてしまい単一責任の原則と全く逆の結果を引き起こす可能性が高い。

### Open-Closed-Principle の実例

- 以下例のように、悪い例の場合は新たに type が増えればその都度`greet`メソッドに処理を追加する必要があるが、
  良い例の場合は`GreetService.call`にオブジェクトを渡すだけで良い(呼び出し先が引数の内容を知っている必要がない)

```ruby

# -----悪い例
def greet(animal_type)
  case animal_type
  when "Human"
    puts "こんにちは"
  when "Dog"
    puts "わん"
  when "Cat"
    puts "にゃー"
  end
end

greet("Human")


# -----良い例
class GreetService
  def call(animal_type)
    animal_type.greet
  end
end

class Human
  def greet
    puts "こんにちは"
  end
end

class Dog
  def greet
    puts "わん"
  end
end

class Cat
  def greet
    puts "にゃー"
  end
end

GreetService.call(クラスオプジェクト)
```

### リスコフの置換原則に違反した場合の不都合

- リスコフの置換原則に反する、つまり派生型が基本型と置換可能でなかった場合、
  その派生型を処理する場合だけは呼び出し元で例外的な処理をする必要が出てしまう。
- 処理を無駄に複雑化させてしまい、呼び出し元の処理に修正を加えなければ機能を拡張できないということにもつながってしまうので、オープンクローズドの原則にも反することになってしまう。

### インターフェースを用いる事でのメリット

- 実際に自分(そのクラス)が利用するメソッドだけに依存するようになることで、他クラスの変更の影響を最小限に抑えることが出来る

### 依存性の逆転を用いる必要のある時

-　ドメイン層が直接インフラ層の実装に依存する状態(RDB を使っている場合に SQL を投げるような形)だと、対象が NoSQL に変わった際にドメイン層ごと修正するようなことになってしまうので、そのようなことを防ぐために依存性逆転の原則を使って、ドメイン層ははインターフェイス(抽象)に依存させるようにする・・など

### デメテルの法則とは？

- 最小知識の原則とも言う。

- オブジェクト間のやりとりを最小限に抑え、必要であれば直接やりとりをするべきということ。

- 守ることで、オブジェクト同士が疎結合になり、テストのしやすさ・コードの改修のしやすさが向上する。

#### このようなコードがダメな理由

- private なフィールドを定義したとしても、それを呼ぶアクセサメソッドが public である時点で実質 public なフィールドを定義したのと等しくなっているから。

## 課題 2

口頭で行った

## 課題 3

口頭で行った