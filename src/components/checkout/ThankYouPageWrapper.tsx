// src/components/checkout/ThankYouPageWrapper.tsx
import Providers from '../Providers'
import ThankYouPage from './ThankYouPage'

export default function ThankYouPageWrapper() {
  return (
    <Providers>
      <ThankYouPage />
    </Providers>
  )
}
