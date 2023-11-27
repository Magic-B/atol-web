import { HttpService } from "./api"
import { AxiosResponse } from "axios"
import {
	TaskResponse,
	TaskRequestBody,
} from "./types"

export enum TaskRequestTypes {
	OpenShift = 'openShift',
  CloseShift = 'closeShift',
  ReportX = 'reportX',
}

export class AtolClient {
	private url: string
	private http: HttpService
	counter = 1

	constructor(url: string) {
		this.url = url
		this.http = new HttpService(this.url)
	}

	/**
	 * Получает информацию о сервере
	 */
	async getServerInfo(): Promise<AxiosResponse<any, any>> {
		return await this.http.get('serverInfo')
	}

	/**
	 * Получает настройки веб-сервера
	 */
	async getSettings(): Promise<AxiosResponse<any, any>> {
		return await this.http.get('settings')
	}

	/**
	 * Изменяет настройки веб-сервера
	 * @param {Object} params
	 */
	async setSettings(params: object): Promise<AxiosResponse<any, any>> {
		return await this.http.put('settings', params);
	}

	/**
	 * Добавляет новое JSON-задание для ККТ
	 * @param {Object} params
	 */
	private async request(params: object): Promise<AxiosResponse<TaskResponse>> {
		return await this.http.post('requests', {
			request: [],
			...params
		});
	}

	/**
	 * Создание тела запроса для задачи
	 * @param {String} type  Тип задачи
	 * @param {String} operatorName  ФИО кассира
	 * @param {String} operatorVatin ИНН кассира
	 */
	createTaskRequestBody(type: TaskRequestTypes, operatorName?: string, operatorVatin?: string) {
		return {
			type: type,
			operator: {
				name: operatorName || '',
				vatin: operatorVatin || ''
			}
		}
	}

	/**
	 * Создает задачу на открытие/закрытие/x-отчет и тд.
	 * @param {Object} taskRequestBody  Тело запроса для создания задачи
	 * @param {String} uuid  UUID
	 */
	async createTask(taskRequestBody: TaskRequestBody, uuid?: string): Promise<AxiosResponse<TaskResponse>> {
		try {

			const taskResponseData = await this.request({
				uuid,
				request: [
					taskRequestBody
				]
			});
	
			return taskResponseData
		} catch(err) {
			throw err
		}
	};

	/**
	 * Получает результат выполнения задания
	 * @param {String} uuid       Идентификатор задания
	 * @param {Function} callback Callback-функция
	 */
	async getTaskResult(uuid: string, callback: Function, ...args: any[]): Promise<void> {
		const self = this;
		const response = await this.http.get('requests/' + uuid)

		if (response.data.results) {
			if (response.data.results[0].status === 'inProgress' || this.counter !== 3) { // Задание ещё не выполнено
				// Повторно запрашиваем результат
				setTimeout(function () {
					self.getTaskResult(uuid, callback, ...args);
				}, 1000);

				this.counter += 1
				return;
			}
		}
		if (callback && typeof callback === 'function') {
			await callback(...args);
		}
	};

	/**
	 * Запрашивает информацию о смене в ККТ
	 */
	async shiftStatus(): Promise<AxiosResponse<any, any>> {
		return await this.http.post('operations/queryShiftStatus');
	}
}
