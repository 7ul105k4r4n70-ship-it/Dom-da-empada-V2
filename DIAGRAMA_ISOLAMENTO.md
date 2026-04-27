# 🌍 Diagrama - Isolamento de Regiões

## Fluxo de Isolamento de Dados

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUÁRIO FAZ LOGIN                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Supabase Auth → Retorna user.id                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Busca em app_users:                                            │
│  - user.role (admin, usuario, motorista)                        │
│  - user.region (Recife, Salvador)                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Define contexto de região                     │
│  RegionProvider → region = 'Recife' ou 'Salvador'               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Usuário acessa página                         │
│  Ex: Página de Pedidos                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Frontend faz query com filtro:                                 │
│  subscribeToTable('orders', { region: 'Recife' }, callback)     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Supabase recebe query:                                         │
│  SELECT * FROM orders WHERE region = 'Recife'                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  RLS Policy verifica:                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ É admin?                                                   │  │
│  │ ├─ SIM → Permite acesso a TODAS as regiões                │  │
│  │ └─ NÃO → Permite acesso SÓ à região do usuário            │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Dados retornados ao frontend                                   │
│  ✅ Apenas dados da região permitida                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Frontend renderiza dados                                       │
│  Usuário vê APENAS dados da sua região                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fluxo para Administradores

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN FAZ LOGIN                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  TopBar mostra selector de região:                              │
│  ┌──────────┬───────────┬────────┐                              │
│  │  Recife  │  Salvador │ Todas  │                              │
│  └──────────┴───────────┴────────┘                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
┌─────────────────────┐   ┌─────────────────────┐
│ Seleciona "Recife"  │   │ Seleciona "Todas"   │
└──────────┬──────────┘   └──────────┬──────────┘
           │                         │
           ▼                         ▼
┌──────────────────────┐   ┌──────────────────────┐
│ Query:               │   │ Query:               │
│ { region: 'Recife' } │   │ {} (sem filtro)      │
└──────────┬───────────┘   └──────────┬───────────┘
           │                         │
           ▼                         ▼
┌──────────────────────┐   ┌──────────────────────┐
│ RLS permite acesso   │   │ RLS permite acesso   │
│ a Recife (é admin)   │   │ a TODAS (é admin)    │
└──────────┬───────────┘   └──────────┬───────────┘
           │                         │
           ▼                         ▼
┌──────────────────────┐   ┌──────────────────────┐
│ Vê SÓ dados Recife   │   │ Vê dados combinados  │
│                      │   │ (mas isolados nas    │
│                      │   │  tabelas por região) │
└──────────────────────┘   └──────────────────────┘
```

---

## Fluxo para Usuários Normais

```
┌─────────────────────────────────────────────────────────────────┐
│                  USUÁRIO DE RECIFE FAZ LOGIN                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  app_users:                                                     │
│  - role: 'usuario'                                              │
│  - region: 'Recife'                                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  NÃO vê selector de região no TopBar                            │
│  Região fixa: Recife                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Tenta acessar qualquer página:                                 │
│  subscribeToTable('orders', { region: 'Recife' }, callback)     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  RLS Policy verifica:                                           │
│  - É admin? NÃO                                                 │
│  - region = user.region? SIM (Recife = Recife)                  │
│  ✅ Permite acesso                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Tenta acessar dados de Salvador (via API direta):              │
│  SELECT * FROM orders WHERE region = 'Salvador'                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  RLS Policy verifica:                                           │
│  - É admin? NÃO                                                 │
│  - region = user.region? NÃO (Salvador ≠ Recife)                │
│  ❌ BLOQUEIA acesso                                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Resultado: 0 registros retornadas                              │
│  Usuário de Recife NÃO consegue ver dados de Salvador           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Arquitetura de Segurança em Duas Camadas

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAMADA 1: FRONTEND (React)                    │
│                                                                   │
│  - Context API (RegionContext)                                   │
│  - Hooks (useRegion, useRegionFilters)                           │
│  - subscribeToTable com filtro de região                         │
│  - Selector de região no TopBar (apenas para admins)             │
│                                                                   │
│  ⚠️ Pode ser burlado se alguém modificar o código                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CAMADA 2: BANCO DE DADOS (RLS)                  │
│                                                                   │
│  - Policies de isolamento em TODAS as tabelas                    │
│  - Verificação automática de role e region                       │
│  - Bloqueio em nível de banco de dados                           │
│  - Funciona mesmo se frontend for burlado                        │
│                                                                   │
│  ✅ Segurança REAL e IMUTÁVEL                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Distribuição de Dados por Região

