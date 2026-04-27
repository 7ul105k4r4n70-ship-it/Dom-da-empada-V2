#!/bin/bash
# ============================================
#  INSTALAR NOVO SUPABASE EM PORTAS ALTERNATIVAS
#  Execute no servidor 72.60.61.216
#  Este NAO interfere no Supabase atual!
# ============================================

set -e

echo "============================================"
echo "  INSTALANDO NOVO SUPABASE (PORTAS ALTERNATIVAS)"
echo "============================================"
echo ""

# Portas diferentes do Supabase atual
# Atual: 3000, 8000, 9999, 5432
# Novo:  3100, 8100, 9998, 5433

NEW_DIR="/root/supabase-new"
KONG_PORT=8100
STUDIO_PORT=3100
AUTH_PORT=9998
DB_PORT=5433
DB_EXTERNAL_PORT=6543

echo "Configuracao:"
echo "  - Kong API:      http://72.60.61.216:$KONG_PORT"
echo "  - Studio:        http://72.60.61.216:$STUDIO_PORT"
echo "  - Auth:         http://72.60.61.216:$AUTH_PORT"
echo "  - DB (interno): localhost:$DB_PORT"
echo "  - DB (externo): localhost:$DB_EXTERNAL_PORT"
echo ""

echo "[1/7] Criando diretorio..."
mkdir -p $NEW_DIR
cd $NEW_DIR

echo "[2/7] Baixando docker-compose.yml do Supabase..."
cat > $NEW_DIR/docker-compose.yml << 'EOF'
version: '3.8'

services:
  db:
    image: supabase/postgres:15.8.1.085
    container_name: supabase-new-db
    restart: unless-stopped
    ports:
      - "5433:5432"
      - "6543:6543"
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: SuaSenhaForte123!
      POSTGRES_HOST_AUTH_METHOD: trust
    volumes:
      - db-data:/var/lib/postgresql/data

  kong:
    image: kong/kong:3.9.1
    container_name: supabase-new-kong
    restart: unless-stopped
    ports:
      - "8100:8000"
      - "8443:8443"
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: /var/lib/kong/kong.yml
      KONG_DNS_ORDER: LAST,A,CNAME
      KONG_PLUGINS: request-transformer,cors,key-auth,acl
      KONG_NGINX_PROXY_PROXY_BUFFER_SIZE: 160k
      KONG_NGINX_PROXY_PROXY_BUFFERS: 64 160k
    volumes:
      - ./kong.yml:/var/lib/kong/kong.yml:ro

  auth:
    image: supabase/gotrue:v2.186.0
    container_name: supabase-new-auth
    restart: unless-stopped
    ports:
      - "9998:9999"
    environment:
      GOTRUE_API_HOST: 0.0.0.0
      GOTRUE_API_PORT: 9999
      API_EXTERNAL_URL: http://localhost:8100
      GOTRUE_DB_DRIVER: postgres
      GOTRUE_DB_DATABASE_URL: postgres://postgres:SuaSenhaForte123!@db:5432/postgres?search_path=auth
      GOTRUE_SITE_URL: http://localhost:3100
      GOTRUE_JWT_SECRET: novo-jwt-secret-super-secreto-123456
      GOTRUE_JWT_EXP: 3600
      GOTRUE_DISABLE_SIGNUP: "false"

  rest:
    image: postgrest/postgrest:v14.8
    container_name: supabase-new-rest
    restart: unless-stopped
    ports:
      - "3101:3000"
    environment:
      PGRST_DB_URI: postgres://postgres:SuaSenhaForte123!@db:5432/postgres
      PGRST_DB_SCHEMA: public
      PGRST_DB_ANON_ROLE: anon
      PGRST_JWT_SECRET: novo-jwt-secret-super-secreto-123456

  realtime:
    image: supabase/realtime:v2.76.5
    container_name: supabase-new-realtime
    restart: unless-stopped
    ports:
      - "4100:4000"
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: SuaSenhaForte123!
      DB_NAME: postgres
      PORT: 4000

  studio:
    image: supabase/studio:2026.04.08-sha-205cbe7
    container_name: supabase-new-studio
    restart: unless-stopped
    ports:
      - "3100:3000"
    environment:
      SUPABASE_URL: http://kong:8000
      STUDIO_PG_META_URL: http://meta:8080
      SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
      SUPABASE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

  meta:
    image: supabase/postgres-meta:v0.96.3
    container_name: supabase-new-meta
    restart: unless-stopped
    ports:
      - "3102:8080"
    environment:
      PG_META_PORT: 8080
      PG_META_DB_HOST: db
      PG_META_DB_PORT: 5432
      PG_META_DB_NAME: postgres
      PG_META_DB_USER: postgres
      PG_META_DB_PASSWORD: SuaSenhaForte123!

volumes:
  db-data:
EOF

echo "[3/7] Criando kong.yml..."
cat > $NEW_DIR/kong.yml << 'EOF'
_format_version: "3.0"
services:
  - name: auth
    url: http://auth:9999
    routes:
      - name: auth-route
        paths:
          - /auth/v1
        strip_path: true
    plugins:
      - name: cors

  - name: rest
    url: http://rest:3000
    routes:
      - name: rest-route
        paths:
          - /rest/v1
        strip_path: true
    plugins:
      - name: cors

  - name: realtime
    url: http://realtime:4000
    routes:
      - name: realtime-route
        paths:
          - /realtime/v1
        strip_path: true
    plugins:
      - name: cors
EOF

echo "[4/7] Criando rede Docker..."
docker network create supabase-new-network 2>/dev/null || true

echo "[5/7] Iniciando containers..."
cd $NEW_DIR
docker compose up -d

echo "[6/7] Aguardando inicializacao (30 segundos)..."
sleep 30

echo "[7/7] Verificando status..."
docker ps --format "table {{.Names}}\t{{.Status}}" | grep supabase-new

echo ""
echo "============================================"
echo "  NOVO SUPABASE INSTALADO!"
echo "============================================"
echo ""
echo "Acesse:"
echo "  - Studio:  http://72.60.61.216:$STUDIO_PORT"
echo "  - API:    http://72.60.61.216:$KONG_PORT"
echo ""
echo "Para VER LOGS:"
echo "  cd $NEW_DIR"
echo "  docker compose logs -f"
echo ""
echo "Para PARAR:"
echo "  cd $NEW_DIR"
echo "  docker compose down"
echo ""
echo "Para VOLTAR AO SUPABASE ANTIGO (portas 3000, 8000):"
echo "  docker ps | grep supabase"
