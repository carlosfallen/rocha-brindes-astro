// src/components/Home.tsx
import { Suspense, lazy } from 'react'
import Layout from './Layout'
import Providers from './Providers'

const HeroBanner = lazy(() => import('../features/home/HeroBanner'))
const FeaturedProducts = lazy(() => import('../features/home/FeaturedProducts'))
const ProductionVideo = lazy(() => import('../features/home/ProductionVideo'))
const ClientsSection = lazy(() => import('../features/home/ClientsSection'))
const Newsletter = lazy(() => import('../features/home/Newsletter'))
const CartSidebar = lazy(() => import('../features/cart/CartSidebar'))

function HomeContent() {
  return (
    <Layout>
      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
        <HeroBanner />
      </Suspense>

      <div className="container mx-auto px-4">
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse my-12" />}>
          <FeaturedProducts />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse my-12" />}>
          <ProductionVideo />
        </Suspense>

        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse my-12" />}>
          <ClientsSection />
        </Suspense>

        <Suspense fallback={<div className="h-48 bg-gray-100 animate-pulse my-12" />}>
          <Newsletter />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <CartSidebar />
      </Suspense>
    </Layout>
  )
}

export default function Home() {
  return (
    <Providers>
      <HomeContent />
    </Providers>
  )
}