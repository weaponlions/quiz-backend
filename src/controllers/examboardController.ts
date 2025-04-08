import { Request, Response } from "express";
import { examBoardSchema } from "../validators/schemaValidator";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import { ExamBoard, StatusCode } from "../types";
import { isObjectEmpty, jsonResponse } from "../helpers";

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
                examBoardLongName: joiResult.value.examBoardLongName,
                examBoardShortName: joiResult.value.examBoardShortName,
                boardLogo: joiResult.value.boardLogo,
                examLogo: joiResult.value.examLogo,
                examName: joiResult.value.examName,
                examBoardType: joiResult.value.examBoardType,
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


export const getExamBoard = async (req: Request, res: Response) => {
    try {
        const prisma = new PrismaClient();
        let query: undefined | Object = undefined;
        
        if (isObjectEmpty(req.query) === false) {
            if (req.query.type && req.query.value) {
                const { error, value } = Joi.string().validate(req.query.value);
                if (error || (["board", "exam"].includes(req.query.type as string)) === false) {
                    res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({code: StatusCode.BAD_REQUEST, data: [], message: "Invalid query parameters values."}))
                    return;
                }
                if (req.query.type === "board") {
                    query = {
                        where: {
                            examBoardName: {
                                contains: value
                            }
                        }
                    }
                }
                else if (req.query.type === "exam") {
                    query = {
                        where: {
                            examName: {
                                contains: value
                            }
                        }
                    }
                }
            }
            else {
                res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({code: StatusCode.BAD_REQUEST, data: [], message: "Invalid query parameters"}))
                return;
            }
        }

        await prisma.examBoard.findMany(typeof query === "undefined" ? {} : query)
        .then((value) => {
            res.status(StatusCode.OK).json(jsonResponse<ExamBoard[]>({code: StatusCode.OK, data: value, message: "Record list"}))
        
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