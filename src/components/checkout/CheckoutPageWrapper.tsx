// src/components/checkout/CheckoutPageWrapper.tsx
import Providers from '../Providers'
import CheckoutPage from './CheckoutPage'

export default function CheckoutPageWrapper() {
  return (
    <Providers>
      <CheckoutPage />
    </Providers>
  )
}
