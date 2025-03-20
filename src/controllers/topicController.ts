import { Request, Response } from "express";
import { topicSchema } from "../validators/schemaValidator";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import { StatusCode, Topic } from "../types";
import { isObjectEmpty, jsonResponse } from "../helpers";

export const createTopic = async (req: Request, res: Response) => {
    try {
        const prisma = new PrismaClient();

        const joiResult: Joi.ValidationResult<Topic> = topicSchema.validate(req.body, { abortEarly: false });
        if (joiResult.error) {

            res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({ code: StatusCode.BAD_REQUEST, data: [], message: joiResult.error.details }))
            return
        }

        await prisma.topic.create({
            data: {
                topicName: joiResult.value.topicName,
                subject: { connect: { id: Number(joiResult.value.subjectId) } },
                active: Boolean(joiResult.value.active)
            }
        }).then((value) => {
            res.status(StatusCode.CREATED).json(jsonResponse<Topic[]>({ code: StatusCode.CREATED, data: [value], message: "Topic created successfully" }))
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


export const getTopic = async (req: Request, res: Response) => {
    try {
        const prisma = new PrismaClient();
        let query: { where: Object | undefined } = { where: undefined };

        if (isObjectEmpty(req.query) === false) {
            const { search, subjectId }: { search: string | undefined, subjectId: Number | undefined } = req.query as unknown as { search: string | undefined, subjectId: Number | undefined };

            const queryArr: Object[] = []

            const { error, value: searchValue } = Joi.string().validate(search);
            const { error: e2, value: subjectIdValue } = Joi.number().validate(subjectId);
            if (search && error) {
                res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({ code: StatusCode.BAD_REQUEST, data: [], message: "Invalid query parameters values." }))
                return;
            }
            if (subjectId && e2) {
                res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({ code: StatusCode.BAD_REQUEST, data: [], message: "Invalid query parameters values2." }))
                return;
            }
            if (search) {
                queryArr.push({
                    topicName: {
                        contains: searchValue
                    },
                })
            }
            if (subjectId) {
                queryArr.push({
                    subjectId: subjectIdValue
                })
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
        console.log(query)
        console.log(typeof query.where !== "undefined" ? query : {})
        await prisma.topic.findMany(typeof query.where !== "undefined" ? query as Object : {})
            .then((value) => {
                res.status(StatusCode.OK).json(jsonResponse<Topic[]>({ code: StatusCode.OK, data: value, message: "Topic list" }))

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

