// src/features/home/ClientsSection.tsx
export default function ClientsSection() {
  const clients = [
    { name: 'Cliente 1', logo: '/clients/1.png' },
    { name: 'Cliente 2', logo: '/clients/2.png' },
    { name: 'Cliente 3', logo: '/clients/3.png' },
    { name: 'Cliente 4', logo: '/clients/4.png' },
    { name: 'Cliente 5', logo: '/clients/5.png' },
    { name: 'Cliente 6', logo: '/clients/6.png' },
  ]

  return (
    <section className="py-16">
      <h2 className="font-title font-bold text-3xl md:text-4xl text-dark text-center mb-4">
        Nossos Clientes
      </h2>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Empresas que confiam em nossos produtos e serviços
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {clients.map((client, i) => (
          <div key={i} className="flex items-center justify-center p-6 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all">
            <img 
              src={client.logo} 
              alt={client.name}
              className="w-full h-16 object-contain grayscale hover:grayscale-0 transition-all"
            />
          </div>
        ))}
      </div>
    </section>
  )
}