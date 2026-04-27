# 🌍 Isolamento de Dados por Região - Dom da Empada

## 📋 Visão Geral

O sistema Dom da Empada opera em **duas regiões independentes**: **Recife** e **Salvador**. Este documento explica como os dados de cada região são mantidos separados, mesmo quando administradores têm acesso a ambas.

---

## 🎯 Princípios de Isolamento

### 1. **Dados Nunca se Misturam**
- Cada pedido, produto, veículo, franqueado, etc. pertence a **uma única região**
- Dados de Recife **nunca** aparecem nas views de Salvador e vice-versa
- Administradores podem **alternar** entre regiões, mas os dados permanecem isolados

### 2. **Controle de Acesso em Duas Camadas**

#### Camada 1: Policies RLS do Supabase (Banco de Dados)
- **Usuários normais**: Só podem VER/EDITAR dados da sua região atribuída
- **Administradores**: Podem VER/EDITAR dados de **todas** as regiões
- Isolamento é **garantido no banco de dados**, não apenas no frontend

#### Camada 2: Filtros no Frontend (React)
- Todas as queries incluem filtro de região
- Selector de região no TopBar permite alternar entre Recife/Salvador
- Admin pode selecionar "Todas" para ver dados combinados (mas ainda isolados por região nas tabelas)

---

## 🏗️ Arquitetura Técnica

### Tabelas com Isolamento por Região

Todas as tabelas principais possuem coluna `region`:

| Tabela | Coluna de Região | Isolamento |
|--------|------------------|------------|
| `orders` | `region` | ✅ Completo |
| `app_users` | `region` | ⚠️ Leitura livre, escrita restrita |
| `franchisees` | `region` | ✅ Completo |
| `products` | `region` | ✅ Completo |
| `vehicles` | `region` | ✅ Completo |
| `delivery_products` | `region` | ✅ Completo |
| `vehicle_checklists` | `region` | ✅ Completo |
| `fuel_registrations` | `region` | ✅ Completo |
| `schedules` | `region` | ✅ Completo |
| `transfers` | `origin_region`, `destination_region` | ✅ Completo |
| `order_items` | Herda de `orders.region` | ✅ Completo |

### Policies RLS (Row Level Security)

**Arquivo SQL**: `scripts/region-data-isolation.sql`

Exemplo de policy para `orders`:

```sql
CREATE POLICY "orders_isolation" ON orders
  FOR ALL
  USING (
    -- Admin pode ver todas as regiões
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    -- Usuários só veem sua região
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  );
```

---

## 💻 Implementação no Frontend

### Contexto Global de Região

**Arquivo**: `src/context/RegionContext.tsx`

```typescript
// Provedor global no App.tsx
<RegionProvider>
  <App />
</RegionProvider>

// Uso em qualquer página
import { useRegion } from '@/context/RegionContext';

function Orders() {
  const { region, setRegion } = useRegion();
  // region pode ser 'Recife', 'Salvador' ou 'Todas'
}
```

### Hook para Filtros de Região

**Arquivo**: `src/hooks/useRegionFilters.ts`

```typescript
import { useRegionFilters } from '@/hooks/useRegionFilters';

function Orders() {
  const { region } = useRegion();
  const filters = useRegionFilters(region);
  
  // Se region = 'Recife' → { region: 'Recife' }
  // Se region = 'Todas' → {} (RLS faz o isolamento)
  
  subscribeToTable('orders', filters, callback);
}
```

### Exemplo de Uso Correto

```typescript
// ✅ CORRETO - Com filtro de região
const unsubOrders = subscribeToTable(
  'orders', 
  { region },  // Filtro de região
  (data) => setOrders(data),
  'created_at'
);

// ❌ ERRADO - Sem filtro (dados podem se misturar)
const unsubOrders = subscribeToTable(
  'orders', 
  {},  // SEM FILTRO!
  (data) => setOrders(data),
  'created_at'
);
```

---

## 🔐 Fluxo de Autenticação e Isolamento

### 1. Login do Usuário
```
Usuário faz login → Supabase Auth
  ↓
Busca dados em app_users
  ↓
Obtém role e region do usuário
  ↓
Define contexto de região
```

### 2. Carregamento de Dados
```
Página solicita dados (ex: orders)
  ↓
Aplica filtro de região { region: 'Recife' }
  ↓
Supabase executa query com RLS
  ↓
RLS verifica: usuário é admin?
  ├─ SIM → Retorna dados de todas as regiões
  └─ NÃO → Retorna apenas dados da região do usuário
  ↓
Dados retornados para o frontend
```

