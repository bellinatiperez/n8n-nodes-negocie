# n8n-nodes-negocie

Um nó personalizado para n8n que permite integração com a API da Negocie, facilitando a gestão de negociações de dívidas, autenticação de devedores e processamento de pagamentos.

## 📋 Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Recursos Disponíveis](#recursos-disponíveis)
- [Exemplos de Uso](#exemplos-de-uso)
- [Autenticação](#autenticação)
- [Solução de Problemas](#solução-de-problemas)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre

O **n8n-nodes-negocie** é um nó customizado desenvolvido para integrar workflows do n8n com a API da Negocie. Este nó permite automatizar processos relacionados à negociação de dívidas, consulta de acordos, processamento de pagamentos e autenticação de devedores.

### Principais Benefícios

- ✅ Integração nativa com a API da Negocie
- ✅ Suporte completo a OAuth2
- ✅ Interface intuitiva no n8n
- ✅ Tratamento robusto de erros
- ✅ Documentação completa da API

## 🚀 Funcionalidades

### Recursos Principais

1. **Autenticação**: Autenticação segura de devedores
2. **Dívidas**: Consulta e gerenciamento de dívidas
3. **Pagamentos**: Processamento e emissão de boletos
4. **Acordos**: Consulta de acordos formalizados

### Operações Suportadas

#### Autenticação
- Autenticar devedor com CPF/CNPJ

#### Dívidas
- Buscar dívidas do devedor
- Buscar opções de pagamento
- Negociar dívida

#### Pagamentos
- Emitir segunda via de boleto

#### Acordos
- Buscar acordos do devedor

## 📋 Pré-requisitos

Antes de instalar o nó, certifique-se de ter:

- **n8n** versão 0.190.0 ou superior
- **Node.js** versão 16.x ou superior
- **npm** ou **yarn** para gerenciamento de pacotes
- Credenciais válidas da API Negocie (Client ID e Client Secret)

## 📦 Instalação

### Instalação via npm

```bash
npm install @bellinatiperez/n8n-nodes-negocie
```

### Instalação via Interface do n8n

1. Acesse as configurações do n8n
2. Vá para "Community Nodes"
3. Clique em "Install"
4. Digite: `@bellinatiperez/n8n-nodes-negocie`
5. Clique em "Install"

### Instalação Manual

1. Clone o repositório:
```bash
git clone https://github.com/bellinatiperez/n8n-nodes-negocie.git
```

2. Instale as dependências:
```bash
cd n8n-nodes-negocie
npm install
```

3. Compile o projeto:
```bash
npm run build
```

4. Vincule o pacote localmente:
```bash
npm link
```

5. No diretório do n8n, vincule o nó:
```bash
npm link @bellinatiperez/n8n-nodes-negocie
```

## ⚙️ Configuração

### 1. Configuração de Credenciais OAuth2

1. No n8n, vá para **Credentials** → **Create New**
2. Selecione **Negocie OAuth2 API**
3. Preencha os campos:
   - **Client ID**: Seu Client ID da Negocie
   - **Client Secret**: Seu Client Secret da Negocie
   - **Authorization URL**: `https://api.devbpbr.services/auth/dialog`
   - **Access Token URL**: `https://api.devbpbr.services/auth/token`

### 2. Configuração do Nó

1. Adicione o nó **Negocie** ao seu workflow
2. Selecione o **Resource** desejado
3. Escolha a **Operation** apropriada
4. Configure os parâmetros necessários

## 📚 Recursos Disponíveis

### 🔐 Autenticação

**Operações:**
- `Autenticar devedor`: Autentica um devedor usando CPF/CNPJ

**Parâmetros:**
- `ClientId`: ID do cliente fornecido pela Negocie
- `ClientSecret`: Chave secreta do cliente
- `CPF ou CNPJ`: Documento do devedor

### 💰 Dívidas

**Operações:**
- `Buscar dívidas`: Consulta dívidas de um devedor
- `Buscar opções de pagamento`: Obtém opções de pagamento para uma dívida
- `Negociar dívida`: Inicia negociação baseada na opção selecionada

**Parâmetros:**
- `Token`: Bearer token de autenticação
- `CPF ou CNPJ`: Documento do devedor
- `Financeira`: Instituição financeira (quando aplicável)

### 💳 Pagamentos

**Operações:**
- `Emitir segunda via de boleto`: Gera nova via do boleto

**Parâmetros:**
- `Token`: Bearer token de autenticação
- `CPF ou CNPJ`: Documento do devedor

### 📋 Acordos

**Operações:**
- `Buscar acordos`: Consulta acordos formalizados do devedor

**Parâmetros:**
- `Token`: Bearer token de autenticação
- `CPF ou CNPJ`: Documento do devedor

## 💡 Exemplos de Uso

### Exemplo 1: Autenticação de Devedor

```json
{
  "resource": "autenticacao",
  "operation": "autenticar_devedor",
  "clientId": "seu_client_id",
  "clientSecret": "seu_client_secret",
  "documento": "12345678901"
}
```

### Exemplo 2: Consulta de Dívidas

```json
{
  "resource": "divida",
  "operation": "buscar_dividas",
  "token": "bearer_token_aqui",
  "documento": "12345678901"
}
```

### Exemplo 3: Workflow Completo

1. **Nó 1**: Autenticar devedor
2. **Nó 2**: Buscar dívidas usando o token retornado
3. **Nó 3**: Processar resultados e enviar notificação

## 🔒 Autenticação

O nó utiliza OAuth2 para autenticação segura com a API da Negocie. O fluxo de autenticação segue o padrão:

1. **Authorization Code Grant**: Obtenção do código de autorização
2. **Token Exchange**: Troca do código por access token
3. **API Calls**: Uso do token nas chamadas da API

### URLs de Autenticação

- **Authorization URL**: `https://api.devbpbr.services/auth/dialog`
- **Token URL**: `https://api.devbpbr.services/auth/token`
- **API Base URL**: `https://68b38a8fc28940c9e69f13f1.mockapi.io`

## 🔧 Solução de Problemas

### Problemas Comuns

#### Erro de Autenticação
**Sintoma**: "Authentication failed" ou "Invalid credentials"

**Soluções:**
1. Verifique se o Client ID e Client Secret estão corretos
2. Confirme se as URLs de autenticação estão configuradas corretamente
3. Verifique se o token não expirou

#### Erro de Conexão
**Sintoma**: "Connection timeout" ou "Network error"

**Soluções:**
1. Verifique sua conexão com a internet
2. Confirme se a API da Negocie está disponível
3. Verifique configurações de firewall/proxy

#### Dados Inválidos
**Sintoma**: "Invalid document" ou "Bad request"

**Soluções:**
1. Verifique o formato do CPF/CNPJ (apenas números)
2. Confirme se todos os campos obrigatórios estão preenchidos
3. Valide os tipos de dados enviados

### Logs e Debugging

Para habilitar logs detalhados:

1. Configure o nível de log do n8n para `debug`
2. Monitore os logs do console para erros específicos
3. Use o modo "Continue on Fail" para workflows robustos

### FAQ

**Q: O nó não aparece na lista de nós disponíveis**
A: Certifique-se de que o pacote foi instalado corretamente e reinicie o n8n.

**Q: Como obter credenciais da API Negocie?**
A: Entre em contato com o suporte da Negocie através do email devbpbr@negocie.com.br.

**Q: É possível usar em ambiente de produção?**
A: Sim, mas certifique-se de usar credenciais de produção e configurar adequadamente os ambientes.

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/bellinatiperez/n8n-nodes-negocie.git

# Instale dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Execute linting
npm run lint

# Execute build
npm run build
```

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

## 📞 Suporte

- **Email**: devbpbr@negocie.com.br
- **Documentação da API**: https://developers.devbpbr.com/reference/introducao-rdsm
- **Issues**: https://github.com/bellinatiperez/n8n-nodes-negocie/issues

---

**Desenvolvido com ❤️ pela equipe BP Dev**