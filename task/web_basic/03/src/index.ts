import express from "express";
import router from "./route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

const port = process.env.PORT || 8080;

app.listen(port);
console.log("listening on port " + port);
