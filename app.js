const STORAGE_KEY = 'tarif-radar-data-v1';
const THEME_KEY = 'tarif-radar-theme';
const AUTO_REFRESH_MS = 1000 * 60 * 5;
const DEFAULT_REGION = 'Москва';

const state = {
  tariffs: [],
  filters: {
    region: DEFAULT_REGION,
    budget: 1200,
    minGb: 15,
    minMinutes: 300,
    minSms: 50,
    needSocial: false,
    needRoaming: false,
    showAllRegional: false,
  },
};

const els = {
  updateStatus: document.getElementById('updateStatus'),
  refreshBtn: document.getElementById('refreshBtn'),
  themeToggle: document.getElementById('themeToggle'),
  regionFilter: document.getElementById('regionFilter'),
  budgetFilter: document.getElementById('budgetFilter'),
  minGbFilter: document.getElementById('minGbFilter'),
  minMinutesFilter: document.getElementById('minMinutesFilter'),
  minSmsFilter: document.getElementById('minSmsFilter'),
  budgetValue: document.getElementById('budgetValue'),
  minGbValue: document.getElementById('minGbValue'),
  minMinutesValue: document.getElementById('minMinutesValue'),
  minSmsValue: document.getElementById('minSmsValue'),
  socialFilter: document.getElementById('socialFilter'),
  roamingFilter: document.getElementById('roamingFilter'),
  showAllRegionalFilter: document.getElementById('showAllRegionalFilter'),
  detectedRegionText: document.getElementById('detectedRegionText'),
  bestHeading: document.getElementById('bestHeading'),
  resultHeading: document.getElementById('resultHeading'),
  tariffGrid: document.getElementById('tariffGrid'),
  bestTariff: document.getElementById('bestTariff'),
  resultCount: document.getElementById('resultCount'),
  adminBtn: document.getElementById('adminBtn'),
  adminDialog: document.getElementById('adminDialog'),
  adminTableBody: document.querySelector('#adminTable tbody'),
  seedDataBtn: document.getElementById('seedDataBtn'),
  exportBtn: document.getElementById('exportBtn'),
  importInput: document.getElementById('importInput'),
};

const unique = (items) => [...new Set(items)].filter(Boolean);
const formatRub = (n) => `${n.toLocaleString('ru-RU')} ₽/мес`;

const scoreTariff = (t) => {
  const value = (t.gb * 11 + t.minutes * 0.08 + t.sms * 0.12 + (t.unlimitedSocial ? 90 : 0) + (t.roamingIncluded ? 70 : 0)) / t.price;
  return Number((value + (t.has5g ? 0.2 : 0) + (t.hasEsim ? 0.1 : 0)).toFixed(4));
};

const getLocalTariffs = () => {
  const local = localStorage.getItem(STORAGE_KEY);
  if (!local) return [];
  try {
    return JSON.parse(local);
  } catch {
    return [];
  }
};

async function fetchLatestTariffs() {
  const local = getLocalTariffs();
  if (local.length) return { tariffs: local, source: 'Локальная база модератора' };
  const response = await fetch(`./data/tariffs.json?ts=${Date.now()}`);
  if (!response.ok) throw new Error('Не удалось загрузить тарифы');
  return { tariffs: await response.json(), source: 'Базовый каталог (JSON/API)' };
}

function applyTheme(theme) {
  const normalized = theme === 'dark' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', normalized);
  localStorage.setItem(THEME_KEY, normalized);
  els.themeToggle.checked = normalized === 'dark';
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
}

function initRegionFilter() {
  const regions = unique(state.tariffs.map((t) => t.region));
  els.regionFilter.innerHTML = regions.map((r) => `<option value="${r}">${r}</option>`).join('');
  const active = regions.includes(state.filters.region) ? state.filters.region : DEFAULT_REGION;
  state.filters.region = regions.includes(active) ? active : regions[0];
  els.regionFilter.value = state.filters.region;
}

function applyFilters() {
  const regional = state.tariffs.filter((t) => t.region === state.filters.region);
  if (state.filters.showAllRegional) return regional;

  return regional.filter((t) => {
    if (t.price > state.filters.budget) return false;
    if (t.gb < state.filters.minGb) return false;
    if (t.minutes < state.filters.minMinutes) return false;
    if ((t.sms || 0) < state.filters.minSms) return false;
    if (state.filters.needSocial && !t.unlimitedSocial) return false;
    if (state.filters.needRoaming && !t.roamingIncluded) return false;
    return true;
  });
}

