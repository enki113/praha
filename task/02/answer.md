# 問題 1

```
url -H 'X-Test:hello' https://httpbin.org/headers
```

# 問題 2

```
curl -X POST -d '{"name":"hoge"}' -H 'Content-Type:application/json' https://httpbin.org/post
```

# 問題 3

```
curl -X POST -d '{"name":"hoge"}' -H 'Content-Type:application/x-www-form-urlencoded' https://httpbin.org/post
```

# 問題 4

```
curl -X POST -d '{"userA":{"name":"hoge", "age":29}}' -H 'Content-Type:application/x-www-form-urlencoded' https://httpbin.org/post
```
