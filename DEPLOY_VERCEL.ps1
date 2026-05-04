# Script para deploy no GitHub e Vercel
# Execute este script no PowerShell do VS Code

$repoName = "Dom-da-empada-V2"
$vercelProjectName = "portal-adminitrativo"

Write-Host "=== DEPLOY GITHUB + VERCEL ===" -ForegroundColor Green

# 1. Configurar remote do GitHub
git remote set-url origin "https://github.com/7ul105k4r4n70-ship-it/$repoName.git"

# 2. Fazer push (se o repositorio ja existir no GitHub)
Write-Host "`nFazendo push para GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nERRO: O repositorio '$repoName' ainda nao existe no GitHub." -ForegroundColor Red
    Write-Host "Crie o repositorio manualmente em: https://github.com/new" -ForegroundColor Yellow
    Write-Host "Nome: $repoName" -ForegroundColor Yellow
    Write-Host "Depois execute este script novamente." -ForegroundColor Yellow
    exit 1
}

Write-Host "`nPush realizado com sucesso!" -ForegroundColor Green

# 3. Verificar/Instalar Vercel CLI
Write-Host "`nVerificando Vercel CLI..." -ForegroundColor Cyan
$npxPath = (Get-Command npx -ErrorAction SilentlyContinue).Source
if (-not $npxPath) {
    Write-Host "npx nao encontrado. Instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

# 4. Fazer deploy no Vercel
Write-Host "`nIniciando deploy no Vercel..." -ForegroundColor Cyan
Write-Host "Se for a primeira vez, faca login no Vercel quando solicitado." -ForegroundColor Yellow

npx vercel --prod --name $vercelProjectName --yes

Write-Host "`n=== DEPLOY CONCLUIDO ===" -ForegroundColor Green
