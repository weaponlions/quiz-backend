import Joi from "joi";
import { examBoardTypeEnum } from "@prisma/client"; 

export const examBoardSchema = Joi.object({
    examBoardType: Joi.string().valid(examBoardTypeEnum.CENTRAL, examBoardTypeEnum.SPECIAL, examBoardTypeEnum.STATE).required(),
    examBoardName: Joi.string().required(),
    examName: Joi.string().required(),
});



