@echo off
echo ============================================
echo   COPIAR BACKUP DO SERVIDOR
echo ============================================
echo.
echo Este script vai baixar o backup do servidor.
echo.
echo Passos:
echo 1. Va para o servidor: ssh root@72.60.61.216
echo 2. Execute: bash /root/export_data.sh
echo 3. Apos exportar, volte aqui e execute:
echo    scp -r root@72.60.61.216:/root/supabase_backup_* C:\Users\tulio\Music\Dom_da_empada_Modulo_V2\
echo.
echo OU use WinSCP para baixar manualmente.
echo.
pause
