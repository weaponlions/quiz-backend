import { createBulkTopicQuestions, createTopicQuestionsFromDocx, createTopicQuestion, deleteTopicQuestion, getTopicQuestion, updateTopicQuestion, updateTopicQuestionById } from "../controllers/topicQuestionController"
import { Router } from "express";  
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const routes = Router();

routes.get("", getTopicQuestion);
routes.post("", createTopicQuestion);
routes.post('/bulk', createBulkTopicQuestions);
routes.post('/docx', upload.single("docx"), createTopicQuestionsFromDocx);
routes.put("/:id", updateTopicQuestionById);

export default routes;