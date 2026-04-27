#!/bin/bash
# Corrigir kong.yml para apontar para PostgREST na porta 8000

cat > /root/supabase-new/kong.yml << 'EOF'
_format_version: "3.0"

services:
  - name: rest
    url: http://rest:8000
    routes:
      - name: rest-route
        paths:
          - /rest/v1
        strip_path: true
    plugins:
      - name: cors

  - name: auth
    url: http://auth:9999
    routes:
      - name: auth-route
        paths:
          - /auth/v1
        strip_path: true
    plugins:
      - name: cors
EOF

# Recarregar Kong
docker kill supabase-new-kong
docker start supabase-new-kong

echo "Kong recarregado com PostgREST na porta 8000!"
sleep 5

# Testar
curl -s http://localhost:8100/rest/v1/ | head -c 200
echo ""
echo "Testando auth..."
curl -s http://localhost:8100/auth/v1/ | head -c 100