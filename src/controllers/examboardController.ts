import { Request, Response } from "express";
import { examBoardSchema } from "../validators/schemaValidator";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import { ExamBoard, StatusCode } from "../types";
import { jsonResponse } from "../helpers";

export const createExamBoard = async (req: Request, res: Response) => {
    try {
        const prisma = new PrismaClient();
    
        const joiResult: Joi.ValidationResult<ExamBoard> = examBoardSchema.validate(req.body, { abortEarly: false });
        if (joiResult.error) { 
            
            res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({code: StatusCode.BAD_REQUEST, data: [], message: joiResult.error.details}))
            return
        }

        await prisma.examBoard.create({
            data: {
                examBoardName: joiResult.value.examBoardName,
                examName: joiResult.value.examName,
                examBoardType: joiResult.value.examBoardType
            }
        }).then((value) => {
            res.status(StatusCode.CREATED).json(jsonResponse<ExamBoard[]>({code: StatusCode.CREATED, data: [value], message: "Record created successfull"}))
        })
        .catch((err) => {
            res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({code: StatusCode.BAD_REQUEST, data: [], message: err}))
        })

    } catch (error) {
        if (error instanceof Error) {


        } else {
            console.log("An unexpected error occurred.");
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(jsonResponse<[]>({code: StatusCode.INTERNAL_SERVER_ERROR, data: [], message: "An unexpected error occurred."}))
        }
    }
}   