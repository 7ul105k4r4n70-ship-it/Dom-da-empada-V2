@echo off
chcp 65001 >nul
echo ================================================
echo  Dom da Empada - Instalar Git e Push para GitHub
echo ================================================
echo.

set "PROJECT_DIR=C:\Users\Tulio Scaranto\Documents\Dom-da-empada-V2"
set "GIT_PORTABLE_DIR=%PROJECT_DIR%\.git-portable"
set "GIT_EXE=%GIT_PORTABLE_DIR%\bin\git.exe"

cd /d "%PROJECT_DIR%"

REM Verificar se git ja existe no PATH
where git >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Git ja esta instalado.
    set "GIT_CMD=git"
    goto :CONFIGURE
)

REM Verificar se git portable ja foi baixado
if exist "%GIT_EXE%" (
    echo [OK] Git portable encontrado.
    set "GIT_CMD=%GIT_EXE%"
    goto :CONFIGURE
)

echo [INFO] Git nao encontrado. Baixando Git Portable...
echo.

REM Criar pasta para git portable
if not exist "%GIT_PORTABLE_DIR%" mkdir "%GIT_PORTABLE_DIR%"

REM Baixar Git Portable (versao minima)
echo Baixando Git Portable...
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/PortableGit-2.43.0-64-bit.7z.exe' -OutFile '%PROJECT_DIR%\git-portable.exe'" 2>nul

if not exist "%PROJECT_DIR%\git-portable.exe" (
    echo [ERRO] Nao foi possivel baixar o Git automaticamente.
    echo.
    echo Por favor, instale o Git manualmente:
    echo https://git-scm.com/download/win
    echo.
    echo Ou use o GitHub Desktop:
    echo https://desktop.github.com/
    pause
    exit /b 1
)

echo Extraindo Git Portable...
"%PROJECT_DIR%\git-portable.exe" -y -o"%GIT_PORTABLE_DIR%" >nul 2>&1
if %errorlevel% neq 0 (
    echo Tentando extracao alternativa...
    powershell -Command "Expand-Archive -Path '%PROJECT_DIR%\git-portable.exe' -DestinationPath '%GIT_PORTABLE_DIR%' -Force" 2>nul
)

if not exist "%GIT_EXE%" (
    echo [ERRO] Falha ao extrair Git Portable.
    echo Instale manualmente: https://git-scm.com/download/win
    pause
    exit /b 1
)

del "%PROJECT_DIR%\git-portable.exe" 2>nul
set "GIT_CMD=%GIT_EXE%"

echo [OK] Git Portable instalado.

:CONFIGURE
echo.
echo [1/5] Configurando Git...
"%GIT_CMD%" init
"%GIT_CMD%" config user.email "deploy@domdaempada.com"
"%GIT_CMD%" config user.name "Deploy Bot"
"%GIT_CMD%" branch -M main

echo.
echo [2/5] Removendo remote antigo (se existir)...
"%GIT_CMD%" remote remove origin 2>nul

echo.
echo [3/5] Adicionando remote do GitHub...
"%GIT_CMD%" remote add origin https://7ul105k4r4n70-ship-it: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@github.com/7ul105k4r4n70-ship-it/Dom-da-empada-V2.git

echo.
echo [4/5] Adicionando arquivos e fazendo commit...
"%GIT_CMD%" add -A
"%GIT_CMD%" commit -m "feat: separacao por categoria nos relatorios, correcao calculos caixas/unidades"

echo.
echo [5/5] Enviando para GitHub...
"%GIT_CMD%" push -u origin main --force

echo.
if %errorlevel%==0 (
    echo ================================================
    echo  SUCESSO! Repositorio atualizado.
    echo  https://github.com/7ul105k4r4n70-ship-it/Dom-da-empada-V2
    echo ================================================
) else (
    echo [ERRO] Falha ao fazer push.
    echo Verifique sua conexao e o token do GitHub.
)

echo.
echo Pressione qualquer tecla para sair...
pause >nul
