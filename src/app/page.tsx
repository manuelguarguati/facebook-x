import Link from 'next/link';
import { LandingCarousel } from '@/components/landing/LandingCarousel';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white overflow-x-hidden font-sans selection:bg-blue-500/30">
      {/* Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-indigo-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Header / Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tighter">
            Manuel <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">Asistente IA</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-neutral-400 hover:text-white hover:bg-white/5">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 border-none shadow-[0_0_20px_rgba(37,99,235,0.3)] rounded-full px-6">
              Registrar
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <section className="relative z-10 pt-20 pb-12 px-6 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
          Manuel <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">Asistente IA</span>
        </h2>
        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-16 font-light">
          Potenciando tu productividad con inteligencia artificial de vanguardia.
        </p>

        {/* Carousel Container */}
        <div className="w-full mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <LandingCarousel />
        </div>

        {/* Main Action Button */}
        <div className="relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
           <Link href="/register">
            <Button className="relative bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 border-none rounded-full px-12 py-7 text-xl font-bold tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shadow-2xl">
              REGISTRAR
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer Navigation */}
      <footer className="relative z-10 mt-auto py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-neutral-500">
          <Link href="#" className="hover:text-blue-400 transition-colors uppercase tracking-widest text-[10px]">Características</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors uppercase tracking-widest text-[10px]">Soporte</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors uppercase tracking-widest text-[10px]">Contacto</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors uppercase tracking-widest text-[10px]">Términos</Link>
        </div>
      </footer >
    </main>
  );
}
