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

            res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({ code: StatusCode.BAD_REQUEST, data: [], message: joiResult.error.details }))
            return
        }

        await prisma.examSubject.create({
            data: {
                subjectName: joiResult.value.subjectName,
                exam: { connect: { id: Number(joiResult.value.examId) } },
                active: Boolean(joiResult.value.active),
                accessType: joiResult.value.accessType,
                owner: { connect: { id: Number(joiResult.value.ownerId) } }
            }
        }).then((value) => {
            res.status(StatusCode.CREATED).json(jsonResponse<Subject[]>({ code: StatusCode.CREATED, data: [value], message: "Subject created successfully" }))
        })
            .catch((err) => {
                res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({ code: StatusCode.BAD_REQUEST, data: [], message: err }))
            })

    } catch (error) {
        if (error instanceof Error) {


        } else {
            console.log("An unexpected error occurred.");
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(jsonResponse<[]>({ code: StatusCode.INTERNAL_SERVER_ERROR, data: [], message: "An unexpected error occurred." }))
        }
    }
}


export const updateSubject = async (req: Request<{ subjectId: number }>, res: Response) => {
    try {
        const prisma = new PrismaClient();
        const { subjectId }: { subjectId: number } = req.params;

        const joiResult: Joi.ValidationResult<Subject> = subjectSchema.validate(req.body, { abortEarly: false });
        if (joiResult.error) {

            res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({ code: StatusCode.BAD_REQUEST, data: [], message: joiResult.error.details }))
            return
        }
        const { error, value: subjectIdValue } = Joi.number().validate(subjectId);
        if (error && subjectIdValue) {
            res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({ code: StatusCode.BAD_REQUEST, data: [], message: "Invalid subjectId parameters values.", other: error.details }))
            return;
        }

        await prisma.examSubject.update({
            where: { id: subjectIdValue },
            data: {
                subjectName: joiResult.value.subjectName,
                exam: { connect: { id: Number(joiResult.value.examId) } },
                active: Boolean(joiResult.value.active),
                accessType: joiResult.value.accessType,
                owner: { connect: { id: Number(joiResult.value.ownerId) } }
            }
        }).then((value) => {
            res.status(StatusCode.CREATED).json(jsonResponse<Subject[]>({ code: StatusCode.CREATED, data: [value], message: "Subject update successfully" }))
        })
            .catch((err) => {
                res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({ code: StatusCode.BAD_REQUEST, data: [], message: err }))
            })

    } catch (error) {
        if (error instanceof Error) {


        } else {
            console.log("An unexpected error occurred.");
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(jsonResponse<[]>({ code: StatusCode.INTERNAL_SERVER_ERROR, data: [], message: "An unexpected error occurred." }))
        }
    }
}


export const getSubject = async (req: Request, res: Response) => {
    try {
        const prisma = new PrismaClient();
        let query: { where: Object | undefined } = { where: { active: true } };

        if (isObjectEmpty(req.query) === false) {
            const { subjectName, examId }: { subjectName: string, examId: number } = req.query as unknown as { subjectName: string, examId: number };

            const queryArr: Object[] = []

            const { error, value: subjectValue } = Joi.string().validate(subjectName);
            const { error: e2, value: examIdValue } = Joi.number().validate(examId);
            if (error && subjectName) {
                res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({ code: StatusCode.BAD_REQUEST, data: [], message: "Invalid query parameters values.", other: error.details }))
                return;
            }
            if (e2 && examId) {
                res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({ code: StatusCode.BAD_REQUEST, data: [], message: "Invalid query parameters values2.", other: e2.details }))
                return;
            }
            if (!error && subjectName) {
                queryArr.push({
                    subjectName: {
                        contains: subjectValue
                    },
                })
            }
            if (!e2 && examId) {
                if (queryArr.length > 0) {
                    queryArr.push({
                        OR: [{
                            examId: examIdValue
                        }]
                    })
                }
                else {
                    queryArr.push({
                        examId: {
                            equals: examIdValue
                        }
                    })
                }
            }
            if (queryArr.length > 0) {
                queryArr.forEach((v) => {
                    query = {
                        where: {
                            ...((query.where) ? query.where : {}),
                            ...v
                        }
                    }
                })
            }

        }

        await prisma.examSubject.findMany(typeof query.where !== "undefined" ? query as Object : { where: { active: true } })
            .then((value) => {
                res.status(StatusCode.OK).json(jsonResponse<Subject[]>({ code: StatusCode.OK, data: value, message: "Subject list" }))

            })
            .catch((err) => {
                res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({ code: StatusCode.BAD_REQUEST, data: [], message: err }))
            })

    } catch (error) {
        if (error instanceof Error) {


        } else {
            console.log("An unexpected error occurred.");
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(jsonResponse<[]>({ code: StatusCode.INTERNAL_SERVER_ERROR, data: [], message: "An unexpected error occurred." }))
        }
    }
}

