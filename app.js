const APP_NAME = "AtoZ Group Meeting Room Booking System";
const stores = ["departments", "users", "rooms", "bookings"];
const i18n = {
  en: {
    dashboard: "Dashboard",
    bookings: "Bookings",
    calendar: "Calendar",
    rooms: "Rooms",
    users: "Users",
    departments: "Departments",
    logout: "Logout",
    installPwa: "Install PWA",
    login: "Login",
    usernameEmail: "Username or Email",
    password: "Password",
    loginHelp: "Sign in to book rooms, review schedules, and keep meetings organized.",
    dashboardSub: "Today bookings, pending approvals, and room availability.",
    bookingsSub: "Create requests and approve or cancel reservations.",
    calendarSub: "See booked meeting rooms by date and time.",
    roomsSub: "Manage room capacity, floor, and equipment.",
    usersSub: "Create normal users by department and assign access roles.",
    departmentsSub: "Maintain the company department structure.",
    newBooking: "New booking",
    newRoom: "New room",
    newUser: "New user",
    newDepartment: "New department",
    activeRooms: "Active rooms",
    today: "Today",
    pending: "Pending",
    needApproval: "Need approval",
    utilization: "Utilization",
    approvedToday: "Approved today",
    todaySchedule: "Today Schedule",
    roomAvailability: "Room Availability",
    viewAll: "View all",
    previous: "Previous",
    next: "Next",
    userManagement: "User Management",
    departmentBased: "Department based",
    name: "Name",
    email: "Email",
    role: "Role",
    department: "Department",
    status: "Status",
    edit: "Edit",
    delete: "Delete",
    editUser: "Edit user",
    deleteUser: "Delete user",
    addUser: "Add user",
    editDepartment: "Edit department",
    noUsersYet: "No users yet",
    usersCount: "users",
    bookingsCount: "bookings",
    seats: "seats",
    available: "available",
    busy: "busy",
    busyToday: "Busy today",
    meeting: "Meeting",
    room: "Room",
    time: "Time",
    totalHours: "Total Hours",
    people: "People",
    noBookings: "No bookings found for this view.",
    dateOptional: "Date (optional)",
    allDepartments: "All departments",
    allRooms: "All rooms",
    title: "Title",
    requester: "Requester",
    startTime: "Start time",
    endTime: "End time",
    availability: "Availability",
    checkAvailability: "OK / Check availability",
    attendees: "Attendees",
    purpose: "Purpose",
    saveBooking: "Save booking",
    close: "Close",
    light: "Light",
    dark: "Dark",
    language: "Language",
    theme: "Theme"
  },
  my: {
    dashboard: "ဒက်ရှ်ဘုတ်",
    bookings: "ဘိုကင်များ",
    calendar: "ပြက္ခဒိန်",
    rooms: "အခန်းများ",
    users: "အသုံးပြုသူများ",
    departments: "ဌာနများ",
    logout: "ထွက်မည်",
    installPwa: "PWA ထည့်သွင်းမည်",
    login: "လော့ဂ်အင်",
    usernameEmail: "အသုံးပြုသူအမည် သို့မဟုတ် အီးမေးလ်",
    password: "စကားဝှက်",
    loginHelp: "အခန်းဘိုကင်လုပ်ရန်၊ အချိန်ဇယားစစ်ရန်နှင့် အစည်းအဝေးများ စီမံရန် ဝင်ရောက်ပါ။",
    dashboardSub: "ယနေ့ဘိုကင်များ၊ စောင့်ဆိုင်းနေသောအတည်ပြုချက်များနှင့် အခန်းအသုံးပြုနိုင်မှု။",
    bookingsSub: "ဘိုကင်တောင်းဆိုမှုများ ပြုလုပ်ပြီး အတည်ပြု/ပယ်ဖျက်နိုင်သည်။",
    calendarSub: "နေ့ရက်နှင့်အချိန်အလိုက် booked meeting rooms များကိုကြည့်ရန်။",
    roomsSub: "အခန်း capacity၊ အထပ်နှင့် equipment များစီမံရန်။",
    usersSub: "ဌာနအလိုက် အသုံးပြုသူများနှင့် role များစီမံရန်။",
    departmentsSub: "ကုမ္ပဏီဌာနဖွဲ့စည်းပုံကို စီမံရန်။",
    newBooking: "ဘိုကင်အသစ်",
    newRoom: "အခန်းအသစ်",
    newUser: "အသုံးပြုသူအသစ်",
    newDepartment: "ဌာနအသစ်",
    activeRooms: "အသုံးပြုနေသောအခန်းများ",
    today: "ယနေ့",
    pending: "စောင့်ဆိုင်း",
    needApproval: "အတည်ပြုရန်လို",
    utilization: "အသုံးပြုမှု",
    approvedToday: "ယနေ့အတည်ပြုပြီး",
    todaySchedule: "ယနေ့အချိန်ဇယား",
    roomAvailability: "အခန်းအသုံးပြုနိုင်မှု",
    viewAll: "အားလုံးကြည့်မည်",
    previous: "ယခင်",
    next: "နောက်",
    userManagement: "အသုံးပြုသူစီမံမှု",
    departmentBased: "ဌာနအလိုက်",
    name: "အမည်",
    email: "အီးမေးလ်",
    role: "အဆင့်",
    department: "ဌာန",
    status: "အခြေအနေ",
    edit: "ပြင်မည်",
    delete: "ဖျက်မည်",
    editUser: "အသုံးပြုသူပြင်မည်",
    deleteUser: "အသုံးပြုသူဖျက်မည်",
    addUser: "အသုံးပြုသူထည့်မည်",
    editDepartment: "ဌာနပြင်မည်",
    noUsersYet: "အသုံးပြုသူ မရှိသေးပါ",
    usersCount: "ဦး",
    bookingsCount: "ဘိုကင်",
    seats: "ယောက်",
    available: "အားလပ်",
    busy: "မအား",
    busyToday: "ယနေ့မအားသောအချိန်",
    meeting: "အစည်းအဝေး",
    room: "အခန်း",
    time: "အချိန်",
    totalHours: "စုစုပေါင်းနာရီ",
    people: "လူဦးရေ",
    noBookings: "ဤ view အတွက် ဘိုကင်မရှိပါ။",
    dateOptional: "နေ့ရက် (မဖြည့်လည်းရ)",
    allDepartments: "ဌာနအားလုံး",
    allRooms: "အခန်းအားလုံး",
    title: "ခေါင်းစဉ်",
    requester: "တောင်းဆိုသူ",
    startTime: "စတင်ချိန်",
    endTime: "ပြီးဆုံးချိန်",
    availability: "အသုံးပြုနိုင်မှု",
    checkAvailability: "OK / အခန်းအားလပ်မှုစစ်မည်",
    attendees: "တက်ရောက်သူ",
    purpose: "ရည်ရွယ်ချက်",
    saveBooking: "ဘိုကင်သိမ်းမည်",
    close: "ပိတ်မည်",
    light: "Light",
    dark: "Dark",
    language: "ဘာသာစကား",
    theme: "အရောင်စနစ်"
  }
};