```
┌─────────────────────────────────────────────────────────────────┐
│                         BANCO DE DADOS                           │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│      REGIÃO RECIFE      │   │    REGIÃO SALVADOR      │
│                         │   │                         │
│  orders:                │   │  orders:                │
│    - order_001 (Recife) │   │    - order_010 (Salv.)  │
│    - order_002 (Recife) │   │    - order_011 (Salv.)  │
│    - order_003 (Recife) │   │    - order_012 (Salv.)  │
│                         │   │                         │
│  franchisees:           │   │  franchisees:           │
│    - Fran. Recife 1     │   │    - Fran. Salv. 1      │
│    - Fran. Recife 2     │   │    - Fran. Salv. 2      │
│                         │   │                         │
│  products:              │   │  products:              │
│    - Produto A (Recife) │   │    - Produto A (Salv.)  │
│    - Produto B (Recife) │   │    - Produto B (Salv.)  │
│                         │   │                         │
│  vehicles:              │   │  vehicles:              │
│    - Veículo 01 (Rec.)  │   │    - Veículo 10 (Salv.) │
│    - Veículo 02 (Rec.)  │   │    - Veículo 11 (Salv.) │
└─────────────────────────┘   └─────────────────────────┘
                              │
                              │ transfers:
                              │   - Transfer 1
                              │     origem: Recife
                              │     destino: Salvador
                              │   - Transfer 2
                              │     origem: Salvador
                              │     destino: Recife
                              ▼
                    ┌─────────────────────┐
                    │  transfers conecta  │
                    │  ambas as regiões   │
                    └─────────────────────┘
```

---

## Estado da Aplicação por Tipo de Usuário

```
┌─────────────────────────────────────────────────────────────────┐
│                    USUÁRIO DE RECIFE                             │
│                                                                   │
│  region: 'Recife' (fixo)                                         │
│  role: 'usuario'                                                 │
│                                                                   │
│  Pode ver:                                                        │
│  ✅ Orders de Recife                                             │
│  ✅ Franchisees de Recife                                        │
│  ✅ Products de Recife                                           │
│  ✅ Vehicles de Recife                                           │
│  ✅ Users (todos, mas só edita se admin)                         │
│                                                                   │
│  NÃO pode ver:                                                    │
│  ❌ Orders de Salvador                                           │
│  ❌ Franchisees de Salvador                                      │
│  ❌ Products de Salvador                                         │
│  ❌ Vehicles de Salvador                                         │
│                                                                   │
│  NÃO pode fazer:                                                  │
│  ❌ Criar order em Salvador                                      │
│  ❌ Editar franqueado de Salvador                                │
│  ❌ Deletar produto de Salvador                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      ADMINISTRADOR                               │
│                                                                   │
│  region: 'Recife' | 'Salvador' | 'Todas' (selecionável)         │
│  role: 'admin'                                                   │
│                                                                   │
│  Pode ver (depende da seleção):                                   │
│  ✅ Seleciona Recife → Vê dados de Recife                        │
│  ✅ Seleciona Salvador → Vê dados de Salvador                    │
│  ✅ Seleciona Todas → Vê dados combinados                        │
│                                                                   │
│  Pode fazer:                                                      │
│  ✅ Criar/editar/deletar em QUALQUER região                      │
│  ✅ Gerenciar usuários de ambas regiões                          │
│  ✅ Criar transfers entre regiões                                │
│  ✅ Ver relatórios consolidados                                   │
│                                                                   │
│  Dados NUNCA se misturam:                                         │
│  ⚠️ Mesmo em "Todas", cada registro mantém sua region            │
│  ⚠️ Tabelas sempre mostram coluna region                         │
│  ⚠️ exports/relatórios separam por região                        │
└─────────────────────────────────────────────────────────────────┘
```
