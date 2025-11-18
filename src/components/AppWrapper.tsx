// src/components/AppWrapper.tsx
import { type ReactNode } from 'react'
import Providers from './Providers'
import Header from '../shared/components/Header'

interface Props {
  children: ReactNode
}

export default function AppWrapper({ children }: Props) {
  console.log('📦 AppWrapper rendering')
  
  return (
    <Providers>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
    </Providers>
  )
}