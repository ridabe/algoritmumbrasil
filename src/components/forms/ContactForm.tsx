'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Mail,
  Phone,
  Building2
} from 'lucide-react';

/**
 * Interface para os dados do formulário de contato
 */
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  service: string;
  acceptTerms: boolean;
}

/**
 * Interface para os erros do formulário
 */
interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  subject?: string;
  message?: string;
  service?: string;
  acceptTerms?: string;
}

/**
 * Estados possíveis do formulário
 */
type FormStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Componente de formulário de contato com validação e persistência
 * Inclui campos para informações pessoais, empresa e tipo de serviço
 */
export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    service: '',
    acceptTerms: false,
  });

  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<ContactFormErrors>({});

  /**
   * Valida os campos do formulário
   * @param data - Dados do formulário para validar
   * @returns Objeto com erros encontrados
   */
  const validateForm = (data: ContactFormData): ContactFormErrors => {
    const newErrors: ContactFormErrors = {};

    // Validação do nome
    if (!data.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (data.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = 'E-mail inválido';
    }

    // Validação do telefone (opcional, mas se preenchido deve ser válido)
    if (data.phone.trim()) {
      const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
      if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Telefone inválido';
      }
    }

    // Validação do assunto
    if (!data.subject.trim()) {
      newErrors.subject = 'Assunto é obrigatório';
    }

    // Validação da mensagem
    if (!data.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    } else if (data.message.trim().length < 10) {
      newErrors.message = 'Mensagem deve ter pelo menos 10 caracteres';
    }

    // Validação do serviço
    if (!data.service) {
      newErrors.service = 'Selecione um tipo de serviço';
    }

    // Validação dos termos
    if (!data.acceptTerms) {
      newErrors.acceptTerms = 'Você deve aceitar os termos';
    }

    return newErrors;
  };

  /**
   * Atualiza um campo específico do formulário
   * @param field - Campo a ser atualizado
   * @param value - Novo valor do campo
   */
  const updateField = (field: keyof ContactFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Remove erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Simula o envio do formulário
   * Em produção, isso faria uma chamada para uma API
   */
  const submitForm = async (data: ContactFormData): Promise<void> => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simula sucesso (em produção, aqui seria a chamada real da API)
    console.log('Dados do formulário:', data);
    
    // Salva no localStorage para demonstração
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    contacts.push({
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('contacts', JSON.stringify(contacts));
  };

  /**
   * Manipula o envio do formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valida o formulário
    const formErrors = validateForm(formData);
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setStatus('loading');
    setErrors({});

    try {
      await submitForm(formData);
      setStatus('success');
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      
      // Reset do formulário após sucesso
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        service: '',
        acceptTerms: false,
      });
    } catch (error) {
      setStatus('error');
      toast.error('Erro ao enviar mensagem. Tente novamente.');
      console.error('Erro no envio:', error);
    }
  };

  /**
   * Renderiza o formulário de sucesso
   */
  if (status === 'success') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Mensagem Enviada com Sucesso!
          </h3>
          <p className="text-muted-foreground mb-8">
            Obrigado pelo seu contato. Nossa equipe analisará sua solicitação e 
            retornará em até 24 horas.
          </p>
          <Button 
            onClick={() => setStatus('idle')}
            className="bg-green-600 hover:bg-green-700"
          >
            Enviar Nova Mensagem
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Mail className="h-6 w-6 text-primary mr-3" />
          Entre em Contato
        </CardTitle>
        <CardDescription>
          Preencha o formulário abaixo e nossa equipe entrará em contato com você.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Pessoais */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                type="text"
                placeholder="Nome da sua empresa"
                value={formData.company}
                onChange={(e) => updateField('company', e.target.value)}
              />
            </div>
          </div>

          {/* Tipo de Serviço */}
          <div className="space-y-2">
            <Label htmlFor="service">Tipo de Serviço *</Label>
            <Select value={formData.service} onValueChange={(value) => updateField('service', value)}>
              <SelectTrigger className={errors.service ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sistema-financeiro">Sistema Financeiro</SelectItem>
                <SelectItem value="rpa-automacao">RPA e Automação</SelectItem>
                <SelectItem value="data-ia">Data & IA</SelectItem>
                <SelectItem value="sistema-personalizado">Sistema Personalizado</SelectItem>
                <SelectItem value="consultoria">Consultoria Tecnológica</SelectItem>
                <SelectItem value="suporte">Suporte Técnico</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
            {errors.service && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.service}
              </p>
            )}
          </div>

          {/* Assunto */}
          <div className="space-y-2">
            <Label htmlFor="subject">Assunto *</Label>
            <Input
              id="subject"
              type="text"
              placeholder="Assunto da sua mensagem"
              value={formData.subject}
              onChange={(e) => updateField('subject', e.target.value)}
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.subject}
              </p>
            )}
          </div>

          {/* Mensagem */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem *</Label>
            <Textarea
              id="message"
              placeholder="Descreva sua necessidade ou dúvida..."
              rows={5}
              value={formData.message}
              onChange={(e) => updateField('message', e.target.value)}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.message}
              </p>
            )}
          </div>

          {/* Termos */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => updateField('acceptTerms', !!checked)}
              className={errors.acceptTerms ? 'border-red-500' : ''}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms"
                className="text-sm font-normal leading-relaxed cursor-pointer"
              >
                Aceito os termos de uso e política de privacidade da Algoritmum Brasil *
              </Label>
              {errors.acceptTerms && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.acceptTerms}
                </p>
              )}
            </div>
          </div>

          {/* Botão de Envio */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Enviar Mensagem
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}