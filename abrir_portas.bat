@echo off
echo Abrindo portas 3000 a 3005 no Windows Firewall...
powershell -Command "for ($port = 3000; $port -le 3005; $port++) { New-NetFirewallRule -DisplayName \"Porta_$port\" -Direction Inbound -Protocol TCP -LocalPort $port -Action Allow -ErrorAction SilentlyContinue }"
echo Portas abertas com sucesso!
pause
