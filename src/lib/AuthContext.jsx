import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = cargando, null = sin sesión
  const [rol, setRol] = useState(null)
  const [negocioId, setNegocioId] = useState(null)
  const [perfilCargado, setPerfilCargado] = useState(false)

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
      // Sin sesión no hay perfil que esperar; con sesión, todavía no sabemos
      // el rol hasta que la consulta de abajo responda.
      setPerfilCargado(session === null)
      return
    }
    setPerfilCargado(false)
    supabase
      .from('usuarios')
      .select('rol, negocio_id')
      .eq('id', session.user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setRol(null)
          setNegocioId(null)
        } else {
          setRol(data?.rol ?? null)
          setNegocioId(data?.negocio_id ?? null)
        }
        setPerfilCargado(true)
      })
  }, [session])

  // Mientras haya una sesión activa, "loading" se mantiene hasta que también
  // sepamos el rol — si no, un guard que depende del rol (RequireAdmin) puede
  // leer `rol === null` como "no es admin" y redirigir de vuelta al login
  // justo en el instante en que la sesión ya resolvió pero el rol todavía no.
  const loading = session === undefined || (session !== null && !perfilCargado)

  return (
    <AuthContext.Provider value={{ session, rol, negocioId, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
