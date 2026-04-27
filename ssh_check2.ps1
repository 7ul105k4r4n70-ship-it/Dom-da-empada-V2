param(
    [string]$Password = "T97414093034j#",
    [string]$Host = "72.60.61.216"
)

# Write password to temp file for SSH
$passFile = "$env:TEMP\ssh_pass_$PID.txt"
$passFile | Out-File -FilePath $passFile -NoNewline -Encoding ASCII
[System.IO.File]::WriteAllText($passFile, $Password)

# Try SSH with password from file
$cmd = "netstat -tlnp | grep -E '3000|8000|LISTEN'; echo '---'; env | grep GOTRUE; echo '---'; docker ps 2>/dev/null; echo '---'; cat /etc/supabase/.env 2>/dev/null || echo 'no .env'"

$output = & ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 -o PreferredAuthentications=password -o PubkeyAuthentication=no -o PasswordAuthentication=yes root@$Host "$cmd" < $passFile 2>&1

# Cleanup
Remove-Item $passFile -Force -ErrorAction SilentlyContinue

Write-Host $output
