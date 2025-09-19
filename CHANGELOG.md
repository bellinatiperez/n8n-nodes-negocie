# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [0.0.14] - 2025-01-20

### Adicionado
- Atualização de versão para próxima iteração
- Documentação de changelog implementada

### Alterado
- Versão atualizada em todos os arquivos do projeto
- User-Agent atualizado para refletir nova versão

## [0.0.13] - 2025-01-20

### Adicionado
- Implementação completa da operação `buscar_opcoes_pagamento`
- Novos campos específicos para buscar opções de pagamento:
  - Campo CRM (string simples)
  - Campo Carteira (number)
  - Campo Contratos (fixedCollection)
  - Campo Data de Vencimento (dateTime)
- Lógica POST para endpoint `/api/v5/busca-opcao-pagamento`

### Corrigido
- Processamento correto do campo contratos (de fixedCollection para array de strings)
- Headers apropriados para requisições POST
- Estrutura de payload conforme especificação da API

## [0.0.12] - 2025-01-20

### Corrigido
- Erro "Could not get parameter" na operação `buscar_credores`
- Estrutura incorreta do campo CRMs no payload da API `buscar_dividas`
- Processamento do campo CRMs para array simples de strings

### Alterado
- Lógica de obtenção de parâmetros otimizada por operação
- Configuração de campos obrigatórios ajustada no Common.ts
- Remoção de `required: true` do token quando não necessário

## [0.0.11] - 2025-01-20

### Corrigido
- Correção inicial do erro de parâmetros na operação buscar_credores
- Ajustes na configuração de displayOptions

## Versões Anteriores

As versões 0.0.1 a 0.0.10 incluíram o desenvolvimento inicial do node n8n para integração com a API Negocie, implementação das operações básicas e correções de bugs menores.