### 3. Alternância de Região (Admin)
```
Admin seleciona "Salvador" no TopBar
  ↓
Contexto global atualiza region = 'Salvador'
  ↓
Todas as páginas recebem novo valor
  ↓
Queries são refeitas com { region: 'Salvador' }
  ↓
Dados de Salvador são carregados (Recife é ocultado)
```

---

## 📊 Páginas e Seus Filtros

| Página | Filtro de Região | Observação |
|--------|------------------|------------|
| Dashboard | ✅ Sim | Usa região selecionada |
| Orders | ✅ Sim | Admin pode ver "Todas" |
| Users | ✅ Sim | Admin pode ver "Todas" |
| Franqueados | ✅ Sim | Filtra por região |
| Vehicles | ✅ Sim | Usa região selecionada |
| Finance | ✅ Sim | Dados financeiros isolados |
| Reports | ✅ Sim | Relatórios por região |
| Schedule | ✅ Sim | Agendamentos isolados |
| KPIs | ✅ Sim | Métricas por região |
| Transfer | ✅ Sim | Transferências entre regiões |
| DeliveryProducts | ✅ Sim | Entregas isoladas |
| VehicleChecklists | ✅ Sim | Checklists por região |
| ExtraDeliveries | ✅ Sim | Entregas extras isoladas |

---

## 🛡️ Segurança e Garantia de Isolamento

### No Banco de Dados (Supabase)
- ✅ **RLS Policies** impedem acesso cruzado entre regiões
- ✅ Mesmo se frontend buga, banco **garante** isolamento
- ✅ Admin pode acessar todas, mas usuários normais **não**

### No Frontend (React)
- ✅ **Context API** compartilha região selecionada
- ✅ **Hooks** aplicam filtros automaticamente
- ✅ **subscribeToTable** sempre recebe filtro de região

### Testes Recomendados
1. Login como usuário de Recife → Verificar que só vê dados de Recife
2. Login como admin → Alternar entre regiões → Verificar isolamento
3. Criar pedido em Recife → Verificar que não aparece em Salvador
4. Tentar acessar API diretamente → Verificar que RLS bloqueia

---

## 🚀 Implementação Passo a Passo

### Para Desenvolvedores

1. **Execute o SQL de isolamento**:
   ```bash
   # No Supabase Studio > SQL Editor
   # Copie e execute: scripts/region-data-isolation.sql
   ```

2. **Use o hook de região** em novas páginas:
   ```typescript
   import { useRegion } from '@/context/RegionContext';
   import { useRegionFilters } from '@/hooks/useRegionFilters';
   
   function NovaPagina() {
     const { region } = useRegion();
     const filters = useRegionFilters(region);
     
     subscribeToTable('tabela', filters, callback);
   }
   ```

3. **Nunca faça queries sem filtro de região**:
   ```typescript
   // ❌ ERRADO
   subscribeToTable('orders', {}, callback);
   
   // ✅ CORRETO
   const { region } = useRegion();
   subscribeToTable('orders', { region }, callback);
   ```

4. **Teste o isolamento**:
   - Crie dados em Recife
   - Mude para Salvador
   - Verifique que dados de Recife não aparecem

---

## 🐛 Troubleshooting

### Problema: Dados de ambas regiões aparecendo
**Causa**: Query sem filtro de região  
**Solução**: Adicionar `{ region }` no `subscribeToTable`

### Problema: Admin não consegue ver todas as regiões
**Causa**: Policy RLS não configurada corretamente  
**Solução**: Verificar se policy tem regra para `role = 'admin'`

### Problema: Usuário vê dados de outra região
**Causa**: RLS não habilitado ou policy faltando  
**Solução**: Executar `scripts/region-data-isolation.sql`

---

## 📝 Notas Importantes

1. **Transfers**: Tabela especial com `origin_region` e `destination_region`
   - Usuário vê transfers de origem OU destino da sua região
   - Admin vê todos os transfers

2. **Order Items**: Herda isolamento de `orders`
   - Não precisa de coluna `region` própria
   - Policy verifica região do pedido pai

3. **App Users**: Leitura livre, escrita restrita
   - Todos podem ver todos os usuários (para atribuir motoristas, etc)
   - Apenas admin pode criar/editar/deletar usuários

---

## ✅ Checklist de Validação

- [ ] SQL de isolamento executado no Supabase
- [ ] Todas as páginas usam filtro de região
- [ ] Admin pode alternar entre regiões
- [ ] Usuário normal só vê sua região
- [ ] Dados não se misturam ao alternar regiões
- [ ] Policies RLS verificadas no Supabase Studio
- [ ] Testes de isolamento realizados

---

**Última atualização**: Abril 2026  
**Responsável**: Equipe de Desenvolvimento Dom da Empada
