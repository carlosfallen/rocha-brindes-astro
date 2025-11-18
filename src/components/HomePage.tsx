// src/components/HomePage.tsx
import HeroBanner from './home/HeroBanner'
import FeaturedProducts from './home/FeaturedProducts'
import NewProducts from './home/NewProducts'
import ProductionVideo from './home/ProductionVideo'
import NewsletterSection from './home/NewsletterSection'
import InstagramFeed from './home/InstagramFeed'
import ClientsSection from './home/ClientsSection'

export default function HomePage() {
  console.log('🏠 HomePage rendering')
  
  return (
    <>
      <HeroBanner />
      <FeaturedProducts />
      <NewProducts />
      <ProductionVideo />
      <NewsletterSection />
      <InstagramFeed />
      <ClientsSection />
    </>
  )
}