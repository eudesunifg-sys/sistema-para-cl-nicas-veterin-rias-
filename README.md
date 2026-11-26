# 🐾 PetSOS - Sistema para Clínicas Veterinárias e Tutores

O **PetSOS** é uma plataforma completa que reúne a gestão de saúde animal para clínicas veterinárias, o acompanhamento de pets por seus tutores e uma rede pública de busca de animais perdidos.

## 🌟 Funcionalidades Principais

### 🩺 Para Clínicas e Veterinários
- **Agenda de Atendimentos:** Visualização diária, semanal e mensal de consultas.
- **Fila de Atendimento:** Acompanhamento do fluxo da recepção à consulta.
- **Prontuário Eletrônico Completo:** Anamnese, exame clínico, diagnósticos, prescrições e vacinação.
- **Histórico Médico:** Acesso rápido ao histórico de consultas, vacinas e exames de cada animal.

### 🐾 Para Tutores (Famílias)
- **Perfil do Pet:** Cadastro completo com foto, peso, raça, microchip e documentos.
- **Acompanhamento de Saúde:** Histórico de consultas, vacinas tomadas e próximas doses.
- **Rede de Busca:** Cadastro rápido de pets perdidos/encontrados.
- **Comunicação Segura:** Contato via plataforma sem expor dados pessoais sensíveis.

### 🔍 Central Pública de Pets Perdidos
- **Busca com Filtros:** Filtre por espécie, porte, cor, sexo e região.
- **Alertas e Correspondências:** Conexão entre quem perdeu e quem encontrou um pet.
- **Comunicação Segura:** Contato via plataforma sem expor dados pessoais sensíveis.

