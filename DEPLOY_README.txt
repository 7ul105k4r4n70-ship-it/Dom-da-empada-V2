=== DEPLOY GITHUB + VERCEL ===

1. CRIAR REPOSITORIO NO GITHUB
   - Acesse: https://github.com/new
   - Nome: Dom-da-empada-V2
   - NAO marque "Add a README file"
   - NAO marque "Add .gitignore"
   - Clique Create repository

2. FAZER PUSH DO CODIGO
   Execute no terminal do VS Code:

   cd "C:\Users\Tulio Scaranto\Documents\GitHub\Dom-da-empada-V2\Portal Administrativo V2"
   git remote set-url origin https://github.com/7ul105k4r4n70-ship-it/Dom-da-empada-V2.git
   git push -u origin main

3. DEPLOY NO VERCEL
   Opcao A - Interface Web (recomendado):
   - Acesse: https://vercel.com/new
   - Importe o repositorio Dom-da-empada-V2
   - Nome do projeto: Portal Adminitrativo
   - Framework: Vite
   - Clique Deploy

   Opcao B - Terminal (se ja tiver login no Vercel):
   npx vercel --prod --name portal-adminitrativo --yes

4. VARIAVEIS DE AMBIENTE
   No dashboard do Vercel, adicione:
   - VITE_SUPABASE_URL = (sua URL)
   - VITE_SUPABASE_ANON_KEY = (sua chave anonima)

Pronto! O site estara no ar.
