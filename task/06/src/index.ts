import express from "express";
import allowCrossDomain from "./server1";
import router from "./router";
import staticPage from "./server2";

const app = express();
app.use(allowCrossDomain);
app.use(router);
app.listen(8080);

const htmlServer = express();
htmlServer.use(staticPage);
htmlServer.listen(8081);
