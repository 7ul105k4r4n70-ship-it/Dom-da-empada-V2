#!/bin/bash
# Script para criar usuário master via API do Supabase
# Execute: bash create-admin-master-api.sh

SUPABASE_URL="http://72.60.61.216:8000"
SUPABASE_KEY="sua-chave-anon-aqui" # Substitua pela sua chave ANON do Supabase

# Criar usuário via Supabase Auth API
curl -X POST "$SUPABASE_URL/auth/v1/signup" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin.master@domdaempada.com.br",
    "password": "T05122020d*",
    "data": {
      "name": "admin.master",
      "role": "admin"
    }
  }'

echo ""
echo "Usuário criado! Agora execute o SQL para criar o registro em app_users"