const seed = {
  departments: [
    { id: 1, name: "Administration", code: "ADM" },
    { id: 2, name: "Human Resources", code: "HR" },
    { id: 3, name: "Finance", code: "FIN" },
    { id: 4, name: "Engineering", code: "ENG" },
    { id: 5, name: "Sales", code: "SAL" }
  ],
  users: [
    { id: 1, name: "Admin Manager", username: "admin", email: "admin@company.test", password: "admin123", role: "administrator", departmentId: 1, isActive: true },
    { id: 2, name: "Operations Manager", username: "manager", email: "manager@company.test", password: "manager123", role: "manager", departmentId: 1, isActive: true },
    { id: 3, name: "Aye Aye", username: "aye", email: "aye@company.test", password: "user123", role: "user", departmentId: 2, isActive: true },
    { id: 4, name: "Min Thu", username: "min", email: "min@company.test", password: "user123", role: "user", departmentId: 4, isActive: true }
  ],
  rooms: [
    { id: 1, name: "Board Room", floor: "Level 8", capacity: 18, equipment: "TV, Video Conference, Whiteboard", isActive: true },
    { id: 2, name: "Focus Room", floor: "Level 6", capacity: 6, equipment: "Whiteboard, Speaker", isActive: true },
    { id: 3, name: "Training Hall", floor: "Level 4", capacity: 40, equipment: "Projector, Microphone, Stage", isActive: true }
  ],
  bookings: [
    {
      id: 1,
      title: "Weekly Leadership Sync",
      roomId: 1,
      requesterId: 2,
      departmentId: 1,
      startTime: localDateAt("09:00"),
      endTime: localDateAt("10:00"),
      attendees: 10,
      status: "approved",
      purpose: "Weekly priorities and blockers."
    },
    {
      id: 2,
      title: "Hiring Interview",
      roomId: 2,
      requesterId: 3,
      departmentId: 2,
      startTime: localDateAt("13:30"),
      endTime: localDateAt("14:30"),
      attendees: 4,
      status: "pending",
      purpose: "Candidate panel interview."
    }
  ]
};

const state = {
  view: "dashboard",
  modal: null,
  alert: null,
  currentUser: null,
  bookingDraft: null,
  data: { departments: [], users: [], rooms: [], bookings: [] },
  filters: {
    date: "",
    departmentId: "all",
    roomId: "all",
    status: "all"
  },
  calendarMonth: localDate().slice(0, 7),
  navOpen: false,
  language: localStorage.getItem("roombook-language") || "en",
  theme: localStorage.getItem("roombook-theme") || "light"
};

const navItems = [
  { id: "dashboard", labelKey: "dashboard", icon: "D" },
  { id: "bookings", labelKey: "bookings", icon: "B" },
  { id: "calendar", labelKey: "calendar", icon: "C" },
  { id: "rooms", labelKey: "rooms", icon: "R", managerOnly: true },
  { id: "users", labelKey: "users", icon: "U", managerOnly: true },
  { id: "departments", labelKey: "departments", icon: "P", managerOnly: true }
];

function t(key) {
  return i18n[state.language]?.[key] || i18n.en[key] || key;
}

function applyPreferences() {
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.dataset.lang = state.language;
}

function localDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function localDateAt(time) {
  return `${localDate()}T${time}`;
}

async function loadData() {
  const { departments, users, rooms, bookings } = await apiFetch("/api/data");
  state.data = {
    departments,
    users,
    rooms,
    bookings: bookings.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
  };
}

async function apiFetch(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || "Request failed.");
    error.status = response.status;
    error.payload = payload;
    if (response.status === 401) {
      state.currentUser = null;
      localStorage.removeItem("roombook-current-user");
    }
    throw error;
  }
  return payload;
}

function put(storeName, item) {
  const id = item.id ? Number(item.id) : null;
  return apiFetch(id ? `/api/${storeName}/${id}` : `/api/${storeName}`, {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(item)
  });
}

function remove(storeName, id) {
  return apiFetch(`/api/${storeName}/${Number(id)}`, { method: "DELETE" });
}

function byId(collection, id) {
  return collection.find((item) => Number(item.id) === Number(id));
}

function modalItem(collectionName) {
  if (!state.modal?.id) return null;
  return byId(state.data[collectionName], state.modal.id);
}

