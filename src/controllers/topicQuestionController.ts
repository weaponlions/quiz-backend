import { Request, Response } from "express";
import { topicQuestionSchema } from "../validators/schemaValidator";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import { StatusCode, TopicQuestion } from "../types";
import mammoth from "mammoth";
import { isObjectEmpty, jsonResponse } from "../helpers";

export const createTopicQuestion = async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient();

    const joiResult: Joi.ValidationResult<TopicQuestion> =
      topicQuestionSchema.validate(req.body, { abortEarly: false });
    if (joiResult.error) {
      res.status(StatusCode.BAD_REQUEST).json(
        jsonResponse<[]>({
          code: StatusCode.BAD_REQUEST,
          data: [],
          message: joiResult.error.details,
        })
      );
      return;
    }

    await prisma.topicQuestion
      .create({
        data: {
          questionText: joiResult.value.questionText,
          questionTitle: joiResult.value.questionTitle,
          answerA: joiResult.value.answerA,
          answerB: joiResult.value.answerB,
          answerC: joiResult.value.answerC,
          answerD: joiResult.value.answerD,
          answerCorrect: joiResult.value.answerCorrect,
          questionYear: joiResult.value.questionYear,
          ...(joiResult.value.topicId !== null && {
            topic: { connect: { id: Number(joiResult.value.topicId) } },
          }),
          ...(joiResult.value.roundId !== null && {
            round: { connect: { id: Number(joiResult.value.roundId) } },
          }),
          active: Boolean(joiResult.value.active),
        },
      })
      .then((value) => {
        res.status(StatusCode.CREATED).json(
          jsonResponse<TopicQuestion[]>({
            code: StatusCode.CREATED,
            data: [value],
            message: "Question created successfully",
          })
        );
      })
      .catch((err) => {
        res.status(StatusCode.BAD_REQUEST).json(
          jsonResponse<[]>({
            code: StatusCode.BAD_REQUEST,
            data: [],
            message: err,
          })
        );
      });
  } catch (error) {
    console.log("Unexpected error:", error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
      jsonResponse<[]>({
        code: StatusCode.INTERNAL_SERVER_ERROR,
        data: [],
        message: "An unexpected error occurred.",
      })
    );
  }
};

export const createBulkTopicQuestions = async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient();

    if (!Array.isArray(req.body)) {
      res.status(StatusCode.BAD_REQUEST).json(
        jsonResponse({
          code: StatusCode.BAD_REQUEST,
          data: [],
          message: `"value" must be an array of questions.`,
        })
      );
      return
    }

    const validationResults = req.body.map((q: any) =>
      topicQuestionSchema.validate(q, { abortEarly: false })
    );

    const errors = validationResults
      .map((result, index) =>
        result.error ? { index, error: result.error.details } : null
      )
      .filter(Boolean);

    if (errors.length > 0) {
      res.status(StatusCode.BAD_REQUEST).json(
        jsonResponse({
          code: StatusCode.BAD_REQUEST,
          data: [],
          message: errors.filter((error) => error !== null),
        })
      );
      return
    }

    const preparedData = validationResults.map((result) => {
      const q = result.value;
      return {
        questionText: q.questionText,
        questionTitle: q.questionTitle || "",
        answerA: q.answerA,
        answerB: q.answerB,
        answerC: q.answerC,
        answerD: q.answerD,
        answerCorrect: q.answerCorrect,
        questionYear: q.questionYear,
        topicId: Number(q.topicId),
        roundId: Number(q.roundId),
        active: Boolean(q.active),
      };
    });

    const insertedQuestions = [];

    for (const q of preparedData) {
      try {
        const created = await prisma.topicQuestion.create({ data: q });
        insertedQuestions.push(created);
      } catch (err: any) {
        // Skip duplicates (Prisma unique constraint violation)
        if (err.code === "P2002") {
          // Duplicate entry; skip
        } else {
          console.error("Insert error:", err);
          throw err;
        }
      }
    }

    res.status(StatusCode.CREATED).json(
      jsonResponse({
        code: StatusCode.CREATED,
        data: insertedQuestions,
        message: `${insertedQuestions.length} questions inserted successfully.`,
      })
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
      jsonResponse({
        code: StatusCode.INTERNAL_SERVER_ERROR,
        data: [],
        message: "An unexpected error occurred.",
      })
    );
  }
  return
};




