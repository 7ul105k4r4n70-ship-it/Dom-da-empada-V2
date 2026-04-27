@echo off
echo ================================================
echo  Dom da Empada - Commit + Deploy (GitHub API)
echo ================================================
cd /d "C:\Users\Tulio Scaranto\Documents\Dom-da-empada-V2"

REM Usar Node.js para fazer commit via GitHub API (sem precisar do Git)
echo.
echo [1/2] Commit no GitHub via API...
node deploy-full.js "deploy: atualizacao relatorios e precos"

REM Se o script Node falhar, usar deploy Vercel direto
echo.
echo [2/2] Deploy no Vercel...
npx vercel --prod --yes

echo.
echo ================================================
echo  Deploy finalizado!
echo  URL: https://portal-administrativo.sk4r4n70.cloud
echo ================================================
pause
