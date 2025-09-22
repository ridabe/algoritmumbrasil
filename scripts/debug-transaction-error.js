const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Carregar variáveis do .env.local manualmente
const envPath = path.join(__dirname, '.env.local');
let supabaseUrl, supabaseKey;

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  });
} catch (error) {
  console.error('Erro ao ler .env.local:', error.message);
  process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Variáveis de ambiente do Supabase não encontradas');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey ? 'Encontrada' : 'Não encontrada');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugTransactionCreation() {
  try {
    console.log('=== DEBUG: Criação de Transação ===');
    
    // 1. Primeiro, vamos verificar quais tabelas existem
    console.log('Verificando tabelas disponíveis...');
    
    // Tentar buscar na tabela auth.users (Supabase Auth)
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('Erro ao buscar usuário autenticado:', authError);
      // Vamos usar um ID de usuário fixo para teste
      console.log('Usando ID de usuário fixo para teste...');
    }
    
    // Verificar se existe tabela profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    let userId;
    if (profileError) {
      console.log('Tabela profiles não encontrada:', profileError.message);
      // Usar um UUID fixo para teste
      userId = '00000000-0000-0000-0000-000000000001';
      console.log('Usando userId fixo:', userId);
    } else if (profiles && profiles.length > 0) {
      userId = profiles[0].id;
      console.log('Usuário encontrado na tabela profiles:', { id: userId });
    } else {
      userId = '00000000-0000-0000-0000-000000000001';
      console.log('Nenhum perfil encontrado, usando userId fixo:', userId);
    }
    
    console.log('UserId definido:', userId);
    
    // 2. Verificar contas do usuário
     const { data: accounts, error: accountError } = await supabase
       .from('accounts')
       .select('*')
       .eq('user_id', userId)
       .limit(1);
    
    if (accountError) {
      console.error('Erro ao buscar contas:', accountError);
      return;
    }
    
    if (!accounts || accounts.length === 0) {
      console.error('Nenhuma conta encontrada para o usuário');
      return;
    }
    
    const account = accounts[0];
    console.log('Conta encontrada:', { id: account.id, name: account.name });
    
    // 3. Verificar categorias
     const { data: categories, error: categoryError } = await supabase
       .from('categories')
       .select('*')
       .or(`user_id.eq.${userId},user_id.is.null`)
       .limit(1);
    
    if (categoryError) {
      console.error('Erro ao buscar categorias:', categoryError);
      return;
    }
    
    if (!categories || categories.length === 0) {
      console.error('Nenhuma categoria encontrada');
      return;
    }
    
    const category = categories[0];
    console.log('Categoria encontrada:', { id: category.id, name: category.name });
    
    // 4. Tentar criar transação
     const transactionData = {
       user_id: userId,
      type: 'expense',
      amount: 50.00,
      date: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
      account_id: account.id,
      category_id: category.id,
      description: 'Teste de transação - Debug',
      tags: '[]',
      status: 'confirmed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Dados da transação a ser criada:', transactionData);
    
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select()
      .single();
    
    if (transactionError) {
      console.error('ERRO ao criar transação:', {
        message: transactionError.message,
        code: transactionError.code,
        details: transactionError.details,
        hint: transactionError.hint,
        fullError: transactionError
      });
      return;
    }
    
    console.log('✅ Transação criada com sucesso:', transaction);
    
    // 5. Testar função RPC update_account_balance
    console.log('\n=== Testando função RPC update_account_balance ===');
    
    const { data: rpcResult, error: rpcError } = await supabase
      .rpc('update_account_balance', {
        account_id: account.id,
        amount_change: -50.00 // Negativo para despesa
      });
    
    if (rpcError) {
      console.error('Erro na função RPC:', rpcError);
    } else {
      console.log('✅ Função RPC executada com sucesso:', rpcResult);
    }
    
  } catch (error) {
    console.error('Erro geral:', {
      message: error.message,
      stack: error.stack
    });
  }
}

debugTransactionCreation();