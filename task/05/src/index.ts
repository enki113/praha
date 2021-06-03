import express from "express";
import server1 from "./server_1";

const app = express();
app.use(server1);

const port = process.env.PORT || 8080;
app.listen(port);
console.log("listening on port " + port);
