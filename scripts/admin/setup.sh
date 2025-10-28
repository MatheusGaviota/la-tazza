#!/usr/bin/env bash

# Setup do Sistema de Gerenciamento de Contas
# Este script facilita a primeira configuração

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     Setup - Sistema de Gerenciamento de Contas Firebase       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar se .env.local existe
if [ ! -f .env.local ]; then
    echo "❌ Arquivo .env.local não encontrado!"
    echo ""
    echo "ℹ️  Ações necessárias:"
    echo "   1. Copie .env.example para .env.local"
    echo "   2. Preencha as variáveis FIREBASE_ADMIN_* com suas credenciais"
    echo ""
    echo "   $ cp .env.example .env.local"
    echo ""
    exit 1
fi

# Verificar se as variáveis estão preenchidas
echo "✅ Verificando variáveis de ambiente..."

required_vars=(
    "FIREBASE_ADMIN_PROJECT_ID"
    "FIREBASE_ADMIN_PRIVATE_KEY_ID"
    "FIREBASE_ADMIN_PRIVATE_KEY"
    "FIREBASE_ADMIN_CLIENT_EMAIL"
    "FIREBASE_ADMIN_CLIENT_ID"
    "FIREBASE_ADMIN_CLIENT_X509_CERT_URL"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if [ -z "${!var:-}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    echo "❌ Variáveis de ambiente faltando:"
    printf '%s\n' "${missing_vars[@]}"
    exit 1
fi

echo "✅ Todas as variáveis configuradas corretamente!"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   Pronto para usar! 🚀                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Comandos disponíveis:"
echo "  npm run admin help                  # Ver ajuda"
echo "  npm run admin list-users            # Listar usuários"
echo "  npm run admin create-user           # Criar novo usuário"
echo ""
