import { HttpService } from "./api"
import { AxiosResponse } from "axios"
import {
	TaskResponse,
	TaskRequestBody,
	DeviceInfoResponse,
	DeviceInfo,
	ShiftStatusResponse,
	ShiftStatus,
	FnInfoResponse,
	FnInfo,
} from "./types"

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
	 * Запрашивает информацию о ККТ
	 * @returns {jqXHR}
	 */
	async queryDeviceInfo (): Promise<DeviceInfo> {
		const response: AxiosResponse<DeviceInfoResponse> = await this.http.post('operations/queryDeviceInfo', null);
		return response.data.deviceInfo
	};


	/**
	 * Запрашивает информацию о смене в ККТ
	 * @returns {jqXHR}
	 */
	async queryShiftStatus(): Promise<ShiftStatus> {
		const response: AxiosResponse<ShiftStatusResponse> = await this.http.post('operations/queryShiftStatus', null);
		return response.data.shiftStatus
	};

	/**
	 * Запрос информации о ФН
	 * @returns {jqXHR}
	 */
	async queryFnInfo(): Promise<FnInfo> {
		const response: AxiosResponse<FnInfoResponse> = await this.http.post('operations/queryFnInfo', null);
		return response.data.fnInfo
	};

	/**
	 * Создает задачу на открытие/закрытие/x-отчет и тд.
	 * @param {Object} taskRequestBody  Тело запроса для создания задачи
	 */
	async createTask(taskRequestBody: TaskRequestBody): Promise<AxiosResponse<TaskResponse>> {
		try {
			const taskResponseData = await this.http.post('requests', taskRequestBody);
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
		let taskResult = null;

		while (true) {
			const response = await this.http.get('requests/' + uuid);
		
			if (response.data.results) {
				if (response.data.results[0].status === 'inProgress') {
					await new Promise(resolve => setTimeout(resolve, 1000));
				} else {
					taskResult = response.data
					break;
				}
			}
		};

		if (taskResult.results[0].status === 'error') {
			throw new Error(`Error code ${taskResult.results[0].error.code}: ${taskResult.results[0].error.description}`);
		}
		
		if (callback && typeof callback === 'function') {
			await callback(...args);
		}
	};
}

