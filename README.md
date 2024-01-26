# Bug-Overflow

O Bug Overflow é um repositório dedicado a fornecer uma plataforma interativa para a comunidade de desenvolvedores, permitindo a troca de perguntas e respostas relacionadas a bugs e problemas de programação

Este é um projeto de aplicativo web baseado em Node.js utilizando Express, Sequelize (ORM para interação com o banco de dados MySQL), Passport para autenticação e GitHub OAuth para login social.

### 1. Configuração Inicial

Antes de iniciar, certifique-se de ter o Node.js e o MySQL instalados no seu sistema. Em seguida, execute o seguinte comando para instalar as dependências do projeto:

```javascript
npm install
```

### 2. Configuração do Banco de Dados

O projeto utiliza o Sequelize como ORM para interação com o banco de dados MySQL. Certifique-se de configurar corretamente as informações de conexão no arquivo 'database/database.js'.

```javascript
const Sequelize = require("sequelize");

const connection = new Sequelize(
  "seu_banco_de_dados",
  "seu_usuario",
  "sua_senha",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

module.exports = connection;
```

### 3. Configuração do GitHub OAuth

O projeto utiliza o Passport e o GitHub OAuth para autenticação social. Crie um aplicativo no [GitHub Developer Settings](https://github.com/settings/developers) para obter as credenciais de cliente (client ID e client secret). Em seguida, crie um arquivo '.env' na raiz do projeto e adicione suas credenciais:

```javascript
GITHUB_CLIENT_ID = sua_client_id;
GITHUB_CLIENT_SECRET = sua_client_secret;
```

### 4. Inicialização do Projeto

Execute o seguinte comando para iniciar o servidor:

```javascript
npm run dev
```

O servidor será iniciado em http://localhost:5000.

## 5. Funcionalidades Principais

- **Página Inicial (/home):** Exibe as perguntas mais recentes.

- **Perguntas (/perguntar):** Permite que os usuários autenticados postem novas perguntas.

- **Visualização de Pergunta (/pergunta/:id):** Exibe uma pergunta específica e suas respostas.

- **Salvar Resposta (/salvarResposta):** Permite que os usuários autenticados salvem respostas para uma pergunta.

- **Busca (/buscar):** Permite que os usuários busquem perguntas com base em palavras-chave.

### 6. Autenticação

O projeto utiliza a autenticação do GitHub. Os usuários podem autenticar-se clicando no botão "Entrar com o Github".

### Documetação

[GitHub Developer Settings](https://github.com/settings/developers)
