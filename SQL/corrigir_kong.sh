#!/bin/bash
# Corrigir kong.yml para o novo Supabase

cat > /root/supabase-new/kong.yml << 'EOF'
_format_version: "3.0"

services:
  - name: rest
    url: http://rest:3000
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

echo "Kong recarregado!"
sleep 5

# Testar
curl http://localhost:8100/rest/v1/
