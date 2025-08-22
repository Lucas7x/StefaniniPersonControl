import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Person } from '@/services/api';

interface PersonEditModalProps {
  person: Person;
  onSave: (updatedPerson: Person) => void;
  onClose: () => void;
}

export const PersonEditModal = ({ person, onSave, onClose }: PersonEditModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
    placeOfBirth: '',
    nationality: '',
    gender: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name,
        email: person.email || '',
        birthDate: person.birthDate.split('T')[0], // Convert to date input format
        placeOfBirth: person.placeOfBirth || '',
        nationality: person.nationality || '',
        gender: person.gender
      });
    }
  }, [person]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.birthDate) {
      return 'Nome e data de nascimento são obrigatórios';
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
      const updatedPerson: Person = {
        ...person,
        name: formData.name,
        email: formData.email,
        birthDate: formData.birthDate + 'T00:00:00Z', // Convert back to API format
        placeOfBirth: formData.placeOfBirth,
        nationality: formData.nationality,
        gender: formData.gender
      };

      onSave(updatedPerson);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar pessoa');
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Pessoa</DialogTitle>
          <DialogDescription>
            Atualize os dados da pessoa. CPF não pode ser alterado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome completo *</Label>
              <Input
                id="edit-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cpf">CPF (não editável)</Label>
              <Input
                id="edit-cpf"
                type="text"
                value={person.cpf}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>Gênero *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="prefiro não informar">Prefiro não informar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-birthDate">Data de nascimento *</Label>
              <Input
                id="edit-birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-placeOfBirth">Lugar de nascimento</Label>
              <Input
                id="edit-placeOfBirth"
                type="text"
                value={formData.placeOfBirth}
                onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                placeholder="Cidade onde nasceu"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-nationality">Nacionalidade</Label>
              <Input
                id="edit-nationality"
                type="text"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                placeholder="Ex: Brasileiro"
              />
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