# Configurar Deploy no Vercel

## Status
- ✅ Repositório GitHub criado: https://github.com/7ul105k4r4n70-ship-it/portal-administrativo
- ⚠️ Vercel: Limite de 100 deploys/dia atingido - aguardar reset (~24h)

## Passos para conectar Vercel ao novo repo

### 1. Acesse o Vercel Dashboard
https://vercel.com/dashboard

### 2. Adicionar novo projeto
- Clique em "Add New..." → "Project"
- Clique em "Import Git Repository"
- Cole a URL: `https://github.com/7ul105k4r4n70-ship-it/portal-administrativo`

### 3. Configurações do projeto
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 4. Variáveis de ambiente (se necessário)
Adicione no Vercel Dashboard → Project Settings → Environment Variables:
```
VITE_SUPABASE_URL=<sua_url>
VITE_SUPABASE_ANON_KEY=<sua_chave>
```

### 5. Deploy
- Clique "Deploy"
- O Vercel vai fazer build automaticamente

## Após configurado
Cada push para o GitHub vai disparar deploy automatico no Vercel.

## Scripts disponíveis localmente
- `node upload-to-new-repo.js` - Envia todos os arquivos para o novo GitHub
- `DEPLOY.bat` - Commit + Deploy Vercel (quando o limite resetar)
