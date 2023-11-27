export interface TaskRequestBody {
  type: TaskRequestBodyTypes;
  operator: {
    name: string;
    vatin: string;
  }
}

export interface TaskResponse {
  number: number;
  uuid: string;
  isBlocked: boolean;
  blockedUUID: string;
}

export enum TaskRequestBodyTypes {
  OpenShift = 'openShift',
  CloseShift = 'closeShift',
  ReportX = 'reportX',
}
