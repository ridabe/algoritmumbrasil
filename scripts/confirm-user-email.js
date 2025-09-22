/**
 * Script para confirmar o email do usuário de teste
 * Atualiza diretamente no banco de dados do Supabase
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  console.log('Certifique-se de que SUPABASE_SERVICE_ROLE_KEY está definida em .env.local');
  process.exit(1);
}

// Usar service role key para operações administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function confirmUserEmail() {
  try {
    console.log('=== CONFIRMAÇÃO DE EMAIL DO USUÁRIO ===\n');
    
    const userEmail = 'usuario.teste@gmail.com';
    
    // 1. Buscar o usuário pelo email
    console.log('1. Buscando usuário...');
    const { data: users, error: searchError } = await supabase.auth.admin.listUsers();
    
    if (searchError) {
      console.error('❌ Erro ao buscar usuários:', searchError.message);
      return;
    }
    
    const user = users.users.find(u => u.email === userEmail);
    
    if (!user) {
      console.error('❌ Usuário não encontrado:', userEmail);
      return;
    }
    
    console.log('✅ Usuário encontrado:', user.email);
    console.log('Status atual:', {
      email_confirmed_at: user.email_confirmed_at,
      confirmed_at: user.confirmed_at
    });
    
    // 2. Confirmar o email do usuário
    if (!user.email_confirmed_at) {
      console.log('\n2. Confirmando email...');
      
      const { data: updatedUser, error: confirmError } = await supabase.auth.admin.updateUserById(
        user.id,
        {
          email_confirm: true
        }
      );
      
      if (confirmError) {
        console.error('❌ Erro ao confirmar email:', confirmError.message);
        return;
      }
      
      console.log('✅ Email confirmado com sucesso!');
      console.log('Novo status:', {
        email_confirmed_at: updatedUser.user.email_confirmed_at,
        confirmed_at: updatedUser.user.confirmed_at
      });
    } else {
      console.log('✅ Email já estava confirmado');
    }
    
    console.log('\n=== CONFIRMAÇÃO CONCLUÍDA ===');
    console.log('✅ O usuário agora pode fazer login normalmente');
    console.log('\n📋 CREDENCIAIS PARA TESTE:');
    console.log('Email:', userEmail);
    console.log('Senha: teste123');
    console.log('\n🔗 Acesse: http://localhost:3000/auth/login');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

confirmUserEmail();