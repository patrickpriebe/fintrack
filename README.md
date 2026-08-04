# FinTrack

Dashboard financeiro com API Laravel 12, frontend React 19 e PostgreSQL. O repositório funciona como monorepo e está preparado para esta arquitetura:

```text
GitHub
├── frontend/ ── Vercel
├── backend/  ── Render
└── dados     ── Supabase Postgres
```

## Funcionalidades

- cadastro e exclusão de receitas e despesas;
- consulta mensal de lançamentos;
- totais de receitas, despesas e saldo;
- gráficos de fluxo financeiro e despesas por categoria;
- interface responsiva com calendários personalizados;
- testes automatizados de frontend e backend.

## Estrutura

```text
.
├── .github/workflows/pipeline.yml  # testes e validação dos builds
├── backend/                        # API Laravel e Dockerfile do Render
├── frontend/                       # React/Vite e configuração da Vercel
├── supabase/setup.sql              # schema privado usado pelo Laravel
├── compose.yaml                    # ambiente local completo
├── render.yaml                     # Blueprint do serviço no Render
└── Dockerfile                      # imagem local com frontend + backend
```

## 📸 Telas principais do sistema

As capturas do dashboard, dos gráficos, dos lançamentos e dos calendários serão adicionadas nesta seção.

<!-- Adicione aqui as capturas das principais telas do FinTrack. -->

## 🏗️ Arquitetura, infraestrutura e stack

O FinTrack foi construído como uma aplicação full-stack enxuta, com separação clara entre interface, API e persistência de dados. A arquitetura prioriza organização, manutenibilidade e uma experiência de uso simples e responsiva.

**React 19 & Vite:** Interface componentizada, responsiva e otimizada para carregamento rápido, com gerenciamento dos lançamentos e atualização dinâmica dos indicadores financeiros.

**Laravel 12 & PHP:** API REST responsável pelas regras de negócio, validação dos dados, cálculos financeiros e comunicação segura com o banco de dados.

**PostgreSQL & Supabase:** Persistência dos lançamentos em banco relacional hospedado no Supabase, utilizando um schema privado dedicado à aplicação.

**Vercel & Render:** Hospedagem independente do frontend e do backend, permitindo deploy contínuo e atualização automática a cada nova versão publicada.

**Docker & Docker Compose:** Padronização do ambiente local e da imagem de produção, reduzindo diferenças entre desenvolvimento, testes e hospedagem.

**GitHub Actions:** Pipeline de integração contínua responsável por validar testes, builds e a imagem Docker antes da publicação.

## 🚀 Domínios da aplicação

**Gestão de lançamentos:** Cadastro e exclusão de receitas e despesas com descrição, categoria, valor e data.

**Visão financeira mensal:** Consulta por período com totais de receitas, despesas e saldo disponível no mês selecionado.

**Análises e gráficos:** Comparativo visual entre entradas e saídas, distribuição das despesas por categoria e geração de insights financeiros.

**Experiência responsiva:** Interface adaptada para desktop e dispositivos móveis, com seletores, calendários personalizados e feedbacks visuais padronizados.

**Integração full-stack:** Comunicação entre React e a API Laravel, persistência no PostgreSQL e atualização dos dados sem recarregar a página.

## 🌐 Aplicação publicada

🔗 [Acessar o FinTrack](https://fintrack-ui-tan.vercel.app) | ⚙️ [API do FinTrack](https://fintrack-api-08b9.onrender.com)

## 👨‍💻 Desenvolvido por Patrick Priebe

Desenvolvedor de Software, apaixonado por código limpo, arquitetura back-end e interfaces que fogem do comum.

🔗 [LinkedIn](https://www.linkedin.com/in/patrickpriebe/) | 💻 [GitHub](https://github.com/patrickpriebe)
