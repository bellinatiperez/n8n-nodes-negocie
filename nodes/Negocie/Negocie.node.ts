/* eslint-disable n8n-nodes-base/node-param-operation-option-action-miscased */
import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError
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
	variableCrmOpcoesPagamento,
	variableCarteira,
	variableContrato,
	variableDataVencimento,
	variableFase,
	variableValor,
	variableParcelas,
	variableIdentificador,
	variableOpcaoDebitoConta,
	variableOpcaoChequeEspecial,
	variableTipoContrato,
	// Novos campos para buscar_opcoes_pagamento
	variableCodigoOpcao,
	variableValorEntrada,
	variableQuantidadeParcela,
	variableValorParcela,
	variableTipoSimulacao,
	variableListaContratoParcelas,
	variableObterSimulacaoVistaSemDesconto,
	// Campos necessários para emitir segunda via de boleto (pagamento)
	variableCnpjCpf,
	variableCodigoCarteiraPagamento,
	variableIdPagamento,
	variableNossoNumero,
	variableValorBoleto,
	variableTipoBoleto,
	// Novos campos autenticacao
	variableDoc,
	variableTrackId,
	variableInternalToken,
	variableTelefone,
	variableCodigo
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
			variableCrmOpcoesPagamento,
			variableCarteira,
			variableContrato,
			variableDataVencimento,
			variableFase,
			variableValor,
			variableParcelas,
			variableIdentificador,
			variableOpcaoDebitoConta,
			variableOpcaoChequeEspecial,
			variableTipoContrato,
			// Novos campos buscar_opcoes_pagamento
			variableCodigoOpcao,
			variableValorEntrada,
			variableQuantidadeParcela,
			variableValorParcela,
			variableTipoSimulacao,
			variableListaContratoParcelas,
			variableObterSimulacaoVistaSemDesconto,
			// Campos pagamento emitir_2via_dividas
			variableCnpjCpf,
			variableCodigoCarteiraPagamento,
			variableIdPagamento,
			variableNossoNumero,
			variableValorBoleto,
			variableTipoBoleto,
			// Novos campos autenticacao
			variableDoc,
			variableTrackId,
			variableInternalToken,
			variableTelefone,
			variableCodigo
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
		const singleOutput = ['autenticar_devedor', 'buscar_credores', 'buscar_dividas', 'buscar_acordos', 'buscar_contato_devedor', 'enviar_codigo_devedor', 'validar_codigo'].includes(operation);

		// Determine base URLs based on environment and resource type
		let authBaseUrl: string;
		let resourceBaseUrl: string;

		if (ambiente === 'producao') {
			// Production URLs
			authBaseUrl = 'https://bpdigital-api.bellinati.com.br';
			resourceBaseUrl = 'https://negocie-api.bellinati.com.br';
		} else {
			// Homologation URLs
			authBaseUrl = 'https://hml-bpdigital-api.bellinati.com.br';
			resourceBaseUrl = 'https://hml-negocie-api.bellinati.com.br';
		}

		let responseData;

		// For each item, make an API call
		for (let i = 0; i < (singleOutput ? Math.min(items.length, 1) : items.length); i++) {
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

				} else if (resource === 'autenticacao' && operation === 'buscar_contato_devedor') {
					// Parameters for buscar_contato_devedor
					const appId = this.getNodeParameter('appId', i) as string;
					const appPass = this.getNodeParameter('appPass', i) as string;
					const doc = this.getNodeParameter('doc', i) as string;
					const trackId = this.getNodeParameter('trackId', i) as string;

					const payload: IDataObject = {
						appId,
						appPass,
						doc,
					};
					if (trackId) {
						payload['trackId'] = trackId;
					}

					responseData = await negocieApiRequest.call(
						this,
						'POST',
						'/api/Autenticacao/busca-cliente-sem-captcha',
						payload,
						{
							'accept': 'application/json',
							'Content-Type': 'application/json'
						},
						authBaseUrl
					);

				} else if (resource === 'autenticacao' && operation === 'enviar_codigo_devedor') {
					// Parameters for enviar_codigo_devedor
					const appId = this.getNodeParameter('appId', i) as string;
					const appPass = this.getNodeParameter('appPass', i) as string;
					const internalToken = this.getNodeParameter('internalToken', i) as string;
					const telefone = this.getNodeParameter('telefone', i) as string;
					const trackId = this.getNodeParameter('trackId', i) as string;

					const payload: IDataObject = {
						appId,
						appPass,
						internalToken,
						telefone,
					};
					if (trackId) {
						payload['trackId'] = trackId;
					}

					responseData = await negocieApiRequest.call(
					this,
					'POST',
					'/api/Autenticacao/envia-token',
					payload,
					{
						'accept': 'application/json',
						'Content-Type': 'application/json'
					},
					authBaseUrl
				);

				} else if (resource === 'autenticacao' && operation === 'validar_codigo') {
					// Parameters for validar_codigo
					const appId = this.getNodeParameter('appId', i) as string;
					const appPass = this.getNodeParameter('appPass', i) as string;
					const internalToken = this.getNodeParameter('internalToken', i) as string;
					const codigo = this.getNodeParameter('codigo', i) as string;
					const trackId = this.getNodeParameter('trackId', i) as string;

					const payload: IDataObject = {
						appId,
						appPass,
						internalToken,
						token: codigo,
					};
					if (trackId) {
						payload['trackId'] = trackId;
					}

					responseData = await negocieApiRequest.call(
						this,
						'POST',
						'/api/Autenticacao/valida-token',
						payload,
						{
							'accept': 'application/json',
							'Content-Type': 'application/json'
						},
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
					} else if (operation === 'buscar_opcoes_pagamento') {
						// Buscar opções de pagamento (POST) - usa apenas os campos especificados
						const token = this.getNodeParameter('token', i) as string;
						const crm = this.getNodeParameter('crm', i) as string;
						const carteira = this.getNodeParameter('carteira', i) as number;
						const contrato = this.getNodeParameter('contrato', i) as string;
						const codigoOpcao = this.getNodeParameter('codigoOpcao', i) as string;
						const dataVencimento = this.getNodeParameter('dataVencimento', i) as string;
						const valorEntrada = this.getNodeParameter('valorEntrada', i) as number;
						const quantidadeParcela = this.getNodeParameter('quantidadeParcela', i) as number;
						const valorParcela = this.getNodeParameter('valorParcela', i) as number;
						const tipoSimulacao = this.getNodeParameter('tipoSimulacao', i) as string;
						const listaContratoParcelasRaw = this.getNodeParameter('listaContratoParcelas', i) as string;
						const obterSimulacaoVistaSemDesconto = this.getNodeParameter('obterSimulacaoVistaSemDesconto', i) as boolean;

						let listaContratoParcelas: IDataObject = {};
						try {
							listaContratoParcelas = listaContratoParcelasRaw ? JSON.parse(listaContratoParcelasRaw) : {};
						} catch (err) {
							throw new NodeOperationError(this.getNode(), 'Campo listaContratoParcelas inválido. Deve ser um JSON no formato { "contratoParcelas": [ { "contrato": "string", "parcelas": [0] } ] }');
						}

						const payload: IDataObject = {
							crm,
							carteira,
							contrato,
							codigoOpcao,
							dataVencimento,
							valorEntrada,
							quantidadeParcela,
							valorParcela,
							tipoSimulacao,
							listaContratoParcelas,
							obterSimulacaoVistaSemDesconto
						};

						responseData = await negocieApiRequest.call(
							this, 
							'POST', 
							'/api/v5/busca-opcao-pagamento', 
							payload, 
							{
								'Authorization': `Bearer ${token}`,
								'accept': 'application/json',
								'Content-Type': 'application/json'
							}, 
							resourceBaseUrl
						);
					} else if (operation === 'negociar_divida') {
						// Negociar dívida (POST) - usa o mesmo endpoint de emitir boleto com mesmos campos
						const token = this.getNodeParameter('token', i) as string;
						const crm = this.getNodeParameter('crm', i) as string;
						const carteira = this.getNodeParameter('carteira', i) as number;
						const contrato = this.getNodeParameter('contrato', i) as string;
						const dataVencimento = this.getNodeParameter('dataVencimento', i) as string;
						const fase = this.getNodeParameter('fase', i) as string;
						const valor = this.getNodeParameter('valor', i) as number;
						const parcelas = this.getNodeParameter('parcelas', i) as number;
						const identificador = this.getNodeParameter('identificador', i) as string;
						const opcaoDebitoConta = this.getNodeParameter('opcaoDebitoConta', i) as boolean;
						const opcaoChequeEspecial = this.getNodeParameter('opcaoChequeEspecial', i) as boolean;
						const tipoContrato = this.getNodeParameter('tipoContrato', i) as string;

						const payload: IDataObject = {
							crm: crm,
							contrato: contrato,
							carteira: carteira,
							fase: fase,
							valor: valor,
							parcelas: parcelas,
							dataVencimento: dataVencimento,
							identificador: identificador,
							opcaoDebitoConta: opcaoDebitoConta,
							opcaoChequeEspecial: opcaoChequeEspecial,
							tipoContrato: tipoContrato
						};

						responseData = await negocieApiRequest.call(
							this, 
							'POST', 
							'/api/v5/emitir-boleto', 
							payload, 
							{
								'Authorization': `Bearer ${token}`,
								'accept': 'application/json',
								'Content-Type': 'application/json'
							}, 
							resourceBaseUrl
						);
					} else if (operation === 'emitir_2via_dividas') {
						// Emitir segunda via de boleto (POST) - pagamento
						const token = this.getNodeParameter('token', i) as string;
						const crm = this.getNodeParameter('crm', i) as string;
						const contrato = this.getNodeParameter('contrato', i) as string;
						const cnpj_Cpf = this.getNodeParameter('cnpj_Cpf', i) as string;
						const codigoCarteira = this.getNodeParameter('codigoCarteira', i) as number;
						const fase = this.getNodeParameter('fase', i) as string;
						const dataVencimento = this.getNodeParameter('dataVencimento', i) as string;
						const id = this.getNodeParameter('id', i) as string;
						const nossoNumero = this.getNodeParameter('nossoNumero', i) as string;
						const quantidadeParcela = this.getNodeParameter('quantidadeParcela', i) as number;
						const valorBoleto = this.getNodeParameter('valorBoleto', i) as number;
						const tipoBoleto = this.getNodeParameter('tipoBoleto', i) as string;

						const payload: IDataObject = {
							crm,
							contrato,
							cnpj_Cpf,
							codigoCarteira,
							fase,
							dataVencimento,
							id,
							nossoNumero,
							quantidadeParcela,
							valorBoleto,
							tipoBoleto,
						};

						responseData = await negocieApiRequest.call(
							this,
							'POST',
							'/api/v5/emitir-boleto-segunda-via',
							payload,
							{
								'Authorization': `Bearer ${token}`,
								'accept': 'application/json',
								'Content-Type': 'application/json'
							},
							resourceBaseUrl
						);
					} else if (operation === 'buscar_dividas') {
						// Buscar dívidas de uma financeira específica ou de todas as financeiras (quando financeira = 'TODAS' | '*' | 'ALL')
						const token = this.getNodeParameter('token', i) as string;
						// Sem variáveis de entrada: sempre derivar via busca-credores e agregar todas as financeiras

						// 1) Buscar credores (GET) - só precisa do token
						const credoresResponse = await negocieApiRequest.call(
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

						// Extrair campos de pessoa do retorno de busca-credores
						const credoresObj = credoresResponse as IDataObject;
						const credoresData = (credoresObj['data'] as IDataObject) || ({} as IDataObject);
						const pessoaNome = (credoresObj['nome'] as string) ?? (credoresData['nome'] as string);
						const pessoaNomeMae = (credoresObj['nomeMae'] as string) ?? (credoresData['nomeMae'] as string);
						const pessoaCnpjCpf = (credoresObj['cnpJ_CPF'] as string) ?? (credoresData['cnpJ_CPF'] as string);
						const pessoaDataNascimento = (credoresObj['dataNascimento'] as string) ?? (credoresData['dataNascimento'] as string);
						const pessoaEmail = (credoresObj['email'] as string) ?? (credoresData['email'] as string);
						const pessoaTelefones = ((credoresObj['telefones'] as IDataObject[]) ?? (credoresData['telefones'] as IDataObject[]) ?? []) as IDataObject[];

						// 2) Derivar mapa de Financeira -> CRMs a partir do retorno acima
						const financeirasMap: Record<string, string[]> = {};
						try {
							const credoresList: IDataObject[] = Array.isArray(credoresResponse)
								? (credoresResponse as IDataObject[])
								: ((credoresResponse as IDataObject)?.credores as IDataObject[]) || ((credoresResponse as IDataObject)?.data as IDataObject[]) || [];

							for (const item of credoresList) {
								// Cada item representa um credor no campo 'credores' do retorno
								const nomeFinanceira = (item['financeira'] as string) ?? (item['nome'] as string);
								if (!nomeFinanceira) continue;

								let crms: string[] = [];
								// 1) CRMs diretamente no array 'crms'
								const crmsArray = item['crms'] as string[];
								if (Array.isArray(crmsArray)) {
									crms = crms.concat(crmsArray.filter(Boolean));
								}
								// 2) CRMs provenientes de cada item em 'carteiraCrms'
								const carteiraCrms = item['carteiraCrms'] as IDataObject[];
								if (Array.isArray(carteiraCrms)) {
									for (const cc of carteiraCrms) {
										const ccCrm = cc['crm'] as string;
										if (ccCrm) crms.push(ccCrm);
									}
								}
								// Deduplicar
								crms = Array.from(new Set(crms)).filter(Boolean);

								if (!financeirasMap[nomeFinanceira]) {
									financeirasMap[nomeFinanceira] = [];
								}
								financeirasMap[nomeFinanceira] = Array.from(new Set([...(financeirasMap[nomeFinanceira] || []), ...crms]));
							}
						} catch (err) {
							// Caso falhe a extração, o mapa pode ficar vazio e tratamos com fallback abaixo
						}

						// 3) Montar chamadas de busca-divida - sempre agregando todas as financeiras
						// Modo ALL: iterar sobre todas as financeiras encontradas e agregar resultados
						const todasDividas: IDataObject[] = [];
						const keys = Object.keys(financeirasMap);
						if (keys.length === 0) {
							throw new NodeOperationError(this.getNode(), 'Nenhuma financeira encontrada via busca-credores para o devedor.');
						}

						for (const financeiraNome of keys) {
							const crms = financeirasMap[financeiraNome] || [];
							const payload: IDataObject = { financeira: financeiraNome, crms };
							const result = await negocieApiRequest.call(
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

							const dividasArray: IDataObject[] = Array.isArray(result)
								? (result as IDataObject[])
								: (((result as IDataObject)['dividas'] as IDataObject[]) ?? []);

							const mapped = dividasArray.map((d: IDataObject) => {
								const crmVal = (d['crm'] as string) ?? (crms[0] as string);
								return { ...d, financeira: financeiraNome, crm: crmVal } as IDataObject;
							});

							todasDividas.push(...mapped);
						}

						const todasDividasComDevedor: IDataObject[] = todasDividas.map((d: IDataObject) => {
							return {
								...d,
								devedor: {
									nome: pessoaNome,
									nomeMae: pessoaNomeMae,
									cpfCnpj: pessoaCnpjCpf,
									dataNascimento: pessoaDataNascimento,
									email: pessoaEmail,
									telefones: pessoaTelefones,
								} as IDataObject,
							} as IDataObject;
						});

						responseData = todasDividasComDevedor as unknown as IDataObject;
					} else if (operation === 'buscar_acordos') {
						const token = this.getNodeParameter('token', i) as string;

						const credoresResponse = await negocieApiRequest.call(
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

						const credoresObj = credoresResponse as IDataObject;
						const credoresData = (credoresObj['data'] as IDataObject) || ({} as IDataObject);
						const pessoaNome = (credoresObj['nome'] as string) ?? (credoresData['nome'] as string);
						const pessoaNomeMae = (credoresObj['nomeMae'] as string) ?? (credoresData['nomeMae'] as string);
						const pessoaCnpjCpf = (credoresObj['cnpJ_CPF'] as string) ?? (credoresData['cnpJ_CPF'] as string);
						const pessoaDataNascimento = (credoresObj['dataNascimento'] as string) ?? (credoresData['dataNascimento'] as string);
						const pessoaEmail = (credoresObj['email'] as string) ?? (credoresData['email'] as string);
						const pessoaTelefones = ((credoresObj['telefones'] as IDataObject[]) ?? (credoresData['telefones'] as IDataObject[]) ?? []) as IDataObject[];

						const financeirasMap: Record<string, string[]> = {};
						try {
							const credoresList: IDataObject[] = Array.isArray(credoresResponse)
								? (credoresResponse as IDataObject[])
								: ((credoresResponse as IDataObject)?.credores as IDataObject[]) || ((credoresResponse as IDataObject)?.data as IDataObject[]) || [];

							for (const item of credoresList) {
								const nomeFinanceira = (item['financeira'] as string) ?? (item['nome'] as string);
								if (!nomeFinanceira) continue;

								let crms: string[] = [];
								const crmsArray = item['crms'] as string[];
								if (Array.isArray(crmsArray)) {
									crms = crms.concat(crmsArray.filter(Boolean));
								}
								const carteiraCrms = item['carteiraCrms'] as IDataObject[];
								if (Array.isArray(carteiraCrms)) {
									for (const cc of carteiraCrms) {
										const ccCrm = cc['crm'] as string;
										if (ccCrm) crms.push(ccCrm);
									}
								}
								crms = Array.from(new Set(crms)).filter(Boolean);

								if (!financeirasMap[nomeFinanceira]) {
									financeirasMap[nomeFinanceira] = [];
								}
								financeirasMap[nomeFinanceira] = Array.from(new Set([...(financeirasMap[nomeFinanceira] || []), ...crms]));
							}
						} catch (err) {}

						const todosAcordos: IDataObject[] = [];
						const keys = Object.keys(financeirasMap);
						if (keys.length === 0) {
							throw new NodeOperationError(this.getNode(), 'Nenhuma financeira encontrada via busca-credores para o devedor.');
						}

						for (const financeiraNome of keys) {
							const crms = financeirasMap[financeiraNome] || [];
							const payload: IDataObject = { financeira: financeiraNome, crms };
							const result = await negocieApiRequest.call(
								this,
								'POST',
								'/api/v5/busca-acordo',
								payload,
								{
									'Authorization': `Bearer ${token}`,
									'accept': 'application/json',
									'Content-Type': 'application/json'
								},
								resourceBaseUrl
							);

							const acordosArray: IDataObject[] = Array.isArray(result)
								? (result as IDataObject[])
								: (((result as IDataObject)['acordos'] as IDataObject[]) ?? []);

							const mapped = acordosArray.map((a: IDataObject) => {
								const crmVal = (a['crm'] as string) ?? (crms[0] as string);
								return { ...a, financeira: financeiraNome, crm: crmVal } as IDataObject;
							});

							todosAcordos.push(...mapped);
						}

						const todosAcordosComDevedor: IDataObject[] = todosAcordos.map((a: IDataObject) => {
							return {
								...a,
								devedor: {
									nome: pessoaNome,
									nomeMae: pessoaNomeMae,
									cpfCnpj: pessoaCnpjCpf,
									dataNascimento: pessoaDataNascimento,
									email: pessoaEmail,
									telefones: pessoaTelefones,
								} as IDataObject,
							}
						});

						responseData = todosAcordosComDevedor as unknown as IDataObject;
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
