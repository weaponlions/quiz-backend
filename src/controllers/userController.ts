import { PrismaClient, userTypeEnum } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCode, User } from "../types";
import Joi from "joi";
import { userSchema } from "../validators/schemaValidator";
import { isObjectEmpty, jsonResponse } from "../helpers";

export const createUser = async (req: Request, res: Response) => {
    try {
        const prisma = new PrismaClient();

        const joiResult: Joi.ValidationResult<User> = userSchema.validate(req.body, { abortEarly: false });
        if (joiResult.error) {

            res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({ code: StatusCode.BAD_REQUEST, data: [], message: joiResult.error.details }))
            return
        }

        await prisma.user.create({
            data: {
                id: joiResult.value.id,
                username: joiResult.value.username,
                password: joiResult.value.password,
                userType: joiResult.value.userType             
            }
        }).then((value) => {
            res.status(StatusCode.CREATED).json(jsonResponse<User[]>({ code: StatusCode.CREATED, data: [value], message: "User created successfully" }))
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


export const getUser = async (req: Request, res: Response) => {
    try {
        const prisma = new PrismaClient();
        let query: { where: Object | undefined } = { where: undefined };

        if (isObjectEmpty(req.query) === false) {
            const { userType, username }: { userType: userTypeEnum, username: string } = req.query as unknown as { userType: userTypeEnum, username: string };

            const queryArr: Object[] = []
            const { error, value: userTypeValue } = Joi.string().valid(...Object.values(userTypeEnum)).validate(userType);
            const { error: e2, value: usernameValue } = Joi.string().validate(username);
            if (error && userTypeValue) {
                res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({ code: StatusCode.BAD_REQUEST, data: [], message: "Invalid userType query parameters values.", other: error.details }))
                return;
            }
            if (e2 && usernameValue) {
                res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({ code: StatusCode.BAD_REQUEST, data: [], message: "Invalid username query parameters values.", other: e2.details }))
                return;
            }
            if (!error && userTypeValue) {
                queryArr.push({
                    userType: {
                        equals: userTypeValue
                    }
                })
            }
            if (!e2 && usernameValue) {
                if (queryArr.length > 0) {
                    queryArr.push({
                        AND: [{
                            username: {
                                equals: usernameValue
                            }
                        }]
                    })
                }
                else {
                    queryArr.push({
                        username: {
                            equals: usernameValue
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
        
        await prisma.user.findMany(typeof query.where !== "undefined" ? query as Object : {})
            .then((value) => {
                res.status(StatusCode.OK).json(jsonResponse<User[]>({ code: StatusCode.OK, data: value, message: "User list" }))

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
