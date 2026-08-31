import { supabase } from '@/app/_libs/supabase'

export const getSupabaseUser = async (token: string) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    return null
  }

  return user
}