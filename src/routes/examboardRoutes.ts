import { Router } from "express";
import { createExamBoard } from "../controllers/examboardController";


const routes = Router();

routes.post("", createExamBoard);

export default routes;