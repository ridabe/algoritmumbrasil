/**
 * Script de teste para verificar se as contas estão sendo listadas corretamente
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão definidas no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAccounts() {
  console.log('🔍 Testando busca de contas...');
  
  try {
    // 1. Verificar se a tabela accounts existe
    console.log('\n1. Verificando estrutura da tabela accounts:');
    const { data: tableInfo, error: tableError } = await supabase
      .from('accounts')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Erro ao acessar tabela accounts:', tableError);
      return;
    }
    
    console.log('✅ Tabela accounts acessível');
    
    // 2. Buscar todas as contas
    console.log('\n2. Buscando todas as contas:');
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select(`
        id,
        user_id,
        name,
        type,
        institution,
        initial_balance,
        reference_date,
        is_active,
        created_at,
        updated_at
      `);
    
    if (accountsError) {
      console.error('❌ Erro ao buscar contas:', accountsError);
      return;
    }
    
    console.log(`✅ Encontradas ${accounts?.length || 0} contas`);
    
    if (accounts && accounts.length > 0) {
      console.log('\n📋 Contas encontradas:');
      accounts.forEach((account, index) => {
        console.log(`${index + 1}. ${account.name} (${account.type})`);
        console.log(`   - ID: ${account.id}`);
        console.log(`   - Instituição: ${account.institution || 'N/A'}`);
        console.log(`   - Saldo inicial: R$ ${account.initial_balance || 0}`);
        console.log(`   - Ativo: ${account.is_active ? 'Sim' : 'Não'}`);
        console.log(`   - User ID: ${account.user_id}`);
        console.log('');
      });
    } else {
      console.log('⚠️  Nenhuma conta encontrada na base de dados');
      
      // 3. Verificar se há dados na tabela
      console.log('\n3. Verificando se existem dados na tabela:');
      const { count, error: countError } = await supabase
        .from('accounts')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('❌ Erro ao contar registros:', countError);
      } else {
        console.log(`📊 Total de registros na tabela: ${count}`);
      }
    }
    
    // 4. Testar autenticação (se necessário)
    console.log('\n4. Verificando autenticação:');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('⚠️  Usuário não autenticado:', authError.message);
    } else if (user) {
      console.log(`✅ Usuário autenticado: ${user.id}`);
      
      // Buscar contas do usuário específico
      console.log('\n5. Buscando contas do usuário autenticado:');
      const { data: userAccounts, error: userAccountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id);
      
      if (userAccountsError) {
        console.error('❌ Erro ao buscar contas do usuário:', userAccountsError);
      } else {
        console.log(`✅ Encontradas ${userAccounts?.length || 0} contas do usuário`);
      }
    } else {
      console.log('⚠️  Nenhum usuário autenticado');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar teste
testAccounts().then(() => {
  console.log('\n🏁 Teste concluído');
}).catch(error => {
  console.error('❌ Erro ao executar teste:', error);
});