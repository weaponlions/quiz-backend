import Joi from "joi";
import { accessTypeEnum, examBoardTypeEnum, roundTypeEnum, userTypeEnum } from "@prisma/client";
import { AnsweredQuestion, AttemptedTest, ExamBoard, Round, Subject, TopicQuestion, User } from "../types";


export const updateUserRoleSchema = Joi.object({
    userType: Joi.string().valid("ADMIN", "CREATOR", "STUDENT").required(),
  });   

export const examBoardSchema = Joi.object<ExamBoard>({
    examBoardType: Joi.string().valid(examBoardTypeEnum.CENTRAL, examBoardTypeEnum.SPECIAL, examBoardTypeEnum.STATE).required(),
    examBoardLongName: Joi.string().required(),
    examBoardShortName: Joi.string().required(),
    examName: Joi.string().required(),
    boardLogo: Joi.string().default(""),
    examLogo: Joi.string().default(""),
    active: Joi.boolean().required()
});

export const subjectSchema = Joi.object<Subject>({ 
    examId: Joi.number().required(),
    ownerId: Joi.number().default(1),
    subjectName: Joi.string().required(),
    active: Joi.boolean().required(),
    accessType: Joi.string().valid(accessTypeEnum.PRIVATE, accessTypeEnum.PUBLIC).required()
});


export const topicSchema = Joi.object({ 
    subjectId: Joi.number().required(),
    topicName: Joi.string().required(),
    active: Joi.boolean().required(),
});


export const authSchema = Joi.object({
    username: Joi.string().min(3).max(255).required().label("Username"),
    password: Joi.string().min(6).max(255).required().label("Password"),
    userType: Joi.string()
      .valid(...Object.values(userTypeEnum))
      .default("STUDENT")
      .label("User Type"),
  });

  export const roundSchema = Joi.object<Round>({
    roundName: Joi.string().max(255).required(),
    sectionName: Joi.string().max(255).required(),
    roundType: Joi.string().valid(roundTypeEnum.MAIN, roundTypeEnum.PRELIMS).required(),
    examId: Joi.number().required(),
    ownerId: Joi.number().required(),
    accessType: Joi.string().valid(accessTypeEnum.PRIVATE, accessTypeEnum.PUBLIC).default('PRIVATE'),
    active: Joi.boolean().default(true)
  });
  

    export const topicQuestionSchema = Joi.object<TopicQuestion>({
      questionText: Joi.string().min(5).required(),
      questionTitle: Joi.string().allow('').default("").optional(),
      answerA: Joi.string().required(),
      answerB: Joi.string().required(),
      answerC: Joi.string().required(),
      answerD: Joi.string().required(),
      answerCorrect: Joi.string().valid("A", "B", "C", "D").required(),
      topicId: Joi.number().allow(null).optional(),
      roundId: Joi.number().optional(),
      questionYear: Joi.string().allow('').length(4).optional(),
      active: Joi.boolean().optional(),
    });

  export const userSchema = Joi.object<User>({
    username: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
    userType: Joi.string().valid(userTypeEnum.ADMIN, userTypeEnum.CREATOR, userTypeEnum.STUDENT).required()
  });
  

  export const attemptedTestSchema = Joi.object<AttemptedTest>({
    userId: Joi.number().required(),
    roundId: Joi.number().required(),
    subjectId: Joi.number().optional(),
    topicId: Joi.number().optional(),
    examId: Joi.number().optional(),
    category: Joi.string().optional(),
    score: Joi.number().optional(),
    timeTaken: Joi.number().optional(),
    submittedAt: Joi.date().optional()
  });
  

  export const updateAttemptedTestSchema = Joi.object({
    score: Joi.number().optional(),
    timeTaken: Joi.number().optional(),
    submittedAt: Joi.date().optional()
  });

  export const answeredQuestionSchema = Joi.object<AnsweredQuestion>({
    attemptedTestId: Joi.number().required(),
    questionId: Joi.number().required(),
    chosenOption: Joi.string().valid("A", "B", "C", "D").allow(null),
    correctOption: Joi.string().valid("A", "B", "C", "D").required(),
    isCorrect: Joi.boolean().required(),
    attempted: Joi.boolean().default(false),
  });
  