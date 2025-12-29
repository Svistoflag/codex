const demoData = {
  cases: [
    {
      id: "101",
      title: "Дело №101: группировка условного города Альфа",
      status: "в работе",
      summary: "Анализ серии связанных эпизодов, связанных с логистикой и фиктивными организациями.",
      persons: [
        {
          name: "Серов Владислав Игоревич",
          birth: "1989",
          city: "Альфа",
          ids: "ID-LGT-001",
          traits: "Гражданство: РФ",
          photoNote: "Фото 2 (демо)"
        },
        {
          name: "Миллер Анна Сергеевна",
          birth: "1992",
          city: "Альфа",
          ids: "ID-LGT-002",
          traits: "Гражданство: РФ",
          photoNote: "Фото 1 (демо)"
        },
        {
          name: "Поляков Тимур Аркадьевич",
          birth: "1984",
          city: "Бета",
          ids: "ID-LGT-003",
          traits: "Гражданство: РФ",
          photoNote: "Фото 3 (демо)"
        }
      ],
      events: [
        "Регистрация организации «Север-Логистик» — 12.02.2024",
        "Встреча в районе промзоны Альфа — 05.03.2024",
        "Поездка на авто AX-4127 — 17.03.2024"
      ],
      links: [
        "Совместное проживание: Серов ↔ Миллер",
        "Общий транспорт: AX-4127",
        "Общая организация: «Север-Логистик»"
      ]
    },
    {
      id: "202",
      title: "Дело №202: серия краж в районе Бета",
      status: "в работе",
      summary: "Аналитика по эпизодам с пересечением по транспорту и адресам.",
      persons: [
        {
          name: "Ковалёв Илья Романович",
          birth: "1995",
          city: "Бета",
          ids: "ID-LGT-021",
          traits: "Гражданство: РФ",
          photoNote: "Фото 1 (демо)"
        },
        {
          name: "Латыпова Дарья Алексеевна",
          birth: "1990",
          city: "Бета",
          ids: "ID-LGT-022",
          traits: "Гражданство: РФ",
          photoNote: "Фото 2 (демо)"
        },
        {
          name: "Чернов Егор Николаевич",
          birth: "1987",
          city: "Гамма",
          ids: "ID-LGT-023",
          traits: "Гражданство: РФ",
          photoNote: "Фото 2 (демо)"
        }
      ],
      events: [
        "Публикация в соцсети о продаже техники — 21.02.2024",
        "Контакт по телефону +7 900 120-43-10 — 28.02.2024",
        "Перемещение в сектор Бета-Запад — 02.03.2024"
      ],
      links: [
        "Пересечение по адресу: ул. Вернадского, 18",
        "Совместное владение устройством ID-DVC-44",
        "Контакт через аккаунт VK «beta_ghost»"
      ]
    },
    {
      id: "303",
      title: "Дело №303: мониторинг медиа-активности города Гамма",
      status: "черновик",
      summary: "Проверка публичной активности и связей через соцсети и публичные реестры.",
      persons: [
        {
          name: "Грачёв Матвей Дмитриевич",
          birth: "1998",
          city: "Гамма",
          ids: "ID-LGT-031",
          traits: "Гражданство: РФ",
          photoNote: "Фото 1 (демо)"
        },
        {
          name: "Зорина Мария Павловна",
          birth: "1994",
          city: "Гамма",
          ids: "ID-LGT-032",
          traits: "Гражданство: РФ",
          photoNote: "Фото 3 (демо)"
        },
        {
          name: "Нестеров Владлен Олегович",
          birth: "1985",
          city: "Дельта",
          ids: "ID-LGT-033",
          traits: "Гражданство: РФ",
          photoNote: "Фото 1 (демо)"
        }
      ],
      events: [
        "Регистрация аккаунта в соцсети «gamma_line» — 14.01.2024",
        "Публикация про встречу сообщества — 09.02.2024",
        "Упоминание на площадке OSINT — 11.02.2024"
      ],
      links: [
        "Пересечение по гео: парк Гамма-Центр",
        "Общая организация: «Гамма-Медиа»",
        "Контакт через аккаунт TG «gamma_watch»"
      ]
    }
  ],
  entities: [
    {
      title: "Фигурант (Person)",
      items: [
        "ФИО и варианты написания",
        "Дата/год рождения",
        "Фото (несколько)",
        "Идентификаторы и атрибуты"
      ]
    },
    {
      title: "Дело (Case)",
      items: [
        "Уникальный ID",
        "Фигуранты и события",
        "Статус дела",
        "Связанные документы"
      ]
    },
    {
      title: "Объект (Object)",
      items: [
        "Транспорт, адрес, организация",
        "Устройства и аккаунты",
        "Гибкий набор атрибутов"
      ]
    },
    {
      title: "Событие (Event)",
      items: [
        "Тип, время, место",
        "Участники и объекты",
        "Источник данных"
      ]
    },
    {
      title: "Источник (Source)",
      items: [
        "Тип источника",
        "Описание данных",
        "Требование логирования"
      ]
    },
    {
      title: "Отчёт (Report)",
      items: [
        "Привязка к делу/фигуранту",
        "Факты, выводы, гипотезы",
        "Статус утверждения"
      ]
    },
    {
      title: "Гипотеза (Hypothesis)",
      items: [
        "Формулировка и статус",
        "Аргументы «за»/«против»",
        "Уровень уверенности"
      ]
    },
    {
      title: "Связь (Link)",
      items: [
        "Тип связи",
        "Участники",
        "Временной интервал"
      ]
    },
    {
      title: "Заметка (Note)",
      items: [
        "Привязка к любой сущности",
        "Тип и важность",
        "Автор и время"
      ]
    }
  ],
  sources: [
    {
      id: "HIMERA",
      types: "ФИО, авто, адрес",
      data: "События, адреса, документы",
      rate: "Лимит по договору",
      log: "Запись всех запросов"
    },
    {
      id: "SHERLOCK",
      types: "Профили, никнеймы",
      data: "Публичные аккаунты",
      rate: "Регламент 60/мин",
      log: "Журнал обращений"
    },
    {
      id: "VK_API",
      types: "Профиль, группы",
      data: "Посты, комментарии",
      rate: "Внутренний лимит",
      log: "Кто и когда"
    },
    {
      id: "INTERNAL_REG",
      types: "Внутренний ID",
      data: "Документы и события",
      rate: "Внутренний регламент",
      log: "Трассировка доступа"
    },
    {
      id: "OSINT_PUBLIC",
      types: "Публичные реестры",
      data: "Адреса и упоминания",
      rate: "Умеренный",
      log: "Регистрация запросов"
    }
  ],
  agents: [
    {
      name: "Агент-разведчик",
      desc: "Собирает данные из источников и складирует без интерпретации."
    },
    {
      name: "Агент-фильтратор",
      desc: "Удаляет повторы, помечает сомнительные записи."
    },
    {
      name: "Агент-аналитик",
      desc: "Строит связи, формирует кластеры и версии."
    },
    {
      name: "Агент-скептик",
      desc: "Проверяет гипотезы, ищет противоречия."
    },
    {
      name: "Агент-редактор",
      desc: "Формирует отчёты по шаблону LEGAT."
    }
  ],
  thoughtTree: [
    "Версия А: единая логистическая сеть",
    "Версия B: локальные исполнители",
    "Версия C: параллельные эпизоды без связи"
  ],
  thoughtTimeline: [
    "12.02.2024 — добавлена гипотеза о связях через транспорт",
    "05.03.2024 — уровень уверенности повышен до среднего",
    "07.03.2024 — агент-скептик отметил конфликт по времени",
    "10.03.2024 — версия B признана активной"
  ],
  eventTimeline: [
    "12.02.2024 — регистрация организации",
    "21.02.2024 — публикация о продаже техники",
    "02.03.2024 — перемещение в сектор Бета-Запад",
    "05.03.2024 — встреча в промзоне Альфа"
  ],
  linkGraph: [
    "Серов ↔ Миллер — совместное проживание",
    "Ковалёв ↔ Латыпова — общий адрес",
    "Грачёв ↔ Нестеров — общая организация"
  ],
  geoMap: [
    "Альфа — ул. Северная, 12",
    "Бета — район Западный",
    "Гамма — парк Гамма-Центр"
  ],
  personProfile: {
    name: "Серов Владислав Игоревич",
    info: "1989 • Альфа • ID-LGT-001",
    summary: "Ключевой фигурант дела №101, отмечены связи с транспортом и организацией.",
    contacts: ["+7 900 555-01-12", "serov.alpha@mail.demo"],
    addresses: ["Альфа, ул. Северная, 12", "Альфа, пер. Лесной, 7"],
    vehicles: ["Sedan AX-4127", "Микроавтобус LV-2110"],
    organizations: ["«Север-Логистик» — учредитель"],
    accounts: ["VK: alpha_serov", "TG: serov_log"],
    links: ["Общий адрес с Миллер А.С.", "Совместные события 02-05.03.2024"],
    events: ["Регистрация ООО — 12.02.2024", "Поездка — 17.03.2024"],
    geo: ["Промзона Альфа", "Сектор Альфа-Север"],
    social: ["Темы: логистика, техника", "Пик активности: вечер"],
    reports: ["Отчёт LEGAT-101-01 (утверждён)", "Отчёт LEGAT-101-02 (черновик)"],
    hypotheses: ["Связь через транспорт — средняя уверенность", "Общая организация — высокая уверенность"]
  },
  audit: [
    "05.03.2024 18:20 — Аналитик создал гипотезу H-101",
    "05.03.2024 19:10 — Агент-аналитик добавил 3 связи",
    "07.03.2024 09:05 — Агент-скептик отметил противоречие",
    "08.03.2024 15:40 — Руководитель утвердил отчёт LEGAT-101-01"
  ]
};

