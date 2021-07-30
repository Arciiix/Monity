import express from "express";

import userRouter from "./userRoutes";
import accountRouter from "./accountRoutes";

const router = express.Router();

router.use("/user", userRouter);
router.use("/account", accountRouter);

export default router;