function renderBestTariff(filtered) {
  els.bestHeading.textContent = `Лучший тариф в ${state.filters.region}`;
  if (!filtered.length) {
    els.bestTariff.innerHTML = '<p class="hint">По выбранным условиям тарифы не найдены.</p>';
    return;
  }

  const best = [...filtered].sort((a, b) => scoreTariff(b) - scoreTariff(a))[0];
  els.bestTariff.innerHTML = `
    <article class="best-card">
      <div class="operator-line">
        <img class="logo" src="${best.logo}" alt="Логотип ${best.operator}" />
        <div>
          <strong>${best.name}</strong>
          <div>${best.operator} • ${best.region}</div>
        </div>
      </div>
      <span class="price">${formatRub(best.price)}</span>
      <div class="pills">
        <span class="pill">${best.gb} ГБ</span>
        <span class="pill">${best.minutes} мин</span>
        <span class="pill">${best.sms} SMS</span>
        <span class="pill">Соцсети: ${best.unlimitedSocial ? 'да' : 'нет'}</span>
      </div>
      <a class="connect-link" href="${best.connectUrl}" target="_blank" rel="noopener noreferrer">Подключить у оператора →</a>
    </article>
  `;
}

function renderTariffs(filtered) {
  els.resultHeading.textContent = state.filters.showAllRegional
    ? `Все тарифы в ${state.filters.region}`
    : `Подходящие тарифы в ${state.filters.region}`;
  els.resultCount.textContent = `Найдено: ${filtered.length}`;

  if (!filtered.length) {
    els.tariffGrid.innerHTML = '<p class="hint">Нет подходящих тарифов. Ослабьте условия подбора.</p>';
    return;
  }

  els.tariffGrid.innerHTML = filtered
    .sort((a, b) => scoreTariff(b) - scoreTariff(a))
    .map(
      (t) => `
      <article class="tariff-card" data-connect-url="${t.connectUrl}" role="link" tabindex="0">
        <div class="tariff-top">
          <div class="operator-line">
            <img class="logo" src="${t.logo}" alt="Логотип ${t.operator}" />
            <div>
              <div class="name">${t.name}</div>
              <small>${t.operator}</small>
            </div>
          </div>
          <span class="pill">${t.isMvno ? 'MVNO' : 'MNO'}</span>
        </div>
        <div class="price">${formatRub(t.price)}</div>
        <div class="pills">
          <span class="pill">${t.gb} ГБ</span>
          <span class="pill">${t.minutes} мин</span>
          <span class="pill">${t.sms} SMS</span>
        </div>
        <a class="connect-link" href="${t.connectUrl}" target="_blank" rel="noopener noreferrer">Перейти к подключению</a>
      </article>
    `,
    )
    .join('');
}

function renderAdminTable() {
  els.adminTableBody.innerHTML = state.tariffs
    .map(
      (t) => `
      <tr>
        <td contenteditable="true" data-field="name" data-id="${t.id}">${t.name}</td>
        <td contenteditable="true" data-field="operator" data-id="${t.id}">${t.operator}</td>
        <td contenteditable="true" data-field="region" data-id="${t.id}">${t.region}</td>
        <td contenteditable="true" data-field="price" data-id="${t.id}">${t.price}</td>
        <td contenteditable="true" data-field="gb" data-id="${t.id}">${t.gb}</td>
        <td contenteditable="true" data-field="minutes" data-id="${t.id}">${t.minutes}</td>
        <td contenteditable="true" data-field="sms" data-id="${t.id}">${t.sms || 0}</td>
        <td contenteditable="true" data-field="isMvno" data-id="${t.id}">${t.isMvno}</td>
        <td><button class="danger-btn" data-delete-id="${t.id}">Удалить</button></td>
      </tr>
    `,
    )
    .join('');
}

function persistTariffs() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tariffs));
}

function renderAll() {
  const filtered = applyFilters();
  renderBestTariff(filtered);
  renderTariffs(filtered);
  renderAdminTable();
}

