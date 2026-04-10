# Fullstack Password Validator

[![CI-CD Password Validator](https://github.com/vitortgonzaga/atividade-C14/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/vitortgonzaga/atividade-C14/actions/workflows/ci-cd.yml)

Projeto fullstack para validação de senhas, com foco em boas práticas de engenharia de software: arquitetura em camadas, testes automatizados e pipeline CI/CD com build, artefatos e deploy.

## Objetivo

Disponibilizar uma API para validar senhas e classificar sua força, integrada a uma interface web em React para uso simples e rápido.

## Tecnologias utilizadas

### Backend

- Node.js
- Express
- Jest + Supertest

### Frontend

- React
- Vite

### CI/CD

- GitHub Actions
- Deploy por hooks (Render para backend e Vercel para frontend)

## Arquitetura e organização

O backend segue separação por responsabilidade:

- `routes`: define as rotas HTTP.
- `controllers`: trata requisição/resposta.
- `services`: aplica a regra de negócio (validação da senha).

Essa divisão reduz acoplamento e facilita manutenção, testes e evolução do projeto.

## Regras de validação da senha

A senha é validada com os seguintes critérios:

- mínimo de 8 caracteres
- pelo menos 1 letra maiúscula
- pelo menos 1 letra minúscula
- pelo menos 1 número
- pelo menos 1 caractere especial
- não conter espaços

Além da validação, o sistema classifica a força:

- `fraca`: até 3 critérios atendidos
- `media`: 4 ou 5 critérios atendidos
- `forte`: 6 critérios atendidos

## API

### Health check

- **GET** `/health`

Resposta esperada:

```json
{
  "status": "ok"
}
```

### Validar senha

- **POST** `/validate-password`

Body:

```json
{
  "password": "Abcdef1!"
}
```

Resposta (senha válida):

```json
{
  "valid": true,
  "strength": "forte",
  "errors": [],
  "suggestions": []
}
```

Resposta (senha inválida):

```json
{
  "valid": false,
  "strength": "fraca",
  "errors": [
    "A senha deve ter no mínimo 8 caracteres.",
    "A senha deve conter pelo menos 1 letra maiúscula."
  ],
  "suggestions": [
    "Use ao menos 8 caracteres.",
    "Adicione pelo menos 1 letra maiúscula (A-Z)."
  ]
}
```

## Variáveis de ambiente

### Backend

- `PORT` (opcional): porta da API (padrão `3000`)
- `FRONTEND_ORIGIN` (opcional): origem permitida no CORS (padrão `http://localhost:5173`)

### Frontend

- `VITE_API_URL`: URL base da API (ex.: `http://localhost:3000`)

## Como executar localmente

Pré-requisitos:

- Node.js 20+
- npm

### 1. Subir o backend

```bash
cd backend
npm install
npm run dev
```

API disponível em `http://localhost:3000`.

### 2. Subir o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Interface disponível em `http://localhost:5173`.

Se necessário, configure `VITE_API_URL` para a URL correta do backend.

## Testes e cobertura

No backend:

```bash
cd backend
npm test
```

Para gerar cobertura:

```bash
cd backend
npm run test:coverage
```

Para CI (relatório JSON + cobertura):

```bash
cd backend
npm run test:ci
```

## Pipeline CI/CD

O workflow `.github/workflows/ci-cd.yml` executa:

1. **Testes do backend com cobertura** e upload de artefatos.
2. **Build do backend e frontend** com publicação de artefatos empacotados.
3. **Deploy automático** (Render e Vercel) via deploy hooks, após sucesso das etapas anteriores.
4. **Criação de release** com versionamento automático (`v1.0.<run_number>`).
5. **Notificação de status** consolidando resultado de testes, build e deploy.

## Estrutura do repositório

```text
.
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── services/
│   └── tests/
├── frontend/
│   └── src/
└── README.md
```

## Uso de IA no processo

A IA foi utilizada para acelerar a estrutura inicial do projeto (base fullstack completa, organização em camadas com boas práticas e direção de CI/CD). O código final foi revisado e ajustado manualmente para aderência aos requisitos funcionais e de qualidade.
