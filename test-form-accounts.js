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
async function testAccountsForForm() {
  console.log('🧪 Testando carregamento de contas para o formulário...');
  
  try {
    // Simular usuário não autenticado (como no desenvolvimento)
    console.log('👤 Simulando usuário não autenticado...');
    
    // Query base sem filtro de usuário
    let query = supabase
      .from('accounts')
      .select('*')
      .order('name', { ascending: true });
    
    console.log('🔍 Executando query para buscar contas...');
    const { data: accounts, error } = await query;
    
    if (error) {
      console.error('❌ Erro ao buscar contas:', error);
      return;
    }
    
    console.log(`✅ Encontradas ${accounts?.length || 0} contas:`);
    
    if (accounts && accounts.length > 0) {
      accounts.forEach((account, index) => {
        console.log(`  ${index + 1}. ID: ${account.id}`);
        console.log(`     Nome: ${account.name}`);
        console.log(`     Instituição: ${account.institution}`);
        console.log(`     Saldo Inicial: R$ ${account.initial_balance}`);
        console.log(`     Ativo: ${account.is_active}`);
        console.log(`     ---`);
      });
      
      // Simular o mapeamento que acontece no AccountsService
      console.log('\n🔄 Simulando mapeamento para o formato Account:');
      const mappedAccounts = accounts.map(dbAccount => ({
        id: dbAccount.id,
        user_id: dbAccount.user_id,
        name: dbAccount.name,
        type: dbAccount.type,
        bank: dbAccount.institution || '', // Mapear 'institution' para 'bank'
        balance: parseFloat(dbAccount.initial_balance || '0'),
        initial_balance: parseFloat(dbAccount.initial_balance || '0'),
        currency: 'BRL',
        status: dbAccount.is_active ? 'ACTIVE' : 'INACTIVE',
        is_active: dbAccount.is_active || false
      }));
      
      console.log('📋 Contas mapeadas para o formulário:');
      mappedAccounts.forEach((account, index) => {
        console.log(`  ${index + 1}. ${account.name} - ${account.bank || 'Sem banco'}`);
      });
      
      console.log('\n✅ As contas devem aparecer no select do formulário!');
    } else {
      console.log('⚠️  Nenhuma conta encontrada na base de dados.');
    }
    
  } catch (error) {
    console.error('💥 Erro durante o teste:', error);
  }
}

// Executar o teste
testAccountsForForm();