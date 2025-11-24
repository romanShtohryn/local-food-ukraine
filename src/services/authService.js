import { supabase } from './supabase'

export const authService = {
  async signUp(email, password, fullName) {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    })
    if (signUpError) throw signUpError

    const user = data.user

    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert([{ id: user.id, email, full_name: fullName }])
      .select()
      .single()

    if (profileError) throw profileError

    return { user, profile: profileData }
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data.user
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data || null
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error
    return data
  },

  async deleteAccount() {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', user.id)

    if (error) throw error

    const { error: delError } = await supabase.auth.admin.deleteUser(user.id)
    if (delError) throw delError
  },


  onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session)
    })
    return subscription
  }
  
}
