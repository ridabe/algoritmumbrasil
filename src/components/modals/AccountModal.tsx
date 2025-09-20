/**
 * Modal para criar/editar contas bancárias
 * Utiliza o AccountForm em um dialog responsivo
 */

'use client';

import { useState } from 'react';
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
import { AccountForm } from '@/components/forms/AccountForm';
import { useAccounts } from '@/hooks/useAccounts';
import { toast } from 'sonner';
import type { Account, CreateAccountData, UpdateAccountData } from '@/lib/types/accounts';

interface AccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: Account; // Para edição
}

/**
 * Modal responsivo para gerenciar contas bancárias
 * Usa Dialog em desktop e Drawer em mobile
 */
export function AccountModal({ open, onOpenChange, account }: AccountModalProps) {
  const [loading, setLoading] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { createAccount, updateAccount, refreshData } = useAccounts();
  const isEditing = !!account;

  /**
   * Manipula o envio do formulário
   */
  const handleSubmit = async (data: CreateAccountData | UpdateAccountData) => {
    setLoading(true);
    try {
      if (isEditing && account) {
        await updateAccount(account.id, data as UpdateAccountData);
        toast.success('Conta atualizada com sucesso!');
      } else {
        await createAccount(data as CreateAccountData);
        toast.success('Conta criada com sucesso!');
      }
      
      // Atualiza a lista de contas
      await refreshData();
      
      // Fecha o modal
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      toast.error(
        isEditing 
          ? 'Erro ao atualizar conta. Tente novamente.' 
          : 'Erro ao criar conta. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manipula o cancelamento
   */
  const handleCancel = () => {
    onOpenChange(false);
  };

  const title = isEditing ? 'Editar Conta' : 'Nova Conta';
  const description = isEditing 
    ? 'Atualize as informações da sua conta bancária.'
    : 'Adicione uma nova conta bancária ao seu portfólio.';

  // Renderiza como Dialog em desktop
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <AccountForm
              account={account}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Renderiza como Drawer em mobile
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto">
          <AccountForm
            account={account}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default AccountModal;