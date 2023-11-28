import { HttpService } from "./api"
import { AxiosResponse } from "axios"
import { TaskResponse, TaskRequestBody, DeviceInfoResponse, ShiftStatusResponse, FnInfoResponse } from "./types"

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
	async queryDeviceInfo (): Promise<AxiosResponse<DeviceInfoResponse>> {
		return this.http.post('operations/queryDeviceInfo');
	};


	/**
	 * Запрашивает информацию о смене в ККТ
	 * @returns {jqXHR}
	 */
	async queryShiftStatus(): Promise<AxiosResponse<ShiftStatusResponse>> {
		return this.http.post('operations/queryShiftStatus');
	};

	/**
	 * Запрос информации о ФН
	 * @returns {jqXHR}
	 */
	async queryFnInfo(): Promise<AxiosResponse<FnInfoResponse>> {
		return this.http.post('operations/queryFnInfo');
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
		while (true) {
			const response = await this.http.get('requests/' + uuid);
		
			if (response.data.results) {
				if (response.data.results[0].status === 'inProgress') {
					await new Promise(resolve => setTimeout(resolve, 1000));
				} else {
					break;
				}
			}
		};
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
