#!/bin/bash
# ============================================
#  RESTAURAR SUPABASE DO BACKUP
#  Execute no servidor 72.60.61.216
# ============================================

echo "============================================"
echo "  RESTAURACAO DO SUPABASE"
echo "============================================"
echo ""

# Criar pasta para os arquivos de backup
mkdir -p /root/restore_backup

echo "[1] Envie os arquivos full_schema.sql e full_data.sql para /root/restore_backup/"
echo "    Use WinSCP para copiar os arquivos do seu PC para o servidor"
echo ""
echo "2] Apos copiar, execute:"
echo "   chmod +x /root/restore_supabase.sh"
echo "   bash /root/restore_supabase.sh"
echo ""

# Script de restauracao real
cat > /root/restore_supabase.sh << 'INNER_EOF'
#!/bin/bash
echo "============================================"
echo "  INICIANDO RESTAURACAO"
echo "============================================"
echo ""

BACKUP_DIR="/root/restore_backup"

if [ ! -f "$BACKUP_DIR/full_schema.sql" ] || [ ! -f "$BACKUP_DIR/full_data.sql" ]; then
    echo "ERRO: Arquivos de backup nao encontrados em $BACKUP_DIR"
    echo "Copie full_schema.sql e full_data.sql para $BACKUP_DIR"
    exit 1
fi

echo "[1/3] Parando servicos do Supabase..."
docker stop supabase-kong supabase-rest supabase-auth realtime-dev.supabase-realtime 2>/dev/null

echo "[2/3] Restaurando schema (estrutura)..."
docker exec -i supabase-db psql -U postgres -d postgres < "$BACKUP_DIR/full_schema.sql"

echo "[3/3] Restaurando dados..."
docker exec -i supabase-db psql -U postgres -d postgres < "$BACKUP_DIR/full_data.sql"

echo ""
echo "[4/4] Reiniciando servicos..."
docker start supabase-kong supabase-rest supabase-auth realtime-dev.supabase-realtime 2>/dev/null

echo ""
echo "============================================"
echo "  RESTAURACAO CONCLUIDA!"
echo "============================================"
echo ""
echo "Verificando conexao..."
docker exec supabase-db psql -U postgres -d postgres -c "SELECT count(*) as total_orders FROM orders;"

INNER_EOF

chmod +x /root/restore_supabase.sh

echo ""
echo "Script criado: /root/restore_supabase.sh"
echo ""
echo "PASSOS:"
echo "1. Copie os arquivos do seu PC para o servidor usando WinSCP:"
echo "   - C:\\Users\\tulio\\Music\\Dom_da_empada_Modulo_V2\\SQL\\full_schema.sql"
echo "   - C:\\Users\\tulio\\Music\\Dom_da_empada_Modulo_V2\\SQL\\full_data.sql"
echo "   Para: /root/restore_backup/"
echo ""
echo "2. Execute: bash /root/restore_supabase.sh"
