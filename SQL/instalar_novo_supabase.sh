#!/bin/bash
# ============================================
#  INSTALAR NOVO SUPABASE NA VPS
#  Execute no servidor 72.60.61.216
# ============================================

set -e

echo "============================================"
echo "  INSTALANDO NOVO SUPABASE"
echo "============================================"
echo ""

# Variaveis
NEW_SUPABASE_DIR="/root/new-supabase"
DOMAIN="supabase.seudominio.com"  # ALTERE AQUI
EMAIL="seu@email.com"               # ALTERE AQUI

echo "[1/8] Parando Supabase atual..."
docker stop $(docker ps -q --filter "name=supabase") 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

echo "[2/8] Fazendo backup do .env atual (se existir)..."
if [ -f "$HOME/supabase/docker/.env" ]; then
    cp "$HOME/supabase/docker/.env" "$HOME/supabase/docker/.env.backup.$(date +%s)"
fi

echo "[3/8] Criando diretorio do novo Supabase..."
mkdir -p "$NEW_SUPABASE_DIR"
cd "$NEW_SUPABASE_DIR"

echo "[4/8] Baixando Supabase..."
# Instalar CLI do Supabase
if ! command -v supabase &> /dev/null; then
    echo "  Instalando Supabase CLI..."
    npm install -g supabase
fi

echo "[5/8] Iniciando novo projeto Supabase..."
supabase init

echo "[6/8] Configurando .env com suas variaveis..."
cat > "$NEW_SUPABASE_DIR/supabase/.env" << 'EOF'
# POSTGRES
POSTGRES_PASSWORD=SuaSenhaForte123!
POSTGRES_USER=postgres
POSTGRES_DB=postgres

# API
API_EXTERNAL_URL=http://localhost:8000
SITE_URL=http://localhost:3000
ADDITIONAL_REDIRECT_URLS=
JWT_EXPIRATION=3600

# AUTH
AUTH_EMAIL_ENABLE_SIGNUP=true
AUTH_EMAIL_DOUBLE_CONFIRMATIONS=false
AUTH_EMAIL_CONFIRMATION_EXPIRY_IN_SECONDS=0

# SMTP (opcional - configure se precisar)
# SMTP_ADMIN_EMAIL=admin@example.com
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=user
# SMTP_PASSWORD=password
# SMTP_SENDER_NAME=Supabase

# Storage
STORAGE_BACKEND=file
FILE_SIZE_LIMIT=52428800
EOF

echo "[7/8] Iniciando containers Docker..."
cd "$NEW_SUPABASE_DIR/supabase"
docker compose up -d

echo "[8/8] Aguardando containers ficarem prontos..."
sleep 10

echo ""
echo "============================================"
echo "  INSTALACAO CONCLUIDA!"
echo "============================================"
echo ""
echo "Portas configuradas:"
echo "  - Studio (Web UI): http://72.60.61.216:3000"
echo "  - API Gateway:     http://72.60.61.216:8000"
echo "  - API REST:       http://72.60.61.216:3001"
echo "  - Auth:           http://72.60.61.216:9999"
echo ""
echo "Para verificar status:"
echo "  cd $NEW_SUPABASE_DIR/supabase"
echo "  docker compose ps"
echo ""
echo "Para ver logs:"
echo "  docker compose logs -f"
echo ""

# Listar containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
