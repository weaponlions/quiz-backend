import { Router } from "express";
import { createExamBoard, getExamBoard } from "../controllers/examboardController";


const routes = Router();

routes.get("", getExamBoard);
routes.post("", createExamBoard);

export default routes;