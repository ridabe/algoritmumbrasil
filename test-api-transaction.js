require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testTransactionAPI() {
  console.log('=== TESTE DE CRIAÇÃO DE TRANSAÇÃO VIA API ===\n');
  
  try {
    // 1. Login
    console.log('1. Fazendo login...');
    const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'usuario.teste@gmail.com',
      password: 'teste123'
    });
    
    if (loginError) {
      console.error('❌ Erro no login:', loginError.message);
      return;
    }
    
    console.log('✅ Login realizado com sucesso');
    console.log('User ID:', authData.user.id);
    
    // 2. Buscar conta
    console.log('\n2. Buscando conta...');
    const { data: accounts, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', authData.user.id)
      .limit(1);
    
    if (accountError || !accounts || accounts.length === 0) {
      console.error('❌ Erro ao buscar conta:', accountError?.message || 'Nenhuma conta encontrada');
      return;
    }
    
    const account = accounts[0];
    console.log('✅ Conta encontrada:', account.name);
    
    // 3. Buscar categoria
    console.log('\n3. Buscando categoria...');
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', authData.user.id)
      .limit(1);
    
    if (categoryError || !categories || categories.length === 0) {
      console.error('❌ Erro ao buscar categoria:', categoryError?.message || 'Nenhuma categoria encontrada');
      return;
    }
    
    const category = categories[0];
    console.log('✅ Categoria encontrada:', category.name);
    
    // 4. Criar transação usando o mesmo método do serviço
    console.log('\n4. Criando transação...');
    
    const transactionData = {
      user_id: authData.user.id,
      account_id: account.id,
      category_id: category.id,
      type: 'expense',
      amount: 25.50,
      description: 'Teste via API',
      date: new Date().toISOString().split('T')[0],
      status: 'confirmed'
    };
    
    console.log('Dados da transação:', JSON.stringify(transactionData, null, 2));
    
    // Inserir transação
    const { data: newTransaction, error: transactionError } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select()
      .single();
    
    if (transactionError) {
      console.error('❌ Erro ao criar transação:', transactionError);
      console.error('Código do erro:', transactionError.code);
      console.error('Detalhes:', transactionError.details);
      console.error('Hint:', transactionError.hint);
      return;
    }
    
    console.log('✅ Transação criada com sucesso!');
    console.log('ID da transação:', newTransaction.id);
    
    // 5. Tentar atualizar saldo da conta
    console.log('\n5. Atualizando saldo da conta...');
    
    const { error: balanceError } = await supabase.rpc('update_account_balance', {
      account_id: account.id,
      amount_change: transactionData.type === 'expense' ? -transactionData.amount : transactionData.amount
    });
    
    if (balanceError) {
      console.error('❌ Erro ao atualizar saldo:', balanceError);
    } else {
      console.log('✅ Saldo atualizado com sucesso');
    }
    
    // 6. Limpar - remover transação de teste
    console.log('\n6. Removendo transação de teste...');
    await supabase
      .from('transactions')
      .delete()
      .eq('id', newTransaction.id);
    
    console.log('✅ Transação de teste removida');
    
    console.log('\n=== TESTE CONCLUÍDO COM SUCESSO ===');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

testTransactionAPI();