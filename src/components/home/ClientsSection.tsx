// src/components/home/ClientsSection.tsx
export default function ClientsSection() {
  const clients = [
    // Adicione os logos dos seus clientes aqui
  ]

  return (
    <section className="container mx-auto px-4 py-16 border-t border-gray-200">
      <h2 className="text-3xl md:text-4xl font-title font-bold text-dark text-center mb-12">
        Alguns de nossos clientes
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60">
        {clients.length > 0 ? (
          clients.map((client, i) => (
            <div key={i} className="grayscale hover:grayscale-0 transition-all">
              <img src={client} alt={`Cliente ${i + 1}`} className="h-12 w-auto" />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            <p>Logos dos clientes em breve</p>
          </div>
        )}
      </div>
    </section>
  )
}