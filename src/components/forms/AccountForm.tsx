/**
 * Formulário para criar/editar contas bancárias
 * Suporta todos os tipos de conta com validação
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Building2, CreditCard, Wallet, TrendingUp } from 'lucide-react';
import { AccountType, AccountStatus, Currency } from '@/lib/types/accounts';
import type { Account, CreateAccountData, UpdateAccountData } from '@/lib/types/accounts';

// Schema de validação
const accountFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  bank: z.string().min(1, 'Banco é obrigatório').max(100, 'Nome do banco muito longo'),
  type: z.nativeEnum(AccountType, {
    errorMap: () => ({ message: 'Tipo de conta é obrigatório' })
  }),
  balance: z.number().min(-999999999, 'Saldo inválido').max(999999999, 'Saldo muito alto'),
  currency: z.nativeEnum(Currency).default(Currency.BRL),
  account_number: z.string().optional(),
  agency: z.string().optional(),
  credit_limit: z.number().optional(),
  description: z.string().max(500, 'Descrição muito longa').optional(),
});

type AccountFormData = z.infer<typeof accountFormSchema>;

interface AccountFormProps {
  account?: Account; // Para edição
  onSubmit: (data: CreateAccountData | UpdateAccountData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * Componente de formulário para contas bancárias
 */
export function AccountForm({ account, onSubmit, onCancel, loading = false }: AccountFormProps) {
  const [selectedType, setSelectedType] = useState<AccountType>(account?.type || AccountType.CHECKING);
  const isEditing = !!account;

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: account?.name || '',
      bank: account?.bank || '',
      type: account?.type || AccountType.CHECKING,
      balance: account?.balance || 0,
      currency: account?.currency || Currency.BRL,
      account_number: account?.account_number || '',
      agency: account?.agency || '',
      credit_limit: account?.credit_limit || undefined,
      description: account?.description || '',
    },
  });

  /**
   * Atualiza o tipo selecionado quando o valor do formulário muda
   */
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'type' && value.type) {
        setSelectedType(value.type as AccountType);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  /**
   * Manipula o envio do formulário
   */
  const handleSubmit = async (data: AccountFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
    }
  };

  /**
   * Retorna ícone baseado no tipo de conta
   */
  const getTypeIcon = (type: AccountType) => {
    switch (type) {
      case AccountType.CHECKING:
        return <Building2 className="h-4 w-4" />;
      case AccountType.SAVINGS:
        return <Wallet className="h-4 w-4" />;
      case AccountType.CREDIT_CARD:
        return <CreditCard className="h-4 w-4" />;
      case AccountType.INVESTMENT:
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  /**
   * Retorna label do tipo de conta
   */
  const getTypeLabel = (type: AccountType) => {
    switch (type) {
      case AccountType.CHECKING:
        return 'Conta Corrente';
      case AccountType.SAVINGS:
        return 'Poupança';
      case AccountType.CREDIT_CARD:
        return 'Cartão de Crédito';
      case AccountType.INVESTMENT:
        return 'Investimentos';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getTypeIcon(selectedType)}
          {isEditing ? 'Editar Conta' : 'Nova Conta'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Básicas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Conta *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Conta Corrente Principal" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banco *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Banco do Brasil" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Conta *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={AccountType.CHECKING}>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              Conta Corrente
                            </div>
                          </SelectItem>
                          <SelectItem value={AccountType.SAVINGS}>
                            <div className="flex items-center gap-2">
                              <Wallet className="h-4 w-4" />
                              Poupança
                            </div>
                          </SelectItem>
                          <SelectItem value={AccountType.CREDIT_CARD}>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Cartão de Crédito
                            </div>
                          </SelectItem>
                          <SelectItem value={AccountType.INVESTMENT}>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Investimentos
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moeda</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a moeda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={Currency.BRL}>Real (BRL)</SelectItem>
                          <SelectItem value={Currency.USD}>Dólar (USD)</SelectItem>
                          <SelectItem value={Currency.EUR}>Euro (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Detalhes da Conta */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Detalhes da Conta</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="account_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número da Conta</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={selectedType === AccountType.CREDIT_CARD ? "**** 1234" : "12345-6"} 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        {selectedType === AccountType.CREDIT_CARD 
                          ? 'Últimos 4 dígitos do cartão'
                          : 'Número da conta bancária'
                        }
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedType !== AccountType.CREDIT_CARD && (
                  <FormField
                    control={form.control}
                    name="agency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agência</FormLabel>
                        <FormControl>
                          <Input placeholder="1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {selectedType === AccountType.CREDIT_CARD ? 'Fatura Atual' : 'Saldo Atual'} *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        {selectedType === AccountType.CREDIT_CARD 
                          ? 'Valor negativo para dívida'
                          : 'Saldo disponível na conta'
                        }
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedType === AccountType.CREDIT_CARD && (
                  <FormField
                    control={form.control}
                    name="credit_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limite do Cartão</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormDescription>
                          Limite total disponível
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Informações adicionais sobre a conta..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Máximo 500 caracteres
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Atualizar' : 'Criar'} Conta
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default AccountForm;