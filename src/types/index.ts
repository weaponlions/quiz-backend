export enum ExamBoardTypeEnum {
    SPECIAL = "SPECIAL",
    STATE = "STATE",
    CENTRAL = "CENTRAL",
}

export type ExamBoard = {
    examBoardType: 'CENTRAL' | 'SPECIAL' | 'STATE';
    examBoardName: string;
    examName: string;
};


export type Subject = {
    subjectName: string;
    examId: Number;
    active: Boolean;
};


export type Topic = {
    topicName: string;
    subjectId: Number;
    active: Boolean;
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

