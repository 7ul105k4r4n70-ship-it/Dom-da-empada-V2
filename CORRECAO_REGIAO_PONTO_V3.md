# 🎯 CORREÇÃO: Direcionamento Regional por Ponto de Entrega

## Problema
Pedidos criados no Módulo V3 estão usando a região do **franqueado** ao invés da região do **ponto de entrega**.

### Exemplo
- **Franqueado:** Gustavo Mesquita (Região: Recife)
- **Ponto:** Shopping Pátio (Cidade: Maceió/AL, **Região: Salvador**)
- **Problema:** Pedido aparece no V2 em Recife (ERRADO!)
- **Correto:** Pedido deve aparecer no V2 em Salvador

---

## 📝 Modificações Necessárias no Módulo V3

### 📍 ARQUIVO 1: `src/supabase.ts`

**O que mudar:** Adicionar campo `region` na interface `DeliveryPoint`

```typescript
// ANTES (linha ~30-36):
export interface DeliveryPoint {
  id: string;
  name: string;
  city: string;
  uf: string;
}

// DEPOIS:
export interface DeliveryPoint {
  id: string;
  name: string;
  city: string;
  uf: string;
  region?: 'Recife' | 'Salvador'; // ← ADICIONAR ESTA LINHA
}
```

---

### 📍 ARQUIVO 2: `src/pages/Checkout.tsx`

**O que mudar:** Usar `selectedPoint?.region` ao invés de `user.region`

#### Mudança 1 - Linha ~46: Remover variável region antiga

```typescript
// ANTES:
const region = user?.region || 'Recife';

// DEPOIS:
// REMOVER esta linha (não precisa mais)
```

#### Mudança 2 - Linha ~88: Adicionar variável pointRegion

```typescript
// ANTES (pular esta parte):
const region = user?.region || 'Recife';

// DEPOIS (ADICIONAR antes de handleConfirm):
const handleConfirm = async () => {
  if (!user || !user.id || !selectedPoint) return;
  setProcessing(true);
  try {
    // ← ADICIONAR AQUI:
    const pointRegion = selectedPoint?.region || user.region;
    
    // ... resto do código continua
```

#### Mudança 3 - Linha ~92: updateOrder

```typescript
// ANTES:
if (lastOrderId) {
  await updateOrder(lastOrderId, pointName, unitsInt, orderItems, user.region);

// DEPOIS:
if (lastOrderId) {
  await updateOrder(lastOrderId, pointName, unitsInt, orderItems, pointRegion);
```

#### Mudança 4 - Linha ~98: createOrder

```typescript
// ANTES:
const order = await createOrder(
  user.id,
  user.region,  // ← ERRADO
  pointName,
  orderItems,
  pointId,
  franchiseeName
);

// DEPOIS:
const order = await createOrder(
  user.id,
  pointRegion,  // ← CORRETO: usa região do ponto
  pointName,
  orderItems,
  pointId,
  franchiseeName
);
```

#### Mudança 5 - Linha ~111: localStorage key

```typescript
// ANTES:
localStorage.setItem(`active_order_id_${user.id}_${user.region}`, orderId);

// DEPOIS:
localStorage.setItem(`active_order_id_${user.id}_${pointRegion}`, orderId);
```

#### Mudança 6 - Linha ~119: generateOrderPDF

```typescript
// ANTES:
await generateOrderPDF(
  orderId,
  user.region,  // ← ERRADO
  orderItems,
  ...

// DEPOIS:
await generateOrderPDF(
  orderId,
  pointRegion,  // ← CORRETO: usa região do ponto
  orderItems,
  ...
```

---

## ✅ Verificação Final

### Teste Manual:
1. Abra o Módulo V2 → Página "Rede de Franqueados"
2. Verifique se o ponto tem região definida (ex: Salvador)
3. Abra o Módulo V3 e faça login com este franqueado
4. Selecione o ponto com região diferente
5. Crie um pedido
6. Volte ao V2 → Verifique se o pedido apareceu na aba correta (Salvador)

### SQL de Verificação:
```sql
-- Verificar se pedidos novos estão com região do ponto
SELECT 
  o.order_code,
  o.point_name,
  o.region as "Região do Pedido",
  f.region as "Região do Franqueado",
  CASE 
    WHEN o.region = (
      SELECT (point->>'region')::text
      FROM jsonb_array_elements(f.points) as point
      WHERE point->>'id' = o.point_id
      LIMIT 1
    ) THEN '✅ CORRETO (região do ponto)'
    ELSE '❌ ERRADO (região do franqueado)'
  END as Status
FROM orders o
LEFT JOIN franchisees f ON o.franchisee_id::uuid = f.id
WHERE o.created_at > NOW() - INTERVAL '1 hour'
ORDER BY o.created_at DESC;
```

---

## 🚀 Deploy

Após aplicar as mudanças:
```bash
cd C:\Users\tulio\Music\Dom_da_empada_Modulo_V3
npm run build
# Ou fazer deploy para Vercel se aplicável
```

---

## 📊 Resumo das Mudanças

| Arquivo | Linha | Antes | Depois |
|---------|-------|-------|--------|
| `supabase.ts` | ~30-36 | Sem campo region | `region?: 'Recife' \| 'Salvador'` |
| `Checkout.tsx` | ~46 | `user.region` | REMOVER |
| `Checkout.tsx` | ~88 | Não existe | `const pointRegion = selectedPoint?.region \|\| user.region` |
| `Checkout.tsx` | ~92 | `user.region` | `pointRegion` |
| `Checkout.tsx` | ~98 | `user.region` | `pointRegion` |
| `Checkout.tsx` | ~111 | `user.region` | `pointRegion` |
| `Checkout.tsx` | ~119 | `user.region` | `pointRegion` |

---

## ⚠️ IMPORTANTE

- **NÃO mexer no sistema de e-mails** (já funciona corretamente)
- Esta correção afeta **apenas** o direcionamento de dados no V2
- Novos pontos criados no V2 já vêm com campo `region` configurado
- SQL de correção já foi executado para pontos existentes
