import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} Móveis Bonafé. Todos os direitos reservados.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-slate-500 hover:text-primary">
              Ajuda
            </Link>
            <Link href="#" className="text-sm text-slate-500 hover:text-primary">
              Contato
            </Link>
            <a 
              href="https://github.com/SEU_USUARIO/moveis-bonafe-lista" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-slate-500 hover:text-primary"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
