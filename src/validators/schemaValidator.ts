import Joi from "joi";
import { examBoardTypeEnum } from "@prisma/client"; 

export const examBoardSchema = Joi.object({
    examBoardType: Joi.string().valid(examBoardTypeEnum.CENTRAL, examBoardTypeEnum.SPECIAL, examBoardTypeEnum.STATE).required(),
    examBoardName: Joi.string().required(),
    examName: Joi.string().required(),
});

export const subjectSchema = Joi.object({ 
    examId: Joi.number().required(),
    subjectName: Joi.string().required(),
    active: Joi.boolean().required(),
});


export const topicSchema = Joi.object({ 
    subjectId: Joi.number().required(),
    topicName: Joi.string().required(),
    active: Joi.boolean().required(),
});



