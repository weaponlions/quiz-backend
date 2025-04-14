import { Router } from "express";
import { createExamBoard, getExamBoard, updateExamBoard } from "../controllers/examboardController";


const routes = Router();

routes.get("", getExamBoard);
routes.post("", createExamBoard);
routes.put("/:examId", updateExamBoard);

export default routes;