const fieldList = document.getElementById("fieldList");
const savedQueries = document.getElementById("savedQueries");
const fieldType = document.getElementById("fieldType");
const fieldValue = document.getElementById("fieldValue");
const addField = document.getElementById("addField");
const saveQuery = document.getElementById("saveQuery");
const startSearch = document.getElementById("startSearch");

const fields = [];
const queries = [];

const labels = {
  fio: "ФИО",
  birth: "Год рождения",
  phone: "Телефон",
  email: "Email",
  plate: "Номер авто",
  address: "Адрес",
  social: "Никнейм / ID",
  link: "Ссылка",
  photo: "Фото",
  internal: "Внутренний ID"
};

function renderFields() {
  fieldList.innerHTML = "";
  if (fields.length === 0) {
    fieldList.innerHTML = "<p class=\"muted\">Поля не добавлены.</p>";
    return;
  }
  fields.forEach((field, index) => {
    const div = document.createElement("div");
    div.className = "field-pill";
    div.innerHTML = `<span>${labels[field.type]}: ${field.value}</span><button data-index="${index}">✕</button>`;
    div.querySelector("button").addEventListener("click", () => {
      fields.splice(index, 1);
      renderFields();
    });
    fieldList.appendChild(div);
  });
}

function renderQueries() {
  savedQueries.innerHTML = "";
  if (queries.length === 0) {
    savedQueries.innerHTML = "<p class=\"muted\">Нет сохранённых запросов.</p>";
    return;
  }
  queries.forEach((query) => {
    const div = document.createElement("div");
    div.className = "saved__item";
    div.innerHTML = `
      <strong>${query.title}</strong>
      <div>${query.fields.map((field) => `${labels[field.type]}: ${field.value}`).join(" • ")}</div>
      <small>Привязка: ${query.case}</small>
    `;
    savedQueries.appendChild(div);
  });
}

