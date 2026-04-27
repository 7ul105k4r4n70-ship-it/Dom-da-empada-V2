import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const V3_PATH = 'C:\\Users\\tulio\\Music\\Dom_da_empada_Modulo_V3';

console.log('========================================');
console.log('  CORRECAO REGIAO DO PONTO - V3');
console.log('========================================\n');

// Verifica se pasta existe
if (!fs.existsSync(V3_PATH)) {
  console.error('ERRO: Pasta do Modulo V3 nao encontrada!');
  process.exit(1);
}

console.log('Modulo V3 encontrado em:', V3_PATH);
console.log('');

// ════════════════════════════════════════════════════════
// ARQUIVO 1: src/supabase.ts
// ════════════════════════════════════════════════════════

console.log('Modificando src/supabase.ts...');

const supabaseFile = path.join(V3_PATH, 'src', 'supabase.ts');
let supabaseContent = fs.readFileSync(supabaseFile, 'utf8');

const oldInterface = `export interface DeliveryPoint {
  id: string;
  name: string;
  city: string;
  uf: string;
}`;

const newInterface = `export interface DeliveryPoint {
  id: string;
  name: string;
  city: string;
  uf: string;
  region?: 'Recife' | 'Salvador';
}`;

if (supabaseContent.includes(oldInterface)) {
  supabaseContent = supabaseContent.replace(oldInterface, newInterface);
  fs.writeFileSync(supabaseFile, supabaseContent, 'utf8');
  console.log('  OK: Campo region adicionado na interface DeliveryPoint\n');
} else {
  console.log('  AVISO: Interface DeliveryPoint ja esta atualizada ou formato diferente\n');
}

// ════════════════════════════════════════════════════════
// ARQUIVO 2: src/pages/Checkout.tsx
// ════════════════════════════════════════════════════════

console.log('Modificando src/pages/Checkout.tsx...');

const checkoutFile = path.join(V3_PATH, 'src', 'pages', 'Checkout.tsx');
let checkoutContent = fs.readFileSync(checkoutFile, 'utf8');

// Mudanca 1: Remover linha const region
checkoutContent = checkoutContent.replace(
  /const region = user\?\.region \|\| 'Recife';/,
  "// region agora vem do ponto: selectedPoint?.region || user.region"
);

// Mudanca 2: Adicionar pointRegion apos try {
checkoutContent = checkoutContent.replace(
  /(try \{)/,
  '$1\n    // Regiao do ponto de entrega (prioridade sobre regiao do franqueado)\n    const pointRegion = selectedPoint?.region || user.region;'
);

// Mudanca 3: Trocar user.region por pointRegion no updateOrder
checkoutContent = checkoutContent.replace(
  /await updateOrder\(lastOrderId, pointName, unitsInt, orderItems, user\.region\)/,
  'await updateOrder(lastOrderId, pointName, unitsInt, orderItems, pointRegion)'
);

// Mudanca 4: Trocar user.region por pointRegion no createOrder
checkoutContent = checkoutContent.replace(
  /user\.id,\s+user\.region,/,
  'user.id,\n  pointRegion,'
);

// Mudanca 5: Trocar user.region por pointRegion no localStorage
checkoutContent = checkoutContent.replace(
  /localStorage\.setItem\(`active_order_id_\$\{user\.id\}_\$\{user\.region\}`/,
  'localStorage.setItem(`active_order_id_${user.id}_${pointRegion}`'
);

// Mudanca 6: Trocar user.region por pointRegion no generateOrderPDF
checkoutContent = checkoutContent.replace(
  /generateOrderPDF\(\s*orderId,\s*user\.region,/,
  'generateOrderPDF(\n    orderId,\n    pointRegion,'
);

fs.writeFileSync(checkoutFile, checkoutContent, 'utf8');
console.log('  OK: Todas as referencias atualizadas para usar pointRegion\n');

console.log('========================================');
console.log('  CORRECAO APLICADA COM SUCESSO!');
console.log('========================================\n');

console.log('Proximos passos:');
console.log('  1. Abra o Modulo V3 no VS Code');
console.log('  2. Verifique as mudancas nos arquivos');
console.log('  3. Execute: npm run dev');
console.log('  4. Teste criando um pedido\n');
