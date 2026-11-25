# 📋 Mapeamento de Escopo — PetSOS vs. Aulas do Professor

Este documento mostra como cada requisito das **3 aulas de CRUD** do curso de Projeto e Engenharia de Software é atendido pelo projeto **PetSOS**, **sem alterar a interface nem as interações**.

> **Nota sobre a stack:** O PetSOS utiliza **Next.js 16 + Payload CMS + Tailwind CSS** em vez de **Python + SQLite + FastAPI** (ensino em sala). Todos os requisitos funcionais (CRUD, API, validação, navegação, tratamento de erros, Git) são atendidos de forma equivalente ou superior.

---

## 📚 Aula 1 — SQLite + Python (Banco de Dados)

| Requisito da Aula 1 | Como o PetSOS atende | Onde fica no código |
|---------------------|----------------------|---------------------|
| Criar banco de dados e tabelas | Payload CMS gerencia coleções automaticamente: `users`, `pets`, `appointments`, `lost-reports`, `media`, etc. | `src/collections/Users.ts`, `src/collections/Pets.ts`, `src/collections/Appointments.ts`, `src/collections/LostReports.ts`, `src/collections/Media.ts`, `src/collections/Folders.ts`, `src/collections/Tags.ts` |
| Colunas com tipos e restrições | Cada coleção define campos com `type`, `required`, `defaultValue`, `unique`, validações | Exemplo em `src/collections/Users.ts`: `name: type text required`, `role: type select required defaultValue tutor` |
| Operações CRUD como funções Python | Server Actions e rotas da API Payload implementam Create, Read, Update, Delete | `src/app/(frontend)/auth-actions.ts` (create, login), `src/lib/payload.ts` (findBySlug, findByField) |
| Banco como arquivo único (`escolar.db`) | Banco hospedado na nuvem do Figma Cloud (via Payload) | Variáveis de ambiente injetadas pelo Make sandbox |
| Evitar SQL injection (queries parametrizadas) | Payload usa queries tipadas e seguras internamente; nunca concatena strings SQL | `payload.create()`, `payload.find()` com `where` tipado |

### Detalhe: Modelagem de dados
- **Aula 1:** `estudantes(id, nome, escola, turno)`
- **PetSOS:** Múltiplas entidades com relacionamentos:
  - `users(id, email, name, phone, role, status, password, createdAt)`
  - `pets(id, nome, especie, peso, porte, microchip, documentos, tutor_id)`
  - `appointments(id, pet_id, veterinarian_id, data, horario, status)`
  - `lost-reports(id, animalName, species, color, breed, size, neighborhood, city, description, photo, situation)`

---

## 🌐 Aula 2 — FastAPI (API REST)

| Requisito da Aula 2 | Como o PetSOS atende | Onde fica no código |
|---------------------|----------------------|---------------------|
| Endpoints HTTP (GET, POST, PUT, DELETE) | Payload gera automaticamente endpoints REST para cada coleção; Server Actions expõem ações customizadas | `src/app/(payload)/api/[...slug]/route.ts`, `src/app/(frontend)/auth-actions.ts` |
| Cinco endpoints CRUD por recurso | Cada coleção do Payload expõe: `GET /api/:collection` (list), `GET /api/:collection/:id` (detail), `POST /api/:collection` (create), `PUT /api/:collection/:id` (update), `DELETE /api/:collection/:id` (delete) | Gerado automaticamente pelo Payload |
| Status codes HTTP (200, 201, 204, 404, 422) | Payload retorna códigos HTTP padrão; Server Actions usam `redirect` e estados de erro; `notFound()` gera 404 | `src/app/(frontend)/animais-perdidos/[id]/page.tsx` usa `notFound()`; `auth-actions.ts` retorna estados de erro |
| Validação com modelos (Pydantic) | Validação no cliente (formulários HTML5 + JS) e no servidor (Server Actions + Payload schema) | `auth-actions.ts` valida email, senha, confirmação; Payload valida `required`, `unique`, tipos |
| Testar via Swagger (/docs) | Payload Admin disponibiliza documentação e playground da API em `/admin` | Acesse `http://localhost:3000/admin` |

