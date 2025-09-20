/**
 * Componente de formulário para transações
 * Permite criar e editar transações financeiras
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import {
  TransactionType,
  PaymentMethod,
  RecurrenceFrequency,
  CreateTransactionData,
  UpdateTransactionData,
  PAYMENT_METHOD_LABELS,
  TRANSACTION_TYPE_LABELS,
  RECURRENCE_FREQUENCY_LABELS
} from '@/lib/types/transactions';
import { useAccounts } from '@/hooks/useAccounts';

// Schema de validação
const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').max(255, 'Descrição muito longa'),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  type: z.nativeEnum(TransactionType),
  account_id: z.string().min(1, 'Conta é obrigatória'),
  category_id: z.string().min(1, 'Categoria é obrigatória'),
  payment_method: z.nativeEnum(PaymentMethod),
  transaction_date: z.date(),
  due_date: z.date().optional(),
  notes: z.string().optional(),
  location: z.string().optional(),
  is_recurring: z.boolean().default(false),
  recurrence_frequency: z.nativeEnum(RecurrenceFrequency).optional(),
  recurrence_end_date: z.date().optional(),
  transfer_account_id: z.string().optional(),
  tags: z.array(z.string()).default([])
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  initialData?: Partial<TransactionFormData>;
  onSubmit: (data: CreateTransactionData | UpdateTransactionData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  loading?: boolean;
}

// Categorias mockadas (em produção, viriam do banco)
const MOCK_CATEGORIES = {
  [TransactionType.INCOME]: [
    { id: '1', name: 'Salário', icon: 'Briefcase', color: '#10B981' },
    { id: '2', name: 'Freelance', icon: 'Laptop', color: '#3B82F6' },
    { id: '3', name: 'Investimentos', icon: 'TrendingUp', color: '#8B5CF6' },
    { id: '4', name: 'Vendas', icon: 'ShoppingBag', color: '#F59E0B' },
    { id: '5', name: 'Outros', icon: 'Plus', color: '#6B7280' }
  ],
  [TransactionType.EXPENSE]: [
    { id: '6', name: 'Alimentação', icon: 'Utensils', color: '#EF4444' },
    { id: '7', name: 'Transporte', icon: 'Car', color: '#F97316' },
    { id: '8', name: 'Moradia', icon: 'Home', color: '#84CC16' },
    { id: '9', name: 'Saúde', icon: 'Heart', color: '#EC4899' },
    { id: '10', name: 'Educação', icon: 'GraduationCap', color: '#8B5CF6' },
    { id: '11', name: 'Lazer', icon: 'Gamepad2', color: '#06B6D4' },
    { id: '12', name: 'Compras', icon: 'ShoppingCart', color: '#F59E0B' },
    { id: '13', name: 'Outros', icon: 'MoreHorizontal', color: '#6B7280' }
  ],
  [TransactionType.TRANSFER]: []
};

export function TransactionForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
  loading = false
}: TransactionFormProps) {
  const { accounts } = useAccounts();
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: initialData?.description || '',
      amount: initialData?.amount || 0,
      type: initialData?.type || TransactionType.EXPENSE,
      account_id: initialData?.account_id || '',
      category_id: initialData?.category_id || '',
      payment_method: initialData?.payment_method || PaymentMethod.CASH,
      transaction_date: initialData?.transaction_date ? new Date(initialData.transaction_date) : new Date(),
      due_date: initialData?.due_date ? new Date(initialData.due_date) : undefined,
      notes: initialData?.notes || '',
      location: initialData?.location || '',
      is_recurring: initialData?.is_recurring || false,
      recurrence_frequency: initialData?.recurrence_frequency,
      recurrence_end_date: initialData?.recurrence_end_date ? new Date(initialData.recurrence_end_date) : undefined,
      transfer_account_id: initialData?.transfer_account_id || '',
      tags: initialData?.tags || []
    }
  });

  const watchedType = form.watch('type');
  const watchedIsRecurring = form.watch('is_recurring');
  const availableCategories = MOCK_CATEGORIES[watchedType] || [];

  // Resetar categoria quando o tipo muda
  useEffect(() => {
    form.setValue('category_id', '');
  }, [watchedType, form]);

  /**
   * Adiciona uma tag à lista
   */
  const addTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      const newTags = [...selectedTags, tagInput.trim()];
      setSelectedTags(newTags);
      form.setValue('tags', newTags);
      setTagInput('');
    }
  };

  /**
   * Remove uma tag da lista
   */
  const removeTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newTags);
    form.setValue('tags', newTags);
  };

  /**
   * Manipula o envio do formulário
   */
  const handleSubmit = async (data: TransactionFormData) => {
    try {
      const submitData = {
        ...data,
        transaction_date: data.transaction_date.toISOString(),
        due_date: data.due_date?.toISOString(),
        recurrence_end_date: data.recurrence_end_date?.toISOString(),
        tags: selectedTags
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Tipo de Transação */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Transação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(TRANSACTION_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Supermercado, Salário, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Valor */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conta */}
        <FormField
          control={form.control}
          name="account_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conta</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a conta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} - {account.bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Categoria */}
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Método de Pagamento */}
        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Pagamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Data da Transação */}
        <FormField
          control={form.control}
          name="transaction_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data da Transação</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conta de Transferência (apenas para transferências) */}
        {watchedType === TransactionType.TRANSFER && (
          <FormField
            control={form.control}
            name="transfer_account_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conta de Destino</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a conta de destino" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accounts
                      .filter(account => account.id !== form.watch('account_id'))
                      .map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} - {account.bank}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Transação Recorrente */}
        <FormField
          control={form.control}
          name="is_recurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Transação Recorrente</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Esta transação se repetirá automaticamente
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Frequência de Recorrência */}
        {watchedIsRecurring && (
          <FormField
            control={form.control}
            name="recurrence_frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequência</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(RECURRENCE_FREQUENCY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Notas */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informações adicionais sobre a transação..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Local */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Shopping, Posto de gasolina, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags (Opcional)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Adicionar tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addTag}>
              Adicionar
            </Button>
          </div>
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Atualizar' : 'Criar'} Transação
          </Button>
        </div>
      </form>
    </Form>
  );
}