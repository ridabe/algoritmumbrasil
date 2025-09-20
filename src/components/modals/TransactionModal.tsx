/**
 * Modal para criação e edição de transações
 * Utiliza Drawer para mobile e Dialog para desktop
 */

'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { useTransactions } from '@/hooks/useTransactions';
import {
  Transaction,
  CreateTransactionData,
  UpdateTransactionData,
} from '@/lib/types/transactions';

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
}

export function TransactionModal({
  open,
  onOpenChange,
  transaction
}: TransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { createTransaction, updateTransaction } = useTransactions();

  const isEditing = !!transaction;
  const title = isEditing ? 'Editar Transação' : 'Nova Transação';
  const description = isEditing
    ? 'Atualize as informações da transação.'
    : 'Adicione uma nova transação ao seu controle financeiro.';

  /**
   * Manipula o envio do formulário
   */
  const handleSubmit = async (data: CreateTransactionData | UpdateTransactionData) => {
    setLoading(true);
    try {
      if (isEditing && transaction) {
        await updateTransaction.mutateAsync({
          id: transaction.id,
          data: data as UpdateTransactionData
        });
        toast.success('Transação atualizada com sucesso!');
      } else {
        await createTransaction.mutateAsync(data as CreateTransactionData);
        toast.success('Transação criada com sucesso!');
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      toast.error(
        isEditing
          ? 'Erro ao atualizar transação. Tente novamente.'
          : 'Erro ao criar transação. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manipula o cancelamento do formulário
   */
  const handleCancel = () => {
    onOpenChange(false);
  };

  /**
   * Prepara os dados iniciais para edição
   */
  const getInitialData = () => {
    if (!transaction) return undefined;

    return {
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      account_id: transaction.account_id,
      category_id: transaction.category_id,
      payment_method: transaction.payment_method,
      transaction_date: new Date(transaction.transaction_date),
      due_date: transaction.due_date ? new Date(transaction.due_date) : undefined,
      notes: transaction.notes || '',
      location: transaction.location || '',
      is_recurring: transaction.is_recurring || false,
      recurrence_frequency: transaction.recurrence_frequency,
      recurrence_end_date: transaction.recurrence_end_date
        ? new Date(transaction.recurrence_end_date)
        : undefined,
      transfer_account_id: transaction.transfer_account_id || '',
      tags: transaction.tags || []
    };
  };

  const content = (
    <TransactionForm
      initialData={getInitialData()}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditing={isEditing}
      loading={loading}
    />
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {content}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto">
          {content}
        </div>
      </DrawerContent>
    </Drawer>
  );
}