addField.addEventListener("click", () => {
  if (!fieldValue.value.trim()) return;
  fields.push({ type: fieldType.value, value: fieldValue.value.trim() });
  fieldValue.value = "";
  renderFields();
});

saveQuery.addEventListener("click", () => {
  if (fields.length === 0) return;
  const query = {
    title: `Запрос #${queries.length + 1}`,
    fields: [...fields],
    case: demoData.cases[0].title
  };
  queries.unshift(query);
  fields.length = 0;
  renderFields();
  renderQueries();
});

startSearch.addEventListener("click", () => {
  if (fields.length === 0) return;
  alert("Запуск агентов сбора данных и привязка к делу выполнены (демо).");
});

function renderEntities() {
  const grid = document.getElementById("entityGrid");
  grid.innerHTML = "";
  demoData.entities.forEach((entity) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${entity.title}</h3><ul>${entity.items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
    grid.appendChild(card);
  });
}

function renderCases() {
  const board = document.getElementById("caseBoard");
  board.innerHTML = "";
  demoData.cases.forEach((caseItem) => {
    const div = document.createElement("div");
    div.className = "case";
    div.innerHTML = `
      <div class="case__header">
        <div>
          <h3>${caseItem.title}</h3>
          <p class="muted">${caseItem.summary}</p>
        </div>
        <span class="badge">${caseItem.status}</span>
      </div>
      <div>
        <strong>Фигуранты</strong>
        <div class="case__people">
          ${caseItem.persons
            .map(
              (person) => `
              <div class="person-card">
                <strong>${person.name}</strong>
                <span>${person.birth} • ${person.city}</span>
                <span>${person.ids}</span>
                <span>${person.traits}</span>
                <small>${person.photoNote}</small>
              </div>`
            )
            .join("")}
        </div>
      </div>
      <div>
        <strong>События</strong>
        <div class="case__events">
          ${caseItem.events.map((event) => `<div class="person-card">${event}</div>`).join("")}
        </div>
      </div>
      <div>
        <strong>Связи</strong>
        <ul>
          ${caseItem.links.map((link) => `<li>${link}</li>`).join("")}
        </ul>
      </div>
    `;
    board.appendChild(div);
  });
}

