import { HelpCircleIcon, SettingsIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} Conversor de Excel para Word. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <HelpCircleIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <SettingsIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