export const updateTopicQuestionById = async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient();
    const questionId = Number(req.params.id);

    if (isNaN(questionId)) {
      res.status(StatusCode.BAD_REQUEST).json(
        jsonResponse({
          code: StatusCode.BAD_REQUEST,
          data: [],
          message: `"id" must be a valid number.`,
        })
      );
      return
    }

    const { error, value } = topicQuestionSchema.validate(req.body, { abortEarly: false });

    if (error) {
      res.status(StatusCode.BAD_REQUEST).json(
        jsonResponse({
          code: StatusCode.BAD_REQUEST,
          data: [],
          message: error.details,
        })
      );
      return
    }

    const updatedQuestion = await prisma.topicQuestion.update({
      where: { id: questionId },
      data: {
        questionText: value.questionText,
        questionTitle: value.questionTitle || "",
        answerA: value.answerA,
        answerB: value.answerB,
        answerC: value.answerC,
        answerD: value.answerD,
        answerCorrect: value.answerCorrect,
        questionYear: value.questionYear,
        topicId: Number(value.topicId),
        roundId: Number(value.roundId),
        active: Boolean(value.active),
      },
    });

    res.status(StatusCode.OK).json(
      jsonResponse({
        code: StatusCode.OK,
        data: [updatedQuestion], // Send as an array
        message: `Question updated successfully.`,
      })
    );
  } catch (error: any) {
    console.error("Update error:", error);

    if (error.code === "P2025") {
      res.status(StatusCode.NOT_FOUND).json(
        jsonResponse({
          code: StatusCode.NOT_FOUND,
          data: [],
          message: "Question not found.",
        })
      );
      return
    }

    res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
      jsonResponse({
        code: StatusCode.INTERNAL_SERVER_ERROR,
        data: [],
        message: "An unexpected error occurred.",
      })
    );
  }
  return
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
        search,
      }: {
        topicId?: number;
        roundId?: number;
        questionYear?: string;
        search?: string;
      } = req.query as any;

      const queryArr: Object[] = [];

      const { error: tErr, value: topicIdValue } =
        Joi.number().validate(topicId);
      const { error: rErr, value: roundIdValue } =
        Joi.number().validate(roundId);
      const { error: yErr, value: yearValue } = Joi.string()
        .length(4)
        .validate(questionYear);
      const { error: sErr, value: searchValue } = Joi.string().validate(search);

      if (
        (topicId && tErr) ||
        (roundId && rErr) ||
        (questionYear && yErr) ||
        (search && sErr)
      ) {
        res.status(StatusCode.BAD_REQUEST).json(
          jsonResponse<[]>({
            code: StatusCode.BAD_REQUEST,
            data: [],
            message: "Invalid query parameter values.",
          })
        );
        return;
      }

      if (topicId) queryArr.push({ topicId: topicIdValue });
      if (roundId) queryArr.push({ roundId: roundIdValue });
      if (questionYear) queryArr.push({ questionYear: yearValue });
      if (search) {
        queryArr.push({
          questionTitle: {
            contains: searchValue,
          },
        });
      }

      if (queryArr.length > 0) {
        queryArr.forEach((v) => {
          query = {
            where: {
              ...(query.where ? query.where : {}),
              ...v,
            },
          };
        });
      }
    }

    await prisma.topicQuestion
      .findMany(typeof query.where !== "undefined" ? (query as Object) : {})
      .then((value) => {
        res.status(StatusCode.OK).json(
          jsonResponse<TopicQuestion[]>({
            code: StatusCode.OK,
            data: value,
            message: "Questions fetched successfully",
          })
        );
      })
      .catch((err) => {
        res.status(StatusCode.BAD_REQUEST).json(
          jsonResponse<[]>({
            code: StatusCode.BAD_REQUEST,
            data: [],
            message: err,
          })
        );
      });
  } catch (error) {
    console.log("Unexpected error:", error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
      jsonResponse<[]>({
        code: StatusCode.INTERNAL_SERVER_ERROR,
        data: [],
        message: "An unexpected error occurred.",
      })
    );
  }
};

