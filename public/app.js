const trapList = document.getElementById('trap-list');
const detectionsContainer = document.getElementById('detections');
const detail = document.getElementById('detail');
const detailPanel = document.getElementById('detail-panel');
const status = document.getElementById('status');
const trapDialog = document.getElementById('trap-dialog');
const notifyEnabled = document.getElementById('notify-enabled');
const notifyObjects = document.getElementById('notify-objects');
const notifyActions = document.getElementById('notify-actions');
const saveSettingsButton = document.getElementById('save-settings');

const state = {
  traps: [],
  detections: [],
  selectedTrapId: null,
  selectedDetectionId: null,
  objectFilters: new Set(['animal', 'person', 'vehicle', 'unknown']),
  notificationSettings: {
    enabled: true,
    objectTypes: ['animal', 'person', 'vehicle'],
    actions: ['movement']
  }
};

const notificationOptions = {
  objectTypes: ['animal', 'person', 'vehicle', 'unknown'],
  actions: ['movement', 'sound', 'other']
};

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Ошибка запроса');
  }
  return response.json();
}

function createTrapCard(trap) {
  const card = document.createElement('button');
  card.className = 'trap-card';
  card.dataset.id = trap.id;
  card.innerHTML = `
    <div>
      <h3>${trap.name}</h3>
      <p>${trap.email}</p>
    </div>
    <div class="trap-meta">
      <span class="badge">${trap.id.slice(0, 6)}</span>
      <button class="icon-button" data-delete title="Удалить фотоловушку">✕</button>
    </div>
  `;
  card.addEventListener('click', () => {
    state.selectedTrapId = trap.id;
    renderTraps();
    loadDetections();
    loadNotificationSettings();
  });
  const deleteButton = card.querySelector('[data-delete]');
  deleteButton.addEventListener('click', async (event) => {
    event.stopPropagation();
    const confirmed = confirm(`Удалить фотоловушку "${trap.name}"?`);
    if (!confirmed) {
      return;
    }
    await fetchJson(`/api/traps/${trap.id}`, { method: 'DELETE' });
    if (state.selectedTrapId === trap.id) {
      state.selectedTrapId = null;
      state.selectedDetectionId = null;
    }
    await loadTraps();
    await loadDetections();
    await loadNotificationSettings();
  });
  return card;
}

function renderTraps() {
  trapList.innerHTML = '';
  state.traps.forEach((trap) => {
    const card = createTrapCard(trap);
    if (trap.id === state.selectedTrapId) {
      card.classList.add('active');
    }
    trapList.appendChild(card);
  });
}

function renderDetections() {
  detectionsContainer.innerHTML = '';
  const filtered = state.detections.filter((item) => {
    const objects = item.analysis.objects.map((obj) => obj.type);
    return objects.some((obj) => state.objectFilters.has(obj));
  });

  if (filtered.length === 0) {
    detectionsContainer.innerHTML = '<p class="empty">Нет детекций под выбранные фильтры.</p>';
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'detection-card';
    card.dataset.id = item.id;
    const isVideo = item.media_type.startsWith('video');
    card.innerHTML = `
      <div class="thumb">
        ${
          isVideo
            ? `<video src="${item.media_url}" muted preload="metadata"></video>`
            : `<img src="${item.media_url}" alt="${item.filename}" />`
        }
      </div>
      <div class="card-body">
        <h3>${item.filename}</h3>
        <p>${new Date(item.received_at).toLocaleString()}</p>
        <p class="summary">${item.analysis.summary}</p>
        <div class="tags">${item.analysis.objects
          .map((obj) => `<span>${obj.type}</span>`)
          .join('')}</div>
      </div>
    `;
    card.addEventListener('click', () => selectDetection(item.id));
    detectionsContainer.appendChild(card);
  });
}

