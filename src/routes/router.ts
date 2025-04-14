import { Router } from "express"
import examRoutes from "./examboardRoutes";
import subjectRoutes from "./subjectRoutes";
import topicRoutes from "./topicRoutes";
import roundRoutes from "./roundRoutes";
import questionRoutes from "./questionRoutes";
import userRoutes from "./userRoutes";

const router = Router();

router.use("/examboard", examRoutes);
router.use("/subject", subjectRoutes);
router.use("/topic", topicRoutes);
router.use("/round", roundRoutes);
router.use("/question", questionRoutes);
router.use("/user", userRoutes);


export default router;