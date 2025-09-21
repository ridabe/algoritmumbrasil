/**
 * Script para testar criação de transação simulando dados do formulário
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Ler variáveis de ambiente do .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTransactionCreation() {
  try {
    console.log('=== TESTE DE CRIAÇÃO DE TRANSAÇÃO ===');
    
    // Simular dados exatos que vêm do formulário
    const formData = {
      type: 'expense',
      amount: 25.50,
      transaction_date: '2025-01-20', // Data no formato YYYY-MM-DD
      account_id: '5e8bb068-5faf-4af0-977b-7048c0fb5ce6',
      category_id: '93321d1b-df37-4cd2-9994-bdc03fb74541',
      description: 'Teste do formulário',
      status: 'confirmed',
      payment_method: 'cash',
      tags: ['teste', 'debug'],
      notes: 'Notas de teste'
    };
    
    console.log('Dados do formulário:', JSON.stringify(formData, null, 2));
    
    // Simular o que o TransactionService.createTransaction faz
    const userId = 'c2a4827e-7fa6-41ab-85ca-9791de358139';
    
    console.log('=== INÍCIO createTransaction ===');
    console.log('UserId:', userId);
    console.log('TransactionData recebido:', JSON.stringify(formData, null, 2));
    
    // Validar dados obrigatórios
    if (!userId) {
      throw new Error('UserId é obrigatório');
    }
    if (!formData.account_id) {
      throw new Error('account_id é obrigatório');
    }
    if (!formData.category_id) {
      throw new Error('category_id é obrigatório');
    }
    if (!formData.amount || formData.amount <= 0) {
      throw new Error('amount deve ser maior que zero');
    }
    if (!formData.transaction_date) {
      throw new Error('transaction_date é obrigatório');
    }
    
    // Mapear campos do frontend para o banco de dados
    const dbData = {
      user_id: userId,
      type: formData.type,
      amount: formData.amount,
      date: formData.transaction_date, // Mapear transaction_date para date
      account_id: formData.account_id,
      category_id: formData.category_id,
      description: formData.description || '',
      tags: formData.tags ? JSON.stringify(formData.tags) : '[]',
      status: formData.status || 'confirmed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Dados mapeados para o banco:', JSON.stringify(dbData, null, 2));

    const { data, error } = await supabase
      .from('transactions')
      .insert(dbData)
      .select()
      .single();

    console.log('Resultado da inserção:', { data, error });

    if (error) {
      console.error('❌ Erro ao criar transação:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw new Error('Falha ao criar transação: ' + error.message);
    }

    console.log('✅ Transação criada com sucesso:', data);
    
    // Testar atualização de saldo
    console.log('\n=== TESTANDO ATUALIZAÇÃO DE SALDO ===');
    const { data: rpcData, error: rpcError } = await supabase.rpc('update_account_balance', {
      account_id: data.account_id,
      amount_change: data.type === 'expense' ? -data.amount : data.amount
    });
    
    if (rpcError) {
      console.error('❌ Erro na função RPC:', rpcError);
    } else {
      console.log('✅ Função RPC executada com sucesso:', rpcData);
    }
    
  } catch (error) {
    console.error('❌ ERRO GERAL:', {
      message: error.message,
      stack: error.stack
    });
  }
}

testTransactionCreation();