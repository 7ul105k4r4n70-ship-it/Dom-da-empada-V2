$pass = 'T97414093034j#'
$secPass = ConvertTo-SecureString $pass -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential('root', $secPass)

$session = New-PSSession -ComputerName '72.60.61.216' -Credential $cred -Authentication Basic

Invoke-Command -Session $session -ScriptBlock {
    Write-Host "=== HOSTNAME ==="
    hostname
    Write-Host "=== NETSTAT 3000 ==="
    netstat -tlnp | findstr "3000 8000 LISTEN"
    Write-Host "=== DOCKER PS ==="
    docker ps 2>$null
    Write-Host "=== GOTRUE ENV ==="
    env 2>$null | Select-String "GOTRUE|AUTH|API_PORT|PORT"
    Write-Host "=== PROCESS ==="
    ps aux 2>$null
} -ErrorAction Continue

Remove-PSSession $session