function renderDetail() {
  const item = state.detections.find((det) => det.id === state.selectedDetectionId);
  if (!item) {
    detail.innerHTML = '<p class="empty">Выберите детекцию, чтобы посмотреть детали.</p>';
    return;
  }

  const isVideo = item.media_type.startsWith('video');

  detail.innerHTML = `
    <div class="detail-media">
      ${
        isVideo
          ? `<video controls src="${item.media_url}"></video>`
          : `<img src="${item.media_url}" alt="${item.filename}" />`
      }
    </div>
    <div class="detail-meta">
      <h3>${item.filename}</h3>
      <p><strong>Время:</strong> ${new Date(item.received_at).toLocaleString()}</p>
      <p><strong>Тип:</strong> ${item.media_type}</p>
      <p><strong>Интерпретация:</strong> ${item.analysis.summary}</p>
      <div class="tags">${item.analysis.objects
        .map((obj) => `<span>${obj.type} · ${Math.round(obj.confidence * 100)}%</span>`)
        .join('')}</div>
      <div class="actions">
        <a class="ghost" href="${item.media_url}" download>Скачать</a>
        <button class="ghost" data-share>Поделиться</button>
      </div>
    </div>
  `;

  detail.querySelector('[data-share]').addEventListener('click', async () => {
    const url = `${window.location.origin}${item.media_url}`;
    if (navigator.share) {
      await navigator.share({ title: item.filename, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    alert('Ссылка скопирована');
  });
}

function renderNotificationSettings() {
  notifyEnabled.checked = state.notificationSettings.enabled;

  notifyObjects.innerHTML = '';
  notifyActions.innerHTML = '';

  notificationOptions.objectTypes.forEach((type) => {
    const pill = document.createElement('button');
    pill.className = 'pill';
    pill.textContent = type;
    if (state.notificationSettings.objectTypes.includes(type)) {
      pill.classList.add('active');
    }
    pill.addEventListener('click', () => {
      toggleSetting('objectTypes', type, pill);
    });
    notifyObjects.appendChild(pill);
  });

  notificationOptions.actions.forEach((action) => {
    const pill = document.createElement('button');
    pill.className = 'pill';
    pill.textContent = action;
    if (state.notificationSettings.actions.includes(action)) {
      pill.classList.add('active');
    }
    pill.addEventListener('click', () => {
      toggleSetting('actions', action, pill);
    });
    notifyActions.appendChild(pill);
  });
}

function toggleSetting(key, value, pill) {
  const list = new Set(state.notificationSettings[key]);
  if (list.has(value)) {
    list.delete(value);
    pill.classList.remove('active');
  } else {
    list.add(value);
    pill.classList.add('active');
  }
  state.notificationSettings[key] = Array.from(list);
}

async function loadTraps() {
  state.traps = await fetchJson('/api/traps');
  if (!state.selectedTrapId && state.traps.length > 0) {
    state.selectedTrapId = state.traps[0].id;
  }
  renderTraps();
}

async function loadDetections() {
  const search = document.getElementById('search').value;
  const mediaType = document.getElementById('media-type').value;
  const params = new URLSearchParams();
  if (state.selectedTrapId) {
    params.set('trapId', state.selectedTrapId);
  }
  if (search) {
    params.set('search', search);
  }
  if (mediaType) {
    params.set('mediaType', mediaType);
  }

  const query = params.toString();
  state.detections = await fetchJson(`/api/detections?${query}`);
  renderDetections();
  renderDetail();
}

async function loadNotificationSettings() {
  if (!state.selectedTrapId) {
    return;
  }
  const settings = await fetchJson(`/api/traps/${state.selectedTrapId}/settings`);
  state.notificationSettings = {
    enabled: settings.enabled,
    objectTypes: settings.objectTypes,
    actions: settings.actions
  };
  renderNotificationSettings();
}

async function saveNotificationSettings() {
  if (!state.selectedTrapId) {
    return;
  }
  state.notificationSettings.enabled = notifyEnabled.checked;
  await fetchJson(`/api/traps/${state.selectedTrapId}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state.notificationSettings)
  });
  alert('Настройки сохранены');
}

function selectDetection(id) {
  state.selectedDetectionId = id;
  renderDetail();
  detailPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setupFilters() {
  const objectFilter = document.getElementById('object-filter');
  const options = ['animal', 'person', 'vehicle', 'unknown'];
  options.forEach((option) => {
    const pill = document.createElement('button');
    pill.className = 'pill active';
    pill.textContent = option;
    pill.addEventListener('click', () => {
      if (state.objectFilters.has(option)) {
        state.objectFilters.delete(option);
        pill.classList.remove('active');
      } else {
        state.objectFilters.add(option);
        pill.classList.add('active');
      }
      renderDetections();
    });
    objectFilter.appendChild(pill);
  });
}

function setupDialog() {
  document.getElementById('add-trap').addEventListener('click', () => {
    trapDialog.showModal();
  });

  trapDialog.addEventListener('close', async () => {
    if (trapDialog.returnValue !== 'submit') {
      return;
    }
    const form = trapDialog.querySelector('form');
    const formData = new FormData(form);
    await fetchJson('/api/traps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email')
      })
    });
    form.reset();
    await loadTraps();
    await loadNotificationSettings();
  });
}

function setupNotifications() {
  document.getElementById('enable-notifications').addEventListener('click', async () => {
    if (!('Notification' in window)) {
      alert('Уведомления не поддерживаются в этом браузере.');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('Разрешение на уведомления не предоставлено.');
      return;
    }
    alert('Уведомления включены!');
  });

  saveSettingsButton.addEventListener('click', saveNotificationSettings);
}

function setupSearch() {
  document.getElementById('search').addEventListener('input', loadDetections);
  document.getElementById('media-type').addEventListener('change', loadDetections);
  document.getElementById('refresh').addEventListener('click', loadDetections);
}

function passesNotificationFilters(analysis) {
  if (!state.notificationSettings.enabled) {
    return false;
  }
  const objectMatch = analysis.objects.some((obj) =>
    state.notificationSettings.objectTypes.includes(obj.type)
  );
  const actionMatch = analysis.objects.some((obj) =>
    state.notificationSettings.actions.includes(obj.action)
  );
  return objectMatch && actionMatch;
}

function setupStream() {
  const stream = new EventSource('/api/stream');
  stream.addEventListener('detection', (event) => {
    const payload = JSON.parse(event.data);
    status.textContent = 'Получена новая детекция';
    if (
      Notification.permission === 'granted' &&
      payload.analysis &&
      passesNotificationFilters(payload.analysis)
    ) {
      new Notification('Новая детекция', {
        body: payload.filename || 'Поступили новые данные'
      });
    }
    loadDetections();
  });
}

(async function init() {
  setupFilters();
  setupDialog();
  setupNotifications();
  setupSearch();
  await loadTraps();
  await loadDetections();
  await loadNotificationSettings();
  setupStream();
})();
