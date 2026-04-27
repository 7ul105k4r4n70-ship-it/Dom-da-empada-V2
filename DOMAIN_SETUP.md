# Configuracao de Dominio

## Dominio desejado
portal-administrativo.sk4r4n70.cloud

## Passos para configurar no Vercel

### 1. Acesse o Dashboard do Vercel
https://vercel.com/dashboard

### 2. Selecione o projeto
- portal-administrativo (ou o projeto atual)

### 3. Vá em Settings → Domains
- Clique em "Add Domain"
- Digite: `portal-administrativo.sk4r4n70.cloud`
- Clique em "Add"

### 4. Configure o DNS (se necessario)

Se seu dominio `sk4r4n70.cloud` estiver em outro provedor (Cloudflare, GoDaddy, etc):

**Opcao A - CNAME (recomendado):**
```
Tipo: CNAME
Nome: portal-administrativo
Valor: cname.vercel-dns.com
TTL: Automatico
```

**Opcao B - A Record:**
```
Tipo: A
Nome: portal-administrativo
Valor: 76.76.21.21
TTL: Automatico
```

### 5. Aguarde a propagacao
- Pode levar alguns minutos ate 24 horas
- O Vercel mostrara o status da configuracao

## Scripts atualizados

Os scripts agora apontam para:
- Producao: `https://portal-administrativo.sk4r4n70.cloud`
- Fallback: `https://administrativo.sk4r4n70.cloud` (antigo)

## Verificar status

Apos configurar, verifique:
```
https://portal-administrativo.sk4r4n70.cloud
```
