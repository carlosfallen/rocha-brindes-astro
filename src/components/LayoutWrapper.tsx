// src/components/LayoutWrapper.tsx
import { type ReactNode } from 'react'
import Providers from './Providers'
import Header from '../shared/components/Header'

interface Props {
  children: ReactNode
}

export default function LayoutWrapper({ children }: Props) {
  return (
    <Providers>
      <Header />
      {children}
    </Providers>
  )
}