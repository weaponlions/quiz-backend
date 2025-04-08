import { createTopicQuestion, deleteTopicQuestion, getTopicQuestion, updateTopicQuestion } from "../controllers/topicQuestionController"; 
import { Router } from "express";  


const routes = Router();

routes.get("", getTopicQuestion);
routes.post("", createTopicQuestion);

export default routes;