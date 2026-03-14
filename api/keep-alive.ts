import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.VITE_SUPABASE_ANON_KEY || ''
  )

  const { error } = await supabase.from('services').select('id').limit(1)

  return res.status(200).json({
    ok: !error,
    timestamp: new Date().toISOString(),
    error: error?.message || null
  })
}
