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
		{
			name: 'Buscar contato do devedor',
			value: 'buscar_contato_devedor',
			action: 'Buscar contato do devedor',
		},
		{
			name: 'Enviar código ao devedor',
			value: 'enviar_codigo_devedor',
			action: 'Enviar código ao devedor',
		},
		{
			name: 'Validar código enviado',
			value: 'validar_codigo',
			action: 'Validar código enviado',
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

// Campo CRM para buscar_opcoes_pagamento e negociar_divida (string simples)
export const variableCrmOpcoesPagamento: INodeProperties = {
	displayName: 'CRM',
	name: 'crm',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Código CRM da financeira',
	placeholder: 'Bvc',
	required: true,
	displayOptions: {
		show: {
			operation: ['buscar_opcoes_pagamento', 'negociar_divida', 'emitir_2via_dividas'],
			resource: ['divida', 'pagamento'],
		},
	},
};

// Campo Carteira para buscar_opcoes_pagamento e negociar_divida
export const variableCarteira: INodeProperties = {
	displayName: 'Carteira',
	name: 'carteira',
	type: 'number' as NodePropertyTypes,
	default: 0,
	description: 'Número da carteira',
	required: true,
	displayOptions: {
		show: {
			operation: ['buscar_opcoes_pagamento', 'negociar_divida'],
			resource: ['divida'],
		},
	},
};

// Campo Contrato (string simples) para buscar_opcoes_pagamento e negociar_divida
export const variableContrato: INodeProperties = {
	displayName: 'Contrato',
	name: 'contrato',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Número do contrato',
	placeholder: '12131000133317',
	required: true,
	displayOptions: {
		show: {
			operation: ['buscar_opcoes_pagamento', 'negociar_divida', 'emitir_2via_dividas'],
			resource: ['divida', 'pagamento'],
		},
	},
};

// Campo Data de Vencimento para buscar_opcoes_pagamento e negociar_divida
export const variableDataVencimento: INodeProperties = {
	displayName: 'Data de Vencimento',
	name: 'dataVencimento',
	type: 'dateTime' as NodePropertyTypes,
	default: '',
	description: 'Data de vencimento no formato ISO 8601',
	placeholder: '2025-01-01T01:01:01.001Z',
	required: true,
	displayOptions: {
		show: {
			operation: ['buscar_opcoes_pagamento', 'negociar_divida', 'emitir_2via_dividas'],
			resource: ['divida', 'pagamento'],
		},
	},
};

// Campos adicionais para emitir boleto (ambas operações)
export const variableFase: INodeProperties = {
	displayName: 'Fase',
	name: 'fase',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Fase da negociação',
	required: true,
	displayOptions: {
		show: {
			operation: ['negociar_divida', 'emitir_2via_dividas'],
			resource: ['divida', 'pagamento'],
		},
	},
};

export const variableValor: INodeProperties = {
	displayName: 'Valor',
	name: 'valor',
	type: 'number' as NodePropertyTypes,
	default: 0,
	description: 'Valor para emissão do boleto',
	required: true,
	displayOptions: {
		show: {
			operation: ['negociar_divida'],
			resource: ['divida'],
		},
	},
};

export const variableParcelas: INodeProperties = {
	displayName: 'Parcelas',
	name: 'parcelas',
	type: 'number' as NodePropertyTypes,
	default: 0,
	description: 'Quantidade de parcelas',
	required: true,
	displayOptions: {
		show: {
			operation: ['negociar_divida'],
			resource: ['divida'],
		},
	},
};

export const variableIdentificador: INodeProperties = {
	displayName: 'Identificador',
	name: 'identificador',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Identificador único da negociação',
	required: true,
	displayOptions: {
		show: {
			operation: ['negociar_divida', 'emitir_2via_dividas'],
			resource: ['divida', 'pagamento'],
		},
	},
};

export const variableOpcaoDebitoConta: INodeProperties = {
	displayName: 'Opção Débito em Conta',
	name: 'opcaoDebitoConta',
	type: 'boolean' as NodePropertyTypes,
	default: false,
	description: 'Se deseja habilitar débito em conta',
	required: true,
	displayOptions: {
		show: {
			operation: ['negociar_divida'],
			resource: ['divida'],
		},
	},
};

export const variableOpcaoChequeEspecial: INodeProperties = {
	displayName: 'Opção Cheque Especial',
	name: 'opcaoChequeEspecial',
	type: 'boolean' as NodePropertyTypes,
	default: false,
	description: 'Se deseja habilitar uso de cheque especial',
	required: true,
	displayOptions: {
		show: {
			operation: ['negociar_divida'],
			resource: ['divida'],
		},
	},
};

export const variableTipoContrato: INodeProperties = {
	displayName: 'Tipo de Contrato',
	name: 'tipoContrato',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Tipo do contrato para emissão do boleto',
	required: true,
	displayOptions: {
		show: {
			operation: ['negociar_divida'],
			resource: ['divida'],
		},
	},
};

// Novos campos para buscar_opcoes_pagamento
export const variableCodigoOpcao: INodeProperties = {
	displayName: 'Código da Opção',
	name: 'codigoOpcao',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Código da opção de pagamento',
	displayOptions: {
		show: {
			operation: ['buscar_opcoes_pagamento'],
			resource: ['divida'],
		},
	},
};

export const variableValorEntrada: INodeProperties = {
	displayName: 'Valor de Entrada',
	name: 'valorEntrada',
	type: 'number' as NodePropertyTypes,
	default: 0,
	description: 'Valor de entrada para a simulação',
	displayOptions: {
		show: {
			operation: ['buscar_opcoes_pagamento'],
			resource: ['divida'],
		},
	},
};

export const variableQuantidadeParcela: INodeProperties = {
	displayName: 'Quantidade de Parcelas',
	name: 'quantidadeParcela',
	type: 'number' as NodePropertyTypes,
	default: 0,
	description: 'Quantidade de parcelas para a simulação',
	displayOptions: {
		show: {
			operation: ['buscar_opcoes_pagamento', 'emitir_2via_dividas'],
			resource: ['divida', 'pagamento'],
		},
	},
};

export const variableValorParcela: INodeProperties = {
	displayName: 'Valor da Parcela',
	name: 'valorParcela',
	type: 'number' as NodePropertyTypes,
	default: 0,
	description: 'Valor da parcela para a simulação',
	displayOptions: {
		show: {
			operation: ['buscar_opcoes_pagamento'],
			resource: ['divida'],
		},
	},
};

export const variableTipoSimulacao: INodeProperties = {
	displayName: 'Tipo de Simulação',
	name: 'tipoSimulacao',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Tipo de simulação desejada',
	displayOptions: {
		show: {
			operation: ['buscar_opcoes_pagamento'],
			resource: ['divida'],
		},
	},
};

export const variableListaContratoParcelas: INodeProperties = {
	displayName: 'Lista Contrato Parcelas (JSON)',
	name: 'listaContratoParcelas',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'JSON com a lista de contratos e suas parcelas no formato { "contratoParcelas": [ { "contrato": "string", "parcelas": [0] } ] }',
	placeholder: '{"contratoParcelas":[{"contrato":"12131000133317","parcelas":[0]}]}',
	displayOptions: {
		show: {
			operation: ['buscar_opcoes_pagamento'],
			resource: ['divida'],
		},
	},
};

export const variableObterSimulacaoVistaSemDesconto: INodeProperties = {
	displayName: 'Obter Simulação à Vista sem Desconto',
	name: 'obterSimulacaoVistaSemDesconto',
	type: 'boolean' as NodePropertyTypes,
	default: true,
	description: 'Se deve obter simulação à vista sem desconto',
	displayOptions: {
		show: {
			operation: ['buscar_opcoes_pagamento'],
			resource: ['divida'],
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
			operation: ['autenticar_devedor', 'buscar_contato_devedor', 'enviar_codigo_devedor', 'validar_codigo'],
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
			operation: ['autenticar_devedor', 'buscar_contato_devedor', 'enviar_codigo_devedor', 'validar_codigo'],
			resource: ['autenticacao'],
		},
	},
};

export const variableDoc: INodeProperties = {
	displayName: 'Documento (CPF/CNPJ)',
	name: 'doc',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'CPF ou CNPJ do devedor (apenas números)',
	placeholder: '23664006836',
	required: true,
	displayOptions: {
		show: {
			operation: ['buscar_contato_devedor'],
			resource: ['autenticacao'],
		},
	},
};

export const variableTrackId: INodeProperties = {
	displayName: 'Track ID',
	name: 'trackId',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Identificador de rastreamento da chamada (opcional)',
	placeholder: 'string',
	displayOptions: {
		show: {
			operation: ['buscar_contato_devedor', 'enviar_codigo_devedor', 'validar_codigo'],
			resource: ['autenticacao'],
		},
	},
};

export const variableInternalToken: INodeProperties = {
	displayName: 'Internal Token',
	name: 'internalToken',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Token interno retornado por busca-cliente',
	required: true,
	displayOptions: {
		show: {
			operation: ['enviar_codigo_devedor', 'validar_codigo'],
			resource: ['autenticacao'],
		},
	},
};

export const variableTelefone: INodeProperties = {
	displayName: 'Telefone',
	name: 'telefone',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Telefone do devedor para envio do código',
	placeholder: '+55XXXXXXXXXXX',
	required: true,
	displayOptions: {
		show: {
			operation: ['enviar_codigo_devedor'],
			resource: ['autenticacao'],
		},
	},
};

export const variableCodigo: INodeProperties = {
	displayName: 'Código de validação',
	name: 'codigo',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Código recebido pelo devedor para validação',
	placeholder: 'string',
	required: true,
	displayOptions: {
		show: {
			operation: ['validar_codigo'],
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
			operation: ['buscar_credores', 'buscar_dividas', 'buscar_opcoes_pagamento', 'negociar_divida', 'emitir_2via_dividas', 'buscar_acordos'],
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
			operation: ['buscar_dividas'],
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

// Campos necessários para emitir segunda via de boleto (pagamento)
export const variableCnpjCpf: INodeProperties = {
	displayName: 'CNPJ/CPF',
	name: 'cnpj_Cpf',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'CPF ou CNPJ do devedor (apenas números)',
	placeholder: '23664006836',
	required: true,
	displayOptions: {
		show: {
			resource: ['pagamento'],
			operation: ['emitir_2via_dividas'],
		},
	},
};

export const variableCodigoCarteiraPagamento: INodeProperties = {
	displayName: 'Código da Carteira',
	name: 'codigoCarteira',
	type: 'number' as NodePropertyTypes,
	default: 0,
	description: 'Código da carteira para o pagamento',
	required: true,
	displayOptions: {
		show: {
			resource: ['pagamento'],
			operation: ['emitir_2via_dividas'],
		},
	},
};

export const variableIdPagamento: INodeProperties = {
	displayName: 'ID',
	name: 'id',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Identificador do boleto/acordo',
	required: true,
	displayOptions: {
		show: {
			resource: ['pagamento'],
			operation: ['emitir_2via_dividas'],
		},
	},
};

export const variableNossoNumero: INodeProperties = {
	displayName: 'Nosso Número',
	name: 'nossoNumero',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Nosso número do boleto',
	required: true,
	displayOptions: {
		show: {
			resource: ['pagamento'],
			operation: ['emitir_2via_dividas'],
		},
	},
};

export const variableValorBoleto: INodeProperties = {
	displayName: 'Valor do Boleto',
	name: 'valorBoleto',
	type: 'number' as NodePropertyTypes,
	default: 0,
	description: 'Valor do boleto a ser emitido',
	required: true,
	displayOptions: {
		show: {
			resource: ['pagamento'],
			operation: ['emitir_2via_dividas'],
		},
	},
};

export const variableTipoBoleto: INodeProperties = {
	displayName: 'Tipo de Boleto',
	name: 'tipoBoleto',
	type: 'string' as NodePropertyTypes,
	default: '',
	description: 'Tipo de boleto para emissão (ex: Boleto, Pix)',
	required: true,
	displayOptions: {
		show: {
			resource: ['pagamento'],
			operation: ['emitir_2via_dividas'],
		},
	},
};