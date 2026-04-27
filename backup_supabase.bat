@echo off
setlocal enabledelayedexpansion

cd /d "C:\Users\tulio\Music\Dom_da_empada_Modulo_V2"

echo ============================================
echo   BACKUP COMPLETO DO SUPABASE
echo ============================================
echo.

set "BACKUP_DIR=%cd%\backup_supabase_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "BACKUP_DIR=%BACKUP_DIR: =0%"
mkdir "%BACKUP_DIR%" 2>nul

echo Criando backup em: %BACKUP_DIR%
echo.

REM --- Copiar todos os arquivos SQL ---
echo [1/5] Copiando arquivos SQL...
mkdir "%BACKUP_DIR%\sql" 2>nul
copy "*.sql" "%BACKUP_DIR%\sql\" /Y >nul 2>&1
copy "scripts\*.sql" "%BACKUP_DIR%\sql\" /Y >nul 2>&1

REM --- Copiar arquivos de configuracao ---
echo [2/5] Copiando configuracoes...
copy ".env" "%BACKUP_DIR%\config_env.txt" /Y >nul 2>&1
copy ".env.example" "%BACKUP_DIR%\config_env_example.txt" /Y >nul 2>&1
copy "vercel.json" "%BACKUP_DIR%\vercel.json" /Y >nul 2>&1
copy "supabase-schema.sql" "%BACKUP_DIR%\sql\schema_principal.sql" /Y >nul 2>&1

REM --- Criar lista de tabelas ---
echo [3/5] Gerando lista de tabelas...
(
echo -- ============================================
echo -- TABELAS DO BANCO DE DADOS
echo -- ============================================
echo.
echo Principais tabelas:
echo - orders (pedidos)
echo - users / app_users (usuarios)
echo - products (produtos)
echo - deliveries (entregas)
echo - vehicles (veiculos)
echo - franchisees (franqueados)
echo - transfers (transferencias)
echo - points (pontos)
echo - prices (precos)
echo - checklists
echo - delivery_photos
echo.
) > "%BACKUP_DIR%\lista_tabelas.txt"

REM --- Criar script de restauracao ---
echo [4/5] Criando script de restauracao...
(
echo @echo off
echo REM ============================================
echo REM   RESTAURACAO DO SUPABASE
echo REM ============================================
echo.
echo ATENCAO: Execute este script APOS ter criado o banco de dados Supabase.
echo.
echo Passos:
echo 1. Acesse o servidor: ssh root^@72.60.61.216
echo 2. Va ao diretorio do Supabase
echo 3. Acesse o container do Postgres: docker exec -it supabase-db.?.? psql -U postgres
echo 4. Conecte ao banco: \c postgres
echo 5. Execute os SQLs na ordem:
echo    - sql\schema_principal.sql
echo    - sql\supabase-new-tables.sql
echo    - sql\supabase-new-tables-v2.sql
echo    - sql\create-admin-master-final.sql
echo 6. Restaure os dados de cada tabela usando os exports
echo.
pause
) > "%BACKUP_DIR%\RESTAURACAO.bat"

REM --- Criar documentacao ---
echo [5/5] Criando documentacao...
(
echo # BACKUP SUPABASE - Dom da Empada
echo.
echo ## Data do Backup
echo %date% %time%
echo.
echo ## Estrutura do Backup
echo.
echo ^### sql/ - Todos os arquivos SQL
echo ^### config_*.txt - Configuracoes (.env)
echo ^### vercel.json - Configuracao Vercel
echo ^### lista_tabelas.txt - Lista de tabelas
echo ^### RESTAURACAO.bat - Script de restauracao
echo.
echo ## Ordem de Execucao dos SQLs
echo.
echo 1. supabase-schema.sql (schema principal)
echo 2. supabase-new-tables.sql
echo 3. supabase-new-tables-v2.sql
echo 4. create-admin-master-final.sql
echo.
echo ## Tabelas Principais
echo.
echo ^| Tabela ^| Descricao ^|
echo ^|--------^|------------^|
echo ^| orders ^| Pedidos ^| 
echo ^| app_users ^| Usuarios do app ^|
echo ^| products ^| Produtos ^|
echo ^| deliveries ^| Entregas ^|
echo ^| vehicles ^| Veiculos ^|
echo ^| franchisees ^| Franqueados ^|
echo ^| transfers ^| Transferencias ^|
echo ^| points ^| Pontos ^|
echo ^| prices ^| Precos ^|
echo.
echo ## Configuracao do Supabase
echo.
echo - API Gateway: 72.60.61.216:8000
echo - Studio: 72.60.61.216:3000
echo - Database: Port 5432 (interno)
echo.
) > "%BACKUP_DIR%\README.md"

echo.
echo ============================================
echo   BACKUP CONCLUIDO COM SUCESSO!
echo ============================================
echo.
echo Local: %BACKUP_DIR%
echo.
echo Conteudo:
dir /b "%BACKUP_DIR%\sql" 2>nul
echo.
echo.
echo PROXIMOS PASSOS:
echo 1. Va para a pasta backup criada
echo 2. Copie para um local seguro (HD externo, Google Drive, etc)
echo 3. Para restaurar: execute RESTAURACAO.bat
echo.
pause
