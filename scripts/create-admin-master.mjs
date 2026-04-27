/**
 * Script para criar o usuário admin.master no Supabase
 * Execute: node scripts/create-admin-master.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
// Service role key padrão do Supabase self-hosted (docker)
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hj04zWl196z2-SB38';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const EMAIL = 'admin.master@domdaempada.com.br';
const PASSWORD = 'T05122020d*';

async function createAdminMaster() {
  console.log('🚀 Criando usuário admin.master no Supabase...\n');

  // 1. Criar usuário via Admin API
  console.log('1️⃣  Criando usuário na Auth...');
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: {
      name: 'admin.master',
      role: 'admin',
    },
  });

  if (authError) {
    if (authError.message?.includes('already been registered') || authError.message?.includes('already exists')) {
      console.log('⚠️  Usuário já existe na Auth. Buscando ID...');
      const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw new Error('Erro ao listar usuários: ' + listError.message);
      const existingUser = listData.users.find(u => u.email === EMAIL);
      if (!existingUser) throw new Error('Usuário não encontrado após verificação.');
      console.log(`✅ Usuário Auth encontrado: ${existingUser.id}\n`);
      await syncAppUser(existingUser.id);
    } else {
      throw new Error('Erro ao criar usuário Auth: ' + authError.message);
    }
    return;
  }

  const userId = authData.user.id;
  console.log(`✅ Usuário Auth criado com sucesso!\n   ID: ${userId}\n   Email: ${EMAIL}\n`);

  // 2. Criar registro na tabela app_users
  await syncAppUser(userId);
}

async function syncAppUser(userId) {
  console.log('2️⃣  Verificando registro em app_users...');
  
  const { data: existing } = await supabase
    .from('app_users')
    .select('id')
    .eq('name', 'admin.master')
    .single();

  if (existing) {
    console.log('⚠️  Registro em app_users já existe. Atualizando auth_uid...');
    const { error } = await supabase
      .from('app_users')
      .update({ auth_uid: userId, role: 'admin', status: 'Ativo' })
      .eq('name', 'admin.master');
    if (error) throw new Error('Erro ao atualizar app_users: ' + error.message);
    console.log('✅ app_users atualizado com sucesso!\n');
  } else {
    console.log('   Criando registro em app_users...');
    const { error } = await supabase
      .from('app_users')
      .insert({
        name: 'admin.master',
        email: EMAIL,
        role: 'admin',
        region: 'Recife',
        status: 'Ativo',
        auth_uid: userId,
      });
    if (error) throw new Error('Erro ao criar app_users: ' + error.message);
    console.log('✅ Registro em app_users criado com sucesso!\n');
  }

  console.log('🎉 Usuário admin.master pronto para uso!');
  console.log('   Login: admin.master@domdaempada.com.br');
  console.log('   Senha: T05122020d*');
}

createAdminMaster().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
