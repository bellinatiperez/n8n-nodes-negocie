import type { OptionsWithUri } from 'request';

import type {
	IDataObject,
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function negocieApiRequest(
	this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: string,
	resource: string,
	body: any = {},
	headers: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	let options: OptionsWithUri = {
		headers: {
			'Content-Type': 'application/json',
			'User-Agent': 'n8n-nodes-negocie/0.0.27',
			'Accept': 'application/json',
			'Connection': 'keep-alive',
			...headers, // Merge custom headers (including Authorization)
		},
		method,
		body,
		uri: `${uri || 'https://localhost'}${resource}`,
		json: true,
		timeout: 30000, // 30 second timeout for performance
		pool: { maxSockets: 10 }, // Connection pooling for better performance
	};
	options = Object.assign({}, options, option);

	try {
		if (Object.keys(body as IDataObject).length === 0) {
			delete options.body;
		}

		// Log detailed request information for debugging
		const requestLog = {
			timestamp: new Date().toISOString(),
			method: options.method,
			url: options.uri,
			headers: { ...options.headers, Authorization: options.headers?.Authorization ? '[REDACTED]' : undefined }, // Hide sensitive token
			body: options.body || null,
		};
		
		console.log('🚀 Negocie API Request:', JSON.stringify(requestLog, null, 2));

		//@ts-ignore
		return await this.helpers.request.call(
			this,
			options,
		);
	} catch (error: any) {
		// Enhanced error logging with context information
		const errorContext = {
			method,
			resource,
			uri: options.uri,
			statusCode: error.statusCode || error.response?.statusCode,
			statusMessage: error.statusMessage || error.response?.statusMessage,
			responseBody: error.response?.body,
			requestBody: body,
			timestamp: new Date().toISOString(),
		};

		// Create detailed error message based on status code
		let enhancedMessage = `Erro na API Negocie: ${error.message}`;
		
		if (error.statusCode === 404 || error.response?.statusCode === 404) {
			enhancedMessage = `Recurso não encontrado na API Negocie. Endpoint: ${options.uri}. Verifique se o documento/parâmetros estão corretos.`;
		} else if (error.statusCode === 401 || error.response?.statusCode === 401) {
			enhancedMessage = `Erro de autenticação na API Negocie. Verifique as credenciais (appId, appPass, usuario).`;
		} else if (error.statusCode === 403 || error.response?.statusCode === 403) {
			enhancedMessage = `Acesso negado na API Negocie. Verifique as permissões do usuário.`;
		} else if (error.statusCode === 500 || error.response?.statusCode === 500) {
			enhancedMessage = `Erro interno do servidor da API Negocie. Tente novamente mais tarde.`;
		} else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
			enhancedMessage = `Não foi possível conectar à API Negocie. Verifique a URL base e conectividade de rede.`;
		}

		// Log detailed error information for debugging
		console.error('Negocie API Error Details:', JSON.stringify(errorContext, null, 2));

		// Create enhanced error object
		const enhancedError = {
			...error,
			message: enhancedMessage,
			context: errorContext,
		};

		throw new NodeApiError(this.getNode(), enhancedError as JsonObject);
	}
}
