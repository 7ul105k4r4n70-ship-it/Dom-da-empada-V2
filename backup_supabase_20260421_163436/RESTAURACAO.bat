@echo off
REM ============================================
REM   RESTAURACAO DO SUPABASE
REM ============================================

ATENCAO: Execute este script APOS ter criado o banco de dados Supabase.

Passos:
1. Acesse o servidor: ssh root@72.60.61.216
2. Va ao diretorio do Supabase
3. Acesse o container do Postgres: docker exec -it supabase-db.?.? psql -U postgres
4. Conecte ao banco: \c postgres
5. Execute os SQLs na ordem:
   - sql\schema_principal.sql
   - sql\supabase-new-tables.sql
   - sql\supabase-new-tables-v2.sql
   - sql\create-admin-master-final.sql
6. Restaure os dados de cada tabela usando os exports

Pressione qualquer tecla para continuar. . . 