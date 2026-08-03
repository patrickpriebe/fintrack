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

> [!WARNING]
> A aplicação ainda não possui autenticação. Em uma publicação pública, use apenas dados demonstrativos até implementar usuários e autorização por lançamento.

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

## Executar localmente

Crie o arquivo de configuração a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

Preencha `APP_KEY` com uma chave Laravel e use uma senha local em `DB_PASSWORD`. Depois execute:

```powershell
docker-compose up --build -d
```

A aplicação fica disponível em [http://localhost:8000](http://localhost:8000).

```powershell
docker-compose ps
docker-compose down
```

Não use `docker-compose down -v` se quiser preservar os dados locais.

## Publicar no GitHub

Crie um repositório vazio no GitHub e publique a branch `main`:

```powershell
git init -b main
git add .
git commit -m "feat: prepara FinTrack para deploy"
git remote add origin https://github.com/SEU_USUARIO/fintrack.git
git push -u origin main
```

Arquivos `.env`, dependências, builds e dados locais estão ignorados pelo Git.

## Banco no Supabase

1. Crie um projeto no Supabase.
2. Abra **SQL Editor** e execute [supabase/setup.sql](supabase/setup.sql).
3. Em **Connect**, copie a string de conexão do **Session pooler**, na porta `5432`.
4. Guarde essa string para a variável `DB_URL` do Render.

O Laravel usa o schema privado `fintrack`, que não é exposto pela Data API pública do Supabase.

## Backend no Render

1. Conecte o Render ao mesmo repositório GitHub.
2. Crie um serviço usando o Blueprint [render.yaml](render.yaml).
3. Preencha as variáveis solicitadas:

| Variável | Valor |
|---|---|
| `APP_KEY` | chave Laravel no formato `base64:...` |
| `APP_URL` | URL final do backend no Render |
| `FRONTEND_URLS` | URL final do frontend na Vercel |
| `DB_URL` | Session pooler do Supabase |

O serviço executa as migrations automaticamente e usa `/api/health` como verificação de saúde.

## Frontend na Vercel

1. Importe o mesmo repositório GitHub na Vercel.
2. Configure **Root Directory** como `frontend`.
3. Adicione a variável:

```text
VITE_API_URL=https://SUA-API.onrender.com/api
```

4. Faça o deploy e copie a URL final.
5. Atualize `FRONTEND_URLS` no Render com essa URL e faça um novo deploy do backend.

Após isso, pushes na `main` atualizam automaticamente Vercel e Render. O GitHub Actions valida testes e builds antes da integração.

## Endpoints principais

| Método | Endpoint | Uso |
|---|---|---|
| `GET` | `/api/health` | saúde da API |
| `GET` | `/api/transactions?month=2026-08` | lançamentos do mês |
| `POST` | `/api/transactions` | criar lançamento |
| `PUT` | `/api/transactions/{id}` | atualizar lançamento |
| `DELETE` | `/api/transactions/{id}` | excluir lançamento |
| `GET` | `/api/dashboard?month=2026-08` | totais e categorias |

## Variáveis do frontend

Consulte [frontend/.env.example](frontend/.env.example).

## Variáveis do backend

Consulte [backend/.env.example](backend/.env.example). Nunca publique chaves reais ou a conexão do Supabase no repositório.
