Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CORRECAO REGIAO DO PONTO - V3" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$V3Path = "C:\Users\tulio\Music\Dom_da_empada_Modulo_V3"

if (-not (Test-Path $V3Path)) {
    Write-Host "ERRO: Pasta do Modulo V3 nao encontrada!" -ForegroundColor Red
    exit 1
}

Write-Host "Modulo V3 encontrado em: $V3Path" -ForegroundColor Green
Write-Host ""

# ARQUIVO 1: src/supabase.ts
Write-Host "Modificando src/supabase.ts..." -ForegroundColor Yellow

$supabaseFile = Join-Path $V3Path "src\supabase.ts"
$content = Get-Content $supabaseFile -Raw -Encoding UTF8

$old = "export interface DeliveryPoint {`r`n  id: string;`r`n  name: string;`r`n  city: string;`r`n  uf: string;`r`n}"
$new = "export interface DeliveryPoint {`r`n  id: string;`r`n  name: string;`r`n  city: string;`r`n  uf: string;`r`n  region?: 'Recife' | 'Salvador';`r`n}"

if ($content -match [regex]::Escape($old)) {
    $content = $content.Replace($old, $new)
    $content | Set-Content $supabaseFile -Encoding UTF8 -NoNewline
    Write-Host "  OK: Campo region adicionado na interface DeliveryPoint" -ForegroundColor Green
} else {
    Write-Host "  AVISO: Interface DeliveryPoint ja esta atualizada ou formato diferente" -ForegroundColor Yellow
}

Write-Host ""

# ARQUIVO 2: src/pages/Checkout.tsx
Write-Host "Modificando src/pages/Checkout.tsx..." -ForegroundColor Yellow

$checkoutFile = Join-Path $V3Path "src\pages\Checkout.tsx"
$checkoutContent = Get-Content $checkoutFile -Raw -Encoding UTF8

# Mudanca 1: Remover linha const region
$checkoutContent = $checkoutContent -replace "const region = user\?\.region \|\| 'Recife';", "// region agora vem do ponto: selectedPoint?.region || user.region"

# Mudanca 2: Adicionar pointRegion apos try {
$checkoutContent = $checkoutContent -replace "(try \{)", "`$1`r`n    // Regiao do ponto de entrega (prioridade sobre regiao do franqueado)`r`n    const pointRegion = selectedPoint?.region || user.region;"

# Mudanca 3: Trocar user.region por pointRegion no updateOrder
$checkoutContent = $checkoutContent -replace "await updateOrder\(lastOrderId, pointName, unitsInt, orderItems, user\.region\)", "await updateOrder(lastOrderId, pointName, unitsInt, orderItems, pointRegion)"

# Mudanca 4: Trocar user.region por pointRegion no createOrder
$checkoutContent = $checkoutContent -replace "user\.id,\s+user\.region,", "user.id,`r`n  pointRegion,"

# Mudanca 5: Trocar user.region por pointRegion no localStorage
$pattern5 = 'localStorage\.setItem\(`active_order_id_\$\{user\.id\}_\$\{user\.region\}`'
$replacement5 = 'localStorage.setItem(`active_order_id_${user.id}_${pointRegion}`'
$checkoutContent = $checkoutContent -replace $pattern5, $replacement5

# Mudanca 6: Trocar user.region por pointRegion no generateOrderPDF
$checkoutContent = $checkoutContent -replace "generateOrderPDF\(\s*orderId,\s*user\.region,", "generateOrderPDF(`r`n    orderId,`r`n    pointRegion,"

$checkoutContent | Set-Content $checkoutFile -Encoding UTF8 -NoNewline
Write-Host "  OK: Todas as referencias atualizadas para usar pointRegion" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CORRECAO APLICADA COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Yellow
Write-Host "  1. Abra o Modulo V3 no VS Code" -ForegroundColor White
Write-Host "  2. Verifique as mudancas nos arquivos" -ForegroundColor White
Write-Host "  3. Execute: npm run dev" -ForegroundColor White
Write-Host "  4. Teste criando um pedido" -ForegroundColor White
Write-Host ""
