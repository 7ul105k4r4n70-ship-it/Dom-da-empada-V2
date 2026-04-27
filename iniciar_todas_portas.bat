@echo off
cd /d "C:\Users\tulio\Music\Dom_da_empada_Modulo_V2"

echo Abrindo portas 3000-3005 no Windows Firewall...
powershell -Command "for ($port = 3000; $port -le 3005; $port++) { New-NetFirewallRule -DisplayName \"Porta_$port\" -Direction Inbound -Protocol TCP -LocalPort $port -Action Allow -ErrorAction SilentlyContinue }"

echo.
echo Iniciando servidores Vite nas portas 3000 a 3005...
echo.

start cmd /k "cd /d C:\Users\tulio\Music\Dom_da_empada_Modulo_V2 && npm run dev -- --port=3000"
timeout /t 2 /nobreak >nul
start cmd /k "cd /d C:\Users\tulio\Music\Dom_da_empada_Modulo_V2 && npm run dev -- --port=3001"
timeout /t 2 /nobreak >nul
start cmd /k "cd /d C:\Users\tulio\Music\Dom_da_empada_Modulo_V2 && npm run dev -- --port=3002"
timeout /t 2 /nobreak >nul
start cmd /k "cd /d C:\Users\tulio\Music\Dom_da_empada_Modulo_V2 && npm run dev -- --port=3003"
timeout /t 2 /nobreak >nul
start cmd /k "cd /d C:\Users\tulio\Music\Dom_da_empada_Modulo_V2 && npm run dev -- --port=3004"
timeout /t 2 /nobreak >nul
start cmd /k "cd /d C:\Users\tulio\Music\Dom_da_empada_Modulo_V2 && npm run dev -- --port=3005"

echo.
echo Servidores iniciados!
echo Portas disponiveis: 3000, 3001, 3002, 3003, 3004, 3005
pause