function renderSources() {
  const grid = document.getElementById("sourceGrid");
  grid.innerHTML = "";
  demoData.sources.forEach((source) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${source.id}</h3>
      <ul>
        <li><strong>Запросы:</strong> ${source.types}</li>
        <li><strong>Данные:</strong> ${source.data}</li>
        <li><strong>Лимит:</strong> ${source.rate}</li>
        <li><strong>Логирование:</strong> ${source.log}</li>
      </ul>
    `;
    grid.appendChild(card);
  });
}

function renderAgents() {
  const grid = document.getElementById("agentGrid");
  grid.innerHTML = "";
  demoData.agents.forEach((agent) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${agent.name}</h3><p>${agent.desc}</p>`;
    grid.appendChild(card);
  });
}

function renderThoughtLayer() {
  const tree = document.getElementById("versionTree");
  const timeline = document.getElementById("thoughtTimeline");
  tree.innerHTML = demoData.thoughtTree
    .map((item) => `<div class="tree__node">${item}</div>`)
    .join("");
  timeline.innerHTML = demoData.thoughtTimeline
    .map((item) => `<div class="timeline__item">${item}</div>`)
    .join("");
}

function renderVisuals() {
  const linkGraph = document.getElementById("linkGraph");
  const eventTimeline = document.getElementById("eventTimeline");
  const geoMap = document.getElementById("geoMap");

  linkGraph.innerHTML = demoData.linkGraph.map((item) => `<div>${item}</div>`).join("");
  eventTimeline.innerHTML = demoData.eventTimeline
    .map((item) => `<div class="timeline__item">${item}</div>`)
    .join("");
  geoMap.innerHTML = demoData.geoMap.map((item) => `<div>${item}</div>`).join("");
}

function renderProfile() {
  const profile = document.getElementById("personProfile");
  const data = demoData.personProfile;
  profile.innerHTML = `
    <div class="profile__header">
      <div class="profile__avatar">
        <h3>${data.name}</h3>
        <p>${data.info}</p>
      </div>
      <div class="card">
        <h3>Краткая сводка</h3>
        <p>${data.summary}</p>
      </div>
    </div>
    <div class="profile__tabs">
      <div class="profile__tab">
        <h4>Данные</h4>
        <p><strong>Контакты:</strong> ${data.contacts.join(", ")}</p>
        <p><strong>Адреса:</strong> ${data.addresses.join("; ")}</p>
        <p><strong>Транспорт:</strong> ${data.vehicles.join(", ")}</p>
      </div>
      <div class="profile__tab">
        <h4>Организации и аккаунты</h4>
        <p><strong>Организации:</strong> ${data.organizations.join(", ")}</p>
        <p><strong>Соцсети:</strong> ${data.accounts.join(", ")}</p>
      </div>
      <div class="profile__tab">
        <h4>Связи</h4>
        <ul>${data.links.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="profile__tab">
        <h4>Время</h4>
        <ul>${data.events.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="profile__tab">
        <h4>Гео</h4>
        <ul>${data.geo.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="profile__tab">
        <h4>Соцсети</h4>
        <ul>${data.social.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="profile__tab">
        <h4>Отчёты</h4>
        <ul>${data.reports.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="profile__tab">
        <h4>Гипотезы</h4>
        <ul>${data.hypotheses.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
    </div>
  `;
}

function renderAudit() {
  const log = document.getElementById("auditLog");
  log.innerHTML = demoData.audit.map((item) => `<div class="log__entry">${item}</div>`).join("");
}

function updateStats() {
  document.getElementById("caseCount").textContent = demoData.cases.length;
  document.getElementById("personCount").textContent = demoData.cases.reduce(
    (acc, item) => acc + item.persons.length,
    0
  );
  document.getElementById("hypothesisCount").textContent =
    demoData.personProfile.hypotheses.length + demoData.thoughtTree.length;
  document.getElementById("sourceCount").textContent = demoData.sources.length;
}

renderFields();
renderQueries();
renderEntities();
renderCases();
renderSources();
renderAgents();
renderThoughtLayer();
renderVisuals();
renderProfile();
renderAudit();
updateStats();
