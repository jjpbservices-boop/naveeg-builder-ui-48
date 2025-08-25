import { ReactNode } from 'react'
import { useRole } from '@/lib/roles'

export function canWrite(role?: string) { return role === 'admin' || role === 'editor' }
export function canDestroy(role?: string) { return role === 'admin' }

export function RequireRole({ allow, children }: { allow: string[]; children: ReactNode }) {
  const role = useRole()
  if (!role) return null
  return allow.includes(role.role) ? <>{children}</> : null
}