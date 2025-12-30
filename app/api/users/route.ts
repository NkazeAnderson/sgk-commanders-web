import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServerSupabase()
    const { data, error } = await supabase.from('users').select('*')
    console.log({data});
    
    if (error) {
      console.error('Supabase error fetching users:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ users: data ?? [] })
  } catch (err) {
    console.error('Unexpected error fetching users:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = createServerSupabase()
    const { data, error } = await supabase.from('users').insert(body).select().single()
    if (error) {
      console.error('Supabase error creating user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ user: data })
  } catch (err) {
    console.error('Unexpected error creating user:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, data } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const supabase = createServerSupabase()
    const { data: updated, error } = await supabase.from('users').update(data).eq('id', id).select().single()
    if (error) {
      console.error('Supabase error updating user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ user: updated })
  } catch (err) {
    console.error('Unexpected error updating user:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const supabase = createServerSupabase()
    const { error } = await supabase.from('users').delete().eq('id', id)
    if (error) {
      console.error('Supabase error deleting user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Unexpected error deleting user:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
