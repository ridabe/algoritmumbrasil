/**
 * Configuração da conexão com o banco de dados
 * Utiliza Drizzle ORM com PostgreSQL/Supabase
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Configuração da conexão
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL não está definida nas variáveis de ambiente');
}

// Cliente PostgreSQL
const client = postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Instância do Drizzle ORM
export const db = drizzle(client, { schema });

// Exportar tipos e schema
export * from './schema';
export type Database = typeof db;

// Função para fechar a conexão (útil em testes)
export const closeConnection = async () => {
  await client.end();
};

// Função para verificar a conexão
export const checkConnection = async () => {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Erro na conexão com o banco:', error);
    return false;
  }
};