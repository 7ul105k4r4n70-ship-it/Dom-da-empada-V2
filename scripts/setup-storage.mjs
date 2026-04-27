import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hj04zWl196z2-SB38';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function setupStorage() {
  console.log('🚀 Iniciando configuração do Storage no Supabase...');

  const buckets = ['checklist-photos', 'delivery-photos', 'vehicle-photos'];

  for (const bucketName of buckets) {
    console.log(`\nChecking bucket: ${bucketName}...`);

    // Tenta criar o bucket
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`✅ Bucket "${bucketName}" já existe.`);
      } else {
        console.error(`❌ Erro ao criar bucket "${bucketName}":`, error.message);
        console.log(`💡 Tente executar o arquivo "fix-storage-buckets.sql" no SQL Editor do Supabase.`);
      }
    } else {
      console.log(`✨ Bucket "${bucketName}" criado com sucesso!`);
    }

    // Tenta criar as políticas de acesso via SQL (Storage Policies)
    // Nota: Em instâncias Docker, politicas de storage as vezes precisam de SQL direto
    // Mas tentaremos via API primeiro
  }

  console.log('\n---');
  console.log('✅ Verficação concluída.');
  console.log('⚠️  Se houver erros acima, use o script SQL "fix-storage-buckets.sql" para configurar manualmente.');
}

setupStorage().catch(console.error);
