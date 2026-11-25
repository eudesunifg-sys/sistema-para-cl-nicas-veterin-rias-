# 📋 Análise de Escopo — PetSOS vs. Slides do Professor Petros

Este documento analisa o que o professor Petros solicita nas 3 aulas do curso de Projeto e Engenharia de Software 2026 e o que o projeto PetSOS já atende e o que ainda falta.

## 📚 Resumo das 3 Aulas

| Aula | Tema | Tecnologia | Arquivo principal |
|------|------|------------|-------------------|
| Aula 1 | O Banco | SQLite + Python | `banco.py`, `menu.py`, `escolar.db` |
| Aula 2 | A API | FastAPI | `api.py`, `/docs` (Swagger) |
| Aula 3 | A Tela | HTML + JavaScript | `static/index.html`, `static/app.js` |

## ✅ O que o PetSOS JÁ ATENDE

### Aula 1 — Banco de Dados (SQLite + Python)
| Requisito da Aula 1 | Como o PetSOS atende |
|---------------------|----------------------|
| Criar banco de dados e tabelas | Payload CMS gerencia coleções automaticamente |
| Colunas com tipos e restrições | Cada coleção define campos com `type`, `required`, `unique`, validações |
| Operações CRUD como funções Python | Server Actions e rotas da API Payload implementam CRUD |
| Banco como arquivo único (`escolar.db`) | Banco hospedado na nuvem do Figma Cloud (via Payload) |
| Evitar SQL injection | Payload usa queries tipadas e seguras internamente |
| Publicar o projeto no GitHub | ✅ Repositório no GitHub |

### Aula 2 — API REST (FastAPI)
| Requisito da Aula 2 | Como o PetSOS atende |
|---------------------|----------------------|
| Endpoints HTTP (GET, POST, PUT, DELETE) | Payload gera endpoints REST para cada coleção |
| Cinco endpoints CRUD por recurso | Cada coleção expõe list, detail, create, update, delete |
| Status codes HTTP (200, 201, 204, 404, 422) | Payload retorna códigos HTTP padrão; Server Actions usam estados de erro |
| Validação com modelos (Pydantic) | Validação no cliente (HTML5 + JS) e no servidor (Server Actions + Payload schema) |
| Testar via Swagger (`/docs`) | Payload Admin disponibiliza playground da API em `/admin` |

### Aula 3 — Interface Web (HTML + JavaScript)
| Requisito da Aula 3 | Como o PetSOS atende |
|---------------------|----------------------|
| HTML, CSS, JavaScript em páginas web | Next.js App Router com React 19 + Tailwind CSS v4 |
| Servir arquivos estáticos | Pasta `public/` com imagens e favicon |
| `fetch` para GET, POST, PUT, DELETE | Server Actions e chamadas diretas ao Payload |
| Tabela renderizada a partir de JSON | Dashboard exibe cards com dados vindos do backend |
| Botões Editar e Deletar | Ações nos módulos do sistema |
| Prevenir XSS | React escapa automaticamente conteúdo via JSX |
| Validação frontend + backend | Formulários usam `required`, `minLength`, `pattern` + validação no Server Action |
| Debug com DevTools | Console, Network e Source Maps disponíveis |

## ❌ O que FALTA no Escopo do Professor Petros

Itens solicitados pelo professor que ainda não estão implementados no PetSOS:

1. **Menu de linha de comando (`menu.py`)** — A Aula 1 solicita um menu no terminal para usar o banco (CRUD via terminal). O PetSOS é exclusivamente web; não há interface de linha de comando.

2. **Swagger/OpenAPI (`/docs`)** — A Aula 2 solicita documentação interativa da API via Swagger para testar os endpoints. O PetSOS não expõe um Swagger UI público; a documentação da API está apenas no Payload Admin (`/admin`).

3. **Banco de dados como arquivo único (`escolar.db`)** — A Aula 1 solicita que o banco seja um arquivo SQLite local. O PetSOS usa banco hospedado na nuvem (Figma Cloud / Payload). Este é um diferencial de stack intencional, mas não é um "arquivo único local".

4. **Publicar o projeto no GitHub com commits organizados por cada integrante** — O repositório está no GitHub, mas precisa de commits organizados por cada membro da equipe.

## 📌 Plano de Ação para os 4 Commits

| Commit | Responsável | O que será adicionado |
|--------|-------------|----------------------|
| 1 | Eudes Portela | Nomes dos integrantes do projeto |
| 2 | Gabriel Geraldo | Casos de teste (100 casos QA) |
| 3 | Lara Dantas | Análise de escopo faltante (este documento) |
| 4 | Lázaro Alves | Documentação da API (OpenAPI/Swagger) e sugestão de CLI menu |

## 🎯 Conclusão

O PetSOS atende **todos os requisitos funcionais** das 3 aulas do professor Petros, com a diferença de stack (Next.js + Payload CMS em vez de Python + FastAPI + SQLite). Os itens que faltam são principalmente diferenciais de apresentação: menu de terminal, Swagger UI público e banco local como arquivo único. Estes podem ser adicionados como melhorias futuras sem afetar as funcionalidades principais do sistema.