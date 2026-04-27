# Fazer commit e push via GitHub API (sem Git instalado)
$token = "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"
$owner = "7ul105k4r4n70-ship-it"
$repo = "Dom-da-empada-V2"
$branch = "main"

$headers = @{
    "Authorization" = "token $token"
    "Accept" = "application/vnd.github.v3+json"
}

$baseUrl = "https://api.github.com/repos/$owner/$repo"

# Funcao para fazer upload de um arquivo
function Upload-File($filePath, $repoPath) {
    $content = [System.IO.File]::ReadAllBytes($filePath)
    $base64 = [Convert]::ToBase64String($content)
    
    # Verificar se arquivo ja existe (para pegar SHA)
    try {
        $existing = Invoke-RestMethod -Uri "$baseUrl/contents/$repoPath`?ref=$branch" -Headers $headers -Method GET -ErrorAction Stop
        $sha = $existing.sha
    } catch {
        $sha = $null
    }
    
    $body = @{
        message = "deploy: atualizacao relatorios e precos"
        content = $base64
        branch = $branch
    }
    if ($sha) { $body.sha = $sha }
    
    try {
        Invoke-RestMethod -Uri "$baseUrl/contents/$repoPath" -Headers $headers -Method PUT -Body ($body | ConvertTo-Json) -ContentType "application/json"
        Write-Host "OK: $repoPath" -ForegroundColor Green
    } catch {
        Write-Host "ERRO: $repoPath - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Enviando arquivos para GitHub..." -ForegroundColor Cyan
Write-Host ""

# Upload do arquivo principal
$reportsPath = "C:\Users\Tulio Scaranto\Documents\Dom-da-empada-V2\src\pages\Reports.tsx"
if (Test-Path $reportsPath) {
    Upload-File $reportsPath "src/pages/Reports.tsx"
}

# Upload do Finance.tsx
$financePath = "C:\Users\Tulio Scaranto\Documents\Dom-da-empada-V2\src\pages\Finance.tsx"
if (Test-Path $financePath) {
    Upload-File $financePath "src/pages/Finance.tsx"
}

Write-Host ""
Write-Host "Concluido! Verifique em: https://github.com/$owner/$repo" -ForegroundColor Cyan
Write-Host ""
pause
