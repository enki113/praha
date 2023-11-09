import express from "express";
import cacheControl from "express-cache-controller";
import { ENV } from "./env";

// キャッシュするサーバー;
const cachedImageServer = express();
const cacheOption = {
  maxAge: 60,
};
cachedImageServer.use(cacheControl(cacheOption));
cachedImageServer.use(express.static(__dirname + "/images/cached"));
cachedImageServer.listen(ENV.CACHED_PORT);

// キャッシュしないサーバー
const noCachedImageServer = express();
const noCacheOption = {
  noStore: true,
};
noCachedImageServer.use(cacheControl(noCacheOption));
noCachedImageServer.use(express.static(__dirname + "/images/no-cached"));
noCachedImageServer.listen(ENV.NO_CACHED_PORT);
