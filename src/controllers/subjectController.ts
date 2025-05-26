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
      let query: { where: any } = { where: {} };
  
      if (!isObjectEmpty(req.query)) {
        const {
          subjectName,
          examId,
          active,
        }: { subjectName?: string; examId?: number; active?: string } =
          req.query as any;
  
        const queryArr: any[] = [];
  
        // Validate inputs
        const { error: nameError, value: subjectValue } = Joi.string().validate(subjectName);
        const { error: examError, value: examIdValue } = Joi.number().validate(examId);
        const { error: activeError, value: activeValue } = Joi.boolean().truthy("true").falsy("false").validate(active);
  
        if (nameError && subjectName) {
          res.status(StatusCode.BAD_REQUEST).json(
            jsonResponse<[]>({
              code: StatusCode.BAD_REQUEST,
              data: [],
              message: "Invalid query parameter: subjectName",
              other: nameError.details,
            })
          );
          return
        }
  
        if (examError && examId) {
          res.status(StatusCode.BAD_REQUEST).json(
            jsonResponse<[]>({
              code: StatusCode.BAD_REQUEST,
              data: [],
              message: "Invalid query parameter: examId",
              other: examError.details,
            })
          );
          return
        }
  
        if (activeError && active !== undefined) {
          res.status(StatusCode.BAD_REQUEST).json(
            jsonResponse<[]>({
              code: StatusCode.BAD_REQUEST,
              data: [],
              message: "Invalid query parameter: active",
              other: activeError.details,
            })
          );
          return
        }
  
        if (!nameError && subjectName) {
          queryArr.push({
            subjectName: {
              contains: subjectValue,
              mode: "insensitive", // optional: makes it case-insensitive
            },
          });
        }
  
        if (!examError && examId) {
          queryArr.push({
            examId: examIdValue,
          });
        }
  
        if (!activeError && active !== undefined) {
          queryArr.push({
            active: activeValue,
          });
        }
  
        // Combine all conditions
        if (queryArr.length > 0) {
          query.where = {
            ...queryArr.reduce((acc, item) => ({ ...acc, ...item }), {}),
          };
        }
      }
  
      const subjects = await prisma.examSubject.findMany(query);
  
      res.status(StatusCode.OK).json(
        jsonResponse<Subject[]>({
          code: StatusCode.OK,
          data: subjects,
          message: "Subject list",
        })
      );
    } catch (error) {
      console.error("Unexpected error in getSubject:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
        jsonResponse<[]>({
          code: StatusCode.INTERNAL_SERVER_ERROR,
          data: [],
          message: "An unexpected error occurred.",
        })
      );
    }
    return
  };
  
