// src/components/Layout.tsx
import type { ReactNode } from 'react'
import Header from '../shared/components/Header'
import Footer from '../shared/components/Footer'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}