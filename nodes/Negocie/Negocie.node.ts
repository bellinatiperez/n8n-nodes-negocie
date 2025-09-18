/* eslint-disable n8n-nodes-base/node-param-operation-option-action-miscased */
import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription
} from 'n8n-workflow';

import { negocieApiRequest } from './GenericFunctions';
import {
	optionResources,
	operationAutenticacao,
	operationDivida,
	operationPagamento,
	operationAcordo,
	variableAmbiente,
	variableAppId,
	variableAppPass,
	variableUsuario,
	variableToken,
	variableFinanceira,
	variableCrms
} from "./Common";

export class Negocie implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Negocie',
		name: 'negocie',
		icon: 'file:negocie-img.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Negocie API',
		defaults: {
			name: 'Negocie',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [],
		properties: [
			// Resources and operations will go here
			optionResources,
			operationAutenticacao,
			operationDivida,
			operationPagamento,
			operationAcordo,
			// Variables
			// Ambiente
			variableAmbiente,
			// Autenticação
			variableAppId,
			variableAppPass,
			variableUsuario,
			// Negociação
			variableToken,
			variableFinanceira,
			variableCrms
		],
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const ambiente = this.getNodeParameter('ambiente', 0) as string;

		// Determine base URLs based on environment and resource type
		let authBaseUrl: string;
		let resourceBaseUrl: string;

		if (ambiente === 'producao') {
			// Production URLs
			authBaseUrl = 'https://prd-digital-api.bellinatiperez.com.br';
			resourceBaseUrl = 'https://negocie-api.bellinatiperez.com.br';
		} else {
			// Homologation URLs
			authBaseUrl = 'https://hml-bpdigital-api.bellinatiperez.com.br';
			resourceBaseUrl = 'https://hml-negocie-api.bellinatiperez.com.br';
		}

		let responseData;

		// For each item, make an API call
		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'autenticacao' && operation === 'autenticar_devedor') {
					// Get authentication parameters
					const appId = this.getNodeParameter('appId', i) as string;
					const appPass = this.getNodeParameter('appPass', i) as string;
					const usuario = this.getNodeParameter('usuario', i) as string;

					// Set the payload for authentication
					const payload: IDataObject = {
						appId: appId,
						appPass: appPass,
						usuario: usuario,
					};

					// Make authentication request to specific endpoint
					responseData = await negocieApiRequest.call(
						this, 
						'POST', 
						'/api/Login/v5/Authentication',
						payload,
						{},
						authBaseUrl
					);

				} else if (['divida', 'pagamento', 'acordo'].includes(resource)) {
					if (operation === 'buscar_credores') {
						// Buscar credores (GET) - só precisa do token
						const token = this.getNodeParameter('token', i) as string;
						
						responseData = await negocieApiRequest.call(
							this, 
							'GET', 
							'/api/v5/busca-credores', 
							{}, 
							{
								'Authorization': `Bearer ${token}`,
								'accept': 'application/json'
							}, 
							resourceBaseUrl
						);
					} else if (operation === 'buscar_dividas') {
						// Buscar dívidas (POST) - precisa de token, financeira e crms
						const token = this.getNodeParameter('token', i) as string;
						const financeira = this.getNodeParameter('financeira', i) as string;
						const crmsData = this.getNodeParameter('crms', i) as IDataObject;

						// Processar CRMs para array simples de strings
						let crmsArray: string[] = [];
						if (crmsData && crmsData.values && Array.isArray(crmsData.values)) {
							crmsArray = (crmsData.values as IDataObject[]).map((item: IDataObject) => item.crm as string).filter(Boolean);
						}

						const payload: IDataObject = {
							financeira: financeira,
							crms: crmsArray
						};

						responseData = await negocieApiRequest.call(
							this, 
							'POST', 
							'/api/v5/busca-divida', 
							payload, 
							{
								'Authorization': `Bearer ${token}`,
								'accept': 'application/json',
								'Content-Type': 'application/json'
							}, 
							resourceBaseUrl
						);
					} else {
						// Operações originais - precisam de documento
						const documento = this.getNodeParameter('documento', i) as string;
						const payload: IDataObject = {
							documento: documento,
						};

						if (resource === 'buscar_dividas') {
							payload.conversion_identifier = documento;
						}

						responseData = await negocieApiRequest.call(this, 'GET', `/dividas/${documento}`, {}, {}, resourceBaseUrl);
					}
				}
			} catch (error: any) {
				// Enhanced error handling with detailed context
				const errorDetails = {
					resource,
					operation,
					ambiente,
					itemIndex: i,
					timestamp: new Date().toISOString(),
					errorType: error.constructor.name,
					statusCode: error.statusCode || error.context?.statusCode,
					originalMessage: error.message,
				};

				if (this.continueOnFail()) {
					// Create detailed error information for continue-on-fail mode
					let userFriendlyMessage = error.message;
					
					if (error.context?.statusCode === 404) {
						userFriendlyMessage = `Documento não encontrado na API Negocie. Verifique se o documento informado existe e está correto.`;
					} else if (error.context?.statusCode === 401) {
						userFriendlyMessage = `Falha na autenticação. Verifique as credenciais (appId, appPass, usuario) no ambiente ${ambiente}.`;
					} else if (error.context?.statusCode === 403) {
						userFriendlyMessage = `Acesso negado. O usuário não tem permissão para acessar este recurso.`;
					} else if (error.context?.statusCode === 500) {
						userFriendlyMessage = `Erro interno do servidor da API Negocie. Tente novamente mais tarde.`;
					}

					const executionErrorData = {
						json: {
							error: true,
							message: userFriendlyMessage,
							details: errorDetails,
							context: error.context || {},
						} as IDataObject,
						error: userFriendlyMessage,
						itemIndex: i,
					};
					
					// Log error for debugging
					console.error(`Negocie Node Error [Item ${i}]:`, JSON.stringify(errorDetails, null, 2));
					
					returnData.push(executionErrorData as INodeExecutionData);
					continue;
				}
				
				// Log error before throwing
				console.error('Negocie Node Fatal Error:', JSON.stringify(errorDetails, null, 2));
				throw error;
			}
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData as IDataObject),
				{ itemData: { item: i } },
			);
			returnData.push(...executionData);
		}

		return this.prepareOutputData(returnData);
	}
}
