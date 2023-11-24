import { AxiosResponse } from "axios"

export interface ShiftRequestData {
  taskResponse: AxiosResponse<TaskResponse>;
  taskRequest: TaskRequest;
}

export interface TaskRequest {
  type: TaskRequestTypes;
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

export type TaskRequestTypes = TaskRequestTypesEnum.OpenShift | TaskRequestTypesEnum.CloseShift

export enum TaskRequestTypesEnum {
  OpenShift = 'openShift',
  CloseShift = 'closeShift',
}
