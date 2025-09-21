// Script de teste para verificar autenticação Supabase
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://fcwmqajcpupgflbsdymz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjd21xYWpjcHVwZ2ZsYnNkeW16Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM3Njk2MiwiZXhwIjoyMDczOTUyOTYyfQ.wiZGDf9-u8PF7GqhTy8KJ6rBiveFbR9Xswl8WqFqqMY';

const supabase = createClient(supabaseUrl, supabaseKey);

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
    
    // Tentar fazer login novamente
    const supabaseClient = createClient(
      'https://fcwmqajcpupgflbsdymz.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjd21xYWpjcHVwZ2ZsYnNkeW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNzY5NjIsImV4cCI6MjA3Mzk1Mjk2Mn0.mOb68sOde4T0hLsP8MO-9l62mvtIMGZe5iR22MgtIKQ'
    );
    
    const { data: loginData, error: loginError } = await supabaseClient.auth.signInWithPassword({
      email: 'teste@algoritmum.com.br',
      password: '123456'
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