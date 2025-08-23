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
import { Controller, useForm } from 'react-hook-form';

const Register = () => {

  const { formState, control, setValue, watch, handleSubmit, getValues, setError: setError2 } = useForm({
    defaultValues: {
      name: '',
      cpf: '',
      email: '',
      birthDate: '',
      placeOfBirth: '',
      nationality: '',
      gender: 'masculino',
      password: '',
      confirmPassword: ''
    },
    mode: 'onBlur'
  })


  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();


  const save = async (person: any) => {
    setError('');

    setLoading(true);

    try {
      const response = await authApi.register({
        name: (person.name != "") ? person.name : undefined,
        email: (person.email != "") ? person.email : undefined,
        birthDate: (person.birthDate != "") ? person.birthDate : undefined,
        placeOfBirth: (person.placeOfBirth != "") ? person.placeOfBirth : undefined,
        nationality: (person.nationality != "") ? person.nationality : undefined,
        gender: (person.gender != "") ? person.gender : undefined,
        cpf: (person.cpf != "") ? person.cpf : undefined,
        password: (person.password != "") ? person.password : undefined,
      });

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Redirecionando para a tela de login...",
      });

      navigate('/login');
    } catch (err: any) {
      if (err.status === 400) {
        const data = err.data;
        if (data.message) {
          setError(data.message)
        }
        else {
          Object.keys(data).forEach(key => {
            const k = key.charAt(0).toLowerCase() + key.slice(1) as 'cpf' | 'name' | 'password' | 'gender' | 'birthDate' | 'placeOfBirth' | 'email' | 'nationality';
            console.log(k, data[key][0])
            setError2(k, {
              message: data[key][0]
            })
          });

        }
      }
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
          <form onSubmit={handleSubmit(save)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Controller
                  name='name'
                  control={control}
                  rules={{
                    required: 'O nome não pode ser vazio',
                  }}
                  render={({ field }) => <Input
                    className={formState.errors.name?.message && 'border-red-500'}
                    {...field}
                    id="name"
                    type="text"
                    required
                    placeholder='Ex.: José da Silva'
                  />} />
                <p className='text-red-500 text-xs'>{formState.errors?.name?.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Controller
                  name='cpf'
                  control={control}
                  rules={{
                    required: "O CPF não pode ser vazio",
                    validate: {
                      onlyNumber: (value) =>
                        /^\d+$/.test(value) || "Somente números são permitidos.",
                      length: (value) =>
                        value.length !== 11 ? "O CPF deve ter exatamente 11 dígitos." : null,
                    },
                  }}

                  render={({ field }) => <Input
                    className={formState.errors.cpf?.message && 'border-red-500'}
                    {...field}
                    id="cpf"
                    type="text"
                    required
                    placeholder="00000000000"
                    maxLength={11}
                  />} />
                <p className='text-red-500 text-xs'>{formState.errors?.cpf?.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Controller
                  name='password'
                  control={control}
                  rules={{
                    required: "A senha não pode ser vazia.",
                    validate: {
                      length: (value) =>
                        value.length < 4 ? "A senha deve ter no mínimo 4 caracteres." : null,
                    },
                  }}
                  render={({ field }) => <Input
                    className={formState.errors.password?.message && 'border-red-500'}
                    {...field}
                    id="password"
                    type="password"
                    required
                    placeholder="Mínimo 4 caracteres"
                  />} />
                <p className='text-red-500 text-xs'>{formState.errors?.password?.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                <Controller
                  name='confirmPassword'
                  control={control}
                  rules={{
                    required: "A confirmação de senha não pode ser vazia.",
                    validate: {
                      passwordsEquals: (value) => value !== getValues('password') ? 'As senhas não coincidem' : null
                    },
                  }}
                  render={({ field }) => <Input
                    className={formState.errors.confirmPassword?.message && 'border-red-500'}
                    {...field}
                    id="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirme sua senha"
                  />} />
                <p className='text-red-500 text-xs'>{formState.errors?.confirmPassword?.message}</p>
              </div>

              <div className="space-y-2">
                <Label>Gênero *</Label>
                <Controller
                  name='gender'
                  control={control}
                  render={({ field }) =>
                    <Select
                      {...field}
                      onValueChange={(e) => field.onChange(e)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="prefiro não informar">Prefiro não informar</SelectItem>
                      </SelectContent>
                    </Select>} />
                <p className='text-red-500 text-xs'>{formState.errors?.gender?.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de nascimento *</Label>
                <Controller
                  name='birthDate'
                  control={control}
                  rules={{
                    required: 'A data de nascimento é obrigatória',
                    validate: {
                      validRange: (dateStr) => {
                        if (!dateStr) return "Data inválida";

                        const date = new Date(dateStr);

                        if (isNaN(date.getTime())) {
                          return "Formato de data inválido";
                        }

                        const minDate = new Date("1900-01-01");
                        const today = new Date();
                        const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

                        if (date < minDate || date > maxDate) {
                          return `A data deve estar entre ${minDate.toISOString().split("T")[0]} e ${maxDate.toISOString().split("T")[0]}`;
                        }

                        return null; // válido
                      }
                    }
                  }}
                  render={({ field }) => <Input
                    className={formState.errors.birthDate?.message && 'border-red-500'}
                    {...field}
                    id="birthDate"
                    type="date"
                    required
                  />} />
                <p className='text-red-500 text-xs'>{formState.errors?.birthDate?.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => <Input
                    className={formState.errors.email?.message && 'border-red-500'}
                    {...field}
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                  />} />
                <p className='text-red-500 text-xs'>{formState.errors?.email?.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeOfBirth">Lugar de nascimento</Label>
                <Controller
                  name='placeOfBirth'
                  control={control}
                  render={({ field }) => <Input
                    className={formState.errors.placeOfBirth?.message && 'border-red-500'}
                    {...field}
                    id="placeOfBirth"
                    type="text"
                    placeholder="Cidade onde nasceu"
                  />} />
                <p className='text-red-500 text-xs'>{formState.errors?.placeOfBirth?.message}</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nationality">Nacionalidade</Label>
                <Controller
                  name='nationality'
                  control={control}
                  render={({ field }) => <Input
                    className={formState.errors.nationality?.message && 'border-red-500'}
                    {...field}
                    id="nationality"
                    type="text"
                    placeholder="Ex: Brasileiro"
                  />} />
                <p className='text-red-500 text-xs'>{formState.errors?.nationality?.message}</p>
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