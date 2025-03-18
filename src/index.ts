import { loggerMiddleware } from './middlewares/logger';
import express from "express";
import router from "./routes/router";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
const server = express();
server.use(express.json({ limit: "2mb" }))
server.use(express.urlencoded({ limit: "2mb", extended: true }))
const PORT: number = (process.env.PORT ? parseInt(process.env.PORT) : 1100);

server.use("/api", loggerMiddleware, router)

console.log("Server is starting...")


server.listen(PORT, async (err) => {
    if (err) {
        console.log(`Server initialize : ${err.message}`);
        await prisma.$disconnect();
        process.exit(1);        
    }
    
    console.log(`Server runing on port : ${PORT}`);
})