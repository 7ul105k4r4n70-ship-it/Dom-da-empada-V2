#!/bin/bash
# ============================================
#  EXPORTA TODOS OS DADOS DO SUPABASE
# ============================================

BACKUP_DIR="/root/supabase_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "============================================"
echo "  EXPORTANDO DADOS DO SUPABASE"
echo "============================================"
echo ""
echo "Backup dir: $BACKUP_DIR"
echo ""

# Tabelas para exportar
TABLES=(
    "orders"
    "app_users"
    "users"
    "products"
    "deliveries"
    "vehicles"
    "franchisees"
    "transfers"
    "points"
    "prices"
    "checklists"
    "delivery_photos"
    "product_categories"
    "order_items"
    "order_status_history"
)

echo "[1/2] Exportando cada tabela..."
for table in "${TABLES[@]}"; do
    echo "  Exportando: $table"
    docker exec supabase-db.?.? pg_dump -U postgres -d postgres -t "$table" > "$BACKUP_DIR/${table}.sql" 2>/dev/null
done

echo ""
echo "[2/2] Exportando banco completo..."
docker exec supabase-db.?.? pg_dump -U postgres -d postgres --schema-only > "$BACKUP_DIR/full_schema.sql" 2>/dev/null
docker exec supabase-db.?.? pg_dump -U postgres -d postgres --data-only > "$BACKUP_DIR/full_data.sql" 2>/dev/null

echo ""
echo "============================================"
echo "  EXPORTACAO CONCLUIDA!"
echo "============================================"
echo ""
echo "Arquivos exportados:"
ls -la "$BACKUP_DIR"
echo ""
echo "Tamanho total:"
du -sh "$BACKUP_DIR"
echo ""
echo "============================================"
echo "  PROXIMOS PASSOS"
echo "============================================"
echo ""
echo "1. Para baixar para seu computador, execute no SEU PC (Windows):"
echo "   scp -r root@72.60.61.216:$BACKUP_DIR C:\\Users\\tulio\\Music\\"
echo ""
echo "2. Ou use WinSCP conectando em: 72.60.61.216"
echo ""
echo "3. Apos baixar, delete o backup do servidor:"
echo "   rm -rf $BACKUP_DIR"
echo ""
