import { TaskRequestBodyTypes } from "./types";

const taskRequestBodyies = {
  [TaskRequestBodyTypes.CloseShift]: {
    type: "openShift",
    operator: {
      name: "Иванов",
      vatin: "123654789507"
    }
  },
  [TaskRequestBodyTypes.OpenShift]: { property1: 'value3', property2: 'value4' },
  [TaskRequestBodyTypes.ReportX]: { property1: 'value5', property2: 'value6' }
};

// Функция, возвращающая тело запроса для создания задачи, в зависимости от переданного enum
export const getTaskRequestBody = (taskRequestBodyType: TaskRequestBodyTypes) => {
  switch (taskRequestBodyType) {
    case TaskRequestBodyTypes.OpenShift:
      return taskRequestBodyies[TaskRequestBodyTypes.OpenShift];
    case TaskRequestBodyTypes.CloseShift:
      return taskRequestBodyies[TaskRequestBodyTypes.CloseShift];
    case TaskRequestBodyTypes.ReportX:
      return taskRequestBodyies[TaskRequestBodyTypes.ReportX];
    default:
      return null;
  }
}

const openShift = () => {
  return {
    
  }
}