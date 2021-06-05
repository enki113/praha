import express from "express";

const server1 = express.static("public", {
  setHeaders: (res) => {
    res.cookie("first", "hoge", {
      httpOnly: true,
    });
  },
});

export default server1;
