import express from "express";
import server1 from "./server1";
import server2 from "./server2";

// メインサーバ
const app = express();
app.use(server1);
app.listen(8080);

// サードパーティのサーバ
const app2 = express();
app2.use(server2);
app2.listen(8081);
