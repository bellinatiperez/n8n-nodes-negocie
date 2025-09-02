/* eslint-disable n8n-nodes-base/node-param-operation-option-action-miscased */
/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
import {
	INodeProperties,
	NodePropertyTypes
} from 'n8n-workflow';

export const optionResources: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	options: [
		{
			description: "Autenticação do devedor",
			name: 'Autenticação',
			value: 'autenticacao',
		},
		{
			description: "Negociação de dívidas",
			name: 'Dívida',
			value: 'divida',
		},
		{
			description: "Meios de pagamentos",
			name: 'Pagamento',
			value: 'pagamento',
		},
		{
			description: "Acordos formalizados",
			name: 'Acordo',
			value: 'acordo',
		}
	],
	default: 'divida',
	noDataExpression: true,
	required: true,
	description: 'Gerenciar dívidas',
}

export const operationAutenticacao: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['autenticacao'],
		},
	},
	options: [
		{
			name: 'Autenticar devedor',
			value: 'autenticar_devedor',
			action: 'Autenticar devedor',
		},
	],
	default: 'autenticar_devedor',
	noDataExpression: true,
}

export const operationDivida: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['divida'],
		},
	},
	options: [
		{
			name: 'Buscar dívidas',
			value: 'buscar_dividas',
			action: 'Buscar dívidas do devedor',
		},
		{
			name: 'Buscar opções de pagamento',
			value: 'buscar_opcoes_pagamento',
			action: 'Buscar opções de pagamento da dívida',
		},
		{
			name: 'Negociar dívida',
			value: 'negociar_divida',
			action: 'Negociar dívida a partir da opção de pagamento selecionada',
		},
	],
	default: 'buscar_dividas',
	noDataExpression: true,
}

export const operationPagamento: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['pagamento'],
		},
	},
	options: [
		{
			name: 'Emitir segunda via de boleto',
			value: 'emitir_2via_dividas',
			action: 'Emitir segunda via de boleto',
		},
	],
	default: 'emitir_2via_dividas',
	noDataExpression: true,
}

export const operationAcordo: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['acordo'],
		},
	},
	options: [
		{
			name: 'Buscar acordos',
			value: 'buscar_acordos',
			action: 'Buscar acordos do devedor',
		},
	],
	default: 'buscar_acordos',
	noDataExpression: true,
}

export const variableClientId: INodeProperties = {
	displayName: 'ClientId',
	name: 'clientId',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Client ID',
	displayOptions: {
		show: {
			operation: ['autenticar_devedor'],
			resource: ['autenticacao'],
		},
	},
};

export const variableClientSecret: INodeProperties = {
	displayName: 'ClientSecret',
	name: 'clientSecret',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Client Secret',
	displayOptions: {
		show: {
			operation: ['autenticar_devedor'],
			resource: ['autenticacao'],
		},
	},
};

export const variableDocumento: INodeProperties = {
	displayName: 'CPF ou CNPJ',
	name: 'documento',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'CPF ou CNPJ do devedor',
	displayOptions: {
		show: {
			operation: ['autenticar_devedor'],
			resource: ['autenticacao'],
		},
	},
};

export const variableToken: INodeProperties = {
	displayName: 'Token',
	name: 'token',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Bearer Token',
	displayOptions: {
		show: {
			resource: ['divida', 'pagamento', 'acordo'],
		},
	},
};

export const variableFinanceira: INodeProperties = {
	displayName: 'Financeira',
	name: 'token',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Instituição financeira',
	displayOptions: {
		show: {
			operation: ['buscar_dividas'],
			resource: ['divida'],
		},
	},
};
