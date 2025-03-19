import { Request, Response } from "express";
import { subjectSchema } from "../validators/schemaValidator";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import { StatusCode, Subject } from "../types";
import { isObjectEmpty, jsonResponse } from "../helpers";

export const createSubject = async (req: Request, res: Response) => {
    try {
        const prisma = new PrismaClient();
    
        const joiResult: Joi.ValidationResult<Subject> = subjectSchema.validate(req.body, { abortEarly: false });
        if (joiResult.error) { 
            
            res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({code: StatusCode.BAD_REQUEST, data: [], message: joiResult.error.details}))
            return
        }

        await prisma.subject.create({
            data: {
                subjectName: joiResult.value.subjectName,
                exam: {connect: {id: Number(joiResult.value.examId)}},
                active: Boolean(joiResult.value.active)
            }
        }).then((value) => {
            res.status(StatusCode.CREATED).json(jsonResponse<Subject[]>({code: StatusCode.CREATED, data: [value], message: "Subject created successfully"}))
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


export const getSubject = async (req: Request, res: Response) => {
    try {
        const prisma = new PrismaClient();
        let query: undefined | Object = undefined;
        
        if (isObjectEmpty(req.query) === false) {
            const { type, value, examId }: {type: "subject", value: string, examId: Number} = req.query as unknown as {type: "subject", value: string, examId: Number};

            if (type && value) {
                const { error, value } = Joi.string().validate(req.query.value);
                // const { error2, examIdValue } = Joi.string().validate(req.query.value);
                if (error || ((req.query.type !== "subject") && (!examId))) {
                    res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({code: StatusCode.BAD_REQUEST, data: [], message: "Invalid query parameters values."}))
                    return;
                }
                if (type === "subject") {
                    query = {
                        where: {
                            subjectName: {
                                contains: value
                            }
                        }
                    }
                }
                if (examId) {
                    query = {
                        where: {
                            subjectName: {
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

        await prisma.subject.findMany(typeof query === "undefined" ? {} : query)
        .then((value) => {
            res.status(StatusCode.OK).json(jsonResponse<Subject[]>({code: StatusCode.OK, data: value, message: "Subject list"}))
        
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