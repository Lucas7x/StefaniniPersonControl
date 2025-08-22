import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    password: '',
    confirmPassword: '',
    gender: '',
    email: '',
    birthDate: '',
    placeOfBirth: '',
    nationality: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatCpf = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'cpf' ? formatCpf(value) : value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.cpf || !formData.password || !formData.gender || !formData.birthDate) {
      return 'Todos os campos obrigatórios devem ser preenchidos';
    }

    if (formData.password.length < 4) {
      return 'A senha deve ter no mínimo 4 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'A confirmação de senha não confere';
    }

    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register({
        name: formData.name,
        cpf: formData.cpf,
        password: formData.password,
        gender: formData.gender,
        email: formData.email,
        birthDate: formData.birthDate,
        placeOfBirth: formData.placeOfBirth,
        nationality: formData.nationality
      });

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Redirecionando para a tela de login...",
      });

      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-medium">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Cadastro de Pessoa</CardTitle>
          <CardDescription>
            Preencha os dados para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  maxLength={14}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 4 caracteres"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Gênero *</Label>
                <Select onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="prefiro não informar">Prefiro não informar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeOfBirth">Lugar de nascimento</Label>
                <Input
                  id="placeOfBirth"
                  type="text"
                  placeholder="Cidade onde nasceu"
                  value={formData.placeOfBirth}
                  onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nationality">Nacionalidade</Label>
                <Input
                  id="nationality"
                  type="text"
                  placeholder="Ex: Brasileiro"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/login')}
                className="flex-1"
              >
                Voltar ao Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;