import { Request, Response } from "express";
import { topicQuestionSchema } from "../validators/schemaValidator";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import { StatusCode, TopicQuestion } from "../types";
import { isObjectEmpty, jsonResponse } from "../helpers";

export const createTopicQuestion = async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient();

    const joiResult: Joi.ValidationResult<TopicQuestion> = topicQuestionSchema.validate(req.body, { abortEarly: false });
    if (joiResult.error) {
      res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({
        code: StatusCode.BAD_REQUEST,
        data: [],
        message: joiResult.error.details
      }));
      return;
    }

    await prisma.topicQuestion.create({
      data: {
        questionText: joiResult.value.questionText,
        questionTitle: joiResult.value.questionTitle,
        answerA: joiResult.value.answerA,
        answerB: joiResult.value.answerB,
        answerC: joiResult.value.answerC,
        answerD: joiResult.value.answerD,
        answerCorrect: joiResult.value.answerCorrect,
        questionYear: joiResult.value.questionYear,
        ...(joiResult.value.topicId !== null && {topic: { connect: { id: Number(joiResult.value.topicId) } }}),
        ...(joiResult.value.roundId !== null && {round: { connect: { id: Number(joiResult.value.roundId) } }}),
        active: Boolean(joiResult.value.active),
      }
    }).then((value) => {
      res.status(StatusCode.CREATED).json(jsonResponse<TopicQuestion[]>({
        code: StatusCode.CREATED,
        data: [value],
        message: "Question created successfully"
      }));
    }).catch((err) => {
      res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({
        code: StatusCode.BAD_REQUEST,
        data: [],
        message: err
      }));
    });

  } catch (error) {
    console.log("Unexpected error:", error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json(jsonResponse<[]>({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      data: [],
      message: "An unexpected error occurred."
    }));
  }
};


export const getTopicQuestion = async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient();
    let query: { where: Object | undefined } = { where: undefined };

    if (!isObjectEmpty(req.query)) {
      const {
        topicId,
        roundId,
        questionYear,
        search
      }: {
        topicId?: number;
        roundId?: number;
        questionYear?: string;
        search?: string;
      } = req.query as any;

      const queryArr: Object[] = [];

      const { error: tErr, value: topicIdValue } = Joi.number().validate(topicId);
      const { error: rErr, value: roundIdValue } = Joi.number().validate(roundId);
      const { error: yErr, value: yearValue } = Joi.string().length(4).validate(questionYear);
      const { error: sErr, value: searchValue } = Joi.string().validate(search);

      if ((topicId && tErr) || (roundId && rErr) || (questionYear && yErr) || (search && sErr)) {
        res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({
          code: StatusCode.BAD_REQUEST,
          data: [],
          message: "Invalid query parameter values."
        }));
        return;
      }

      if (topicId) queryArr.push({ topicId: topicIdValue });
      if (roundId) queryArr.push({ roundId: roundIdValue });
      if (questionYear) queryArr.push({ questionYear: yearValue });
      if (search) {
        queryArr.push({
          questionTitle: {
            contains: searchValue
          }
        });
      }

      if (queryArr.length > 0) {
        queryArr.forEach((v) => {
          query = {
            where: {
              ...((query.where) ? query.where : {}),
              ...v
            }
          };
        });
      }
    }

    await prisma.topicQuestion.findMany(typeof query.where !== "undefined" ? query as Object : {})
      .then((value) => {
        res.status(StatusCode.OK).json(jsonResponse<TopicQuestion[]>({
          code: StatusCode.OK,
          data: value,
          message: "Questions fetched successfully"
        }));
      })
      .catch((err) => {
        res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({
          code: StatusCode.BAD_REQUEST,
          data: [],
          message: err
        }));
      });

  } catch (error) {
    console.log("Unexpected error:", error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json(jsonResponse<[]>({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      data: [],
      message: "An unexpected error occurred."
    }));
  }
};


export const updateTopicQuestion = async (req: Request, res: Response) => {
    try {
      const prisma = new PrismaClient();
  
      const id = Number(req.params.id);
      const { error: idError } = Joi.number().required().validate(id);
      if (idError) {
        res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({
          code: StatusCode.BAD_REQUEST,
          data: [],
          message: "Invalid ID parameter"
        }));
        return;
      }
  
      const joiResult = topicQuestionSchema.validate(req.body, { abortEarly: false });
      if (joiResult.error) {
        res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({
          code: StatusCode.BAD_REQUEST,
          data: [],
          message: joiResult.error.details
        }));
        return;
      }
  
      const updated = await prisma.topicQuestion.update({
        where: { id },
        data: {
          questionText: joiResult.value.questionText,
          questionTitle: joiResult.value.questionTitle,
          answerA: joiResult.value.answerA,
          answerB: joiResult.value.answerB,
          answerC: joiResult.value.answerC,
          answerD: joiResult.value.answerD,
          answerCorrect: joiResult.value.answerCorrect,
          questionYear: joiResult.value.questionYear,
          topic: { connect: { id: joiResult.value.topicId } },
          round: { connect: { id: joiResult.value.roundId } },
          active: joiResult.value.active
        }
      });
  
      res.status(StatusCode.OK).json(jsonResponse<TopicQuestion[]>({
        code: StatusCode.OK,
        data: [updated],
        message: "Question updated successfully"
      }));
  
    } catch (err) {
      console.error("Unexpected error:", err);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json(jsonResponse<[]>({
        code: StatusCode.INTERNAL_SERVER_ERROR,
        data: [],
        message: "An unexpected error occurred."
      }));
    }
  };

  
export const deleteTopicQuestion = async (req: Request, res: Response) => {
    try {
      const prisma = new PrismaClient();
      const id = Number(req.params.id);
  
      const { error: idError } = Joi.number().required().validate(id);
      if (idError) {
        res.status(StatusCode.BAD_REQUEST).json(jsonResponse<[]>({
          code: StatusCode.BAD_REQUEST,
          data: [],
          message: "Invalid ID parameter"
        }));
        return;
      }
  
      await prisma.topicQuestion.delete({
        where: { id }
      });
  
      res.status(StatusCode.OK).json(jsonResponse<[]>({
        code: StatusCode.OK,
        data: [],
        message: "Question deleted successfully"
      }));
  
    } catch (err) {
      console.error("Unexpected error:", err);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json(jsonResponse<[]>({
        code: StatusCode.INTERNAL_SERVER_ERROR,
        data: [],
        message: "An unexpected error occurred."
      }));
    }
  };