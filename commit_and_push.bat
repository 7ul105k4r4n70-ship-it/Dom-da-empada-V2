@echo off
echo ================================================
echo  Dom da Empada - Commit e Push
echo ================================================
cd /d "C:\Users\Tulio Scaranto\Documents\Dom-da-empada-V2"
git add -A

REM Detecta o nome da branch atual automaticamente
for /f "delims=" %%i in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%i
echo Branch atual: %BRANCH%

git commit -m "deploy: atualizacao relatorios e precos"
git push origin %BRANCH%
echo ================================================
echo  Push concluido! Aguarde o deploy automatico.
echo  Branch: %BRANCH%
echo ================================================
pause
