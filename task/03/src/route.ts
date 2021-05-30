import express from "express";

const router = express.Router();

router.get("/", (req: express.Request, res: express.Response) => {
  try {
    res.status(200).json({ text: "hello world" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/", (req: express.Request, res: express.Response) => {
  try {
    if (req.header("Content-Type") !== "application/json") {
      throw new Error("Only application/json is allowed for Content-Type");
    }
    res.status(201).json(req.body);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