export const updateTopicQuestion = async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient();

    const id = Number(req.params.id);
    const { error: idError } = Joi.number().required().validate(id);
    if (idError) {
      res.status(StatusCode.BAD_REQUEST).json(
        jsonResponse<[]>({
          code: StatusCode.BAD_REQUEST,
          data: [],
          message: "Invalid ID parameter",
        })
      );
      return;
    }

    const joiResult = topicQuestionSchema.validate(req.body, {
      abortEarly: false,
    });
    if (joiResult.error) {
      res.status(StatusCode.BAD_REQUEST).json(
        jsonResponse<[]>({
          code: StatusCode.BAD_REQUEST,
          data: [],
          message: joiResult.error.details,
        })
      );
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
        ...(typeof joiResult.value.topicId === 'number' && {
          topic: {
            connect: { id: joiResult.value.topicId },
          },
        }),
        ...(typeof joiResult.value.roundId === 'number' && {
          round: {
            connect: { id: joiResult.value.roundId },
          },
        }),
        active: joiResult.value.active
      },
    });

    res.status(StatusCode.OK).json(
      jsonResponse<TopicQuestion[]>({
        code: StatusCode.OK,
        data: [updated],
        message: "Question updated successfully",
      })
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
      jsonResponse<[]>({
        code: StatusCode.INTERNAL_SERVER_ERROR,
        data: [],
        message: "An unexpected error occurred.",
      })
    );
  }
};

export const deleteTopicQuestion = async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient();
    const id = Number(req.params.id);

    const { error: idError } = Joi.number().required().validate(id);
    if (idError) {
      res.status(StatusCode.BAD_REQUEST).json(
        jsonResponse<[]>({
          code: StatusCode.BAD_REQUEST,
          data: [],
          message: "Invalid ID parameter",
        })
      );
      return;
    }

    await prisma.topicQuestion.delete({
      where: { id },
    });

    res.status(StatusCode.OK).json(
      jsonResponse<[]>({
        code: StatusCode.OK,
        data: [],
        message: "Question deleted successfully",
      })
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
      jsonResponse<[]>({
        code: StatusCode.INTERNAL_SERVER_ERROR,
        data: [],
        message: "An unexpected error occurred.",
      })
    );
  }
};





// export const createTopicQuestionsFromDocx = async (req: Request, res: Response) => {
//   const prisma = new PrismaClient();

//   try {
//     if (!req.file) {
//       return res.status(StatusCode.BAD_REQUEST).json(
//         jsonResponse({
//           code: StatusCode.BAD_REQUEST,
//           data: [],
//           message: "No .docx file uploaded.",
//         })
//       );
//     }

//     const result = await mammoth.extractRawText({ path: req.file.path });
//     const lines = result.value.split("\n").map((l) => l.trim()).filter(Boolean);

//     const questions: any[] = [];
//     let current: any = {
//       questionTitle: "",
//       questionText: "",
//       answerA: "",
//       answerB: "",
//       answerC: "",
//       answerD: "",
//       answerCorrect: "",
//       questionYear: new Date().getFullYear(),
//       topicId: Number(req.body.topicId) || 1,
//       roundId: Number(req.body.roundId) || 1,
//       active: true,
//     };

//     for (const line of lines) {
//       if (/^\d+\./.test(line)) {
//         if (current.questionText) questions.push({ ...current });
//         current = {
//           questionTitle: "",
//           questionText: line,
//           answerA: "",
//           answerB: "",
//           answerC: "",
//           answerD: "",
//           answerCorrect: "",
//           questionYear: new Date().getFullYear(),
//           topicId: Number(req.body.topicId) || 1,
//           roundId: Number(req.body.roundId) || 1,
//           active: true,
//         };
//       } else if (/^A[\.\)]/i.test(line)) {
//         current.answerA = line;
//       } else if (/^B[\.\)]/i.test(line)) {
//         current.answerB = line;
//       } else if (/^C[\.\)]/i.test(line)) {
//         current.answerC = line;
//       } else if (/^D[\.\)]/i.test(line)) {
//         current.answerD = line;
//       } else if (/^Answer[:：]/i.test(line)) {
//         current.answerCorrect = line.split(/[:：]/)[1].trim();
//       } else {
//         current.questionTitle += line + " ";
//       }
//     }

//     if (current.questionText) questions.push({ ...current });

//     // Validate
//     const validationResults = questions.map((q) =>
//       topicQuestionSchema.validate(q, { abortEarly: false })
//     );

//     const errors = validationResults
//       .map((r, i) => (r.error ? { index: i, error: r.error.details } : null))
//       .filter(Boolean);

//     if (errors.length > 0) {
//       return res.status(StatusCode.BAD_REQUEST).json(
//         jsonResponse({
//           code: StatusCode.BAD_REQUEST,
//           data: [],
//           message: errors,
//         })
//       );
//     }

