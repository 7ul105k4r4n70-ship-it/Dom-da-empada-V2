@echo off
chcp 65001 >nul
echo ============================================
echo Atualizando Kong para porta 8000
echo ============================================

REM Criar arquivo kong.yml localmente
echo _format_version: "3.0" > "%TEMP%\kong.yml"
echo. >> "%TEMP%\kong.yml"
echo services: >> "%TEMP%\kong.yml"
echo   - name: rest >> "%TEMP%\kong.yml"
echo     url: http://rest:8000 >> "%TEMP%\kong.yml"
echo     routes: >> "%TEMP%\kong.yml"
echo       - name: rest-route >> "%TEMP%\kong.yml"
echo         paths: >> "%TEMP%\kong.yml"
echo           - /rest/v1 >> "%TEMP%\kong.yml"
echo         strip_path: true >> "%TEMP%\kong.yml"
echo     plugins: >> "%TEMP%\kong.yml"
echo       - name: cors >> "%TEMP%\kong.yml"
echo. >> "%TEMP%\kong.yml"
echo   - name: auth >> "%TEMP%\kong.yml"
echo     url: http://auth:9999 >> "%TEMP%\kong.yml"
echo     routes: >> "%TEMP%\kong.yml"
echo       - name: auth-route >> "%TEMP%\kong.yml"
echo         paths: >> "%TEMP%\kong.yml"
echo           - /auth/v1 >> "%TEMP%\kong.yml"
echo         strip_path: true >> "%TEMP%\kong.yml"
echo     plugins: >> "%TEMP%\kong.yml"
echo       - name: cors >> "%TEMP%\kong.yml"

echo.
echo [1/3] Copiando kong.yml para servidor...
plink -batch -pw "T9092298679j#" root@72.60.61.216 "mkdir -p /root/supabase-new" 2>nul
scp -pw "T9092298679j#" "%TEMP%\kong.yml" root@72.60.61.216:/root/supabase-new/kong.yml
if errorlevel 1 (
    echo ERRO ao copiar arquivo!
    pause
    exit /b 1
)

echo.
echo [2/3] Reiniciando Kong...
plink -batch -pw "T9092298679j#" root@72.60.61.216 "docker restart supabase-new-kong && sleep 5" 2>nul

echo.
echo [3/3] Testando conexao...
plink -batch -pw "T9092298679j#" root@72.60.61.216 "curl -s http://localhost:8100/rest/v1/ | head -c 200" 2>nul

echo.
echo ============================================
echo Concluido! Verifique a resposta acima.
echo ============================================
del "%TEMP%\kong.yml" 2>nul
pause