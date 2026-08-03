-- Execute uma vez no SQL Editor do Supabase antes do primeiro deploy.
create schema if not exists fintrack authorization postgres;

-- O backend acessa o schema pela conexão PostgreSQL. Ele não fica disponível
-- anonimamente pela Data API do Supabase.
revoke all on schema fintrack from public;
