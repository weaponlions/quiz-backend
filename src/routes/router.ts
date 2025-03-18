import { Router } from "express"
import examRoutes from "./examboardRoutes";

const router = Router();

router.use("/examboard", examRoutes);


export default router;