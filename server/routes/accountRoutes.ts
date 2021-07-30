import express from "express";
import requireLogin from "../middlewares/requireLogin";
import { getAllAccounts } from "../services/Account";

const router = express.Router();

//Those endpoints require users to be logged, so check if they are, and if so, store user data in req.userData. Otherwise return an error message.
router.use(requireLogin);

router.get("/getSimplifiedAccounts", async (req: any, res) => {
  let accounts = await getAllAccounts(req.userData.id);
  if (accounts.error) {
    res.status(400);
  }
  res.send(accounts);
});
export default router;
