export interface TaskResponse {
  number: number;
  uuid: string;
  isBlocked: boolean;
  blockedUUID: string;
}

export interface DeviceInfo {
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

export interface DeviceInfoResponse {
  deviceInfo: DeviceInfo
}

export interface ShiftStatus {
  state: string;
  number: number;
  expiredAt: string;
}

export interface ShiftStatusResponse {
  shiftStatus: ShiftStatus
}

export interface FnInfo {
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

export interface FnInfoResponse {
  fnInfo: FnInfo
}

export enum TaskRequestBodyTypes {
  OpenShift = 'openShift',
  CloseShift = 'closeShift',
  ReportX = 'reportX',
  Sell = 'sell',
  SellReturn = 'sellReturn',
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
  request: OpenCloseShiftTaskRequest[];
}

export interface ReportXTaskRequest extends TaskRequestType, TaskRequestOperator {}

export interface ReportXTaskRequestBody extends TaskRequestUuid {
  request: ReportXTaskRequest[];
}

export interface SellItems {
  type: string;
  name: string;
  price: number;
  quantity: number;
  tax: {
      type: string;
  }
}

interface SellReceiptTaskRequest extends TaskRequestType, TaskRequestOperator {
  taxationType: string;
  ignoreNonFiscalPrintErrors: boolean;
  items: SellItems[];
  payments: {
    type: PaymentTypes,
    sum: number,
  }[],
  total: number;
}

export interface SalesReciptTaskRequestBody extends TaskRequestUuid {
  request: SellReceiptTaskRequest[];
}

export enum PaymentTypes {
  Cash = 'cash',
  Electronically = 'electronically',
  Prepaid = 'prepaid',
  Credir = 'credir',
  Other = 'other',
}

export type TaskRequestBody = OpenCloseShiftTaskRequestBody | ReportXTaskRequestBody | SalesReciptTaskRequestBody;
