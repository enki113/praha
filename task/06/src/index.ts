import express from "express";
import server1 from "./server1";
import router from "./router";
import server2 from "./server2";

const app = express();
app.use(server1);
app.use(router);
app.listen(8080);

const htmlServer = express();
htmlServer.use(server2);
htmlServer.listen(8081);
