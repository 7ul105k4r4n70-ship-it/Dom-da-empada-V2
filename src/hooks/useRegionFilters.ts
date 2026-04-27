import { type Region } from '@/types';

/**
 * Hook para obter filtros de região apropriados para queries Supabase
 * 
 * @param region - Região selecionada (pode ser 'Todas' para admins)
 * @returns Objeto de filtros para usar em subscribeToTable ou queries
 * 
 * Exemplo de uso:
 * const filters = useRegionFilters(region);
 * subscribeToTable('orders', filters, callback);
 */
export function useRegionFilters(region: Region | 'Todas'): Record<string, string> {
  // Se região for 'Todas', retorna objeto vazio (sem filtro)
  // As policies RLS do Supabase garantirão o isolamento de dados
  if (region === 'Todas') {
    return {};
  }
  
  // Caso contrário, filtra pela região específica
  return { region };
}
