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
			name: 'Buscar credores',
			value: 'buscar_credores',
			action: 'Buscar credores do devedor',
		},
		{
			name: 'Buscar dívidas',
			value: 'buscar_dividas',
			action: 'Buscar dívidas do devedor por credor',
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
	default: 'buscar_credores',
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

export const variableAmbiente: INodeProperties = {
	displayName: 'Ambiente',
	name: 'ambiente',
	type: 'options' as NodePropertyTypes,
	options: [
		{
			name: 'Homologação',
			value: 'homologacao',
			description: 'Ambiente de testes',
		},
		{
			name: 'Produção',
			value: 'producao',
			description: 'Ambiente de produção',
		},
	],
	default: 'homologacao',
	description: 'Selecione o ambiente para realizar as operações',
	required: true,
	displayOptions: {
		show: {
			resource: ['autenticacao', 'divida', 'pagamento', 'acordo'],
		},
	},
};

export const variableAppId: INodeProperties = {
	displayName: 'App ID',
	name: 'appId',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'ID da aplicação fornecido pela Negocie',
	placeholder: '96fcf641-47f9-46cf-8bbd-72b1e738a3cc',
	required: true,
	displayOptions: {
		show: {
			operation: ['autenticar_devedor'],
			resource: ['autenticacao'],
		},
	},
};

export const variableAppPass: INodeProperties = {
	displayName: 'App Pass',
	name: 'appPass',
	type: 'string' as NodePropertyTypes,
	typeOptions: {
		password: true,
	},
	default: '',
	description: 'Senha da aplicação fornecida pela Negocie',
	placeholder: 'UG1zUlpNRTlVQWhZN01qT0htMFVRUjZkeDczN3F0Q0E=',
	required: true,
	displayOptions: {
		show: {
			operation: ['autenticar_devedor'],
			resource: ['autenticacao'],
		},
	},
};

export const variableUsuario: INodeProperties = {
	displayName: 'Usuário (CPF/CNPJ)',
	name: 'usuario',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'CPF ou CNPJ do devedor (apenas números)',
	placeholder: '23664006836',
	required: true,
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
	description: 'Bearer Token obtido na autenticação',
	displayOptions: {
		show: {
			resource: ['divida', 'pagamento', 'acordo'],
			operation: ['buscar_credores', 'buscar_dividas', 'buscar_opcoes_pagamento', 'negociar_divida'],
		},
	},
};

export const variableFinanceira: INodeProperties = {
	displayName: 'Financeira',
	name: 'financeira',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Nome da financeira (ex: BV, PAN, Casas Bahia)',
	placeholder: 'BV',
	required: true,
	displayOptions: {
		show: {
			operation: ['buscar_dividas', 'buscar_opcoes_pagamento', 'negociar_divida'],
			resource: ['divida'],
		},
	},
};

export const variableCrms: INodeProperties = {
	displayName: 'CRMs',
	name: 'crms',
	type: 'fixedCollection' as NodePropertyTypes,
	default: { values: [{ crm: '' }] },
	description: 'Lista de CRMs da financeira',
	typeOptions: {
		multipleValues: true,
	},
	options: [
		{
			name: 'values',
			displayName: 'CRM',
			values: [
				{
					displayName: 'CRM',
					name: 'crm',
					type: 'string' as NodePropertyTypes,
					default: '',
					placeholder: 'Bvc',
					description: 'Código CRM da financeira',
				},
			],
		},
	],
	displayOptions: {
		show: {
			operation: ['buscar_dividas'],
			resource: ['divida'],
		},
	},
};