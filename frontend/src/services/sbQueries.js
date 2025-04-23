import { supabase } from './supabaseClient';

export const fetchTeams = async () => {
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('team_name');

    if (error) {
        console.error('Error fetching teams from Supabase:', error);
        return [];
    }

    return data;
};
