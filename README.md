# MedClinic API

API REST para gerenciamento de clínica médica de pequeno porte.

**Escopo desta etapa:** construção da base de acesso do sistema — cadastro de usuários, autenticação (login com JWT) e autorização baseada em perfis (RBAC).

> As funcionalidades de gerenciamento de especialidades, médicos, pacientes e consultas serão implementadas em uma etapa futura do projeto, utilizando esta mesma base de código.

---

## 🚀 Tecnologias utilizadas

- **Node.js** — ambiente de execução
- **TypeScript** — tipagem estática
- **Express.js** — framework web
- **TypeORM** — ORM para PostgreSQL
- **PostgreSQL** — banco de dados relacional
- **bcrypt** — criptografia de senhas
- **jsonwebtoken (JWT)** — autenticação baseada em token
- **dotenv** — gerenciamento de variáveis de ambiente
- **ts-node-dev** — hot reload em desenvolvimento

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [PostgreSQL](https://www.postgresql.org/download/) (versão 14 ou superior)
- [Git](https://git-scm.com/)

---

## ⚙️ Instalação e configuração

### 1. Clonar o repositório

\`\`\`bash
git clone https://github.com/Robcfdf/medclinic-api.git
cd medclinic-api
\`\`\`

### 2. Instalar as dependências

\`\`\`bash
npm install
\`\`\`

### 3. Criar o banco de dados

No PostgreSQL (via pgAdmin, psql ou extensão do VS Code), crie um banco chamado `medclinic`:

\`\`\`sql
CREATE DATABASE medclinic;
\`\`\`

A estrutura da tabela `users` pode ser conferida em `src/database/schema.sql`, ou será criada automaticamente pelo TypeORM na primeira execução (modo `synchronize`).

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, com o seguinte conteúdo (ajuste conforme seu ambiente):

\`\`\`
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=medclinic

JWT_SECRET=uma_chave_secreta_bem_dificil_de_adivinhar
JWT_EXPIRES_IN=1h
\`\`\`

### 5. Executar a aplicação

Modo desenvolvimento (com hot reload):
\`\`\`bash
npm run dev
\`\`\`

Modo produção:
\`\`\`bash
npm run build
npm start
\`\`\`

Se tudo estiver certo, você verá no terminal:
\`\`\`
Conexão com o banco de dados estabelecida com sucesso!
Servidor rodando na porta 3000
\`\`\`

---

## 🏗️ Arquitetura do projeto

O projeto segue uma arquitetura **MVC organizada em camadas**, promovendo separação de responsabilidades, baixo acoplamento e facilidade de manutenção. A estrutura já está preparada para receber, em etapas futuras, os módulos de domínio da clínica (especialidades, médicos, pacientes e consultas), sem necessidade de reestruturação.

### Estrutura de pastas

\`\`\`
medclinic-api/
├── src/
│   ├── controllers/       # Recebem requisições HTTP, chamam os services e retornam respostas
│   │   ├── AuthController.ts
│   │   ├── UserController.ts
│   │   └── AdminController.ts
│   ├── services/          # Regras de negócio e validações
│   │   └── AuthService.ts
│   ├── repositories/      # Comunicação com o banco de dados via TypeORM
│   │   └── UserRepository.ts
│   ├── entities/          # Entidades do TypeORM (tabelas do banco)
│   │   └── User.ts
│   ├── middlewares/       # Autenticação, autorização e tratamento de erros
│   │   ├── authMiddleware.ts
│   │   ├── roleMiddleware.ts
│   │   ├── errorMiddleware.ts
│   │   └── notFoundMiddleware.ts
│   ├── routes/            # Definição dos endpoints da API
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── adminRoutes.ts
│   ├── dtos/              # Objetos de transferência de dados (entrada/saída)
│   │   ├── CreateUserDTO.ts
│   │   └── LoginDTO.ts
│   ├── database/          # Configuração de conexão e script SQL
│   │   ├── data-source.ts
│   │   └── schema.sql
│   ├── utils/              # Funções auxiliares reutilizáveis
│   │   ├── passwordUtils.ts
│   │   └── jwtUtils.ts
│   └── server.ts          # Ponto de entrada da aplicação
├── .env                    # Variáveis de ambiente (não versionado)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

### Fluxo de uma requisição

\`\`\`
Cliente HTTP → Routes → Middlewares (Auth/RBAC) → Controller → Service → Repository (TypeORM) → PostgreSQL
\`\`\`

---

## 🔒 Segurança aplicada

- Senhas nunca armazenadas ou retornadas em texto puro (hash com **bcrypt**)
- Autenticação via **token JWT** com tempo de expiração definido
- Autorização por perfil (**RBAC**) validada em middleware próprio
- Variáveis sensíveis (credenciais do banco, chave JWT) mantidas em `.env`, fora do código-fonte

---

## 👤 Perfis de acesso disponíveis

| Perfil | Descrição |
|---|---|
| `admin` | Acesso completo às funcionalidades da API |
| `atendente` | Acesso operacional, com permissões restritas (perfil padrão no cadastro) |

> Por padrão, todo novo usuário cadastrado recebe o perfil `atendente`. A promoção para `admin` deve ser feita manualmente no banco de dados nesta etapa do projeto.

---

## 📡 Documentação dos Endpoints

### Autenticação

#### `POST /auth/register`
Cadastra um novo usuário no sistema.

**Body (JSON):**
```json
{
  "nome": "Admin Teste",
  "email": "admin@teste.com",
  "senha": "123456"
}
```

**Resposta de sucesso — `201 Created`:**
```json
{
  "id": "f3d52fd7-d537-4db0-ba0c-141ac720cb39",
  "nome": "Admin Teste",
  "email": "admin@teste.com",
  "role": "atendente",
  "createdAt": "2026-09-12T20:03:23.520Z"
}
```

**Possíveis erros:**
| Status | Situação |
|---|---|
| `400` | Campos obrigatórios ausentes ou e-mail em formato inválido |
| `409` | E-mail já cadastrado |

---

#### `POST /auth/login`
Autentica um usuário e retorna um token JWT.

**Body (JSON):**
```json
{
  "email": "admin@teste.com",
  "senha": "123456"
}
```

**Resposta de sucesso — `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Possíveis erros:**
| Status | Situação |
|---|---|
| `400` | E-mail ou senha ausentes |
| `401` | Credenciais inválidas |

---

### Verificação de Autenticação/Autorização

#### `GET /users/me`
Retorna os dados do usuário autenticado. **Rota protegida** — requer token JWT.

**Headers:**

Authorization: Bearer <token>
```

**Resposta de sucesso — `200 OK`:**
```json
{
  "id": "f3d52fd7-d537-4db0-ba0c-141ac720cb39",
  "nome": "Admin Teste",
  "email": "admin@teste.com",
  "role": "atendente",
  "createdAt": "2026-09-12T20:03:23.520Z"
}
```

**Possíveis erros:**
| Status | Situação |
|---|---|
| `401` | Token ausente, inválido ou expirado |

---

#### `GET /admin/ping`
Endpoint protegido, acessível **apenas** por usuários com perfil `admin`. Demonstra o funcionamento do RBAC.

**Headers:**

Authorization: Bearer <token>
```

**Resposta de sucesso — `200 OK`:**
```json
{
  "message": "Acesso autorizado! Você é um Administrador."
}
```

**Possíveis erros:**
| Status | Situação |
|---|---|
| `401` | Token ausente, inválido ou expirado |
| `403` | Usuário autenticado, mas sem permissão de Administrador |

---

## 🧪 Testando a API

Recomenda-se o uso do [Insomnia](https://insomnia.rest/) ou [Postman](https://www.postman.com/) para testar os endpoints.

Fluxo de teste sugerido:
1. Cadastre um usuário via `POST /auth/register`
2. Faça login via `POST /auth/login` e copie o token retornado
3. Use o token no header `Authorization: Bearer <token>` para acessar `GET /users/me`
4. Para testar o RBAC, promova um usuário para `admin` diretamente no banco:
```sql
   UPDATE users SET role = 'admin' WHERE email = 'seu_email_aqui';
```
5. Faça login novamente com esse usuário e acesse `GET /admin/ping`

---

## 📌 Próximos passos do projeto

Esta etapa entrega exclusivamente a base de autenticação e autorização. As próximas etapas incluirão:

- Cadastro e gerenciamento de especialidades médicas
- Cadastro e gerenciamento de médicos
- Cadastro e gerenciamento de pacientes
- Agendamento e gerenciamento de consultas

---

## 🎥 Vídeo de apresentação

O vídeo demonstrando o funcionamento da aplicação (autenticação e autorização) está disponível em:

**[Link do vídeo](https://youtu.be/bcjKAaycCWE)**

---

## 👨‍💻 Autor

Desenvolvido por **[Robson Cássio Ferreira Duarte Filho ]** como parte do Mini-Projeto Avaliativo — Módulo 02, Semana 07.