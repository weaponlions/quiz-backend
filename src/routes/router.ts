import { Router } from "express"
import examRoutes from "./examboardRoutes";
import subjectRoutes from "./subjectRoutes";
import topicRoutes from "./topicRoutes";
import roundRoutes from "./roundRoutes";
import questionRoutes from "./questionRoutes";

const router = Router();

router.use("/examboard", examRoutes);
router.use("/subject", subjectRoutes);
router.use("/topic", topicRoutes);
router.use("/round", roundRoutes);
router.use("/question", questionRoutes);


export default router;