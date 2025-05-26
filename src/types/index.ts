import { accessTypeEnum, correctAnswerEnum, roundTypeEnum, userTypeEnum } from "@prisma/client";

export enum ExamBoardTypeEnum {
    SPECIAL = "SPECIAL",
    STATE = "STATE",
    CENTRAL = "CENTRAL",
}

export type ExamBoard = {
    examBoardType: 'CENTRAL' | 'SPECIAL' | 'STATE';
    examBoardLongName: string;
    examBoardShortName: string;
    examName: string;
    boardLogo: string;
    examLogo: string;
    active: boolean;
};


export type Subject = {
    subjectName: string;
    examId: Number;
    ownerId: Number;
    active: Boolean; 
    accessType: accessTypeEnum;
};


export type Topic = {
    topicName: string;
    subjectId: Number;
    active: Boolean;
};

export type Round = {
    roundName: string;
    sectionName: string;
    roundType: roundTypeEnum
    examId: number;
    ownerId: number;
    accessType?: accessTypeEnum 
    active?: boolean;
  };
  
  

  export type TopicQuestion = {
    id: number | undefined | null;
    questionText: string;
    questionTitle: string;
    answerA: string;
    answerB: string;
    answerC: string;
    answerD: string;
    answerCorrect: correctAnswerEnum;
    topicId: number | null;
    roundId: number | null;
    createdAt: Date;
    updatedAt: Date;
    active: boolean;
    questionYear: string;
  };

  export type User = {
    id: number;
    username: string;
    password: string;
    userType: userTypeEnum
  }
  
  export type AttemptedTest = {
    userId: number;
    roundId: number;
    subjectId: number | null;
    topicId: number | null;
    examId: number | null;
    category: string | null;
    score: number | null;
    timeTaken: number | null;
    submittedAt: Date | null;
  };

  export type AnsweredQuestion = {
    attemptedTestId: number;
    questionId: number;
    chosenOption: "A" | "B" | "C" | "D" | null;
    correctOption: "A" | "B" | "C" | "D";
    isCorrect: boolean;
    attempted: boolean;
  };
  

export enum StatusCode {
    // Informational Responses (100–199)
    CONTINUE = 100,
    SWITCHING_PROTOCOLS = 101,
    PROCESSING = 102,

    // Success Responses (200–299)
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NON_AUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    MULTI_STATUS = 207,
    ALREADY_REPORTED = 208,

    // Client Error Responses (400–499)
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401, 
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406, 
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    PAYLOAD_TOO_LARGE = 413,
    UNSUPPORTED_MEDIA_TYPE = 415, 
    LOCKED = 423,
    TOO_MANY_REQUESTS = 429,
    REQUEST_HEADER_FIELDS_TOO_LARGE = 431,

    // Server Error Responses (500–599)
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    NETWORK_AUTHENTICATION_REQUIRED = 511
}

