import { HttpService } from "./api"
import { AxiosResponse } from "axios"

export class FptrClient {
	url: string
	deviceId: number
	initialized: boolean
	http: HttpService

	constructor(url: string, deviceId: number) {
		this.url = url
		this.deviceId = deviceId
		this.initialized = false
		this.http = new HttpService(this.url)
	}

	/**
	 * Получает информацию о сервере
	 * @returns {jqXHR}
	 */
	async getServerInfo(): Promise<AxiosResponse<any, any>> {
		return await this.http.get('serverInfo')
	}

	/**
	 * Получает настройки веб-сервера
	 * @returns {jqXHR}
	 */
	async getSettings(): Promise<AxiosResponse<any, any>> {
		return await this.http.get('settings')
	}

	/**
	 * Изменяет настройки веб-сервера
	 * @param {Object} params
	 * @returns {jqXHR}
	 */
	async setSettings(params: object): Promise<AxiosResponse<any, any>> {
		return await this.http.put('settings', params);
	}

	/**
	 * Добавляет новое JSON-задание для ККТ
	 * @param {Object} params
	 * @returns {jqXHR}
	 */
	async request(params: object) {
		return await this.http.post('requests', {
			request: [],
			...params
		});
	}

	/**
	 * Получает результат выполнения задания
	 * @param {String} uuid       Идентификатор задания
	 * @param {Function} callback Callback-функция
	 * @returns {undefined}
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
	 * @param {String} operatorName  ФИО кассира
	 * @param {String} operatorVatin ИНН кассира
	 * @returns {jqXHR}
	 */
	async openShift(uuid: string, operatorName: string, operatorVatin: string): Promise<AxiosResponse<any, any>> {
		return await this.request({
			uuid,
			request: [
				{
					type: 'openShift',
					operator: {
						name: operatorName || '',
						vatin: operatorVatin + ''
					}
				}
			]
		});
	};

	/**
	 * Закрывает смену
	 * @param {String} operatorName  ФИО кассира
	 * @param {String} operatorVatin ИНН кассира
	 * @returns {jqXHR}
	 */
	async closeShift(operatorName: string, operatorVatin: string): Promise<AxiosResponse<any, any>> {
		return await this.request({
			//uuid: this._createUUID(), // Необязательно, т.к. uuid генерируется в request
			request: [
				{
					type: 'closeShift',
					operator: {
						name: operatorName || '',
						vatin: operatorVatin + ''
					}
				}
			]
		});
	};

	/**
	 * Запрашивает информацию о смене в ККТ
	 * @returns {jqXHR}
	 */
	async shiftStatus(): Promise<AxiosResponse<any, any>> {
		return await this.http.post('operations/queryShiftStatus');
	}
}