//     // Prepare for DB
//     const prepared = validationResults.map((r) => {
//       const q = r.value;
//       return {
//         questionText: q.questionText,
//         questionTitle: q.questionTitle || "",
//         answerA: q.answerA,
//         answerB: q.answerB,
//         answerC: q.answerC,
//         answerD: q.answerD,
//         answerCorrect: q.answerCorrect,
//         questionYear: q.questionYear,
//         topicId: Number(q.topicId),
//         roundId: Number(q.roundId),
//         active: Boolean(q.active),
//       };
//     });

//     const inserted = [];

//     for (const q of prepared) {
//       try {
//         const created = await prisma.topicQuestion.create({ data: q });
//         inserted.push(created);
//       } catch (err: any) {
//         if (err.code === "P2002") {
//           // skip duplicate
//         } else {
//           console.error("DB insert error", err);
//           throw err;
//         }
//       }
//     }

//     return res.status(StatusCode.CREATED).json(
//       jsonResponse({
//         code: StatusCode.CREATED,
//         data: inserted,
//         message: `${inserted.length} questions inserted.`,
//       })
//     );
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
//       jsonResponse({
//         code: StatusCode.INTERNAL_SERVER_ERROR,
//         data: [],
//         message: "Error processing .docx upload.",
//       })
//     );
//   }
// };




export const createTopicQuestionsFromDocx = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();

  try {
    if (!req.file) {
      return res.status(StatusCode.BAD_REQUEST).json(
        jsonResponse({
          code: StatusCode.BAD_REQUEST,
          data: [],
          message: "No .docx file uploaded.",
        })
      );
    }

    const result = await mammoth.extractRawText({ path: req.file.path });
    const lines = result.value.split("\n").map((l) => l.trim()).filter(Boolean);

    const questions: any[] = [];
    let current: any = {
      questionTitle: "",
      questionText: "",
      answerA: "",
      answerB: "",
      answerC: "",
      answerD: "",
      answerCorrect: "",
      questionYear: String(new Date().getFullYear()),
      topicId: req.body.topicId ? Number(req.body.topicId) : null,
      roundId: req.body.roundId ? Number(req.body.roundId) : undefined,
      active: true,
    };

    for (const line of lines) {
      if (/^\d+\./.test(line)) {
        if (current.questionText) questions.push({ ...current });
        current = {
          questionTitle: "",
          questionText: line,
          answerA: "",
          answerB: "",
          answerC: "",
          answerD: "",
          answerCorrect: "",
          questionYear: String(new Date().getFullYear()),
          topicId: req.body.topicId ? Number(req.body.topicId) : null,
          roundId: req.body.roundId ? Number(req.body.roundId) : undefined,
          active: true,
        };
      } else if (/^A[\.\)]/i.test(line)) {
        current.answerA = line.replace(/^A[\.\)]\s*/, "");
      } else if (/^B[\.\)]/i.test(line)) {
        current.answerB = line.replace(/^B[\.\)]\s*/, "");
      } else if (/^C[\.\)]/i.test(line)) {
        current.answerC = line.replace(/^C[\.\)]\s*/, "");
      } else if (/^D[\.\)]/i.test(line)) {
        current.answerD = line.replace(/^D[\.\)]\s*/, "");
      } else if (/^Answer[:：]/i.test(line)) {
        current.answerCorrect = line.split(/[:：]/)[1].trim().toUpperCase();
      } else {
        current.questionTitle += line + " ";
      }
    }

    if (current.questionText) questions.push({ ...current });

    // Joi Validation
    const validationResults = questions.map((q) =>
      topicQuestionSchema.validate(q, { abortEarly: false })
    );

    const errors = validationResults
      .map((r, i) => (r.error ? { index: i + 1, error: r.error.details } : null))
      .filter(Boolean);

    if (errors.length > 0) {
      return res.status(StatusCode.BAD_REQUEST).json(
        jsonResponse({
          code: StatusCode.BAD_REQUEST,
          data: [],
          message: errors,
        })
      );
    }

    // Prepare final data for DB
    const prepared = validationResults.map((r) => r.value);

    const inserted = [];

    for (const q of prepared) {
      try {
        const created = await prisma.topicQuestion.create({ data: q });
        inserted.push(created);
      } catch (err: any) {
        if (err.code === "P2002") {
          // Skip duplicates
          continue;
        } else {
          console.error("DB insert error:", err);
        }
      }
    }

    return res.status(StatusCode.CREATED).json(
      jsonResponse({
        code: StatusCode.CREATED,
        data: inserted,
        message: `${inserted.length} questions inserted.`,
      })
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
      jsonResponse({
        code: StatusCode.INTERNAL_SERVER_ERROR,
        data: [],
        message: "Error processing .docx upload.",
      })
    );
  }
};
