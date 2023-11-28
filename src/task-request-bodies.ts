import { TaskRequestBodyTypes, OpenCloseShiftTaskRequestBody, ReportXTaskRequestBody } from "./types";

export const openShiftBody = (uuid: string, operatorName: string, operatorVatin: string): OpenCloseShiftTaskRequestBody => {
  return {
    uuid,
    request: [
      {
        type: TaskRequestBodyTypes.OpenShift,
        operator: {
          name: operatorName || '',
          vatin: operatorVatin || ''
        }
      }
    ]
  }
}

export const closeShiftBody = (uuid: string, operatorName: string, operatorVatin: string): OpenCloseShiftTaskRequestBody => {
  return {
    uuid,
    request: [
      {
        type: TaskRequestBodyTypes.CloseShift,
        operator: {
          name: operatorName || '',
          vatin: operatorVatin || ''
        }
      }
    ]
  }
}

export const reportXBody = (operatorName: string, operatorVatin: string): ReportXTaskRequestBody[] => {
  return [
    {
      type: TaskRequestBodyTypes.ReportX,
      operator: {
        name: operatorName || '',
        vatin: operatorVatin || ''
      }
    }
  ]
}
