import { getTopic, createTopic} from "../controllers/topicController"; 
import { Router } from "express";  


const routes = Router();

routes.get("", getTopic);
routes.post("", createTopic);

export default routes;