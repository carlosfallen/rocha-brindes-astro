import QueryProvider from "../core/providers/QueryProvider";
import { type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function AppWrapper({ children }: Props) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}
