export interface TaskResponse {
  number: number;
  uuid: string;
  isBlocked: boolean;
  blockedUUID: string;
}

export interface DeviceInfoResponse {
  deviceInfo: {
    firmwareVersion: string;
    appVersion: string;
    boolVersion: string;
    scriptsVersion: string;
    scriptsName: string;
    model: number;
    modelName: string;
    receiptLineLength: number;
    receiptLineLengthPix: number;
    serial: string;
    ffdVersion: number;
    fnFfdVersion: number;
  }
}

export interface ShiftStatusResponse {
  shiftStatus: {
    state: string;
    number: number;
    expiredAt: string;
  }
}

export interface FnInfoResponse {
  fnInfo: {
    serial: string;
    livePhase: string;
    ffdVersion: number;
    fnFfdVersion: number;
    validity: {
      numberOfRegistrations: number;
      registrationsRemaining: number;
      validityDate: string;
    }
    warnings: {
      criticalError: boolean;
      memoryOverflow: boolean;
      needReplacement: boolean;
      ofdTimeout: boolean;
      resourceExhausted: boolean;
    }
  }
}

export enum TaskRequestBodyTypes {
  OpenShift = 'openShift',
  CloseShift = 'closeShift',
  ReportX = 'reportX',
}

interface TaskRequestUuid {
  uuid: string;
}

interface TaskRequestType {
  type: TaskRequestBodyTypes
}

interface TaskRequestOperator {
  operator: {
    name: string;
    vatin: string;
  }
}

interface OpenCloseShiftTaskRequest extends TaskRequestType, TaskRequestOperator {}

export interface OpenCloseShiftTaskRequestBody extends TaskRequestUuid {
  request: OpenCloseShiftTaskRequest[]
}

export interface ReportXTaskRequestBody extends TaskRequestType, TaskRequestOperator {}

export type TaskRequestBody = OpenCloseShiftTaskRequestBody | ReportXTaskRequestBody;
