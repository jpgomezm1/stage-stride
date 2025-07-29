import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Prospect, ProspectActivity, ProspectFile } from '@/types/prospect';
import { useToast } from '@/hooks/use-toast';

export const useProspects = () => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProspects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProspects(data as Prospect[] || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching prospects';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createProspect = async (prospectData: Omit<Prospect, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .insert([prospectData])
        .select()
        .single();

      if (error) throw error;

      setProspects(prev => [data as Prospect, ...prev]);
      
      // Log activity
      await logActivity(data.id, 'prospect_created', `Prospecto creado: ${data.company_name}`);
      
      toast({
        title: 'Éxito',
        description: 'Prospecto creado exitosamente'
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating prospect';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const updateProspect = async (id: string, updates: Partial<Prospect>) => {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProspects(prev => prev.map(p => p.id === id ? data as Prospect : p));
      
      // Log activity for stage changes
      if (updates.current_stage) {
        await logActivity(id, 'stage_updated', `Prospecto movido a etapa ${updates.current_stage}`);
      }
      
      toast({
        title: 'Éxito',
        description: 'Prospecto actualizado exitosamente'
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating prospect';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const deleteProspect = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prospects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProspects(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: 'Éxito',
        description: 'Prospecto eliminado exitosamente'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting prospect';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const logActivity = async (prospectId: string, activityType: string, description: string, stage?: number) => {
    try {
      const { error } = await supabase
        .from('prospect_activities')
        .insert([{
          prospect_id: prospectId,
          activity_type: activityType,
          description,
          stage,
          created_by: 'current_user' // TODO: Replace with actual user
        }]);

      if (error) throw error;
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  };

  const getProspectActivities = async (prospectId: string): Promise<ProspectActivity[]> => {
    try {
      const { data, error } = await supabase
        .from('prospect_activities')
        .select('*')
        .eq('prospect_id', prospectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching activities:', err);
      return [];
    }
  };

  const getProspectFiles = async (prospectId: string): Promise<ProspectFile[]> => {
    try {
      const { data, error } = await supabase
        .from('prospect_files')
        .select('*')
        .eq('prospect_id', prospectId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching files:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchProspects();
  }, []);

  return {
    prospects,
    loading,
    error,
    createProspect,
    updateProspect,
    deleteProspect,
    logActivity,
    getProspectActivities,
    getProspectFiles,
    refetch: fetchProspects
  };
};