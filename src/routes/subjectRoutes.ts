import { createSubject, getSubject } from "../controllers/subjectController"; 
import { Router } from "express"; 


const routes = Router();

routes.get("", getSubject);
routes.post("", createSubject);

export default routes;