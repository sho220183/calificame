import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = cargando, null = sin sesión
  const [rol, setRol] = useState(null)
  const [negocioId, setNegocioId] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setSession(null)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!supabase || !session?.user) {
      setRol(null)
      setNegocioId(null)
      return
    }
    supabase
      .from('usuarios')
      .select('rol, negocio_id')
      .eq('id', session.user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setRol(null)
          setNegocioId(null)
          return
        }
        setRol(data?.rol ?? null)
        setNegocioId(data?.negocio_id ?? null)
      })
  }, [session])

  return (
    <AuthContext.Provider value={{ session, rol, negocioId, loading: session === undefined }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
