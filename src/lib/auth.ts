import { supabase } from './supabase'

export async function signUp(email: string, password: string, fullName?: string) {
  const redirectOrigin = window.location.origin.includes('localhost') 
    ? window.location.origin 
    : window.location.origin;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${redirectOrigin}/dashboard`,
      data: {
        full_name: fullName || email.split('@')[0],
      }
    }
  })

  if (error) {
    throw error
  }

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

export async function resetPasswordForEmail(email: string) {
  const redirectOrigin = window.location.origin;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${redirectOrigin}/auth?type=recovery`
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function updateUserPassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signInWithGoogle() {
  const redirectOrigin = window.location.origin;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${redirectOrigin}/dashboard`
    }
  })

  if (error) {
    throw error
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}