function fmtDateTime(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function timeOnly(value) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function bookingHours(booking) {
  const ms = new Date(booking.endTime) - new Date(booking.startTime);
  const hours = Math.max(ms / 3600000, 0);
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hrs`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function optionList(items, selected = "all", allLabel = null) {
  const all = allLabel ? `<option value="all"${selected === "all" ? " selected" : ""}>${allLabel}</option>` : "";
  return all + items.map((item) => `<option value="${item.id}"${Number(selected) === Number(item.id) ? " selected" : ""}>${escapeHtml(item.name)}</option>`).join("");
}

function canManage() {
  return ["administrator", "manager"].includes(state.currentUser?.role);
}

function visibleNavItems() {
  return navItems.filter((item) => !item.managerOnly || canManage());
}

function visibleBookings(bookings = state.data.bookings) {
  if (canManage()) return bookings;
  return bookings.filter((booking) => Number(booking.requesterId) === Number(state.currentUser?.id));
}

function brandMarkup(className = "") {
  return `
    <div class="brand ${className}">
      <img class="brand-logo" src="./assets/atoz-logo.jpeg" alt="AtoZ Group">
      <div>
        <strong>${APP_NAME}</strong>
      </div>
    </div>
  `;
}

function render() {
  applyPreferences();
  const app = document.querySelector("#app");
  if (!state.currentUser) {
    app.innerHTML = loginScreen();
    bindEvents();
    return;
  }
  if (!visibleNavItems().some((item) => item.id === state.view)) {
    state.view = "dashboard";
  }
  const initial = state.currentUser.name.slice(0, 1).toUpperCase();
  app.innerHTML = `
    <div class="shell ${state.navOpen ? "nav-open" : ""}">
      <aside class="sidebar">
        ${brandMarkup()}
        <nav class="nav">
          ${visibleNavItems().map((item) => `
            <button class="${state.view === item.id ? "active" : ""}" data-view="${item.id}" title="${t(item.labelKey)}">
              <span>${item.icon}</span>
              <strong>${t(item.labelKey)}</strong>
            </button>
          `).join("")}
        </nav>
        <div class="profile">
          <div class="switch-panel">
            <label>${t("language")}</label>
            <div class="segmented">
              <button class="${state.language === "en" ? "active" : ""}" data-pref="language" data-value="en">ENG</button>
              <button class="${state.language === "my" ? "active" : ""}" data-pref="language" data-value="my">မြန်မာ</button>
            </div>
            <label>${t("theme")}</label>
            <div class="segmented">
              <button class="${state.theme === "light" ? "active" : ""}" data-pref="theme" data-value="light">${t("light")}</button>
              <button class="${state.theme === "dark" ? "active" : ""}" data-pref="theme" data-value="dark">${t("dark")}</button>
            </div>
          </div>
          <div class="profile-card">
            <div class="avatar">${escapeHtml(initial)}</div>
            <div>
              <strong>${escapeHtml(state.currentUser.name)}</strong>
              <span>${escapeHtml(state.currentUser.email)}</span>
            </div>
          </div>
          <button class="btn ghost full" data-action="logout">${t("logout")}</button>
          <button class="btn secondary full" data-action="install">${t("installPwa")}</button>
        </div>
      </aside>
      <main class="main">
        ${topbar()}
        ${views[state.view]()}
      </main>
    </div>
    ${modal()}
    ${alertDialog()}
    <div class="toast" id="toast"></div>
  `;
  bindEvents();
}

function loginScreen() {
  applyPreferences();
  return `
    <main class="login-page">
      <section class="login-panel">
        ${brandMarkup("login-brand")}
        <div class="login-switches">
          <div class="segmented light">
            <button class="${state.language === "en" ? "active" : ""}" data-pref="language" data-value="en">ENG</button>
            <button class="${state.language === "my" ? "active" : ""}" data-pref="language" data-value="my">မြန်မာ</button>
          </div>
          <div class="segmented light">
            <button class="${state.theme === "light" ? "active" : ""}" data-pref="theme" data-value="light">${t("light")}</button>
            <button class="${state.theme === "dark" ? "active" : ""}" data-pref="theme" data-value="dark">${t("dark")}</button>
          </div>
        </div>
        <div class="login-copy">
          <h1>${t("login")}</h1>
          <p>${t("loginHelp")}</p>
        </div>
        <form data-form="login" class="login-form">
          <div class="field">
            <label>${t("usernameEmail")}</label>
            <input name="login" type="text" value="admin" autocomplete="username" required>
          </div>
          <div class="field">
            <label>${t("password")}</label>
            <input name="password" type="password" value="admin123" autocomplete="current-password" required>
          </div>
          <button class="btn full" type="submit">${t("login")}</button>
        </form>
      </section>
    </main>
    ${alertDialog()}
    <div class="toast" id="toast"></div>
  `;
}

function topbar() {
  const labels = {
    dashboard: [t("dashboard"), t("dashboardSub")],
    bookings: [t("bookings"), t("bookingsSub")],
    calendar: [t("calendar"), t("calendarSub")],
    rooms: [t("rooms"), t("roomsSub")],
    users: [t("users"), t("usersSub")],
    departments: [t("departments"), t("departmentsSub")]
  };
  const [title, subtitle] = labels[state.view];
  const action = {
    dashboard: `<button class="btn" data-modal="booking">${t("newBooking")}</button>`,
    bookings: `<button class="btn" data-modal="booking">${t("newBooking")}</button>`,
    calendar: `<button class="btn" data-modal="booking">${t("newBooking")}</button>`,
    rooms: `<button class="btn" data-modal="room">${t("newRoom")}</button>`,
    users: `<button class="btn" data-modal="user">${t("newUser")}</button>`,
    departments: `<button class="btn" data-modal="department">${t("newDepartment")}</button>`
  }[state.view];

  return `
    <div class="topbar">
      <div>
        <button class="btn secondary mobile-menu" data-action="toggle-nav">=</button>
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>
      <div class="toolbar">${action}</div>
    </div>
  `;
}

const views = {
  dashboard() {
    const today = localDate();
    const scopedBookings = visibleBookings();
    const todaysBookings = scopedBookings.filter((booking) => booking.startTime.startsWith(today));
    const pending = scopedBookings.filter((booking) => booking.status === "pending");
    const approvedToday = todaysBookings.filter((booking) => booking.status === "approved");
    const activeRooms = state.data.rooms.filter((room) => room.isActive);
    const utilization = activeRooms.length ? Math.round((approvedToday.length / activeRooms.length) * 100) : 0;

    return `
      <section class="grid metrics">
        ${metric(t("rooms"), activeRooms.length, t("activeRooms"))}
        ${metric(t("today"), todaysBookings.length, t("bookings"))}
        ${metric(t("pending"), pending.length, t("needApproval"))}
        ${metric(t("utilization"), `${utilization}%`, t("approvedToday"))}
      </section>
      <section class="grid two" style="margin-top:16px">
        <div class="card">
          <div class="section-title">
            <h2>${t("todaySchedule")}</h2>
            <button class="btn ghost" data-view="bookings">${t("viewAll")}</button>
          </div>
          ${bookingTable(todaysBookings)}
        </div>
        <div class="card">
          <div class="section-title">
            <h2>${t("roomAvailability")}</h2>
          </div>
          <div class="room-grid">
            ${activeRooms.map((room) => roomCard(room)).join("")}
          </div>
        </div>
      </section>
    `;
  },
  bookings() {
    const bookings = filteredBookings();
    return `
      <section class="card">
        ${filters()}
        ${bookingTable(bookings)}
      </section>
    `;
  },
  calendar() {
    return `
      <section class="calendar-shell">
        <div class="calendar-toolbar">
          <div class="actions no-margin">
            <button class="btn ghost" data-calendar="prev">${t("previous")}</button>
            <button class="btn ghost" data-calendar="today">${t("today")}</button>
            <button class="btn ghost" data-calendar="next">${t("next")}</button>
          </div>
          <strong>${calendarMonthLabel()}</strong>
        </div>
        <div class="calendar-weekdays">
          ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<span>${day}</span>`).join("")}
        </div>
        <div class="calendar-grid">
          ${calendarCells()}
        </div>
      </section>
    `;
  },
  rooms() {
    return `
      <section class="room-grid">
        ${state.data.rooms.map((room) => roomCard(room, true)).join("")}
      </section>
    `;
  },
  users() {
    return `
      <section class="card">
        <div class="section-title">
          <h2>${t("userManagement")}</h2>
          <span class="status">${t("departmentBased")}</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>${t("name")}</th><th>${t("email")}</th><th>${t("role")}</th><th>${t("department")}</th><th>${t("status")}</th><th></th></tr></thead>
            <tbody>
              ${state.data.users.map((user) => `
                <tr>
                  <td><strong>${escapeHtml(user.name)}</strong></td>
                  <td>${escapeHtml(user.email)}</td>
                  <td><span class="status">${escapeHtml(user.role)}</span></td>
                  <td>${escapeHtml(byId(state.data.departments, user.departmentId)?.name || "-")}</td>
                  <td>${user.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <div class="actions">
                      <button class="btn ghost" data-edit="user" data-id="${user.id}">${t("edit")}</button>
                      <button class="btn ghost" data-delete-user="${user.id}">${t("delete")}</button>
                    </div>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;
  },
  departments() {
    return `
      <section class="user-grid">
        ${state.data.departments.map((department) => {
          const users = state.data.users.filter((user) => Number(user.departmentId) === Number(department.id));
          const bookings = state.data.bookings.filter((booking) => Number(booking.departmentId) === Number(department.id));
          return `
            <article class="card">
              <div class="section-title">
                <h2>${escapeHtml(department.name)}</h2>
                <span class="status">${escapeHtml(department.code)}</span>
              </div>
              <p>${users.length} ${t("usersCount")}, ${bookings.length} ${t("bookingsCount")}</p>
              <div class="department-users">
                ${users.length ? users.map((user) => `
                  <div class="department-user">
                    <div>
                      <strong>${escapeHtml(user.name)}</strong>
                      <span>${escapeHtml(user.email)} - ${escapeHtml(user.role)}</span>
                    </div>
                    <div class="department-user-actions">
                      <button class="btn ghost compact" data-edit="user" data-id="${user.id}">${t("editUser")}</button>
                      <button class="btn ghost compact" data-delete-user="${user.id}">${t("deleteUser")}</button>
                    </div>
                  </div>
                `).join("") : `<div class="department-user empty-row">${t("noUsersYet")}</div>`}
              </div>
              <div class="actions">
                <button class="btn ghost" data-modal="assign-user" data-department="${department.id}">${t("addUser")}</button>
                <button class="btn ghost" data-edit="department" data-id="${department.id}">${t("editDepartment")}</button>
                <button class="btn ghost" data-delete-department="${department.id}">${t("delete")}</button>
              </div>
            </article>
          `;
        }).join("")}
      </section>
    `;
  }
};

function metric(label, value, detail) {
  return `<div class="metric"><span>${label}</span><strong>${value}</strong><span>${detail}</span></div>`;
}

function calendarMonthLabel() {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(`${state.calendarMonth}-01T00:00`));
}

