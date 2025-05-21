// Componente de cabeçalho

export default function Header() {
  return (
    <header className="py-6 shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="text-center">
            <h1 className="font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <span className="text-3xl tracking-tight uppercase">
                <span className="bg-gradient-to-r from-black to-primary bg-clip-text text-transparent font-extrabold">MÓVEIS BONAFÉ</span>
              </span>
              <div className="h-0.5 w-28 bg-primary mx-auto mt-2 mb-1"></div>
              <span className="text-sm uppercase tracking-widest text-black font-medium">Lista de Entrega</span>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
