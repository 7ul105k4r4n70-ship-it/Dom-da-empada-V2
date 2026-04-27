@echo off
echo ========================================
echo  DOM DA EMPADA V2 - Deploy Direto (Vercel)
echo ========================================
echo.

cd /d "c:\Users\Tulio Scaranto\Documents\Dom-da-empada-V2"

echo [1/3] Verificando status do repositorio...
git status
echo.

echo [2/3] Adicionando e comitando arquivos...
git add .
set /p msg="Digite a mensagem do commit (ou pressione Enter para padrao): "
if "%msg%"=="" set msg=Update: latest changes
git commit -m "%msg%"
echo.

echo [3/3] Iniciando Deploy direto na Vercel...
echo (Isso contorna o erro do GitHub e publica a versao mais recente)
call npx vercel --prod

echo.
echo ========================================
if %errorlevel%==0 (
    echo  SUCESSO! Deploy realizado na Vercel.
) else (
    echo  ERRO no deploy! Verifique as mensagens acima.
)
echo ========================================
echo.
pause
