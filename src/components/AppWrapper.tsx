// FILE: src/components/AppWrapper.tsx
import { type ReactNode } from 'react'
import Providers from './Providers'
import Header from '../shared/components/Header'
import CartSidebar from '../features/cart/CartSidebar'

interface Props {
  children: ReactNode
}

export default function AppWrapper({ children }: Props) {
  return (
    <Providers>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <CartSidebar />
    </Providers>
  )
}