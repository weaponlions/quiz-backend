import { Router } from "express"
import examRoutes from "./examboardRoutes";
import subjectRoutes from "./subjectRoutes";

const router = Router();

router.use("/examboard", examRoutes);
router.use("/subject", subjectRoutes);


export default router;