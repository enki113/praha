### 課題１

####「常連顧客を特定して欲しい」と頼まれました

- 1996年に3回以上注文した（Ordersが3つ以上紐づいている）CustomerのIDと、注文回数を取得する

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

- 最もよく注文してくれたのは、どのCustomerか

![画像１](image/1.jpg) 

結果より、65,63,20のCustomerが該当


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

![画像2](image/2.jpg) 

結果より、５件紐づいている

#### 過去最も多くのOrderが紐づいたShipperを特定する

```sql
SELECT
  ShipperID,
  COUNT(OrderID) AS OrderCount
FROM
  Orders
GROUP BY ShipperID
ORDER BY OrderCount DESC;

```

![画像3](image/3.jpg) 

結果より、ID:2のShipperが該当


#### 売上が高い順番にCountryを並べる

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

![画像4](image/4.jpg) 

結果より、最も売り上げが高いのはUSA

#### 国ごとの売上を年毎に（1月1日~12月31日の間隔で）集計する


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

![画像5](image/5.jpg) 


#### フラグ立て

- Employeeテーブルに「Junior（若手）」カラム（boolean）を追加して、若手に分類されるEmployeeレコードの場合はtrueにする

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

- long_relationがtrueになるべきShipperレコードを特定し、更新
  - long_relationの定義：これまでに70回以上、Orderに関わったShipper（つまり発注を受けて運搬作業を実施した運送会社）

```sql
UPDATE Shippers
SET long_relation = true
WHERE ShipperID IN  (
SELECT ShipperID FROM Orders
GROUP BY ShipperID
HAVING COUNT(ShipperID)  >= 70
);
```