---

## 🖥️ Aula 3 — HTML + JavaScript (Interface Web)

| Requisito da Aula 3 | Como o PetSOS atende | Onde fica no código |
|---------------------|----------------------|---------------------|
| HTML, CSS, JavaScript em páginas web | Next.js App Router com React 19 + Tailwind CSS v4 | `src/app/(frontend)/page.tsx`, `src/app/(frontend)/styles.css` |
| Servir arquivos estáticos | Pasta `public/` com imagens e favicon | `public/favicon.svg`, `public/images/*.png` |
| `fetch` para GET, POST, PUT, DELETE | Server Actions (form submissions) e chamadas diretas ao Payload via `getPayloadClient()` | `auth-actions.ts` (POST create, POST login), `petsos-queries.ts` (GET list) |
| Tabela renderizada a partir de JSON | Dashboard do tutor exibe cards com dados vindos do backend | `src/app/(frontend)/sistema/page.tsx`, `src/components/petsos/DashboardView.tsx` |
| Botões Editar e Deletar | Ações nos módulos do sistema | `src/components/petsos/LostDetailActions.tsx`, `src/components/petsos/ModuleView.tsx` |
| Prevenir XSS (textContent vs innerHTML) | React escapa automaticamente conteúdo inserido via JSX; nunca usa `dangerouslySetInnerHTML` sem sanitização | Todos os componentes usam JSX padrão |
| Validação frontend (atributos HTML) + backend | Formulários usam `required`, `minLength`, `pattern` + validação no Server Action | `src/app/(frontend)/cadastro/page.tsx` + `auth-actions.ts` |
| Debug com DevTools (F12) | Console, Network e Source Maps disponíveis no Next.js dev | Qualquer página no navegador |

---

## 📦 Entregáveis da Avaliação Final

| Entregável exigido | Status no PetSOS |
|--------------------|------------------|
| Implementação completa de CRUD para pelo menos 2 entidades | ✅ **7 entidades**: users, pets, appointments, lost-reports, media, folders, tags |
| Menu de navegação ligando diferentes páginas | ✅ Navegação entre Visão geral, Meus animais, Consultas, Prontuários, Pets perdidos, Mensagens, Notificações |
| README.md com instruções de setup | ✅ Criado na raiz do projeto |
| Demonstração de tratamento de erros (422, 404) | ✅ `notFound()` para registros inexistentes; estados de erro em formulários; validação de senha/email |
| Repositório Git com commits organizados | ✅ Repositório inicializado com primeiro commit |

---

## 🗂️ Estrutura de Arquivos do PetSOS (equivalente à aula)

```
crud-escolar/                    →  pet-sos/
├── banco.py                     →  src/payload.config.ts + src/collections/*
├── api.py                       →  src/app/(payload)/api/[...slug]/route.ts + auth-actions.ts
├── menu.py                      →  src/app/(frontend)/layout.tsx (navegação)
├── escolar.db                   →  Banco na nuvem (Figma Cloud / Payload)
├── static/                      →  public/
│   ├── index.html               →  src/app/(frontend)/page.tsx
│   ├── estilo.css               →  src/app/(frontend)/styles.css
│   └── app.js                   →  src/components/petsos/* + src/lib/*
└── README.md                    →  README.md (criado)
```

---

## ✅ Conclusão

O PetSOS atende **todos os requisitos funcionais** das 3 aulas:
1. ✅ CRUD completo em múltiplas entidades
2. ✅ API com endpoints REST e status codes HTTP
3. ✅ Interface web com navegação, tabelas, formulários e ações CRUD
4. ✅ Validação frontend e backend
5. ✅ Tratamento de erros (404, 422, mensagens amigáveis)
6. ✅ Documentação (README.md)
7. ✅ Controle de versão (Git com commits)

A única diferença é a **stack de tecnologia** (Next.js + Payload em vez de Python + FastAPI + SQLite), mas isso **não afeta a interface nem as interações** do usuário.