function calendarCells() {
  const firstDay = new Date(`${state.calendarMonth}-01T00:00`);
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - firstDay.getDay());
  const today = localDate();
  const month = state.calendarMonth;

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const dateKey = toDateKey(date);
    const bookings = state.data.bookings
      .filter((booking) => booking.startTime.startsWith(dateKey))
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    const isOtherMonth = !dateKey.startsWith(month);
    const isToday = dateKey === today;

    return `
      <article class="calendar-cell ${isOtherMonth ? "muted" : ""} ${isToday ? "today" : ""}">
        <div class="calendar-cell-head">
          <strong>${date.getDate()}</strong>
          ${isToday ? `<span class="status approved">today</span>` : ""}
        </div>
        <div class="calendar-cell-events">
          ${bookings.map((booking) => calendarEventPill(booking)).join("")}
        </div>
      </article>
    `;
  }).join("");
}

function calendarEventPill(booking) {
  const room = byId(state.data.rooms, booking.roomId);
  return `
    <div class="calendar-pill ${booking.status}">
      <strong>${timeOnly(booking.startTime)} ${escapeHtml(booking.title)}</strong>
      <span>${escapeHtml(room?.name || "-")} - ${booking.status}</span>
    </div>
  `;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function roomCard(room, editable = false) {
  const today = localDate();
  const bookings = state.data.bookings.filter((booking) => Number(booking.roomId) === Number(room.id) && booking.status !== "cancelled");
  const todaysBusyBookings = bookings
    .filter((booking) => booking.startTime.startsWith(today))
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  return `
    <article class="room-card">
      <div>
        <div class="section-title">
          <h3>${escapeHtml(room.name)}</h3>
          <span class="status">${room.capacity} ${t("seats")}</span>
        </div>
        <p>${escapeHtml(room.floor)}</p>
        <div class="chips">
          ${room.equipment.split(",").map((item) => `<span class="chip">${escapeHtml(item.trim())}</span>`).join("")}
        </div>
        ${todaysBusyBookings.length ? `
          <div class="busy-slots">
            <strong>${t("busyToday")}</strong>
            ${todaysBusyBookings.map((booking) => `
              <div class="busy-slot">
                <span>${timeOnly(booking.startTime)} - ${timeOnly(booking.endTime)}</span>
                <small>${escapeHtml(booking.title)}</small>
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>
      <div class="actions">
        <span class="status ${todaysBusyBookings.length ? "busy" : "approved"}">${todaysBusyBookings.length ? t("busy") : t("available")}</span>
        ${editable ? `
          <button class="btn ghost" data-edit="room" data-id="${room.id}">Edit</button>
          <button class="btn ghost" data-delete-room="${room.id}">Delete</button>
        ` : ""}
      </div>
    </article>
  `;
}

function filters() {
  return `
    <div class="filters">
      <div class="field">
        <label>Date (optional)</label>
        <input type="date" data-filter="date" value="${state.filters.date}" title="Leave empty to show all dates">
      </div>
      <div class="field">
        <label>Department</label>
        <select data-filter="departmentId">${optionList(state.data.departments, state.filters.departmentId, t("allDepartments"))}</select>
      </div>
      <div class="field">
        <label>Room</label>
        <select data-filter="roomId">${optionList(state.data.rooms, state.filters.roomId, t("allRooms"))}</select>
      </div>
    </div>
  `;
}

function filteredBookings() {
  return visibleBookings().filter((booking) => {
    const dateOk = !state.filters.date || booking.startTime.startsWith(state.filters.date);
    const depOk = state.filters.departmentId === "all" || Number(booking.departmentId) === Number(state.filters.departmentId);
    const roomOk = state.filters.roomId === "all" || Number(booking.roomId) === Number(state.filters.roomId);
    return dateOk && depOk && roomOk;
  });
}

function bookingTable(bookings) {
  if (!bookings.length) return `<div class="empty">${t("noBookings")}</div>`;
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>${t("meeting")}</th><th>${t("room")}</th><th>${t("department")}</th><th>${t("time")}</th><th>${t("totalHours")}</th><th>${t("people")}</th><th>${t("status")}</th><th></th></tr>
        </thead>
        <tbody>
          ${bookings.map((booking) => {
            const room = byId(state.data.rooms, booking.roomId);
            const department = byId(state.data.departments, booking.departmentId);
            const requester = byId(state.data.users, booking.requesterId);
            return `
              <tr>
                <td><strong>${escapeHtml(booking.title)}</strong><br><small>${escapeHtml(requester?.name || "Unknown")}</small></td>
                <td>${escapeHtml(room?.name || "-")}</td>
                <td>${escapeHtml(department?.name || "-")}</td>
                <td>${fmtDateTime(booking.startTime)}<br><small>${fmtDateTime(booking.endTime)}</small></td>
                <td><strong>${bookingHours(booking)}</strong></td>
                <td>${booking.attendees}</td>
                <td><span class="status ${booking.status}">${booking.status}</span></td>
                <td>
                  <div class="actions">
                    ${canManage() && booking.status === "pending" ? `<button class="btn ghost" data-approve="${booking.id}">Approve</button>` : ""}
                    ${booking.status !== "cancelled" ? `<button class="btn ghost" data-cancel="${booking.id}">Cancel</button>` : ""}
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function modal() {
  if (!state.modal) return `<div class="modal"></div>`;
  const forms = {
    booking: bookingForm,
    room: roomForm,
    user: userForm,
    "assign-user": assignUserForm,
    department: departmentForm
  };
  return `
    <div class="modal open">
      <div class="modal-panel">
        ${forms[state.modal.type]()}
      </div>
    </div>
  `;
}

function alertDialog() {
  if (!state.alert) return "";
  const confirm = state.alert.confirmDelete;
  return `
    <div class="modal open alert-modal">
      <div class="modal-panel alert-panel ${state.alert.tone === "danger" ? "danger" : ""}">
        <div class="section-title">
          <h2>${escapeHtml(state.alert.title)}</h2>
          <button type="button" class="btn ghost" data-action="close-alert">Close</button>
        </div>
        <p>${escapeHtml(state.alert.message)}</p>
        ${state.alert.detail ? `<div class="alert-detail">${state.alert.detail}</div>` : ""}
        ${confirm ? `
          <div class="actions confirm-actions">
            <button type="button" class="btn ghost" data-action="close-alert">Cancel</button>
            <button type="button" class="btn danger" data-confirm-delete="${escapeHtml(confirm.kind)}" data-id="${confirm.id}">Delete</button>
          </div>
        ` : `<button type="button" class="btn full" data-action="close-alert">OK</button>`}
      </div>
    </div>
  `;
}

function bookingForm() {
  const normalUser = !canManage();
  const requesterId = normalUser ? state.currentUser.id : 2;
  const departmentId = normalUser ? state.currentUser.departmentId : "";
  const draft = state.bookingDraft || {};
  return `
    <form data-form="booking">
      <div class="section-title">
        <h2>${t("newBooking")}</h2>
        <button type="button" class="btn ghost" data-action="close-modal">${t("close")}</button>
      </div>
      <div class="form-grid">
        ${input(t("title"), "title", "text", draft.title || "Project planning")}
        <div class="field">
          <label>${t("room")}</label>
          <select name="roomId" required>${optionList(state.data.rooms, draft.roomId || "")}</select>
        </div>
        <div class="field">
          <label>${t("requester")}</label>
          ${normalUser
            ? `<input type="hidden" name="requesterId" value="${state.currentUser.id}"><input value="${escapeHtml(state.currentUser.name)}" disabled>`
            : `<select name="requesterId" required>${optionList(state.data.users, draft.requesterId || requesterId)}</select>`}
        </div>
        <div class="field">
          <label>${t("department")}</label>
          ${normalUser
            ? `<input type="hidden" name="departmentId" value="${state.currentUser.departmentId}"><input value="${escapeHtml(byId(state.data.departments, state.currentUser.departmentId)?.name || "-")}" disabled>`
            : `<select name="departmentId" required>${optionList(state.data.departments, draft.departmentId || departmentId)}</select>`}
        </div>
        ${timeInput(t("startTime"), "startTime", draft.startTime || localDateAt("11:00"))}
        ${timeInput(t("endTime"), "endTime", draft.endTime || localDateAt("12:00"))}
        <div class="field">
          <label>${t("availability")}</label>
          <button class="btn secondary" type="button" data-action="check-availability">${t("checkAvailability")}</button>
        </div>
        ${input(t("attendees"), "attendees", "number", draft.attendees || "6")}
        <div class="field wide">
          <label>${t("purpose")}</label>
          <textarea name="purpose" placeholder="Meeting purpose">${escapeHtml(draft.purpose || "")}</textarea>
        </div>
      </div>
      <br>
      <button class="btn" type="submit">${t("saveBooking")}</button>
    </form>
  `;
}

function roomForm() {
  const room = modalItem("rooms");
  return `
    <form data-form="room">
      <div class="section-title">
        <h2>${room ? "Edit Room" : "New Room"}</h2>
        <button type="button" class="btn ghost" data-action="close-modal">Close</button>
      </div>
      <div class="form-grid">
        ${input("Room name", "name", "text", room?.name || "Strategy Room")}
        ${input("Floor", "floor", "text", room?.floor || "Level 5")}
        ${input("Capacity", "capacity", "number", room?.capacity || "12")}
        ${input("Equipment", "equipment", "text", room?.equipment || "TV, Whiteboard")}
      </div>
      <br>
      <button class="btn" type="submit">${room ? "Update room" : "Save room"}</button>
    </form>
  `;
}

function userForm() {
  const user = modalItem("users");
  const selected = user?.departmentId || state.modal.departmentId || 1;
  return `
    <form data-form="user">
      <div class="section-title">
        <h2>${user ? "Edit User" : "New User"}</h2>
        <button type="button" class="btn ghost" data-action="close-modal">Close</button>
      </div>
      <div class="form-grid">
        ${input("Name", "name", "text", user?.name || "New User")}
        ${input("Username", "username", "text", user?.username || "newuser")}
        ${input("Email", "email", "email", user?.email || "user@company.test")}
        ${input("Password", "password", "text", user ? "" : "user123", user ? false : true)}
        <div class="field">
          <label>Role</label>
          <select name="role">
            ${roleOptions(user?.role || "user")}
          </select>
        </div>
        <div class="field">
          <label>Department</label>
          <select name="departmentId" required>${optionList(state.data.departments, selected)}</select>
        </div>
        <div class="field">
          <label>Status</label>
          <select name="isActive">
            <option value="true"${user?.isActive !== false ? " selected" : ""}>Active</option>
            <option value="false"${user?.isActive === false ? " selected" : ""}>Inactive</option>
          </select>
        </div>
      </div>
      <br>
      <button class="btn" type="submit">${user ? "Update user" : "Save user"}</button>
    </form>
  `;
}

function assignUserForm() {
  const departmentId = Number(state.modal.departmentId);
  const department = byId(state.data.departments, departmentId);
  const availableUsers = state.data.users.filter((user) => Number(user.departmentId) !== departmentId);
  return `
    <form data-form="assign-user">
      <div class="section-title">
        <h2>Add User to ${escapeHtml(department?.name || "Department")}</h2>
        <button type="button" class="btn ghost" data-action="close-modal">Close</button>
      </div>
      <input type="hidden" name="departmentId" value="${departmentId}">
      ${availableUsers.length ? `
        <div class="form-grid">
          <div class="field wide">
            <label>Select existing user</label>
            <select name="userId" required>
              ${availableUsers.map((user) => {
                const currentDepartment = byId(state.data.departments, user.departmentId);
                return `<option value="${user.id}">${escapeHtml(user.name)} - ${escapeHtml(user.email)} (${escapeHtml(currentDepartment?.name || "No department")})</option>`;
              }).join("")}
            </select>
          </div>
        </div>
        <br>
        <button class="btn" type="submit">Add selected user</button>
      ` : `
        <div class="empty">No users available to add. Create a user in the Users page first.</div>
      `}
    </form>
  `;
}

function departmentForm() {
  const department = modalItem("departments");
  return `
    <form data-form="department">
      <div class="section-title">
        <h2>${department ? "Edit Department" : "New Department"}</h2>
        <button type="button" class="btn ghost" data-action="close-modal">Close</button>
      </div>
      <div class="form-grid">
        ${input("Department name", "name", "text", department?.name || "Marketing")}
        ${input("Code", "code", "text", department?.code || "MKT")}
      </div>
      <br>
      <button class="btn" type="submit">${department ? "Update department" : "Save department"}</button>
    </form>
  `;
}

function roleOptions(selectedRole) {
  return ["user", "manager", "administrator"]
    .map((role) => `<option value="${role}"${selectedRole === role ? " selected" : ""}>${role === "user" ? "normal user" : role}</option>`)
    .join("");
}

function input(label, name, type, value, required = true) {
  return `
    <div class="field">
      <label>${label}</label>
      <input name="${name}" type="${type}" value="${escapeHtml(value)}"${required ? " required" : ""}>
    </div>
  `;
}

function timeInput(label, name, value) {
  return `
    <div class="field">
      <label>${label}</label>
      <div class="time-control">
        <input name="${name}" type="datetime-local" value="${escapeHtml(value)}" required>
        <button class="btn secondary compact" type="button" data-action="validate-time">OK</button>
      </div>
    </div>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      state.navOpen = false;
      render();
    });
  });

  document.querySelectorAll("[data-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.modal === "booking") state.bookingDraft = null;
      state.modal = { type: button.dataset.modal, departmentId: button.dataset.department };
      render();
    });
  });

  document.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      state.modal = { type: button.dataset.edit, id: Number(button.dataset.id) };
      render();
    });
  });

  document.querySelectorAll("[data-action='close-modal']").forEach((button) => {
    button.addEventListener("click", () => {
      state.modal = null;
      render();
    });
  });

  document.querySelectorAll("[data-action='close-alert']").forEach((button) => {
    button.addEventListener("click", () => {
      state.alert = null;
      render();
    });
  });

  document.querySelectorAll("[data-confirm-delete]").forEach((button) => {
    button.addEventListener("click", async () => {
      await remove(button.dataset.confirmDelete, Number(button.dataset.id));
      state.alert = null;
      await loadData();
      render();
      notify("Deleted.");
    });
  });

  document.querySelectorAll("[data-action='toggle-nav']").forEach((button) => {
    button.addEventListener("click", () => {
      state.navOpen = !state.navOpen;
      render();
    });
  });

  document.querySelectorAll("[data-pref]").forEach((button) => {
    button.addEventListener("click", () => {
      state[button.dataset.pref] = button.dataset.value;
      localStorage.setItem(`roombook-${button.dataset.pref}`, button.dataset.value);
      render();
    });
  });

  document.querySelectorAll("[data-action='logout']").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.removeItem("roombook-current-user");
      state.currentUser = null;
      state.navOpen = false;
      render();
    });
  });

  document.querySelectorAll("[data-filter]").forEach((inputEl) => {
    inputEl.addEventListener("change", () => {
      state.filters[inputEl.dataset.filter] = inputEl.value;
      render();
    });
  });

  document.querySelectorAll("[data-calendar]").forEach((button) => {
    button.addEventListener("click", () => {
      changeCalendarMonth(button.dataset.calendar);
      render();
    });
  });

  document.querySelectorAll("[data-action='check-availability']").forEach((button) => {
    button.addEventListener("click", () => {
      const form = button.closest("form");
      showAvailabilityResult(Object.fromEntries(new FormData(form).entries()));
    });
  });

  document.querySelectorAll("[data-action='validate-time']").forEach((button) => {
    button.addEventListener("click", () => {
      const form = button.closest("form");
      const values = Object.fromEntries(new FormData(form).entries());
      state.bookingDraft = values;
      const error = bookingTimeError(values.startTime, values.endTime);
      if (error) {
        state.alert = { title: "Invalid time", message: error };
        render();
      }
    });
  });

  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", handleForm);
  });

  document.querySelectorAll("[data-approve]").forEach((button) => {
    button.addEventListener("click", () => updateBookingStatus(Number(button.dataset.approve), "approved"));
  });

  document.querySelectorAll("[data-cancel]").forEach((button) => {
    button.addEventListener("click", () => updateBookingStatus(Number(button.dataset.cancel), "cancelled"));
  });

  bindDelete("room", "rooms");
  bindDelete("user", "users");
  bindDelete("department", "departments");
}

