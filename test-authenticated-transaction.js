/**
 * Script para testar criação de transação com usuário autenticado
 * Verifica se o problema está na autenticação ou na criação da transação
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthenticatedTransaction() {
  try {
    console.log('=== TESTE DE TRANSAÇÃO COM USUÁRIO AUTENTICADO ===\n');
    
    // 1. Fazer login
    console.log('1. Fazendo login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'usuario.teste@gmail.com',
      password: 'teste123'
    });
    
    if (authError) {
      console.error('❌ Erro no login:', authError.message);
      return;
    }
    
    console.log('✅ Login realizado com sucesso');
    console.log('User ID:', authData.user.id);
    console.log('Email confirmado:', authData.user.email_confirmed_at ? 'Sim' : 'Não');
    
    // 2. Verificar perfil do usuário
    console.log('\n2. Verificando perfil...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Erro ao buscar perfil:', profileError.message);
    } else {
      console.log('✅ Perfil encontrado:', profile.name);
    }
    
    // 3. Buscar contas do usuário
    console.log('\n3. Buscando contas...');
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', authData.user.id);
    
    if (accountsError) {
      console.error('❌ Erro ao buscar contas:', accountsError.message);
      return;
    }
    
    if (!accounts || accounts.length === 0) {
      console.log('⚠️ Nenhuma conta encontrada. Criando conta de teste...');
      
      const { data: newAccount, error: createAccountError } = await supabase
        .from('accounts')
        .insert({
          user_id: authData.user.id,
          name: 'Conta Teste',
          type: 'checking',
          initial_balance: 1000.00,
          reference_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();
      
      if (createAccountError) {
        console.error('❌ Erro ao criar conta:', createAccountError.message);
        return;
      }
      
      accounts.push(newAccount);
      console.log('✅ Conta criada:', newAccount.name);
    }
    
    console.log(`✅ ${accounts.length} conta(s) encontrada(s)`);
    
    // 4. Buscar categorias
    console.log('\n4. Buscando categorias...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', authData.user.id)
      .limit(1);
    
    if (categoriesError) {
      console.error('❌ Erro ao buscar categorias:', categoriesError.message);
      return;
    }
    
    if (!categories || categories.length === 0) {
      console.log('⚠️ Nenhuma categoria encontrada. Criando categoria de teste...');
      
      const { data: newCategory, error: createCategoryError } = await supabase
        .from('categories')
        .insert({
          user_id: authData.user.id,
          name: 'Teste',
          color: '#FF0000',
          emoji: '🧪'
        })
        .select()
        .single();
      
      if (createCategoryError) {
        console.error('❌ Erro ao criar categoria:', createCategoryError.message);
        return;
      }
      
      categories.push(newCategory);
      console.log('✅ Categoria criada:', newCategory.name);
    }
    
    console.log(`✅ ${categories.length} categoria(s) encontrada(s)`);
    
    // 5. Criar transação de teste
    console.log('\n5. Criando transação de teste...');
    
    const transactionData = {
      user_id: authData.user.id,
      type: 'expense',
      amount: 50.00,
      date: new Date().toISOString().split('T')[0],
      account_id: accounts[0].id,
      category_id: categories[0].id,
      description: 'Transação de teste via script',
      tags: '[]',
      status: 'confirmed'
    };
    
    console.log('Dados da transação:', JSON.stringify(transactionData, null, 2));
    
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select()
      .single();
    
    if (transactionError) {
      console.error('❌ Erro ao criar transação:', {
        message: transactionError.message,
        code: transactionError.code,
        details: transactionError.details,
        hint: transactionError.hint
      });
      return;
    }
    
    console.log('✅ Transação criada com sucesso!');
    console.log('ID da transação:', transaction.id);
    
    // 6. Limpar - remover transação de teste
    console.log('\n6. Removendo transação de teste...');
    const { error: deleteError } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transaction.id);
    
    if (deleteError) {
      console.error('⚠️ Erro ao remover transação de teste:', deleteError.message);
    } else {
      console.log('✅ Transação de teste removida');
    }
    
    console.log('\n=== TESTE CONCLUÍDO COM SUCESSO ===');
    console.log('✅ O usuário está autenticado e pode criar transações');
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('1. Faça login na aplicação web com: usuario.teste@gmail.com / teste123');
    console.log('2. Navegue até /financas/transacoes');
    console.log('3. Tente criar uma transação');
    console.log('4. Verifique os logs do navegador (F12 > Console)');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

testAuthenticatedTransaction();