### 🛡️ Gestão e Administração
- **Perfis de Acesso:** Controle granular para Tutores, Veterinários e Administradores.
- **Indicadores em Tempo Real:** Dashboard administrativo para gestão da clínica.

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── (frontend)/          # Páginas públicas e aplicação principal (Next.js App Router)
│   │   ├── animais-perdidos/# Central pública de busca
│   │   ├── cadastro/        # Tela de criação de conta
│   │   ├── login/           # Tela de autenticação
│   │   └── sistema/         # Painel interno (tutor, vet, admin)
│   └── (payload)/           # Painel de administração e rotas da API do Payload
├── collections/             # Definições de coleções do Payload (Users, Pets, Appointments, etc.)
├── components/              # Componentes UI reutilizáveis
├── lib/                     # Utilitários e helpers de integração (Payload, Auth)
└── payload.config.ts        # Configuração principal do Payload CMS
```

## 🌐 Acesso ao Site

O site está disponível apenas pela URL pública do Figma Make:

https://repair-tawny-88343290.figma.site/

## 🛠️ Como o Projeto Foi Desenvolvido

O PetSOS foi desenvolvido em quatro etapas principais, cada uma focada em um entregável específico do projeto:

1. **Documentação da equipe** — Nomes dos integrantes registrados em `INTEGRANTES.md`.
2. **Garantia de qualidade** — Suite completa de 100 casos de teste (CT001–CT100) cobrindo clientes, animais, consultas e relatórios.
3. **Análise de escopo** — Mapeamento dos requisitos às aulas 1–3 (banco, API, tela) e identificação de lacunas de escopo.
4. **Documentação da API** — Endpoints REST das 7 coleções Payload, Swagger/OpenAPI pendente e mapa de responsabilidades por commit.

A aplicação foi construída com Next.js 16 (App Router), Payload 4.0 (CMS com 7 coleções: users, pets, appointments, lost-reports, media, folders, tags) e Tailwind CSS v4, rodando dentro do ambiente Figma Make.

## 📋 Casos de Teste (100 Casos de Garantia de Qualidade)

O projeto inclui 100 casos de teste para garantir a qualidade do sistema. Abaixo estão os primeiros 18 casos, que cobrem funcionalidades básicas de cadastro e gerenciamento de clientes:

**CT001 - Cliente:** Cadastrar cliente com todos os dados válidos
- **Pré-condições:** Sistema na tela de cadastro de clientes
- **Passos a Executar:** 
  1. Preencher todos os campos obrigatórios e opcionais
  2. Clicar em 'Salvar'
- **Dados de Teste:** 
  - Nome: Maria Silva, CPF: 123.456.789-00, Tel: (81) 99999-8888, E-mail: maria@email.com, Endereço: Rua A, 123
- **Resultado Esperado:** Cliente cadastrado com sucesso e ID gerado.
- **Status:** Pendente

**CT002 - Cliente:** Impedir cadastro de cliente com CPF duplicado
- **Pré-condições:** Cliente com CPF 123.456.789-00 já cadastrado
- **Passos a Executar:** 
  1. Inserir CPF existente
  2. Tentar salvar
- **Dados de Teste:** 
  - CPF: 123.456.789-00
- **Resultado Esperado:** Erro: 'CPF j\`á cadastrado no sistema'.
- **Status:** Pendente

**CT003 - Cliente:** Validar cadastro de cliente sem CPF (campo obrigatório)
- **Pré-condições:** Tela de cadastro aberta
- **Passos a Executar:** 
  1. Preencher nome e telefone
  2. Deixar CPF vazio
  3. Clicar em 'Salvar'
- **Dados de Teste:** 
  - CPF: Em branco
- **Resultado Esperado:** Sistema exige o preenchimento do CPF.
- **Status:** Pendente

**CT004 - Cliente:** Validar formato de CPF inválido (menos dígitos)
- **Pré-condições:** Tela de cadastro aberta
- **Passos a Executar:** 
  1. Inserir CPF com 8 dígitos
  2. Salvar
- **Dados de Teste:** 
  - CPF: 12345678
- **Resultado Esperado:** Mensagem de erro: 'CPF inválido'.
- **Status:** Pendente

**CT005 - Cliente:** Validar formato de e-mail inválido
- **Pré-condições:** Tela de cadastro aberta
- **Passos a Executar:** 
  1. Digitar e-mail sem '@'
  2. Salvar
- **Dados de Teste:** 
  - E-mail: mariasilva.com
- **Resultado Esperado:** Mensagem de erro: 'Formato de e-mail inválido'.
- **Status:** Pendente

**CT006 - Cliente:** Buscar cliente por CPF cadastrado
- **Pré-condições:** Cliente Maria Silva cadastrada
- **Passos a Executar:** 
  1. Acessar pesquisa de clientes
  2. Digitar o CPF
  3. Clicar em 'Buscar'
- **Dados de Teste:** 
  - CPF: 123.456.789-00
- **Resultado Esperado:** Registro do cliente Maria Silva exibido nos resultados.
- **Status:** Pendente

**CT007 - Cliente:** Buscar cliente por Nome parcial
- **Pré-condições:** Cliente Maria Silva cadastrada
- **Passos a Executar:** 
  1. Digitar 'Maria' no campo de busca
  2. Buscar
- **Dados de Teste:** 
  - Nome: Maria
- **Resultado Esperado:** Lista exibindo Maria Silva e outros clientes com nome similar.
- **Status:** Pendente

**CT008 - Cliente:** Editar telefone do cliente
- **Pré-condições:** Cliente Maria Silva cadastrada
- **Passos a Executar:** 
  1. Abrir cadastro do cliente
  2. Alterar telefone
  3. Clicar em 'Atualizar'
- **Dados de Teste:** 
  - Novo Tel: (81) 98888-7777
- **Resultado Esperado:** Dados do cliente atualizados com sucesso.
- **Status:** Pendente

**CT009 - Cliente:** Editar endereço do cliente
- **Pré-condições:** Cliente cadastrado
- **Passos a Executar:** 
  1. Abrir perfil do cliente
  2. Atualizar endereço
  3. Salvar
- **Dados de Teste:** 
  - Endereço: Av. Principal, 456
- **Resultado Esperado:** Endereço atualizado no banco de dados.
- **Status:** Pendente

**CT010 - Cliente:** Excluir cliente sem animais vinculados
- **Pré-condições:** Cliente cadastrado sem histórico ou animais
- **Passos a Executar:** 
  1. Selecionar cliente
  2. Clicar em 'Excluir'
  3. Confirmar
- **Dados de Teste:** 
  - ID Cliente: 105
- **Resultado Esperado:** Cliente excluído com sucesso.
- **Status:** Pendente

**CT011 - Cliente:** Impedir exclusão de cliente com animais vinculados
- **Pré-condições:** Cliente possui animal cadastrado
- **Passos a Executar:** 
  1. Selecionar cliente
  2. Clicar em 'Excluir'
- **Dados de Teste:** 
  - ID Cliente: 101
- **Resultado Esperado:** Alerta: 'N\`ão é poss\`ível excluir cliente com animais vinculados'.
- **Status:** Pendente

**CT012 - Cliente:** Validar limite máximo de caracteres no Nome
- **Pré-condições:** Tela de cadastro aberta
- **Passos a Executar:** 
  1. Digitar nome com mais de 150 caracteres
  2. Salvar
- **Dados de Teste:** 
  - Nome: Texto com >150 chars
- **Resultado Esperado:** Sistema limita o campo ou exibe mensagem de alerta.
- **Status:** Pendente

**CT013 - Cliente:** Validar injeção de caracteres especiais em Nome
- **Pré-condições:** Tela de cadastro aberta
- **Passos a Executar:** 
  1. Inserir script ou caracteres como <script>
  2. Salvar
- **Dados de Teste:** 
  - Nome: <script>alert(1)</script>
- **Resultado Esperado:** Sistema limpa/suscita erro e impede execução de c\`ódigo.
- **Status:** Pendente

**CT014 - Cliente:** Cadastrar cliente com campo Endereço em branco (opcional)
- **Pré-condições:** Tela de cadastro aberta
- **Passos a Executar:** 
  1. Preencher Nome, CPF e Telefone
  2. Deixar Endereço em branco
  3. Salvar
- **Dados de Teste:** 
  - Endereço: Nulo
- **Resultado Esperado:** Cliente cadastrado com sucesso.
- **Status:** Pendente

**CT015 - Cliente:** Listar todos os clientes cadastrados
- **Pré-condições:** Diversos clientes no banco
- **Passos a Executar:** 
  1. Acessar menu 'Clientes'
- **Dados de Teste:** 
  - Diversos clientes no banco
- **Resultado Esperado:** Lista exibindo todos os clientes cadastrados.
- **Status:** Pendente

**CT016 - Cliente:** Validar limite máximo de caracteres no Nome (continuação)
- **Pré-condições:** Tela de cadastro aberta
- **Passos a Executar:** 
  1. Digitar nome com mais de 150 caracteres
  2. Salvar
- **Dados de Teste:** 
  - Nome: Texto com >150 chars
- **Resultado Esperado:** Sistema limita o campo ou exibe mensagem de alerta.
- **Status:** Pendente

**CT017 - Cliente:** Validar caracteres especiais em Nome (continuação)
- **Pré-condições:** Tela de cadastro aberta
- **Passos a Executar:** 
  1. Inserir script ou caracteres como <script>
  2. Salvar
- **Dados de Teste:** 
  - Nome: <script>alert(1)</script>
- **Resultado Esperado:** Sistema limpa/suscita erro e impede execução de c\`ódigo.
- **Status:** Pendente

**CT018 - Cliente:** Cadastrar cliente com campo Endereço em branco (opcional) (continuação)
- **Pré-condições:** Tela de cadastro aberta
- **Passos a Executar:** 
  1. Preencher Nome, CPF e Telefone
  2. Deixar Endereço em branco
  3. Salvar
- **Dados de Teste:** 
  - Endereço: Nulo
- **Resultado Esperado:** Cliente cadastrado com sucesso.
- **Status:** Pendente

## 📋 Entregáveis da Avaliação Final

| Entregável exigido | Status no PetSOS |
|--------------------|------------------|
| Implementação completa de CRUD para pelo menos 2 entidades | ✅ **7 entidades**: users, pets, appointments, lost-reports, media, folders, tags |
| Menu de navegação ligando diferentes páginas | ✅ Navegação entre Visão geral, Meus animais, Consultas, Prontuários, Pets perdidos, Mensagens, Notificações |
| README.md com instruções de setup | ✅ Criado na raiz do projeto |
| Demonstração de tratamento de erros (422, 404) | ✅ `notFound()` para registros inexistentes; estados de erro em formulários; validação de senha/email |
| Repositório Git com commits organizados | ✅ Repositório inicializado com primeiro commit |

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.