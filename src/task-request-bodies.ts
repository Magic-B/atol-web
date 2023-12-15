import {
  TaskRequestBodyTypes,
  OpenCloseShiftTaskRequestBody,
  ReportXTaskRequestBody,
  SalesReciptTaskRequestBody,
  PrintFnDocumentRequestBody,
  SellItems,
  PaymentTypes,
} from "./types";

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

export const reportXBody = (uuid: string, operatorName: string, operatorVatin: string): ReportXTaskRequestBody => {
  return {
    uuid,
    request: [
      {
        type: TaskRequestBodyTypes.ReportX,
        operator: {
          name: operatorName || '',
          vatin: operatorVatin || ''
        }
      }
    ]
  }
}

export const sellReceiptBody = (uuid: string, operatorName: string, operatorVatin: string, items: SellItems[], total: number): SalesReciptTaskRequestBody => {
  return {
    uuid,
    request: [
      {
        type: TaskRequestBodyTypes.Sell,
        taxationType: "osn",
        ignoreNonFiscalPrintErrors: false,
        operator: {
          name: operatorName,
          vatin: operatorVatin
        },
        payments: [],
        items,
        total
      }
    ]
  }
}

export const sellReturnReceiptBody = (uuid: string, operatorName: string, operatorVatin: string, items: SellItems[], total: number): SalesReciptTaskRequestBody => {
  return {
    uuid,
    request: [
      {
        type: TaskRequestBodyTypes.SellReturn,
        taxationType: "osn",
        ignoreNonFiscalPrintErrors: false,
        operator: {
          name: operatorName,
          vatin: operatorVatin
        },
        payments: [],
        items,
        total
      }
    ]
  }
}

export const printFnDocumentBody = (uuid: string, fiscalDocumentNumber: number): PrintFnDocumentRequestBody => {
  return {
    uuid,
    request: [
      {
        type: TaskRequestBodyTypes.PrintFnDocument,
        fiscalDocumentNumber
      }
    ]
  }
}

export const paymentTypeBody = (paymentType: PaymentTypes, paymentSum: number) => {
  return {
    type: paymentType,
    sum: paymentSum,
  }
}
