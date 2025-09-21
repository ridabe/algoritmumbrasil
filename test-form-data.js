/**
 * Script para testar dados específicos do formulário - versão com usuário real
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFormData() {
  try {
    console.log('🧪 Testando dados do formulário (com usuário real)...');
    
    // Buscar um usuário real
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name')
      .limit(1);
      
    if (profilesError || !profiles || profiles.length === 0) {
      console.error('❌ Erro ao buscar usuários:', profilesError);
      return;
    }
    
    console.log('👤 Usando usuário:', profiles[0]);
    
    // Buscar uma conta real
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('id, name')
      .limit(1);
      
    if (accountsError || !accounts || accounts.length === 0) {
      console.error('❌ Erro ao buscar contas:', accountsError);
      return;
    }
    
    console.log('💳 Usando conta:', accounts[0]);
    
    // Buscar uma categoria real
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name')
      .limit(1);
      
    if (categoriesError || !categories || categories.length === 0) {
      console.error('❌ Erro ao buscar categorias:', categoriesError);
      console.log('ℹ️ Tentando criar uma categoria de teste...');
      
      // Criar uma categoria de teste
      const { data: newCategory, error: createError } = await supabase
        .from('categories')
        .insert([{
          name: 'Teste',
          type: 'expense',
          icon: 'test',
          color: '#6B7280'
        }])
        .select()
        .single();
        
      if (createError) {
        console.error('❌ Erro ao criar categoria:', createError);
        return;
      }
      
      console.log('✅ Categoria criada:', newCategory);
      categories.push(newCategory);
    }
    
    console.log('📂 Usando categoria:', categories[0]);
    
    // Dados mínimos que existem na tabela
    const dbData = {
      user_id: profiles[0].id, // Usuário real
      type: 'expense',
      amount: 100.50,
      date: new Date().toISOString(),
      account_id: accounts[0].id,
      category_id: categories[0].id,
      description: 'Teste de transação com dados reais',
      tags: JSON.stringify(['teste']),
      status: 'confirmed'
    };
    
    console.log('🗄️ Dados para inserção:', JSON.stringify(dbData, null, 2));
    
    // Tentar inserir no banco
    console.log('🚀 Tentando inserir no banco...');
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([dbData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao inserir:', error);
      console.error('📋 Detalhes do erro:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } else {
      console.log('✅ Transação criada com sucesso:', data);
      
      // Limpar o teste
      await supabase
        .from('transactions')
        .delete()
        .eq('id', data.id);
      console.log('🧹 Transação de teste removida');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testFormData();