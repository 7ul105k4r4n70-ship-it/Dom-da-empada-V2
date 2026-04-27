#!/bin/bash
# Listar TODAS as tabelas do banco

echo "============================================"
echo "  LISTANDO TABELAS DO SUPABASE"
echo "============================================"
echo ""

# Primeiro, descubra o nome do container do DB
echo "[1] Containers ativos:"
docker ps --format "table {{.Names}}\t{{.Image}}" | grep -i supabase

echo ""
echo "[2] Tabelas no banco (public schema):"
docker exec supabase-db.?.? psql -U postgres -d postgres -c "\dt public.*"

echo ""
echo "[3] Todas as tabelas:"
docker exec supabase-db.?.? psql -U postgres -d postgres -c "\dt"

echo ""
echo "[4] Schemas disponiveis:"
docker exec supabase-db.?.? psql -U postgres -d postgres -c "\dn"

echo ""
echo "[5] Tabelas do schema public:"
docker exec supabase-db.?.? psql -U postgres -d postgres -c "\dt public."

echo ""
echo "[6] Contagem de registros por tabela:"
docker exec supabase-db.?.? psql -U postgres -d postgres -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"

echo ""
echo "[7] Backup com nome correto de container:"
# Descobrir nome exato
DB_CONTAINER=$(docker ps --format "{{.Names}}" | grep -i db)
echo "Container do DB: $DB_CONTAINER"

if [ -n "$DB_CONTAINER" ]; then
    BACKUP_DIR="/root/supabase_backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    echo ""
    echo "Exportando estrutura..."
    docker exec $DB_CONTAINER pg_dump -U postgres -d postgres --schema-only > "$BACKUP_DIR/full_schema.sql"
    
    echo "Exportando dados..."
    docker exec $DB_CONTAINER pg_dump -U postgres -d postgres --data-only > "$BACKUP_DIR/full_data.sql"
    
    echo ""
    echo "Backup completo criado!"
    ls -la "$BACKUP_DIR"
    du -sh "$BACKUP_DIR"
fi
