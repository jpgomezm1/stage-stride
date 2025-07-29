import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProspects } from '@/hooks/useProspects';
import { Prospect, STAGE_NAMES, PRIORITY_COLORS } from '@/types/prospect';
import { 
  Search, 
  Plus, 
  Filter,
  LayoutGrid,
  LayoutList,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Clock
} from 'lucide-react';

export const Dashboard = () => {
  const { prospects, loading, createProspect } = useProspects();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  const filteredProspects = prospects.filter(prospect => 
    prospect.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const prospectsByStage = filteredProspects.reduce((acc, prospect) => {
    const stage = prospect.current_stage;
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push(prospect);
    return acc;
  }, {} as Record<number, Prospect[]>);

  const totalValue = prospects.reduce((sum, prospect) => 
    sum + (prospect.estimated_value || 0), 0
  );

  const activeProspects = prospects.filter(p => !p.is_lost).length;
  const avgStage = prospects.length > 0 
    ? prospects.reduce((sum, p) => sum + p.current_stage, 0) / prospects.length 
    : 0;

  const handleCreateProspect = async () => {
    const newProspect = {
      company_name: "Nueva Empresa",
      contact_name: "Contacto Principal",
      contact_email: "contacto@empresa.com",
      first_contact_date: new Date().toISOString().split('T')[0],
      assigned_to: "current_user",
      current_stage: 1,
      stage_progress: {},
      is_lost: false,
      priority_level: "medium"
    };
    
    await createProspect(newProspect);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Cargando CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Irrelevant CRM
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {activeProspects} Prospectos Activos
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar prospectos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                  className="border-0"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="border-0"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                  className="border-0"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>

              <Button onClick={handleCreateProspect} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Prospecto
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prospectos Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProspects}</div>
              <p className="text-xs text-muted-foreground">
                de {prospects.length} totales
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                valor estimado
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Etapa Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgStage.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                de 5 etapas
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversión</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23%</div>
              <p className="text-xs text-muted-foreground">
                tasa de cierre
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((stage) => (
              <div key={stage} className="bg-card rounded-lg shadow-sm border">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">
                      {STAGE_NAMES[stage as keyof typeof STAGE_NAMES]}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {prospectsByStage[stage]?.length || 0}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 space-y-3 min-h-[400px]">
                  {prospectsByStage[stage]?.map((prospect) => (
                    <ProspectCard key={prospect.id} prospect={prospect} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Lista de Prospectos</CardTitle>
              <CardDescription>
                Vista detallada de todos los prospectos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProspects.map((prospect) => (
                  <ProspectListItem key={prospect.id} prospect={prospect} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Calendar View Placeholder */}
        {viewMode === 'calendar' && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Vista de Calendario</CardTitle>
              <CardDescription>
                Próximamente: Vista de calendario con fechas importantes
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Calendar className="h-16 w-16 mx-auto mb-4" />
                <p>Vista de calendario en desarrollo</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const ProspectCard = ({ prospect }: { prospect: Prospect }) => {
  const priorityClass = PRIORITY_COLORS[prospect.priority_level as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.medium;
  
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm truncate">{prospect.company_name}</h4>
            <Badge className={`text-xs ${priorityClass}`}>
              {prospect.priority_level}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground truncate">
            {prospect.contact_name}
          </p>
          
          {prospect.estimated_value && (
            <p className="text-sm font-medium text-primary">
              ${prospect.estimated_value.toLocaleString()}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{new Date(prospect.first_contact_date).toLocaleDateString()}</span>
            <span>{prospect.assigned_to}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProspectListItem = ({ prospect }: { prospect: Prospect }) => {
  const priorityClass = PRIORITY_COLORS[prospect.priority_level as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.medium;
  
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
      <div className="flex items-center space-x-4">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <div>
          <h4 className="font-semibold">{prospect.company_name}</h4>
          <p className="text-sm text-muted-foreground">{prospect.contact_name}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Badge className={priorityClass}>
          {prospect.priority_level}
        </Badge>
        
        <Badge variant="outline">
          Etapa {prospect.current_stage}
        </Badge>
        
        {prospect.estimated_value && (
          <span className="text-sm font-medium">
            ${prospect.estimated_value.toLocaleString()}
          </span>
        )}
        
        <span className="text-sm text-muted-foreground">
          {prospect.assigned_to}
        </span>
      </div>
    </div>
  );
};