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
	operationDivida,
	operationPagamento,
	operationAcordo,
	operationAutenticacao,
	variableClientSecret,
	variableClientId,
	variableDocumento, variableToken, variableFinanceira,
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
			// Autenticação
			variableClientId,
			variableClientSecret,
			variableDocumento,
			// Negociação
			variableToken,
			variableFinanceira,
		],
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;

		let responseData;

		// For each item, make an API call to create a contact
		for (let i = 0; i < items.length; i++) {
			try {
				if (['divida', 'pagamento', 'acordo'].includes(resource)) {
					const documento = this.getNodeParameter('documento', i) as string;
					// Set the Payload
					const payload: IDataObject = {
						documento: documento,
					};

					if (resource === 'buscar_dividas') {
						// Get identifier input
						const documento = this.getNodeParameter('documento', i) as string;
						payload.conversion_identifier = documento;
					}

					responseData = await negocieApiRequest.call(this, 'GET', `/dividas/${documento}`);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = {
						json: {} as IDataObject,
						error: error.message,
						itemIndex: i,
					};
					returnData.push(executionErrorData as INodeExecutionData);
					continue;
				}
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
