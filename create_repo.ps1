# Criar repositorio Dom-da-empada-V2 no GitHub via API
$token = Read-Host "Digite seu token do GitHub (ghp_...)" -AsSecureString
$plainToken = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))

$headers = @{
    "Authorization" = "token $plainToken"
    "Accept" = "application/vnd.github.v3+json"
}

$body = @{
    name = "Dom-da-empada-V2"
    description = "Dom da Empada - Portal Administrativo"
    private = $true
    auto_init = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "Repositorio criado com sucesso!" -ForegroundColor Green
    Write-Host "URL: $($response.html_url)"
    Write-Host "Clone: $($response.clone_url)"
    
    # Salvar instrucoes
    $instructions = @"
Proximos passos (rode no terminal do projeto):

cd "C:\Users\Tulio Scaranto\Documents\Dom-da-empada-V2"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin $($response.clone_url)
git push -u origin main

Depois, no Vercel:
1. Acesse https://vercel.com/dashboard
2. Importe o repositorio Dom-da-empada-V2
3. O deploy sera automatico a cada push
"@
    
    $instructions | Out-File -FilePath "github_setup_instructions.txt" -Encoding UTF8
    Write-Host "Instrucoes salvas em github_setup_instructions.txt"
    
} catch {
    Write-Host "Erro ao criar repositorio: $_" -ForegroundColor Red
}
