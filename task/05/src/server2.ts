import express from "express";

const server2 = express.static("asset", {
  setHeaders: (res) => {
    res.cookie("third", "huga", {
      httpOnly: true,
    });
  },
});

export default server2;
