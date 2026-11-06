# RentFlow — Sistema de aluguel de carros

Aplicação de aluguel de carros com interface React + Vite, API Spring Boot e banco PostgreSQL no Supabase.

## Requisitos

- Node.js e npm.
- JDK 25.
- Maven 3.9 ou superior.
- Projeto no Supabase, caso queira usar o banco de dados.

## 1. Instalar as dependências do frontend

Abra o PowerShell na pasta principal do projeto e execute uma vez:

```powershell
npm install
```

## 2. Configurar o Supabase

No painel do Supabase, abra **Connect** e copie os dados de conexão PostgreSQL. Para esse projeto, use a conexão direta se sua rede aceitar IPv6; caso contrário, use **Session pooler** na porta `5432`. O usuário pode ser `postgres` na conexão direta ou `postgres.<PROJECT-REF>` no pooler. Evite o **Transaction pooler** (porta `6543`) com Hibernate.

Antes da primeira execução, abra **SQL Editor** no Supabase e execute o conteúdo de [`backend/src/main/resources/schema.sql`](backend/src/main/resources/schema.sql).

## 3. Configurar e iniciar a API (Terminal 1)

As configurações do banco ficam em `backend/.env`, que não é enviado ao Git. Esse arquivo já está criado com o endereço e usuário Supabase informados para este projeto; abra-o e preencha `SUPABASE_DB_PASSWORD` com a senha atual do banco, sem aspas. Se usar outro projeto Supabase, copie `backend/.env.example` para `backend/.env` e substitua endereço, usuário e senha pelos valores exibidos em **Connect**. Não coloque a senha em arquivos do frontend.

Depois, abra o PowerShell na pasta principal do projeto e inicie o backend com:

```powershell
cd backend
powershell.exe -ExecutionPolicy Bypass -File .\iniciar.ps1
```

O script configura Java/Maven e carrega `backend/.env` automaticamente. Se o JDK ou Maven estiver instalado em outro caminho, ajuste os caminhos no arquivo `backend/iniciar.ps1`. Deixe o terminal aberto. A API estará disponível em `http://localhost:8080/api`.

## 4. Iniciar a interface (Terminal 2)

Abra outro terminal na pasta principal do projeto e execute:

```powershell
npm run dev
```

Abra o endereço mostrado pelo Vite, normalmente `http://localhost:5173`. A página inicial pública permite conhecer as funcionalidades sem fazer login; use **Entrar** ou **Criar conta** para acessar o sistema. A variável `VITE_API_URL` em `frontend/.env` aponta para `http://localhost:8080/api`. Se alterar esse endereço, reinicie o servidor do Vite.

## 5. Confirmar que o banco está conectado

Com os dois servidores ligados, crie uma conta pela interface. O cadastro deve entrar na tabela `usuarios` do Supabase; a senha será armazenada como hash protegido, e não em texto legível. Saia e entre com a mesma conta para confirmar o login. Se houver erro, confira as mensagens no Terminal 1 e confirme os valores em `backend/.env`.

## Rodar somente a interface

Sem a API, o frontend pode funcionar com dados locais de demonstração no navegador, desde que `VITE_API_URL` esteja vazio ou ausente. Esses dados não são sincronizados com o Supabase. Para usar cadastro, login e informações persistidas, rode a API e conecte o banco conforme os passos acima.

## Estrutura do projeto

```text
frontend/                  Interface React + Vite
  src/                     Telas, estilos e cliente da API
  public/                  Logo e ícone do navegador
backend/                   API Spring Boot
  src/main/java/           controller, service, repository, model e config
  src/main/resources/      configuração e schema SQL
docs/                      Atividade, histórias e diagramas UML
```

## Funcionalidades

- Página pública com apresentação dos recursos e acesso ao cadastro/login.
- Cadastro e login de clientes e agentes.
- Criar, consultar, modificar e cancelar pedidos de aluguel.
- Avaliação financeira por agente e concessão de crédito por agente bancário.
- Execução de contrato após aprovação.
- Cadastro de até três rendimentos por cliente.

Rotas principais: `POST /auth/cadastro`, `POST /auth/login`, `POST /auth/logout`; `GET/POST /pedidos`, `PATCH/DELETE /pedidos/{id}`; `PUT /clientes/me`; `GET /contratos` e `POST /contratos/pedido/{id}/executar`.

Para implementar novas funções, crie ou ajuste o modelo em `backend/src/main/java/.../model`, a regra e o acesso em `service` e `repository`, e uma rota em `controller`. Depois consuma essa rota na interface por `frontend/src/services/api.js`. A conexão PostgreSQL deve permanecer somente no backend.
