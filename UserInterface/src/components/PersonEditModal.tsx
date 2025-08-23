import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Person } from '@/services/api';
import { Controller, useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface PersonEditModalProps {
  person: Person;
  onSave: (updatedPerson: Person) => Promise<void>;
  onClose: () => void;
  fieldErrors: { [key: string]: string[] };
}

export const PersonEditModal = ({ person, onSave, onClose }: PersonEditModalProps) => {

  const { formState, control, setValue, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      cpf: '',
      email: '',
      birthDate: '',
      placeOfBirth: '',
      nationality: '',
      gender: ''
    },
    mode: 'onBlur'
  })

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (person) {
      setValue('name', person.name ?? '');
      setValue('cpf', person.cpf ?? '');
      setValue('gender', person.gender ?? '');
      setValue('birthDate', person.birthDate.split('T')[0] ?? '');
      setValue('email', person.email ?? '');
      setValue('placeOfBirth', person.placeOfBirth ?? '');
      setValue('nationality', person.nationality ?? '');
    }
  }, [person]);

  const save = async (p: any) => {

    setLoading(true);

    try {
      const updatedPerson: Person = {
        ...person,
        ...p
      };

      await onSave(updatedPerson);
    } catch (err: any) {

    } finally {
      setLoading(false);
    }
  };

  const getGenderText = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'masculino': return 'Masculino';
      case 'feminino': return 'Feminino';
      case 'prefiro não informar': return 'Prefiro não informar';
      default: return 'Não informado';
    }
  };

  useEffect(() => {

  }, []);

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Pessoa</DialogTitle>
          <DialogDescription>
            Atualize os dados da pessoa. CPF não pode ser alterado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(save)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome completo *</Label>
              <Controller
                name='name'
                control={control}
                rules={{
                  required: 'O nome não pode ser vazio',
                }}
                render={({ field }) => <Input
                  className={formState.errors.name?.message && 'border-red-500'}
                  {...field}
                  id="edit-name"
                  type="text"
                  required
                />} />
              <p className='text-red-500 text-xs'>{formState.errors?.name?.message}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cpf">CPF (não editável)</Label>
              <Controller
                name='cpf'
                control={control}
                render={({ field }) => <Input
                  className={cn('bg-muted', formState.errors.cpf?.message && 'border-red-500')}
                  {...field}
                  id="edit-cpf"
                  type="text"
                  required
                  disabled
                />} />
              <p className='text-red-500 text-xs'>{formState.errors?.cpf?.message}</p>
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
              <Label htmlFor="edit-birthDate">Data de nascimento</Label>
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
                  id="edit-birthDate"
                  type="date"
                  required
                />} />
              <p className='text-red-500 text-xs'>{formState.errors?.birthDate?.message}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Controller
                name='email'
                control={control}
                render={({ field }) => <Input
                  className={formState.errors.email?.message && 'border-red-500'}
                  {...field}
                  id="edit-email"
                  type="email"
                  placeholder="seu@email.com"
                />} />
              <p className='text-red-500 text-xs'>{formState.errors?.email?.message}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-placeOfBirth">Lugar de nascimento</Label>
              <Controller
                name='placeOfBirth'
                control={control}
                render={({ field }) => <Input
                  className={formState.errors.placeOfBirth?.message && 'border-red-500'}
                  {...field}
                  id="edit-placeOfBirth"
                  type="text"
                  placeholder="Cidade onde nasceu"
                />} />
              <p className='text-red-500 text-xs'>{formState.errors?.placeOfBirth?.message}</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-nationality">Nacionalidade</Label>
              <Controller
                name='nationality'
                control={control}
                render={({ field }) => <Input
                  className={formState.errors.nationality?.message && 'border-red-500'}
                  {...field}
                  id="edit-nationality"
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
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>       

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};