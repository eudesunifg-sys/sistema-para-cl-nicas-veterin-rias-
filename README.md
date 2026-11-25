# 🐾 PetSOS - Sistema para Clínicas Veterinárias e Tutores

O **PetSOS** é uma plataforma completa que reúne a gestão de saúde animal para clínicas veterinárias, o acompanhamento de pets por seus tutores e uma rede pública de busca de animais perdidos.

---

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

### 🔍 Central Pública de Pets Perdidos
- **Busca com Filtros:** Filtre por espécie, porte, cor, sexo e região.
- **Alertas e Correspondências:** Conexão entre quem perdeu e quem encontrou um pet.
- **Comunicação Segura:** Contato via plataforma sem expor dados pessoais sensíveis.

### 🛡️ Gestão e Administração
- **Perfis de Acesso:** Controle granular para Tutores, Veterinários e Administradores.
- **Indicadores em Tempo Real:** Dashboard administrativo para gestão da clínica.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **CMS / Data Layer:** [Payload CMS 3](https://payloadcms.com/)
- **UI & Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) + React 19
- **Linguagem:** TypeScript
- **Gerenciador de Pacotes:** pnpm

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (v20 ou superior)
- pnpm (`npm i -g pnpm`)

### Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU-USUARIO/sistema-para-clinicas-veterinarias.git
   cd sistema-para-clinicas-veterinarias
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   pnpm dev
   ```

4. **Acesse no navegador:**
   - App: [http://localhost:3000](http://localhost:3000)
   - Login: [http://localhost:3000/login](http://localhost:3000/login)
   - Cadastro: [http://localhost:3000/cadastro](http://localhost:3000/cadastro)
   - Painel CMS (Admin): [http://localhost:3000/admin](http://localhost:3000/admin)

> **Nota:** Para o funcionamento completo da persistência de dados fora do ambiente Figma Make, certifique-se de configurar as variáveis de ambiente do Payload.

---

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

---

## 👥 Perfis de Acesso para Teste

| Perfil | Acesso | Descrição |
|--------|--------|-----------|
| **Tutor** | Cadastro via `/cadastro` | Acessa dashboard do tutor, gerencia seus pets e consultas. |
| **Veterinário** | Criado pelo Admin | Acessa prontuários, realiza atendimento e prescrições. |
| **Administrador** | Acesso via `/admin` | Acesso total à gestão do sistema e CMS. |

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
