import { HttpService } from "./api"
import { AxiosResponse } from "axios"
import {
	ShiftRequestData,
	TaskResponse,
	TaskRequestTypesEnum,
} from "./types"

export class AtolClient {
	private url: string
	private http: HttpService

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
	 * Получает результат выполнения задания
	 * @param {String} uuid       Идентификатор задания
	 * @param {Function} callback Callback-функция
	 */
	async getTaskResult(uuid: string, callback: Function): Promise<void> {
		var self = this;
		const response = await this.http.get('requests/' + uuid)

		if (response.data.results) {
			if (response.data.results[0].status === 'inProgress') { // Задание ещё не выполнено
				// Повторно запрашиваем результат
				setTimeout(function () {
					self.getTaskResult(uuid, callback);
				}, 1000);
				return;
			}
		}
		if (callback && typeof callback === 'function') {
			callback(response.data);
		}
	};

	/**
	 * Открывает смену
	 * @param {String} uuid  uuid
	 * @param {String} operatorName  ФИО кассира
	 * @param {String} operatorVatin ИНН кассира
	 */
	async openShift(uuid: string, operatorName: string, operatorVatin: string): Promise<ShiftRequestData> {
		try {
			const taskRequest = {
				type: TaskRequestTypesEnum.OpenShift,
				operator: {
					name: operatorName || '',
					vatin: operatorVatin || ''
				}
			}

			const taskResponse = await this.request({
				uuid,
				request: taskRequest
			});
	
			return {
				taskResponse,
				taskRequest,
			}
		} catch(err) {
			throw err
		}
	};

	/**
	 * Закрывает смену
	 * @param {String} uuid  uuid
	 * @param {String} operatorName  ФИО кассира
	 * @param {String} operatorVatin ИНН кассира
	 */
	async closeShift(uuid: string, operatorName: string, operatorVatin: string): Promise<ShiftRequestData> {
		try {
			const taskRequest = {
				type: TaskRequestTypesEnum.CloseShift,
				operator: {
					name: operatorName || '',
					vatin: operatorVatin || ''
				}
			}

			const taskResponse = await this.request({
				uuid,
				request: taskRequest
			});
	
			return {
				taskResponse,
				taskRequest,
			}
		} catch(err) {
			throw err
		}
	};

	/**
	 * Запрашивает информацию о смене в ККТ
	 */
	async shiftStatus(): Promise<AxiosResponse<any, any>> {
		return await this.http.post('operations/queryShiftStatus');
	}
}
