@echo off
cd /d "C:\Users\tulio\Music\Dom_da_empada_Modulo_V2"

echo Abrindo portas 3000-3005 no Windows Firewall...
powershell -Command "for ($port = 3000; $port -le 3005; $port++) { New-NetFirewallRule -DisplayName \"Porta_$port\" -Direction Inbound -Protocol TCP -LocalPort $port -Action Allow -ErrorAction SilentlyContinue }"

echo.
echo Iniciando servidor Vite na porta 3003...
echo Acesse: http://localhost:3003
echo.
npm run dev
pause
