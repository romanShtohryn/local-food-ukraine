import { supabase } from './supabase'

export const sellersService = {
  async getAll() {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async search(query, category) {
    let queryBuilder = supabase.from('sellers').select('*')

    if (category) {
      queryBuilder = queryBuilder.eq('category', category)
    }

    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,product.ilike.%${query}%,city.ilike.%${query}%`)
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async create(seller) {
    const { data, error } = await supabase
      .from('sellers')
      .insert([seller])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('sellers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('sellers')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
