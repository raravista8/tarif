import React from 'react';
import { cn } from '@/lib/utils';
import { Wifi } from 'lucide-react';

interface FooterSectionProps {
  className?: string;
  onGoToAdmin?: () => void;
  onGoToComparison?: () => void;
  onGoToMethodology?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ className, onGoToAdmin, onGoToComparison, onGoToMethodology }) => {
  const currentYear = new Date().getFullYear();

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
            <p className="text-slate-400 mb-4 max-w-sm text-sm">
              Независимый информационный сервис сравнения тарифов мобильной связи.
              Сравнивайте условия от всех операторов России с учётом скрытых условий и программ лояльности.
            </p>
            <p className="text-slate-500 text-xs mb-2">
              Проект является информационным ресурсом. Не является рекламным материалом операторов связи.
            </p>
          </div>

          {/* Operators */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Тарифы операторов</h4>
            <ul className="space-y-2">
              {['МегаФон', 'МТС', 'Билайн', 'Т2 (Tele2)', 'Yota', 'Т-Мобайл', 'СберМобайл', 'ГПБ Мобайл', 'ВТБ Мобайл'].map(name => (
                <li key={name}>
                  <span className="text-slate-400 text-sm">{name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Информация</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onGoToComparison} className="text-slate-400 hover:text-white transition-colors text-sm">
                  Сравнить тарифы
                </button>
              </li>
              <li>
                <button onClick={onGoToMethodology} className="text-slate-400 hover:text-white transition-colors text-sm">
                  Методика сравнения
                </button>
              </li>
              <li>
                <a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Как это работает
                </a>
              </li>
              <li>
                <button onClick={onGoToAdmin} className="text-slate-400 hover:text-white transition-colors text-sm">
                  Статистика
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Правовая информация</h4>
            <ul className="space-y-2">
              <li><a href="#privacy" className="text-slate-400 hover:text-white transition-colors text-sm">Политика конфиденциальности</a></li>
              <li><a href="#terms" className="text-slate-400 hover:text-white transition-colors text-sm">Пользовательское соглашение</a></li>
              <li><a href="#cookies" className="text-slate-400 hover:text-white transition-colors text-sm">Политика cookie</a></li>
            </ul>
          </div>
        </div>

        {/* Methodology block */}
        <div className="border-t border-slate-800 mt-10 pt-8">
          <div className="bg-slate-800/60 rounded-xl p-5 mb-6">
            <h4 className="font-semibold text-sm mb-2 text-slate-300">📋 О методике сравнения тарифов</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Сравнение тарифов производится по открытой методике, учитывающей: стоимость владения за 12 месяцев (TCO),
              объём включённых услуг (интернет, звонки, SMS), наличие дополнительных опций, скрытые условия из «мелкого шрифта»,
              программы лояльности и кэшбэк, а также условия для новых абонентов и MNP.
              Рейтинг формируется автоматически по заданным критериям без участия операторов.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Методика разработана в соответствии со ст. 10, 12 Федерального закона от 07.02.1992 N 2300-1
              «О защите прав потребителей» (право потребителя на полную и достоверную информацию об услуге).
            </p>
            <button
              onClick={onGoToMethodology}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Подробнее о методике →
            </button>
          </div>
        </div>

        {/* Owner info & copyright */}
        <div className="border-t border-slate-800 pt-6 space-y-4">
          {/* Contact / owner info */}
          <div className="text-xs text-slate-500 space-y-1">
            <p>Контакт: info@tarify.online</p>
            <p>Информационный сервис «Тарифы.онлайн»</p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-slate-500 text-xs">
              © {currentYear} Тарифы.онлайн. Все права защищены.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <a href="#privacy" className="hover:text-white transition-colors">Конфиденциальность</a>
              <a href="#terms" className="hover:text-white transition-colors">Соглашение</a>
            </div>
          </div>
        </div>

        {/* Legal disclaimers */}
        <div className="mt-6 space-y-3">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-400">Отказ от ответственности:</strong>{' '}
              Все логотипы и торговые марки принадлежат их правообладателям.
              Информация о тарифах предоставлена для ознакомления на основании данных из открытых источников
              и может отличаться от актуальной. Перед подключением уточняйте условия на официальных сайтах операторов.
              Цены указаны для Москвы и Московской области на дату обновления данных.
              В других регионах стоимость и наполнение тарифов могут отличаться.
            </p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-400">Юридическое примечание:</strong>{' '}
              Рейтинг и рекомендации формируются на основании объективной методики сравнения.
              Формулировки «подходящий тариф», «соответствует профилю» означают результат
              автоматизированного сравнения по заданным потребителем параметрам согласно методике,
              а не субъективную оценку качества услуг оператора.
              Ни один оператор не оплачивал размещение или повышение позиций в рейтинге.
              Сервис не является рекламным материалом и не преследует цели продвижения услуг какого-либо оператора.
            </p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-400">Правовые основания:</strong>{' '}
              ФЗ от 07.02.1992 N 2300-1 «О защите прав потребителей» (ст. 10, 12);
              ФЗ от 07.07.2003 N 126-ФЗ «О связи» (ст. 44);
              ФЗ от 13.03.2006 N 38-ФЗ «О рекламе» (ст. 5, 28);
              ФЗ от 27.07.2006 N 152-ФЗ «О персональных данных».
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
