### 課題１

####「常連顧客を特定して欲しい」と頼まれました

- 1996 年に 3 回以上注文した（Orders が 3 つ以上紐づいている）Customer の ID と、注文回数を取得する

```sql
SELECT
  CustomerID,
  COUNT(CustomerID) AS OrderCount
FROM
  Orders
WHERE
  Orders.OrderDate LIKE '1996%'
GROUP BY CustomerID
HAVING OrderCount >= 3
ORDER BY OrderCount DESC;
```

- 最もよく注文してくれたのは、どの Customer か

![画像１](images/1.png)

結果より、65,63,20 の Customer が該当

#### 過去最も多くの OrderDetail が紐づいた Order を取得する

```sql
SELECT
  OrderID,
  COUNT(OrderDetailID) AS OrderDetailsCount
FROM
  OrderDetails
GROUP BY OrderID
ORDER BY OrderDetailsCount DESC
LIMIT 1
```

![画像2](images/2.png)

結果より、５件紐づいている

#### 過去最も多くの Order が紐づいた Shipper を特定する

```sql
SELECT
  ShipperID,
  COUNT(OrderID) AS OrderCount
FROM
  Orders
GROUP BY ShipperID
ORDER BY OrderCount DESC;

```

![画像3](images/3.png)

結果より、ID:2 の Shipper が該当

#### 売上が高い順番に Country を並べる

```sql
SELECT
  ROUND(SUM(Products.Price * OrderDetails.Quantity)) AS Sales,
  Customers.Country
FROM OrderDetails
  JOIN Products ON (OrderDetails.ProductID = Products.ProductID)
  JOIN Orders ON (OrderDetails.OrderID = Orders.OrderID)
  JOIN Customers ON (Orders.CustomerID = Customers.CustomerID)
GROUP BY Customers.Country
ORDER BY Sales DESC;
```

![画像4](images/4.png)

結果より、最も売り上げが高いのは USA

#### 国ごとの売上を年毎に（1 月 1 日~12 月 31 日の間隔で）集計する

```sql
SELECT
  Customers.Country,
  strftime('%Y',Orders.OrderDate) as Year,
  ROUND(SUM(OrderDetails.Quantity * Products.Price)) as Salse
FROM Customers
JOIN Orders ON Orders.CustomerID = Customers.CustomerID
JOIN OrderDetails ON OrderDetails.OrderID = Orders.OrderID
JOIN Products ON Products.ProductID = OrderDetails.ProductID
GROUP BY Customers.Country, Year
ORDER BY Customers.Country
```

![画像5](images/5.png)

#### フラグ立て

- Employee テーブルに「Junior（若手）」カラム（boolean）を追加して、若手に分類される Employee レコードの場合は true にする

```sql
ALTER TABLE Employees ADD COLUMN Junior boolean default false;

UPDATE Employees
SET Junior = true
WHERE  strftime('%Y', DATE(BirthDate)) > '1960';
```

#### 多くの運送をしている業者を特定する

- 「long_relation」カラム（boolean）を Shipper テーブルに追加

```sql
ALTER TABLE Shippers ADD long_relation boolean default false;
```

- long_relation が true になるべき Shipper レコードを特定し、更新
  - long_relation の定義：これまでに 70 回以上、Order に関わった Shipper（つまり発注を受けて運搬作業を実施した運送会社）

```sql
UPDATE Shippers
SET long_relation = true
WHERE ShipperID IN  (
SELECT ShipperID FROM Orders
GROUP BY ShipperID
HAVING COUNT(ShipperID)  >= 70
);
```
