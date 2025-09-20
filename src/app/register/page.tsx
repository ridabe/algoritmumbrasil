/**
 * Página de Registro
 * Integração com Supabase Auth
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  /**
   * Validação de senha
   */
  const passwordValidation = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword;

  /**
   * Função para atualizar os dados do formulário
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Função para realizar o registro
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast.error('Senha não atende aos critérios de segurança');
      return;
    }

    if (!passwordsMatch) {
      toast.error('As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    try {
      // Registrar usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (error) {
        toast.error('Erro ao criar conta', {
          description: error.message,
        });
        return;
      }

      if (data.user) {
        // Se o usuário foi criado mas precisa confirmar email
        if (!data.session) {
          toast.success('Conta criada com sucesso!', {
            description: 'Verifique seu e-mail para confirmar a conta.',
          });
          router.push('/login?message=check-email');
        } else {
          // Se o usuário foi criado e já está logado
          toast.success('Conta criada com sucesso!');
          router.push('/financas');
          router.refresh();
        }
      }
    } catch (error) {
      toast.error('Erro inesperado', {
        description: 'Tente novamente em alguns instantes.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Função para registro com Google
   */
  const handleGoogleRegister = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error('Erro ao registrar com Google', {
          description: error.message,
        });
      }
    } catch (error) {
      toast.error('Erro inesperado', {
        description: 'Tente novamente em alguns instantes.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Algoritmum</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Criar sua conta</CardTitle>
            <CardDescription>
              Comece a controlar suas finanças hoje mesmo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Crie uma senha segura"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {/* Validação de senha */}
                {formData.password && (
                  <div className="text-xs space-y-1 mt-2">
                    <div className={`flex items-center space-x-2 ${
                      passwordValidation.minLength ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <Check className={`h-3 w-3 ${
                        passwordValidation.minLength ? 'opacity-100' : 'opacity-30'
                      }`} />
                      <span>Mínimo 8 caracteres</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <Check className={`h-3 w-3 ${
                        passwordValidation.hasUpperCase ? 'opacity-100' : 'opacity-30'
                      }`} />
                      <span>Uma letra maiúscula</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <Check className={`h-3 w-3 ${
                        passwordValidation.hasLowerCase ? 'opacity-100' : 'opacity-30'
                      }`} />
                      <span>Uma letra minúscula</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <Check className={`h-3 w-3 ${
                        passwordValidation.hasNumber ? 'opacity-100' : 'opacity-30'
                      }`} />
                      <span>Um número</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <Check className={`h-3 w-3 ${
                        passwordValidation.hasSpecialChar ? 'opacity-100' : 'opacity-30'
                      }`} />
                      <span>Um caractere especial</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-600">As senhas não coincidem</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !isPasswordValid || !passwordsMatch}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleGoogleRegister}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar com Google
              </Button>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link href="/login" className="text-blue-600 hover:underline">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}