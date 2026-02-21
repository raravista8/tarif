import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Tariff } from '@/types';
import { operators } from '@/data/operators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  Search,
  Database,
  Shield,
  LogOut,
  Download,
  Upload
} from 'lucide-react';

// LocalStorage keys
const STORAGE_KEYS = {
  TARIFFS: 'tariffs_admin_data',
  AUTH: 'tariffs_admin_auth',
};

// Admin credentials (in real app, this would be on backend)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

interface AdminSectionProps {
  onBack: () => void;
  className?: string;
}

export const AdminSection: React.FC<AdminSectionProps> = ({ onBack, className }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<string>('all');
  const [editingTariff, setEditingTariff] = useState<Tariff | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load tariffs from localStorage or use default
  useEffect(() => {
    const savedTariffs = localStorage.getItem(STORAGE_KEYS.TARIFFS);
    const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
    
    if (savedAuth) {
      setIsAuthenticated(true);
    }
    
    if (savedTariffs) {
      setTariffs(JSON.parse(savedTariffs));
    } else {
      // Load default tariffs from module
      import('@/data/tariffs').then(module => {
        setTariffs(module.tariffs);
      });
    }
  }, []);

  // Save to localStorage
  const saveToStorage = (newTariffs: Tariff[]) => {
    localStorage.setItem(STORAGE_KEYS.TARIFFS, JSON.stringify(newTariffs));
    setHasChanges(true);
  };

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      loginForm.username === ADMIN_CREDENTIALS.username &&
      loginForm.password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    } else {
      alert('Неверные учетные данные');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  // Filter tariffs
  const filteredTariffs = tariffs.filter(tariff => {
    const matchesSearch = 
      tariff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      operators.find(o => o.id === tariff.operatorId)?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOperator = selectedOperator === 'all' || tariff.operatorId === selectedOperator;
    return matchesSearch && matchesOperator;
  });

  // Add new tariff
  const handleAddTariff = (tariff: Omit<Tariff, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTariff: Tariff = {
      ...tariff,
      id: `tariff-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newTariffs = [...tariffs, newTariff];
    setTariffs(newTariffs);
    saveToStorage(newTariffs);
    setIsAddDialogOpen(false);
  };

  // Update tariff
  const handleUpdateTariff = (updatedTariff: Tariff) => {
    const newTariffs = tariffs.map(t => 
      t.id === updatedTariff.id 
        ? { ...updatedTariff, updatedAt: new Date().toISOString() }
        : t
    );
    setTariffs(newTariffs);
    saveToStorage(newTariffs);
    setEditingTariff(null);
  };

  // Delete tariff
  const handleDeleteTariff = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот тариф?')) {
      const newTariffs = tariffs.filter(t => t.id !== id);
      setTariffs(newTariffs);
      saveToStorage(newTariffs);
    }
  };

  // Export data
  const handleExport = () => {
    const dataStr = JSON.stringify(tariffs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tariffs_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Import data
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedTariffs = JSON.parse(event.target?.result as string);
          setTariffs(importedTariffs);
          saveToStorage(importedTariffs);
          alert('Данные успешно импортированы!');
        } catch (error) {
          alert('Ошибка при импорте данных');
        }
      };
      reader.readAsText(file);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    if (confirm('Вы уверены? Все изменения будут потеряны.')) {
      localStorage.removeItem(STORAGE_KEYS.TARIFFS);
      import('@/data/tariffs').then(module => {
        setTariffs(module.tariffs);
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <section className={cn('min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center', className)}>
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Админ-панель
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Введите учетные данные для входа
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Логин
                </label>
                <Input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="admin"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Пароль
                </label>
                <Input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••"
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full">
                Войти
              </Button>
            </form>

            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад на сайт
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn('min-h-screen bg-slate-50 dark:bg-slate-900', className)}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <h1 className="font-semibold text-slate-900 dark:text-white">
                  Админ-панель
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Импорт
                  </span>
                </Button>
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                Сбросить
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 lg:px-12 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Всего тарифов</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{tariffs.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Активных</p>
            <p className="text-2xl font-bold text-green-600">
              {tariffs.filter(t => t.isActive).length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Операторов</p>
            <p className="text-2xl font-bold text-indigo-600">{operators.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">С изменениями</p>
            <p className="text-2xl font-bold text-amber-600">
              {hasChanges ? 'Да' : 'Нет'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Поиск тарифов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedOperator} onValueChange={setSelectedOperator}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Все операторы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все операторы</SelectItem>
              {operators.map(op => (
                <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить тариф
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Новый тариф</DialogTitle>
              </DialogHeader>
              <TariffForm
                onSubmit={handleAddTariff}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Оператор</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Интернет</TableHead>
                <TableHead>Минуты</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTariffs.map((tariff) => (
                <TableRow key={tariff.id}>
                  <TableCell className="font-medium">{tariff.name}</TableCell>
                  <TableCell>
                    {operators.find(o => o.id === tariff.operatorId)?.name}
                  </TableCell>
                  <TableCell>{tariff.price} ₽</TableCell>
                  <TableCell>
                    {tariff.internetUnlimited 
                      ? 'Безлимит' 
                      : `${tariff.internetGb} ГБ`}
                  </TableCell>
                  <TableCell>
                    {tariff.minutesUnlimited 
                      ? 'Безлимит' 
                      : `${tariff.minutes} мин`}
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs',
                      tariff.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-500'
                    )}>
                      {tariff.isActive ? 'Активен' : 'Неактивен'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingTariff(tariff)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Редактировать тариф</DialogTitle>
                          </DialogHeader>
                          {editingTariff && (
                            <TariffForm
                              tariff={editingTariff}
                              onSubmit={(data) => handleUpdateTariff({ ...editingTariff, ...data })}
                              onCancel={() => setEditingTariff(null)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTariff(tariff.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

// Tariff Form Component
interface TariffFormProps {
  tariff?: Tariff;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const TariffForm: React.FC<TariffFormProps> = ({ tariff, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: tariff?.name || '',
    operatorId: tariff?.operatorId || operators[0]?.id,
    price: tariff?.price || 0,
    internetGb: tariff?.internetGb || 0,
    internetUnlimited: tariff?.internetUnlimited || false,
    minutes: tariff?.minutes || 0,
    minutesUnlimited: tariff?.minutesUnlimited || false,
    sms: tariff?.sms || 0,
    smsUnlimited: tariff?.smsUnlimited || false,
    unlimitedSocial: tariff?.unlimitedSocial || false,
    unlimitedMessengers: tariff?.unlimitedMessengers || false,
    unlimitedMusic: tariff?.unlimitedMusic || false,
    unlimitedVideo: tariff?.unlimitedVideo || false,
    hotspot: tariff?.hotspot || false,
    esim: tariff?.esim || false,
    familyTariff: tariff?.familyTariff || false,
    roamingIncluded: tariff?.roamingIncluded || false,
    hasKion: tariff?.hasKion || false,
    hasIvi: tariff?.hasIvi || false,
    hasYandexPlus: tariff?.hasYandexPlus || false,
    hasStart: tariff?.hasStart || false,
    hasSberprime: tariff?.hasSberprime || false,
    loyaltyProgram: tariff?.loyaltyProgram || '',
    includedSubscriptions: tariff?.includedSubscriptions || '',
    isActive: tariff?.isActive ?? true,
    regionIds: tariff?.regionIds || ['moscow'],
    conditions: tariff?.conditions || 'all',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Название</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Оператор</label>
          <Select 
            value={formData.operatorId} 
            onValueChange={(v) => setFormData(prev => ({ ...prev, operatorId: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {operators.map(op => (
                <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Цена (₽)</label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Интернет (ГБ)</label>
          <Input
            type="number"
            value={formData.internetGb}
            onChange={(e) => setFormData(prev => ({ ...prev, internetGb: parseInt(e.target.value) }))}
            disabled={formData.internetUnlimited}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Минуты</label>
          <Input
            type="number"
            value={formData.minutes}
            onChange={(e) => setFormData(prev => ({ ...prev, minutes: parseInt(e.target.value) }))}
            disabled={formData.minutesUnlimited}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <label className="flex items-center gap-2">
          <Checkbox
            checked={formData.internetUnlimited}
            onCheckedChange={(v) => setFormData(prev => ({ ...prev, internetUnlimited: v as boolean }))}
          />
          <span className="text-sm">Безлимитный интернет</span>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox
            checked={formData.minutesUnlimited}
            onCheckedChange={(v) => setFormData(prev => ({ ...prev, minutesUnlimited: v as boolean }))}
          />
          <span className="text-sm">Безлимитные звонки</span>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox
            checked={formData.smsUnlimited}
            onCheckedChange={(v) => setFormData(prev => ({ ...prev, smsUnlimited: v as boolean }))}
          />
          <span className="text-sm">Безлимитные SMS</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Опции</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'unlimitedSocial', label: 'Соцсети' },
            { key: 'unlimitedMessengers', label: 'Мессенджеры' },
            { key: 'unlimitedMusic', label: 'Музыка' },
            { key: 'unlimitedVideo', label: 'Видео' },
            { key: 'hotspot', label: 'Раздача' },
            { key: 'esim', label: 'eSIM' },
            { key: 'familyTariff', label: 'Семейный' },
            { key: 'roamingIncluded', label: 'Роуминг' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2">
              <Checkbox
                checked={formData[key as keyof typeof formData] as boolean}
                onCheckedChange={(v) => setFormData(prev => ({ ...prev, [key]: v as boolean }))}
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Подписки</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'hasKion', label: 'КИОН' },
            { key: 'hasIvi', label: 'IVI' },
            { key: 'hasYandexPlus', label: 'Яндекс Плюс' },
            { key: 'hasStart', label: 'START' },
            { key: 'hasSberprime', label: 'СберПрайм' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2">
              <Checkbox
                checked={formData[key as keyof typeof formData] as boolean}
                onCheckedChange={(v) => setFormData(prev => ({ ...prev, [key]: v as boolean }))}
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Программа лояльности</label>
        <Input
          value={formData.loyaltyProgram}
          onChange={(e) => setFormData(prev => ({ ...prev, loyaltyProgram: e.target.value }))}
          placeholder="Например: МегаСилы, Кубики МТС..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Включенные подписки</label>
        <Input
          value={formData.includedSubscriptions}
          onChange={(e) => setFormData(prev => ({ ...prev, includedSubscriptions: e.target.value }))}
          placeholder="Например: Яндекс Плюс, START..."
        />
      </div>

      <label className="flex items-center gap-2">
        <Checkbox
          checked={formData.isActive}
          onCheckedChange={(v) => setFormData(prev => ({ ...prev, isActive: v as boolean }))}
        />
        <span className="text-sm">Активен</span>
      </label>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          {tariff ? 'Сохранить' : 'Создать'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Отмена
        </Button>
      </div>
    </form>
  );
};

export default AdminSection;
