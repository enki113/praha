import express, { Request, Response } from "express";
const app = express();
const router = express.Router();

app.get("*", (_req: Request, res: Response) => {});

router.post("/", (_req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "success" });
  } catch {
    res.status(400).json({ message: "error" });
  }
});

export default router;
