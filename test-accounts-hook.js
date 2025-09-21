/**
 * Script de teste para verificar se o hook useAccounts está funcionando
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

/**
 * Simula o comportamento do AccountsService.getAccounts
 */
async function testAccountsService() {
  console.log('🔍 Testando AccountsService.getAccounts...');
  
  try {
    // Verificar se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Para desenvolvimento, buscar todas as contas se não houver usuário autenticado
    let userId = user?.id;
    if (authError || !user) {
      console.log('⚠️ Usuário não autenticado, buscando todas as contas para desenvolvimento');
      userId = null;
    } else {
      console.log(`✅ Usuário autenticado: ${user.id}`);
    }

    // Construir query base
    let query = supabase
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
    
    // Filtrar por usuário apenas se estiver autenticado
    if (userId) {
      query = query.eq('user_id', userId);
      console.log(`🔍 Filtrando por user_id: ${userId}`);
    } else {
      console.log('🔍 Buscando todas as contas (sem filtro de usuário)');
    }

    // Aplicar ordenação
    query = query.order('created_at', { ascending: false });

    const { data: accounts, error, count } = await query;

    if (error) {
      console.error('❌ Erro ao buscar contas:', error);
      return;
    }

    console.log(`✅ Encontradas ${accounts?.length || 0} contas`);
    
    if (accounts && accounts.length > 0) {
      console.log('\n📋 Contas que seriam retornadas pelo hook:');
      accounts.forEach((account, index) => {
        console.log(`${index + 1}. ${account.name} (${account.type})`);
        console.log(`   - ID: ${account.id}`);
        console.log(`   - Instituição: ${account.institution || 'N/A'}`);
        console.log(`   - Saldo inicial: R$ ${account.initial_balance || 0}`);
        console.log(`   - Ativo: ${account.is_active ? 'Sim' : 'Não'}`);
        console.log('');
      });
      
      console.log('\n✅ O hook useAccounts deveria retornar essas contas!');
      console.log('✅ O formulário de transações deveria listar essas contas no select!');
    } else {
      console.log('❌ Nenhuma conta seria retornada pelo hook');
      console.log('❌ O formulário de transações ficaria vazio');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar teste
testAccountsService().then(() => {
  console.log('\n🏁 Teste do hook concluído');
}).catch(error => {
  console.error('❌ Erro ao executar teste:', error);
});