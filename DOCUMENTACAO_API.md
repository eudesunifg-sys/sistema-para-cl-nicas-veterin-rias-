# 📄 Documentação da API — PetSOS

Este documento complementa o escopo do projeto PetSOS, registrando sugestões de melhorias que ainda não foram implementadas e que atendem aos requisitos do professor Petros nas 3 aulas do curso de Projeto e Engenharia de Software 2026.

## 🚀 Sugestões de Melhoria Pendentes

### 1. Swagger / OpenAPI (Aula 2 — A API)

O professor solicita documentação interativa da API via Swagger (`/docs`) para testar endpoints REST.

**Status no PetSOS:** Não implementado. O Payload Admin disponibiliza playground da API apenas em `/admin`, restrito a administradores do CMS.

**Sugestão:** Configurar um endpoint `/api/docs` (ou similar) com OpenAPI/Swagger que expõe:
- Lista de todos os endpoints REST gerados pelo Payload para cada coleção
- Exemplo de payloads de requisição e resposta para cada método (GET, POST, PUT, DELETE)
- Status codes esperados (200, 201, 204, 404, 422)
- Interface de teste para executar chamadas diretamente no navegador

### 2. Menu de Linha de Comando (Aula 1 — O Banco)

O professor solicita um `menu.py` no terminal para operar o banco de dados via linha de comando (CRUD via terminal).

**Status no PetSOS:** Não implementado. O PetSOS é exclusivamente uma aplicação web.

**Sugestão:** Criar um script CLI (Node.js/Python) que permita:
- Listar, buscar, criar, atualizar e excluir registros de clientes, animais, consultas e relatórios
- Operar via terminal com comandos interativos
- Conectar à mesma fonte de dados do Payload

### 3. Banco de Dados como Arquivo Único Local (Aula 1)

O professor solicita que o banco seja um arquivo SQLite único (`escolar.db`).

**Status no PetSOS:** O PetSOS usa banco hospedado na nuvem (Figma Cloud / Payload), não um arquivo SQLite local.

**Sugestão:** Manter a stack atual (Next.js + Payload CMS), mas documentar claramente que o banco de dados é gerenciado pelo Payload na nuvem do Figma Make, com backup e persistência garantidos pela plataforma.

### 4. Commits Organizados por Integrante

O professor solicita repositório Git com commits organizados por cada membro da equipe.

**Status no PetSOS:** Este documento registra os 4 commits organizados por integrante.

## 👥 Mapa de Responsabilidades (4 Commits)

| Commit | Responsável | O que foi adicionado |
|--------|-------------|----------------------|
| 1 | Eudes Portela | Nomes dos integrantes (`INTEGRANTES.md`) |
| 2 | Gabriel Geraldo | Casos de teste QA (`Casos_de_Teste_100.xlsx`) |
| 3 | Lara Dantas | Análise de escopo vs. slides do professor (`ESCOPO_ANALISADO.md`) |
| 4 | Lázaro Alves | Documentação da API e sugestões de melhoria (`DOCUMENTACAO_API.md`) |

## 📋 Coleções do Payload (7 Entidades)

| Coleção | Uso |
|---------|-----|
| `users` | Usuários do sistema (tutores, veterinários, administradores) |
| `pets` | Cadastro de animais de estimação |
| `appointments` | Agendamento de consultas |
| `lost-reports` | Relatórios de pets perdidos/encontrados |
| `media` | Upload de imagens (fotos de pets, documentos) |
| `folders` | Organização de arquivos e pastas |
| `tags` | Etiquetas para categorização |

## 🔗 Endpoints REST (Gerados pelo Payload)

Cada coleção expõe automaticamente:
- `GET /api/:collection` — Listar registros
- `GET /api/:collection/:id` — Detalhe de um registro
- `POST /api/:collection` — Criar registro
- `PUT /api/:collection/:id` — Atualizar registro
- `DELETE /api/:collection/:id` — Excluir registro

## 📄 Licença

Este projeto está sob a licença MIT.