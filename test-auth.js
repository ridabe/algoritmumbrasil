// Script de teste para verificar autenticação Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function confirmUser() {
  try {
    console.log('Confirmando usuário de teste...');
    
    // Confirmar o email do usuário diretamente
    const { data, error } = await supabase.auth.admin.updateUserById(
      '7a2572ad-9eb0-4b2d-a03e-94fe54122521',
      { email_confirm: true }
    );
    
    if (error) {
      console.error('Erro ao confirmar usuário:', error.message);
    } else {
      console.log('Usuário confirmado com sucesso:', data);
    }
    
    // Tentar fazer login novamente com cliente anônimo
    const supabaseClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    const testEmail = process.env.TEST_USER_EMAIL || 'teste@algoritmum.com.br';
    const testPassword = process.env.TEST_USER_PASSWORD;
    
    if (!testPassword) {
      console.error('❌ TEST_USER_PASSWORD não definida no .env.local');
      return;
    }
    
    const { data: loginData, error: loginError } = await supabaseClient.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (loginError) {
      console.error('Erro no login:', loginError.message);
    } else {
      console.log('Login realizado com sucesso!');
      console.log('Usuário:', loginData.user.email);
      console.log('Sessão ativa:', !!loginData.session);
    }
    
  } catch (err) {
    console.error('Erro geral:', err);
  }
}

confirmUser();