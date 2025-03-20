import { Router } from "express"
import examRoutes from "./examboardRoutes";
import subjectRoutes from "./subjectRoutes";
import topicRoutes from "./topicRoutes";

const router = Router();

router.use("/examboard", examRoutes);
router.use("/subject", subjectRoutes);
router.use("/topic", topicRoutes);


export default router;