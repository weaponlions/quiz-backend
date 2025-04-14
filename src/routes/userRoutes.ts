import { createUser, getUser } from "../controllers/userController";
import { Router } from "express";

const router: Router = Router();

router.post("", createUser);
router.get("", getUser);

export default router;