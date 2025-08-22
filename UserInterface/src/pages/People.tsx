import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Edit, Trash2, UserPlus } from 'lucide-react';
import { PersonEditModal } from '@/components/PersonEditModal';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { peopleApi, type Person } from '@/services/api';

const People = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadPeople();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPeople(filtered);
    } else {
      setFilteredPeople(people);
    }
  }, [searchTerm, people]);

  const loadPeople = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await peopleApi.getAll();
      setPeople(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pessoas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pessoa?')) {
      return;
    }

    try {
      await peopleApi.delete(id);
      setPeople(people.filter(p => p.id !== id));
      toast({
        title: "Pessoa excluída com sucesso!",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao excluir pessoa",
        description: err.message || 'Erro desconhecido',
        variant: "destructive"
      });
    }
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
  };

  const handleEditSave = async (updatedPerson: Person) => {
    try {
      await peopleApi.update(updatedPerson.id, {
        name: updatedPerson.name,
        email: updatedPerson.email,
        birthDate: updatedPerson.birthDate,
        placeOfBirth: updatedPerson.placeOfBirth,
        nationality: updatedPerson.nationality,
        gender: updatedPerson.gender
      });

      setPeople(people.map(p => p.id === updatedPerson.id ? { ...p, ...updatedPerson } : p));
      setEditingPerson(null);
      toast({
        title: "Pessoa atualizada com sucesso!",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar pessoa",
        description: err.message || 'Erro desconhecido',
        variant: "destructive"
      });
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando pessoas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Pessoas</h1>
            <p className="text-muted-foreground">
              {people.length} {people.length === 1 ? 'pessoa cadastrada' : 'pessoas cadastradas'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={() => navigate('/register')}
              className="whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Nova Pessoa
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Sair
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive text-center">{error}</p>
              <Button onClick={loadPeople} className="mt-4 mx-auto block">
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid gap-4">
          {filteredPeople.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  {searchTerm ? 'Nenhuma pessoa encontrada com este nome.' : 'Nenhuma pessoa cadastrada.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPeople.map((person) => (
              <Card key={person.cpf} className="hover:shadow-medium transition-shadow group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(person.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-semibold truncate">{person.name}</h3>
                        <Badge variant="secondary">{getGenderText(person.gender)}</Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 text-sm text-muted-foreground">
                        <span><strong>CPF:</strong> {person.cpf}</span>
                        <span><strong>Nascimento:</strong> {formatDate(person.birthDate)}</span>
                        {person.email && (
                          <span><strong>Email:</strong> {person.email}</span>
                        )}
                        {person.placeOfBirth && (
                          <span><strong>Local:</strong> {person.placeOfBirth}</span>
                        )}
                        {person.nationality && (
                          <span><strong>Nacionalidade:</strong> {person.nationality}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(person)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(person.id)}
                        className="hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {editingPerson && (
        <PersonEditModal
          person={editingPerson}
          onSave={handleEditSave}
          onClose={() => setEditingPerson(null)}
        />
      )}
    </div>
  );
};

export default People;