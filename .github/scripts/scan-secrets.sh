#!/usr/bin/env bash
# =============================================================================
# Scans ENTIRE git commit history for leaked credentials.
#
# Runs in GitHub Actions CI with fetch-depth: 0.
# =============================================================================
set -uo pipefail

PATTERNS=$(cat <<'EOF'
chave secreta Stripe|sk_(live|test)_[0-9a-zA-Z]{20}
segredo de webhook Stripe|whsec_[0-9a-zA-Z]{20}
token do GitHub|(ghp_|github_pat_)[0-9a-zA-Z_]{20}
chave de acesso AWS|AKIA[0-9A-Z]{16}
URI do MongoDB com senha|mongodb\+srv://[^<$"'"'"'[:space:]]+:[^@$"'"'"'[:space:]]+@
URL do Postgres com senha|postgres(ql)?://[^<$"'"'"'[:space:]]+:[^@$"'"'"'[:space:]]+@
chave privada|BEGIN [A-Z ]*PRIVATE KEY
token do Slack|xox[baprs]-[0-9a-zA-Z]{10}
EOF
)

found=0

while IFS= read -r entry; do
    [ -z "$entry" ] && continue
    kind=${entry%%|*}
    pattern=${entry#*|}

    hits=$(git grep -I -n -E -e "$pattern" \
              $(git rev-list --all) -- \
              ':!.env.example' ':!backend/.env.example' ':!frontend/.env.example' ':!.githooks/pre-commit' ':!.github/scripts/scan-secrets.sh' \
           2>/dev/null | head -5)

    if [ -n "$hits" ]; then
        echo "::error::$kind encontrada no histórico"
        # Print commit and filename, NEVER the full secret line
        echo "$hits" | cut -d: -f1,2 | sed 's/^/  /'
        found=1
    fi
done <<< "$PATTERNS"

if [ "$found" -ne 0 ]; then
    cat <<'EOF'

Uma credencial foi detectada no histórico de commits do repositório.
Procedimentos recomendados:
  1. Rotacionar a credencial no provedor (Supabase, Render, GitHub, etc).
  2. Substituir por variável de ambiente.
  3. Se necessário, reescrever histórico usando git-filter-repo.
EOF
    exit 1
fi

echo "Nenhuma credencial encontrada no histórico do repositório."
