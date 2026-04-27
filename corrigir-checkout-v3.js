import fs from 'fs';
import path from 'path';

const V3_PATH = 'C:\\Users\\tulio\\Music\\Dom_da_empada_Modulo_V3';

console.log('Corrigindo Checkout.tsx...\n');

const checkoutFile = path.join(V3_PATH, 'src', 'pages', 'Checkout.tsx');
let content = fs.readFileSync(checkoutFile, 'utf8');

// PROBLEMA 1: Função generatePDF foi removida pelo script anterior
// Precisa restaurar e usar pointRegion
const pdfFunction = `  // ─── Gerar PDF ──────────────────────────────────────────────────────────────
  const generatePDF = async (): Promise<string> => {
    const pointRegion = selectedPoint?.region || user?.region;
    const pointName = selectedPoint?.name || user?.storeName || user?.name || 'Desconhecido';
    // Buscar TODOS os produtos da região para incluir no PDF (mesmo com qty 0)
    const allProducts = await getAllProductNamesForPDF(pointRegion);
    return await generateOrderPDF({
      unidade: pointName,
      region: pointRegion,
      dataEntrega: dateStr,
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        category: (item as any).category
      })),
      allProducts,
    });
  };`;

// Remover a versão antiga que usa 'region'
content = content.replace(
  /const dateStr = now\.toLocaleDateString\('pt-BR'\);[\s\S]*?const timeStr = now\.toLocaleTimeString\('pt-BR', \{ hour: '2-digit', minute: '2-digit' \}\);[\s\S]*?\/\/ region agora vem do ponto: selectedPoint\?\.region \|\| user\.region[\s\S]*?return await generateOrderPDF\(\{[\s\S]*?\}\);[\s\S]*?\};/,
  `const dateStr = now.toLocaleDateString('pt-BR');
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

${pdfFunction}`
);

// PROBLEMA 2: pointRegion duplicado (linhas 74-76)
content = content.replace(
  /try \{\s*\/\/ Regiao do ponto de entrega[\s\S]*?const pointRegion = selectedPoint\?\.region \|\| user\.region;\s*\/\/ Regiao do ponto de entrega[\s\S]*?const pointRegion = selectedPoint\?\.region \|\| user\.region;/,
  `try {
      // Regiao do ponto de entrega (prioridade sobre regiao do franqueado)
      const pointRegion = selectedPoint?.region || user.region;`
);

// PROBLEMA 3: emailParams ainda usa user.region
content = content.replace(
  /const emailParams = \{[\s\S]*?region: user\.region,/,
  `const emailParams = {
        region: pointRegion,`
);

fs.writeFileSync(checkoutFile, content, 'utf8');
console.log('✅ Checkout.tsx corrigido com sucesso!\n');
console.log('Mudanças aplicadas:');
console.log('  1. Restaurada função generatePDF usando pointRegion');
console.log('  2. Removida duplicação de pointRegion');
console.log('  3. emailParams agora usa pointRegion ao invés de user.region\n');
