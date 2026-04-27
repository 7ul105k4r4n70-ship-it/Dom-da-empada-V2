@echo off
echo ================================================
echo  Dom da Empada - Deploy Local (localhost)
echo ================================================
cd /d "C:\Users\Tulio Scaranto\Documents\Dom-da-empada-V2"

REM 1. Verificar se git está disponível
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Git nao encontrado. Verifique se o Git for Windows esta instalado.
    pause
    exit /b 1
)

REM 2. Verificar se Vercel CLI está disponível
npx vercel --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Vercel CLI nao encontrado. Instale com: npm i -g vercel
    pause
    exit /b 1
)

REM 3. Verificar vinculação com projeto Vercel
if not exist ".vercel\project.json" (
    echo [INFO] Vinculando projeto ao Vercel...
    npx vercel link --project portal-administrativo --yes
    if errorlevel 1 (
        echo [ERRO] Falha ao vincular projeto. Verifique suas credenciais do Vercel.
        pause
        exit /b 1
    )
)

REM 4. Adicionar todos os arquivos
git add -A

REM 4. Detectar branch atual
for /f "delims=" %%i in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%i
echo Branch: %BRANCH%

REM 5. Commit (mensagem pode ser passada como argumento)
if "%~1"=="" (
    set MSG=deploy: atualizacao relatorios e precos
) else (
    set MSG=%~1
)
git commit -m "%MSG%"

REM 6. Push para GitHub
echo.
echo Enviando para GitHub...
git push origin %BRANCH%

REM 7. Deploy no Vercel (producao)
echo.
echo Iniciando deploy no Vercel...
npx vercel --prod --yes

echo.
echo ================================================
echo  Deploy finalizado!
echo  URL: https://portal-administrativo.sk4r4n70.cloud
echo ================================================
pause