function bindEvents() {
  els.themeToggle.addEventListener('change', (event) => applyTheme(event.target.checked ? 'dark' : 'light'));
  els.regionFilter.addEventListener('change', (event) => {
    state.filters.region = event.target.value;
    renderAll();
  });

  [
    ['budgetFilter', 'budget', 'budgetValue', (v) => `до ${v} ₽`],
    ['minGbFilter', 'minGb', 'minGbValue', (v) => `от ${v} ГБ`],
    ['minMinutesFilter', 'minMinutes', 'minMinutesValue', (v) => `от ${v} минут`],
    ['minSmsFilter', 'minSms', 'minSmsValue', (v) => `от ${v} SMS`],
  ].forEach(([id, key, valueId, format]) => {
    els[id].addEventListener('input', (event) => {
      const value = Number(event.target.value);
      state.filters[key] = value;
      els[valueId].textContent = format(value);
      renderAll();
    });
  });

  els.socialFilter.addEventListener('change', (event) => {
    state.filters.needSocial = event.target.checked;
    renderAll();
  });

  els.roamingFilter.addEventListener('change', (event) => {
    state.filters.needRoaming = event.target.checked;
    renderAll();
  });

  els.showAllRegionalFilter.addEventListener('change', (event) => {
    state.filters.showAllRegional = event.target.checked;
    renderAll();
  });

  els.tariffGrid.addEventListener('click', (event) => {
    const card = event.target.closest('.tariff-card');
    if (!card || event.target.closest('a')) return;
    window.open(card.dataset.connectUrl, '_blank', 'noopener,noreferrer');
  });

  els.tariffGrid.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const card = event.target.closest('.tariff-card');
    if (!card) return;
    window.open(card.dataset.connectUrl, '_blank', 'noopener,noreferrer');
  });

  els.refreshBtn.addEventListener('click', () => loadTariffs());
  setInterval(loadTariffs, AUTO_REFRESH_MS);
  els.adminBtn.addEventListener('click', () => els.adminDialog.showModal());

  els.adminTableBody.addEventListener(
    'blur',
    (event) => {
      const { id, field } = event.target.dataset;
      if (!id || !field) return;
      const tariff = state.tariffs.find((t) => t.id === id);
      if (!tariff) return;

      const raw = event.target.textContent.trim();
      if (['price', 'gb', 'minutes', 'sms'].includes(field)) tariff[field] = Number(raw) || 0;
      else if (['isMvno'].includes(field)) tariff[field] = ['true', '1', 'да'].includes(raw.toLowerCase());
      else tariff[field] = raw;

      persistTariffs();
      initRegionFilter();
      renderAll();
    },
    true,
  );

  els.adminTableBody.addEventListener('click', (event) => {
    const id = event.target.dataset.deleteId;
    if (!id) return;
    state.tariffs = state.tariffs.filter((t) => t.id !== id);
    persistTariffs();
    initRegionFilter();
    renderAll();
  });

  els.seedDataBtn.addEventListener('click', async () => {
    localStorage.removeItem(STORAGE_KEY);
    await loadTariffs();
  });

  els.exportBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state.tariffs, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tariffs-export.json';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  els.importInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const parsed = JSON.parse(await file.text());
    if (!Array.isArray(parsed)) return;
    state.tariffs = parsed;
    persistTariffs();
    initRegionFilter();
    renderAll();
  });
}

function mapCityToRegion(city = '') {
  const normalized = city.toLowerCase();
  if (normalized.includes('moscow') || normalized.includes('моск')) return 'Москва';
  if (normalized.includes('saint petersburg') || normalized.includes('петербург')) return 'Санкт-Петербург';
  if (normalized.includes('kazan') || normalized.includes('казан')) return 'Казань';
  if (normalized.includes('yekaterinburg') || normalized.includes('екатерин')) return 'Екатеринбург';
  if (normalized.includes('novosibirsk') || normalized.includes('новосибир')) return 'Новосибирск';
  return DEFAULT_REGION;
}

async function detectUserRegion() {
  const fallback = () => {
    state.filters.region = DEFAULT_REGION;
    els.detectedRegionText.textContent = 'Показываем подходящие тарифы в Москве (регион по умолчанию).';
    if (els.regionFilter.querySelector(`option[value="${DEFAULT_REGION}"]`)) els.regionFilter.value = DEFAULT_REGION;
    renderAll();
  };

  if (!navigator.geolocation) return fallback();

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
        const response = await fetch(url);
        const data = await response.json();
        const city = data.address?.city || data.address?.town || data.address?.state || '';
        const region = mapCityToRegion(city);
        state.filters.region = region;
        if (els.regionFilter.querySelector(`option[value="${region}"]`)) {
          els.regionFilter.value = region;
          els.detectedRegionText.textContent = `Определили ваш регион: ${region}. Подобрали тарифы именно для него.`;
        } else {
          state.filters.region = DEFAULT_REGION;
          els.regionFilter.value = DEFAULT_REGION;
          els.detectedRegionText.textContent = 'Не нашли регион в каталоге. Показываем тарифы в Москве.';
        }
        renderAll();
      } catch {
        fallback();
      }
    },
    fallback,
    { timeout: 7000 },
  );
}

async function loadTariffs() {
  try {
    const { tariffs, source } = await fetchLatestTariffs();
    state.tariffs = tariffs.map((t) => ({ ...t, sms: t.sms ?? 100 }));
    initRegionFilter();
    renderAll();
    els.updateStatus.textContent = `Последнее обновление: ${new Date().toLocaleString('ru-RU')} • Источник: ${source}`;
    detectUserRegion();
  } catch (error) {
    els.updateStatus.textContent = `Ошибка обновления: ${error.message}`;
  }
}

initTheme();
bindEvents();
loadTariffs();
