import React from 'react';
import { cn } from '@/lib/utils';
import { Wifi, Mail, MessageCircle } from 'lucide-react';

interface FooterSectionProps {
  className?: string;
  onGoToAdmin?: () => void;
  onGoToComparison?: () => void;
  onGoToMethodology?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ className, onGoToAdmin, onGoToComparison, onGoToMethodology }) => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    operators: [
      { name: 'МегаФон', href: '#' },
      { name: 'МТС', href: '#' },
      { name: 'Билайн', href: '#' },
      { name: 'Т2', href: '#' },
      { name: 'Yota', href: '#' },
      { name: 'СберМобайл', href: '#' },
    ],
    regions: [
      { name: 'Москва', href: '#' },
      { name: 'Санкт-Петербург', href: '#' },
      { name: 'Краснодар', href: '#' },
      { name: 'Екатеринбург', href: '#' },
      { name: 'Новосибирск', href: '#' },
      { name: 'Все регионы', href: '#' },
    ],
    info: [
      { name: 'О проекте', href: '#' },
      { name: 'Как это работает', href: '#' },
      { name: 'Блог', href: '#' },
      { name: 'Контакты', href: '#' },
    ],
  };
  
  return (
    <footer className={cn('bg-slate-900 dark:bg-slate-950 text-white', className)}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Тарифы.онлайн</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm">
              Независимый агрегатор телеком-тарифов. Сравнивайте и выбирайте выгодные условия от всех операторов России.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Operators */}
          <div>
            <h4 className="font-semibold mb-4">Операторы</h4>
            <ul className="space-y-2">
              {footerLinks.operators.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Regions */}
          <div>
            <h4 className="font-semibold mb-4">Регионы</h4>
            <ul className="space-y-2">
              {footerLinks.regions.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2">
              {footerLinks.info.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={onGoToComparison}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Сравнить тарифы
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToMethodology}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Методика сравнения
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToAdmin}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Админ-панель
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} Тарифы.онлайн. Все права защищены.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Пользовательское соглашение
            </a>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-slate-800/50 rounded-xl">
          <p className="text-xs text-slate-500 text-center">
            Все логотипы и торговые марки принадлежат их правообладателям. 
            Информация о тарифах предоставлена для ознакомления и может отличаться от актуальной. 
            Перед подключением уточняйте условия на официальных сайтах операторов.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