async function handleForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = Object.fromEntries(new FormData(form).entries());
  const type = form.dataset.form;
  const editId = state.modal?.id;

  if (type === "login") {
    let user;
    try {
      ({ user } = await apiFetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ login: values.login, password: values.password })
      }));
    } catch (error) {
      state.alert = { title: "Login failed", message: "Username or password is incorrect.", tone: "danger" };
      return render();
    }
    if (!user.isActive) {
      state.alert = { title: "Account inactive", message: "This user account is inactive.", tone: "danger" };
      return render();
    }
    state.currentUser = user;
    state.view = "dashboard";
    await loadData();
    render();
    return notify("Logged in successfully.");
  }

  if (type === "booking") {
    state.bookingDraft = values;
    const timeError = bookingTimeError(values.startTime, values.endTime);
    if (timeError) {
      state.alert = { title: "Invalid time", message: timeError };
      return render();
    }
    await loadData();
    const conflict = findConflict(Number(values.roomId), values.startTime, values.endTime);
    if (conflict) {
      return showConflict(conflict);
    }
    try {
      await put("bookings", {
        title: values.title,
        roomId: Number(values.roomId),
        requesterId: Number(values.requesterId),
        departmentId: Number(values.departmentId),
        startTime: values.startTime,
        endTime: values.endTime,
        attendees: Number(values.attendees),
        status: "approved",
        purpose: values.purpose,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      if (error.status === 409 && error.payload?.conflict) {
        await loadData();
        return showConflict(error.payload.conflict);
      }
      throw error;
    }
    state.filters.date = values.startTime.slice(0, 10);
    state.calendarMonth = values.startTime.slice(0, 7);
    state.bookingDraft = null;
  }

  if (type === "room") {
    const existingRoom = editId ? byId(state.data.rooms, editId) : null;
    await put("rooms", {
      ...existingRoom,
      ...(editId ? { id: editId } : {}),
      name: values.name,
      floor: values.floor,
      capacity: Number(values.capacity),
      equipment: values.equipment,
      isActive: true
    });
  }

  if (type === "user") {
    const existingUser = editId ? byId(state.data.users, editId) : null;
    await put("users", {
      ...existingUser,
      ...(editId ? { id: editId } : {}),
      name: values.name,
      username: values.username.trim().toLowerCase(),
      email: values.email,
      password: values.password,
      role: values.role,
      departmentId: Number(values.departmentId),
      isActive: values.isActive === "true",
      createdAt: existingUser?.createdAt || new Date().toISOString()
    });
  }

  if (type === "assign-user") {
    const user = byId(state.data.users, values.userId);
    if (!user) {
      state.alert = { title: "User required", message: "Please select a user first.", tone: "danger" };
      return render();
    }
    await put("users", {
      ...user,
      departmentId: Number(values.departmentId)
    });
  }

  if (type === "department") {
    const existingDepartment = editId ? byId(state.data.departments, editId) : null;
    await put("departments", {
      ...existingDepartment,
      ...(editId ? { id: editId } : {}),
      name: values.name,
      code: values.code.toUpperCase()
    });
  }

  state.modal = null;
  await loadData();
  if (state.currentUser) {
    state.currentUser = byId(state.data.users, state.currentUser.id) || state.currentUser;
  }
  render();
  notify(editId ? "Updated successfully." : "Saved successfully.");
}

function findConflict(roomId, startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return state.data.bookings.find((booking) => {
    if (Number(booking.roomId) !== roomId || booking.status === "cancelled") return false;
    const existingStart = new Date(booking.startTime);
    const existingEnd = new Date(booking.endTime);
    return start < existingEnd && end > existingStart;
  });
}

function showAvailabilityResult(values) {
  state.bookingDraft = values;
  if (!values.roomId || !values.startTime || !values.endTime) {
    state.alert = { title: "Missing time", message: "Please select room, start time, and end time first." };
    return render();
  }
  const timeError = bookingTimeError(values.startTime, values.endTime);
  if (timeError) {
    state.alert = { title: "Invalid time", message: timeError };
    return render();
  }
  const conflict = findConflict(Number(values.roomId), values.startTime, values.endTime);
  if (conflict) return showConflict(conflict);
  state.alert = {
    title: "Room available",
    message: "This room is available for the selected date and time."
  };
  render();
}

function bookingTimeError(startTime, endTime) {
  if (!startTime || !endTime) return "Please choose both start time and end time.";
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "Please choose valid date and time values.";
  if (end <= start) return "End time must be later than start time.";
  const hours = (end - start) / 3600000;
  if (hours > 8) return "A booking cannot be longer than 8 hours. Please choose a shorter time range.";
  return "";
}

function showConflict(conflict) {
  const room = byId(state.data.rooms, conflict.roomId);
  const requester = byId(state.data.users, conflict.requesterId);
  state.alert = {
    title: "Room already booked",
    message: "You cannot book this room because another booking already uses that time.",
    detail: `
      <strong>${escapeHtml(conflict.title)}</strong>
      <span>${escapeHtml(room?.name || "-")}</span>
      <span>${fmtDateTime(conflict.startTime)} - ${fmtDateTime(conflict.endTime)}</span>
      <span>Booked by ${escapeHtml(requester?.name || "-")}</span>
    `
  };
  render();
}

function changeCalendarMonth(direction) {
  if (direction === "today") {
    state.calendarMonth = localDate().slice(0, 7);
    return;
  }
  const date = new Date(`${state.calendarMonth}-01T00:00`);
  date.setMonth(date.getMonth() + (direction === "next" ? 1 : -1));
  state.calendarMonth = toDateKey(date).slice(0, 7);
}

async function updateBookingStatus(id, status) {
  const booking = byId(state.data.bookings, id);
  if (!booking) return;
  await apiFetch(`/api/bookings/${Number(id)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
  await loadData();
  render();
  notify(`Booking ${status}.`);
}

function bindDelete(kind, storeName) {
  document.querySelectorAll(`[data-delete-${kind}]`).forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset[`delete${kind[0].toUpperCase()}${kind.slice(1)}`]);
      state.alert = deleteConfirmation(kind, storeName, id);
      render();
    });
  });
}

function deleteConfirmation(kind, storeName, id) {
  const collections = {
    room: state.data.rooms,
    user: state.data.users,
    department: state.data.departments
  };
  const item = byId(collections[kind] || [], id);
  const labels = { room: "room", user: "user", department: "department" };
  return {
    title: `Delete ${labels[kind] || "item"}?`,
    message: `Are you sure you want to delete ${item?.name || "this item"}? This action cannot be undone.`,
    tone: "danger",
    confirmDelete: { kind: storeName, id }
  };
}

let installPrompt = null;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
});

document.addEventListener("click", async (event) => {
  if (event.target.matches("[data-action='logout']")) {
    await apiFetch("/api/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("roombook-current-user");
    state.currentUser = null;
    state.data = { departments: [], users: [], rooms: [], bookings: [] };
    state.navOpen = false;
    render();
    return;
  }
  if (!event.target.matches("[data-action='install']")) return;
  if (!installPrompt) return notify("PWA install is available after serving over localhost or HTTPS.");
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
});

function notify(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

async function init() {
  const { user } = await apiFetch("/api/me");
  state.currentUser = user;
  if (state.currentUser) {
    await loadData();
  }
  render();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

init().catch((error) => {
  document.querySelector("#app").innerHTML = `<main class="main"><div class="card"><h1>App failed to start</h1><p>${escapeHtml(error.message)}</p></div></main>`;
});
