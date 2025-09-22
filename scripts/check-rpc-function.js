require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRPCFunction() {
  console.log('=== VERIFICANDO FUNÇÃO RPC update_account_balance ===\n');
  
  try {
    // Tenta chamar a função RPC
    const { data, error } = await supabase.rpc('update_account_balance', {
      account_id: '00000000-0000-0000-0000-000000000000', // UUID fake para teste
      amount_change: 0
    });
    
    if (error) {
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        console.log('❌ Função update_account_balance NÃO existe no banco');
        console.log('\n📋 SOLUÇÃO: Execute a migração SQL:');
        console.log('\nCREATE OR REPLACE FUNCTION update_account_balance(account_id UUID, amount_change DECIMAL)');
        console.log('RETURNS VOID AS $$');
        console.log('BEGIN');
        console.log('  UPDATE accounts');
        console.log('  SET initial_balance = initial_balance + amount_change');
        console.log('  WHERE id = account_id;');
        console.log('END;');
        console.log('$$ LANGUAGE plpgsql;');
      } else {
        console.log('✅ Função update_account_balance existe (erro esperado com UUID fake)');
        console.log('Erro:', error.message);
      }
    } else {
      console.log('✅ Função update_account_balance existe e funcionou');
    }
  } catch (err) {
    console.error('❌ Erro ao verificar função RPC:', err.message);
  }
}

checkRPCFunction();