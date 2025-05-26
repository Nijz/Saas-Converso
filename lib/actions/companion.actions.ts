'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";

export const createCompanion = async (formData: CreateCompanion) => {
    const { userId: author } = await auth();
    const supabase = createSupabaseClient();

    const { data, error } = await supabase.from("companions").insert({...formData, author}).select();

    if (error) {
        throw new Error(`Error creating companion: ${error.message}`);
    }

    return data[0];
}

export const getAllCompanions = async ({limit = 10, page = 1, subject, topic}:GetAllCompanions) => {
    const supabase = createSupabaseClient();
    let query = supabase.from("companions").select();
    if (subject && topic) {
        query = query.ilike('subject', `%${subject}%`)
            .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    } else if (subject) {
        query = query.ilike('subject', `%${subject}%`);
    } else if (topic) { 
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    }

    query = query.order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)
        .limit(limit);
    const { data, error } = await query;
    
    if (error) {
        throw new Error(`Error fetching companions: ${error.message}`);
    }
    
    return data;
}