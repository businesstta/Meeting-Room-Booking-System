const APP_NAME = "AtoZ Group Meeting Room Booking System";
const APP_VERSION = "64";
const IS_NATIVE_APP = document.querySelector('meta[name="app-platform"]')?.content === "capacitor";
const API_ORIGIN = (document.querySelector('meta[name="api-origin"]')?.content || "").replace(/\/$/, "");
const stores = ["departments", "users", "rooms", "bookings"];
const i18n = {
  en: {
    dashboard: "Dashboard",
    bookings: "Bookings",
    calendar: "Calendar",
    notifications: "Notifications",
    settings: "Settings",
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
    notificationsSub: "Meeting reminders and booking activity.",
    settingsSub: "Manage module access and your account password.",
    modulePermissionsSub: "Control which roles can open each module.",
    roleSetupSub: "Create custom access roles for future users.",
    changePasswordSub: "Update your account password.",
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
    theme: "Theme",
    collapseNav: "Collapse navigation",
    expandNav: "Expand navigation",
    roomDisplay: "Room display",
    backToLogin: "Back to login",
    displaySub: "Live room tablet panel for today's meetings.",
    selectRoom: "Select room",
    now: "Now",
    freeNow: "Free now",
    busyNow: "Busy now",
    todayBookings: "Today's bookings",
    noMeetingsToday: "No meetings booked today.",
    bookedBy: "Booked by",
    roomPanel: "Room Panel",
    upcomingReminder: "Upcoming reminder",
    meetingStartsIn: "Meeting starts in",
    minutes: "min",
    notificationEmpty: "No notifications yet.",
    bookedSuccess: "Booking successful",
    monthView: "Month",
    dayView: "Day",
    workWeekView: "Work week",
    selectedDay: "Selected day",
    dayTimeline: "Day timeline",
    clickDateHint: "Double click a date or time slot to create a booking.",
    markAllRead: "Mark all as read",
    unread: "Unread",
    read: "Read",
    notificationDetail: "Notification detail",
    roomDisplayLogin: "Room display login",
    roomDisplayLoginHelp: "Administrator login is required to open the tablet room display.",
    adminOnly: "Administrator access is required.",
    modulePermissions: "Module permissions",
    roleSetup: "Role Setup",
    roleName: "Role name",
    addRole: "Add role",
    existingRoles: "Existing roles",
    coreRole: "Core role",
    customRole: "Custom role",
    deleteRole: "Delete role",
    changePassword: "Change password",
    oldPassword: "Old password",
    newPassword: "New password",
    saveSettings: "Save settings",
    updatePassword: "Update password",
    cancelBookingTitle: "Cancel booking?",
    cancelBookingMessage: "Are you sure you want to cancel this booking?",
    cancelReason: "Reason",
    confirmCancel: "Confirm cancel",
    bookingCancelled: "Booking cancelled",
    cancelBookingsPermission: "Can cancel bookings",
    instantMeeting: "Book Now",
    instantMeetingBooking: "Book Now",
    meetingTitle: "Meeting title",
    timeSlot: "Time slot",
    from: "From",
    to: "To",
    requesterName: "Requester name",
    bookInstantMeeting: "Book Now"
  },
  my: {
    dashboard: "ဒက်ရှ်ဘုတ်",
    bookings: "ဘိုကင်များ",
    calendar: "ပြက္ခဒိန်",
    notifications: "အသိပေးချက်များ",
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
    notificationsSub: "အစည်းအဝေး reminder နှင့် booking activity များ။",
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
    theme: "အရောင်စနစ်",
    collapseNav: "Navigation ခေါက်မည်",
    expandNav: "Navigation ဖြန့်မည်",
    roomDisplay: "Room display",
    backToLogin: "Login သို့ပြန်သွားမည်",
    displaySub: "ယနေ့အစည်းအဝေးများအတွက် room tablet panel။",
    selectRoom: "အခန်းရွေးမည်",
    now: "ယခု",
    freeNow: "ယခု အားလပ်သည်",
    busyNow: "ယခု မအားပါ",
    todayBookings: "ယနေ့ဘိုကင်များ",
    noMeetingsToday: "ယနေ့အတွက် ဘိုကင်မရှိပါ။",
    bookedBy: "ဘိုကင်လုပ်သူ",
    roomPanel: "Room Panel",
    upcomingReminder: "Reminder",
    meetingStartsIn: "အစည်းအဝေးစရန်",
    minutes: "မိနစ်",
    notificationEmpty: "အသိပေးချက်မရှိသေးပါ။",
    bookedSuccess: "ဘိုကင်အောင်မြင်ပါသည်",
    monthView: "လမြင်ကွင်း",
    dayView: "နေ့",
    workWeekView: "အလုပ်ရက်သတ္တပတ်",
    selectedDay: "ရွေးထားသောနေ့",
    dayTimeline: "နေ့စဉ်အချိန်ဇယား",
    clickDateHint: "နေ့ရက် သို့မဟုတ် အချိန် slot ကို double click နှိပ်ပြီး booking အသစ်လုပ်နိုင်သည်။",
    markAllRead: "အားလုံးဖတ်ပြီးအဖြစ်မှတ်မည်",
    unread: "မဖတ်ရသေး",
    read: "ဖတ်ပြီး",
    notificationDetail: "အသိပေးချက် အသေးစိတ်",
    roomDisplayLogin: "Room display login",
    roomDisplayLoginHelp: "Tablet room display ဝင်ရန် administrator account လိုအပ်သည်။",
    adminOnly: "Administrator access လိုအပ်သည်။",
    settings: "Settings",
    settingsSub: "Module access နှင့် password ပြင်ရန်။",
    modulePermissionsSub: "Role အလိုက် module access ကိုစီမံရန်။",
    roleSetupSub: "အသုံးပြုသူအသစ်များအတွက် role အသစ်များဖန်တီးရန်။",
    changePasswordSub: "သင့် account password ကိုပြင်ရန်။",
    modulePermissions: "Module permissions",
    roleSetup: "Role Setup",
    roleName: "Role အမည်",
    addRole: "Role ထည့်မည်",
    existingRoles: "ရှိပြီးသား Role များ",
    coreRole: "Core role",
    customRole: "Custom role",
    deleteRole: "Role ဖျက်မည်",
    changePassword: "Password ပြင်မည်",
    oldPassword: "Password အဟောင်း",
    newPassword: "Password အသစ်",
    saveSettings: "Settings သိမ်းမည်",
    updatePassword: "Password update လုပ်မည်",
    cancelBookingTitle: "Booking cancel လုပ်မလား?",
    cancelBookingMessage: "ဤ booking ကို cancel လုပ်မှာ သေချာပါသလား?",
    cancelReason: "Reason",
    confirmCancel: "Confirm cancel",
    bookingCancelled: "Booking cancelled",
    cancelBookingsPermission: "Booking cancel လုပ်နိုင်သည်",
    instantMeeting: "Book Now",
    instantMeetingBooking: "Book Now",
    meetingTitle: "အစည်းအဝေးခေါင်းစဉ်",
    timeSlot: "အချိန်ကာလ",
    from: "စချိန်",
    to: "ပြီးချိန်",
    requesterName: "တောင်းဆိုသူအမည်",
    bookInstantMeeting: "Book Now"
  }
};

const state = {
  view: "dashboard",
  modal: null,
  alert: null,
  currentUser: null,
  sessionExpiresAt: null,
  bookingDraft: null,
  data: { departments: [], users: [], rooms: [], bookings: [], notifications: [], settings: { modulePermissions: {}, roles: ["administrator", "manager", "user"], coreRoles: ["administrator", "manager", "user"] } },
  filters: {
    date: "",
    departmentId: "all",
    roomId: "all",
    sortBy: "start-desc"
  },
  calendarMonth: localDate().slice(0, 7),
  selectedDate: localDate(),
  calendarView: localStorage.getItem("roombook-calendar-view") || "month",
  navOpen: false,
  navCollapsed: localStorage.getItem("roombook-nav-collapsed") === "true",
  settingsOpen: localStorage.getItem("roombook-settings-open") === "true",
  notifications: JSON.parse(localStorage.getItem("roombook-notifications") || "[]"),
  readNotificationIds: JSON.parse(localStorage.getItem("roombook-read-notifications") || "[]"),
  roomPanel: {
    active: false,
    login: false,
    roomId: localStorage.getItem("roombook-display-room") || "",
    data: null,
    instantOpen: false,
    notice: null
  },
  language: localStorage.getItem("roombook-language") || "en",
  theme: localStorage.getItem("roombook-theme") || "light"
};

const mainNavItems = [
  { id: "dashboard", labelKey: "dashboard", icon: "dashboard" },
  { id: "bookings", labelKey: "bookings", icon: "bookings" },
  { id: "calendar", labelKey: "calendar", icon: "calendar" },
  { id: "notifications", labelKey: "notifications", icon: "bell" },
  { id: "rooms", labelKey: "rooms", icon: "rooms", managerOnly: true },
  { id: "users", labelKey: "users", icon: "users", managerOnly: true },
  { id: "departments", labelKey: "departments", icon: "departments", managerOnly: true }
];

const settingsNavItems = [
  { id: "module-permissions", labelKey: "modulePermissions", icon: "settings", adminOnly: true },
  { id: "role-setup", labelKey: "roleSetup", icon: "users", adminOnly: true },
  { id: "change-password", labelKey: "changePassword", icon: "settings", requiredForAll: true }
];

const navItems = [...mainNavItems, ...settingsNavItems];
const permissionItems = [
  ...navItems.map((item) => ({ id: item.id, labelKey: item.labelKey })),
  { id: "cancel-bookings", labelKey: "cancelBookingsPermission", capability: true }
];

function t(key) {
  return i18n[state.language]?.[key] || i18n.en[key] || key;
}

function icon(name) {
  const paths = {
    dashboard: `<path d="M4 13h7V4H4v9Zm9 7h7V4h-7v16ZM4 20h7v-5H4v5Z"/>`,
    bookings: `<path d="M7 3v3M17 3v3M4 8h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="m8 13 2 2 5-5"/>`,
    calendar: `<path d="M7 3v3M17 3v3M4 8h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M8 12h3M8 16h8"/>`,
    bell: `<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/>`,
    rooms: `<path d="M4 21V5a2 2 0 0 1 2-2h9v18"/><path d="M15 8h3a2 2 0 0 1 2 2v11M11 12h.01"/>`,
    users: `<path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>`,
    departments: `<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/><path d="M9 10h.01M15 10h.01"/>`,
    settings: `<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="m19.4 15 .4 2.2-2 1.2-1.8-1.4a7.5 7.5 0 0 1-2 .8L13.4 20h-2.8l-.6-2.2a7.5 7.5 0 0 1-2-.8l-1.8 1.4-2-1.2.4-2.2a7 7 0 0 1-1-1.8L1.5 12l2.1-1.2a7 7 0 0 1 1-1.8l-.4-2.2 2-1.2L8 7a7.5 7.5 0 0 1 2-.8L10.6 4h2.8l.6 2.2a7.5 7.5 0 0 1 2 .8l1.8-1.4 2 1.2-.4 2.2a7 7 0 0 1 1 1.8L22.5 12l-2.1 1.2a7 7 0 0 1-1 1.8Z"/>`,
    eye: `<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>`,
    eyeOff: `<path d="m3 3 18 18"/><path d="M10.6 10.6A3 3 0 0 0 13.4 13.4"/><path d="M9.9 4.2A10.9 10.9 0 0 1 12 4.0c6.5 0 10 8 10 8a18.5 18.5 0 0 1-3.1 4.2"/><path d="M6.6 6.6C3.8 8.5 2 12 2 12s3.5 8 10 8a10.8 10.8 0 0 0 5.4-1.5"/>`,
    collapse: `<path d="M15 18 9 12l6-6"/><path d="M20 4v16M4 4v16"/>`,
    expand: `<path d="m9 18 6-6-6-6"/><path d="M4 4v16M20 4v16"/>`,
    menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
    display: `<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>`
  };
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.dashboard}</svg>`;
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
  const { departments, users, rooms, bookings, notifications = [], settings = { modulePermissions: {} } } = await apiFetch("/api/data");
  state.data = {
    departments,
    users,
    rooms,
    bookings: bookings.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
    notifications,
    settings
  };
}

async function loadRoomPanelData() {
  const data = state.data.rooms.length ? state.data : await apiFetch("/api/data");
  state.roomPanel.data = {
    ...data,
    bookings: data.bookings.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
  };
  if (!state.roomPanel.roomId && data.rooms[0]) {
    state.roomPanel.roomId = String(data.rooms[0].id);
    localStorage.setItem("roombook-display-room", state.roomPanel.roomId);
  }
}

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_ORIGIN}${path}`, {
    credentials: IS_NATIVE_APP ? "include" : "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || "Request failed.");
    error.status = response.status;
    error.payload = payload;
    if (response.status === 401) {
      if (state.currentUser) expireSession();
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

function canManageUser(user) {
  if (state.currentUser?.role === "administrator") return true;
  return state.currentUser?.role === "manager" && !["administrator", "manager"].includes(user?.role);
}

function canDeleteUser(user) {
  return canManageUser(user) && Number(user?.id) !== Number(state.currentUser?.id);
}

function isAdminDepartmentUser() {
  const department = byId(state.data.departments, state.currentUser?.departmentId);
  return department?.code === "ADM" || /admin/i.test(department?.name || "");
}

function canCancelBooking(booking) {
  if (!booking || booking.status === "cancelled") return false;
  return state.currentUser?.role === "administrator" || roleModulePermissions().includes("cancel-bookings");
}

function availableRoles() {
  const roles = state.data.settings?.roles;
  const available = Array.isArray(roles) && roles.length ? roles : ["administrator", "manager", "user"];
  return state.currentUser?.role === "administrator" ? available : available.filter((role) => !["administrator", "manager"].includes(role));
}

function coreRoles() {
  const roles = state.data.settings?.coreRoles;
  return Array.isArray(roles) && roles.length ? roles : ["administrator", "manager", "user"];
}

function defaultModulesForRole(role) {
  if (role === "administrator") {
    return [...navItems.map((item) => item.id), "cancel-bookings", "settings"];
  }
  if (role === "manager") {
    return navItems
      .map((item) => item.id)
      .filter((id) => !["module-permissions", "role-setup"].includes(id))
      .concat("cancel-bookings", "settings");
  }
  return ["dashboard", "bookings", "calendar", "notifications", "change-password", "settings"];
}

function roleModulePermissions(role = state.currentUser?.role) {
  return state.data.settings?.modulePermissions?.[role] || defaultModulesForRole(role);
}

function canAccessModule(moduleId) {
  if (state.currentUser?.role === "administrator") return true;
  if (["module-permissions", "role-setup"].includes(moduleId)) return false;
  if (moduleId === "change-password") {
    const permissions = roleModulePermissions();
    return permissions.includes("change-password") || permissions.includes("settings");
  }
  return roleModulePermissions().includes(moduleId);
}

function visibleNavItems() {
  return navItems.filter((item) => canShowNavItem(item));
}

function canShowNavItem(item) {
  if (item.adminOnly && state.currentUser?.role !== "administrator") return false;
  if (item.managerOnly && !canManage()) return false;
  return canAccessModule(item.id);
}

function navButton(item, notificationCount = 0) {
  const label = t(item.labelKey);
  return `
    <button class="${state.view === item.id ? "active" : ""}" data-view="${item.id}" data-nav-tooltip="${escapeHtml(label)}" aria-label="${escapeHtml(label)}">
      <span class="nav-icon">${icon(item.icon)}${item.id === "notifications" && notificationCount ? `<em>${notificationCount}</em>` : ""}</span>
      <strong>${label}</strong>
    </button>
  `;
}

function settingsSubmenu(notificationCount = 0) {
  const children = settingsNavItems.filter((item) => canShowNavItem(item));
  if (!children.length) return "";
  const active = children.some((item) => item.id === state.view);
  const open = state.settingsOpen || active;
  return `
    <div class="nav-group ${active ? "active" : ""} ${open ? "open" : ""}">
      <button class="nav-group-label" type="button" data-action="toggle-settings" data-nav-tooltip="${escapeHtml(t("settings"))}" aria-label="${escapeHtml(t("settings"))}" aria-expanded="${open}">
        <span class="nav-icon">${icon("settings")}</span>
        <strong>${t("settings")}</strong>
      </button>
      <div class="nav-submenu">
        ${open ? children.map((item) => navButton(item, notificationCount)).join("") : ""}
      </div>
    </div>
  `;
}

function visibleBookings(bookings = state.data.bookings) {
  if (["administrator", "manager"].includes(state.currentUser?.role)) return bookings;
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
  if (state.roomPanel.active) {
    app.innerHTML = roomDisplayScreen();
    bindEvents();
    return;
  }
  if (state.roomPanel.login && !state.currentUser) {
    app.innerHTML = roomDisplayLoginScreen();
    bindEvents();
    return;
  }
  if (!state.currentUser) {
    app.innerHTML = loginScreen();
    bindEvents();
    return;
  }
  if (state.view === "settings") {
    state.view = state.currentUser.role === "administrator" ? "module-permissions" : "change-password";
  }
  if (!visibleNavItems().some((item) => item.id === state.view)) {
    state.view = "dashboard";
  }
  const initial = state.currentUser.name.slice(0, 1).toUpperCase();
  const notificationCount = unreadNotifications().length;
  const usesDrawerNavigation = window.matchMedia("(max-width: 760px)").matches;
  const collapseLabel = usesDrawerNavigation ? t("close") : state.navCollapsed ? t("expandNav") : t("collapseNav");
  app.innerHTML = `
    <div class="shell ${state.navOpen ? "nav-open" : ""} ${state.navCollapsed ? "nav-collapsed" : ""}">
      <aside class="sidebar">
        <div class="sidebar-head">
          <button class="nav-collapse" data-action="collapse-nav" data-nav-tooltip="${escapeHtml(collapseLabel)}" aria-label="${escapeHtml(collapseLabel)}" title="${escapeHtml(collapseLabel)}">
            <span class="nav-collapse-icon" aria-hidden="true">${icon("menu")}</span>
          </button>
          ${brandMarkup()}
        </div>
        <nav class="nav">
          ${mainNavItems.filter((item) => canShowNavItem(item)).map((item) => navButton(item, notificationCount)).join("")}
          ${settingsSubmenu(notificationCount)}
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
    <div class="nav-hover-tooltip" id="nav-hover-tooltip" role="tooltip"></div>
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
            <input name="login" type="text" value="" autocomplete="username" required>
          </div>
          <div class="field">
            <label>${t("password")}</label>
            ${passwordControl("password", "")}
          </div>
          <button class="btn full" type="submit">${t("login")}</button>
        </form>
        <button class="btn secondary full" type="button" data-action="open-room-display-login">${icon("display")} ${t("roomDisplay")}</button>
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
    notifications: [t("notifications"), t("notificationsSub")],
    rooms: [t("rooms"), t("roomsSub")],
    users: [t("users"), t("usersSub")],
    departments: [t("departments"), t("departmentsSub")],
    "module-permissions": [t("modulePermissions"), t("modulePermissionsSub")],
    "role-setup": [t("roleSetup"), t("roleSetupSub")],
    "change-password": [t("changePassword"), t("changePasswordSub")]
  };
  const [title, subtitle] = labels[state.view];
  const action = {
    dashboard: `<button class="btn" data-modal="booking">${t("newBooking")}</button>`,
    bookings: `<button class="btn" data-modal="booking">${t("newBooking")}</button>`,
    calendar: `<button class="btn" data-modal="booking">${t("newBooking")}</button>`,
    notifications: `<button class="btn" data-modal="booking">${t("newBooking")}</button>`,
    rooms: `<button class="btn" data-modal="room">${t("newRoom")}</button>`,
    users: `<button class="btn" data-modal="user">${t("newUser")}</button>`,
    departments: `<button class="btn" data-modal="department">${t("newDepartment")}</button>`,
    "module-permissions": "",
    "role-setup": "",
    "change-password": ""
  }[state.view] || "";

  return `
    <div class="topbar">
      <div class="topbar-copy">
        <button class="mobile-menu" type="button" data-action="toggle-nav" aria-label="${t("expandNav")}" title="${t("expandNav")}">
          ${icon("menu")}
        </button>
        <div class="topbar-heading">
          <h1>${title}</h1>
          <p>${subtitle}</p>
        </div>
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
      <section class="calendar-layout">
        <div class="calendar-shell">
          <div class="calendar-toolbar">
            <div>
              ${calendarViewControls()}
              <strong>${calendarMonthLabel()}</strong>
            </div>
            <div class="actions no-margin">
              <button class="btn ghost" data-calendar="prev">${t("previous")}</button>
              <button class="btn ghost" data-calendar="today">${t("today")}</button>
              <button class="btn ghost" data-calendar="next">${t("next")}</button>
            </div>
          </div>
          ${calendarMain()}
        </div>
        ${selectedDayPanel()}
      </section>
    `;
  },
  notifications() {
    const items = notifications();
    return `
      <section class="notification-grid">
        <div class="section-title notification-title">
          <div>
            <h2>${t("notifications")}</h2>
            <p>${unreadNotifications().length} ${t("unread")}</p>
          </div>
          <button class="btn ghost" data-action="mark-all-read">${t("markAllRead")}</button>
        </div>
        ${items.length ? items.map((item) => notificationCard(item)).join("") : `<div class="empty">${t("notificationEmpty")}</div>`}
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
        <div class="table-wrap desktop-record-table">
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
                      ${canManageUser(user) ? `<button class="btn ghost" data-edit="user" data-id="${user.id}">${t("edit")}</button>` : ""}
                      ${canDeleteUser(user) ? `<button class="btn ghost" data-delete-user="${user.id}">${t("delete")}</button>` : ""}
                    </div>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div class="mobile-record-list">
          ${state.data.users.map((user) => userRecordCard(user)).join("")}
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
                      ${canManageUser(user) ? `<button class="btn ghost compact" data-edit="user" data-id="${user.id}">${t("editUser")}</button>` : ""}
                      ${canDeleteUser(user) ? `<button class="btn ghost compact" data-delete-user="${user.id}">${t("deleteUser")}</button>` : ""}
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
  },
  "module-permissions"() {
    const roles = availableRoles();
    return `
      <section>
        ${state.currentUser?.role === "administrator" ? `
          <form class="card" data-form="settings">
            <div class="section-title">
              <h2>${t("modulePermissions")}</h2>
              <span class="status">${t("adminOnly")}</span>
            </div>
            <div class="permission-grid" style="--role-count:${roles.length}">
              <div></div>
              ${roles.map((role) => `<strong>${role}</strong>`).join("")}
              ${permissionItems.map((permission) => `
                <strong>${t(permission.labelKey || permission.id)}</strong>
                ${roles.map((role) => {
                  const moduleId = permission.id;
                  const requiredForAll = moduleId === "change-password";
                  const adminOnly = ["module-permissions", "role-setup"].includes(moduleId);
                  const checked = role === "administrator" || requiredForAll || roleModulePermissions(role).includes(moduleId);
                  const disabled = role === "administrator" || requiredForAll || (adminOnly && role !== "administrator");
                  return `
                    <label class="permission-check">
                      <input type="checkbox" name="${role}:${moduleId}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}>
                    </label>
                  `;
                }).join("")}
              `).join("")}
            </div>
            <button class="btn" type="submit">${t("saveSettings")}</button>
          </form>
        ` : `<div class="empty">${t("adminOnly")}</div>`}
      </section>
    `;
  },
  "role-setup"() {
    const roles = availableRoles();
    const fixedRoles = coreRoles();
    return `
      <section class="grid two">
        ${state.currentUser?.role === "administrator" ? `
          <form class="card" data-form="role-setup">
            <div class="section-title">
              <h2>${t("roleSetup")}</h2>
              <span class="status">${t("adminOnly")}</span>
            </div>
            <div class="form-grid">
              ${input(t("roleName"), "roleName", "text", "supervisor")}
            </div>
            <br>
            <button class="btn" type="submit">${t("addRole")}</button>
          </form>
          <div class="card">
            <div class="section-title">
              <h2>${t("existingRoles")}</h2>
            </div>
            <div class="role-list">
              ${roles.map((role) => {
                const isCore = fixedRoles.includes(role);
                return `
                  <div class="role-row">
                    <div>
                      <strong>${escapeHtml(role)}</strong>
                      <span>${isCore ? t("coreRole") : t("customRole")}</span>
                    </div>
                    <button class="btn ghost compact" type="button" data-delete-role="${escapeHtml(role)}" ${isCore ? "disabled" : ""}>${t("deleteRole")}</button>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        ` : `<div class="empty">${t("adminOnly")}</div>`}
      </section>
    `;
  },
  "change-password"() {
    return `
      <section>
        <form class="card" data-form="change-password">
          <div class="section-title">
            <h2>${t("changePassword")}</h2>
          </div>
          <div class="form-grid">
            ${input(t("oldPassword"), "oldPassword", "password", "")}
            ${input(t("newPassword"), "newPassword", "password", "")}
          </div>
          <br>
          <button class="btn" type="submit">${t("updatePassword")}</button>
        </form>
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

function calendarViewControls() {
  const views = [
    ["day", t("dayView")],
    ["workweek", t("workWeekView")],
    ["month", t("monthView")]
  ];
  return `
    <div class="calendar-view-switch">
      ${views.map(([view, label]) => `<button class="${state.calendarView === view ? "active" : ""}" type="button" data-calendar-view="${view}">${label}</button>`).join("")}
    </div>
  `;
}

function calendarMain() {
  if (state.calendarView === "day") return dayCalendarView();
  if (state.calendarView === "workweek") return workWeekCalendarView();
  return `
    <div class="calendar-weekdays">
      ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<span>${day}</span>`).join("")}
    </div>
    <div class="calendar-grid">
      ${calendarCells()}
    </div>
  `;
}

function dayCalendarView() {
  const bookings = state.data.bookings
    .filter((booking) => booking.startTime.startsWith(state.selectedDate) && booking.status !== "cancelled")
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  return `
    <div class="calendar-agenda single">
      <div class="agenda-day-title">${formatDateLabel(state.selectedDate)}</div>
      ${daySlots(state.selectedDate, bookings)}
    </div>
  `;
}

function workWeekCalendarView() {
  const dates = workWeekDates(state.selectedDate);
  return `
    <div class="workweek-grid">
      ${dates.map((dateKey) => {
        const bookings = state.data.bookings
          .filter((booking) => booking.startTime.startsWith(dateKey) && booking.status !== "cancelled")
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        return `
          <section class="workweek-day ${dateKey === state.selectedDate ? "selected" : ""}" data-date="${dateKey}" role="button" tabindex="0">
            <strong>${new Intl.DateTimeFormat("en", { weekday: "short", day: "numeric" }).format(new Date(`${dateKey}T00:00`))}</strong>
            <div class="workweek-events">
              ${bookings.length ? bookings.map((booking) => calendarEventPill(booking)).join("") : `<span>${t("available")}</span>`}
            </div>
          </section>
        `;
      }).join("")}
    </div>
  `;
}

function workWeekDates(dateKey) {
  const date = new Date(`${dateKey}T00:00`);
  const day = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 6 }, (_, index) => {
    const current = new Date(monday);
    current.setDate(monday.getDate() + index);
    return toDateKey(current);
  });
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
    const isSelected = dateKey === state.selectedDate;

    return `
      <article class="calendar-cell ${isOtherMonth ? "muted" : ""} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}" data-date="${dateKey}" role="button" tabindex="0" title="Double click to book">
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
    <button class="calendar-pill ${booking.status}" type="button" data-booking-detail="${booking.id}" title="${escapeHtml(booking.title)}">
      <strong>${timeOnly(booking.startTime)} ${escapeHtml(booking.title)}</strong>
      <span>${escapeHtml(room?.name || "-")} - ${booking.status}</span>
    </button>
  `;
}

function roomDisplayLoginScreen() {
  applyPreferences();
  return `
    <main class="login-page">
      <section class="login-panel">
        ${brandMarkup("login-brand")}
        <div class="login-copy">
          <h1>${t("roomDisplayLogin")}</h1>
          <p>${t("roomDisplayLoginHelp")}</p>
        </div>
        <form data-form="room-display-login" class="login-form">
          <div class="field">
            <label>${t("usernameEmail")}</label>
            <input name="login" type="text" autocomplete="username" required>
          </div>
          <div class="field">
            <label>${t("password")}</label>
            ${passwordControl("password", "")}
          </div>
          <button class="btn full" type="submit">${t("login")}</button>
        </form>
        <button class="btn ghost full" type="button" data-action="back-login">${t("backToLogin")}</button>
      </section>
    </main>
    ${alertDialog()}
    <div class="toast" id="toast"></div>
  `;
}

function selectedDayPanel() {
  const bookings = state.data.bookings
    .filter((booking) => booking.startTime.startsWith(state.selectedDate) && booking.status !== "cancelled")
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  return `
    <aside class="day-panel">
      <div class="section-title">
        <div>
          <span class="status">${t("selectedDay")}</span>
          <h2>${formatDateLabel(state.selectedDate)}</h2>
        </div>
      </div>
      <p>${t("clickDateHint")}</p>
      <div class="day-timeline">
        ${daySlots(state.selectedDate, bookings)}
      </div>
    </aside>
  `;
}

function daySlots(dateKey, bookings) {
  return Array.from({ length: 21 }, (_, index) => {
    const minutes = (8 * 60) + (index * 30);
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const timeText = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    const slotStart = new Date(`${dateKey}T${timeText}`);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotStart.getMinutes() + 30);
    const slotBookings = bookings.filter((booking) => new Date(booking.startTime) < slotEnd && new Date(booking.endTime) > slotStart);
    return `
      <div class="day-slot ${slotBookings.length ? "busy" : "free"}" data-slot-start="${dateKey}T${timeText}" title="Double click to book this time">
        <strong>${timeText}</strong>
        <div>
          ${slotBookings.length ? slotBookings.map((booking) => {
            const room = byId(state.data.rooms, booking.roomId);
            return `<button class="day-slot-booking" type="button" data-booking-detail="${booking.id}">${timeOnly(booking.startTime)} - ${timeOnly(booking.endTime)} · ${escapeHtml(booking.title)} · ${escapeHtml(room?.name || "-")}</button>`;
          }).join("") : `<span>${t("available")}</span>`}
        </div>
      </div>
    `;
  }).join("");
}

function openBookingDraft(startTime) {
  const start = new Date(startTime);
  const end = new Date(start);
  end.setMinutes(start.getMinutes() + 30);
  state.selectedDate = startTime.slice(0, 10);
  state.calendarMonth = state.selectedDate.slice(0, 7);
  state.bookingDraft = {
    startTime,
    endTime: toLocalInputValue(end),
    roomId: state.filters.roomId !== "all" ? state.filters.roomId : (state.data.rooms[0]?.id || ""),
    title: "New meeting",
    attendees: "6"
  };
  state.modal = { type: "booking" };
  render();
}

function toLocalInputValue(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function notifications() {
  const reminders = upcomingReminders();
  return [...reminders, ...(state.data.notifications || []), ...state.notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function unreadNotifications() {
  return notifications().filter((item) => !isNotificationRead(item));
}

function isNotificationRead(item) {
  return Boolean(item.readAt) || state.readNotificationIds.includes(String(item.id));
}

function persistNotificationState() {
  localStorage.setItem("roombook-notifications", JSON.stringify(state.notifications));
  localStorage.setItem("roombook-read-notifications", JSON.stringify(state.readNotificationIds));
}

function markNotificationRead(id) {
  const idText = String(id);
  state.notifications = state.notifications.map((item) => String(item.id) === idText ? { ...item, readAt: item.readAt || new Date().toISOString() } : item);
  state.data.notifications = (state.data.notifications || []).map((item) => String(item.id) === idText ? { ...item, readAt: item.readAt || new Date().toISOString() } : item);
  if (!state.readNotificationIds.includes(idText)) state.readNotificationIds.push(idText);
  persistNotificationState();
}

function markAllNotificationsRead() {
  notifications().forEach((item) => markNotificationRead(item.id));
}

function upcomingReminders() {
  const now = new Date();
  return visibleBookings(state.data.bookings)
    .filter((booking) => booking.status === "approved")
    .map((booking) => ({ booking, minutesLeft: Math.round((new Date(booking.startTime) - now) / 60000) }))
    .filter((item) => item.minutesLeft >= 0 && item.minutesLeft <= 15)
    .map(({ booking, minutesLeft }) => {
      const room = byId(state.data.rooms, booking.roomId);
      return {
        id: `reminder-${booking.id}`,
        type: "reminder",
        title: t("upcomingReminder"),
        message: `${booking.title} · ${room?.name || "-"} · ${t("meetingStartsIn")} ${minutesLeft} ${t("minutes")}`,
        createdAt: booking.startTime
      };
    });
}

function notificationCard(item) {
  const read = isNotificationRead(item);
  return `
    <button class="notification-card ${item.type || "info"} ${read ? "read" : "unread"}" type="button" data-notification="${escapeHtml(item.id)}">
      <div class="notification-icon">${icon(item.type === "reminder" ? "bell" : "bookings")}</div>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.message)}</p>
        <span>${fmtDateTime(item.createdAt)} · ${read ? t("read") : t("unread")}</span>
      </div>
    </button>
  `;
}

function addNotification(item) {
  state.notifications = [
    { id: Date.now(), createdAt: new Date().toISOString(), readAt: null, ...item },
    ...state.notifications
  ].slice(0, 30);
  persistNotificationState();
}

function formatDateLabel(dateKey) {
  return new Intl.DateTimeFormat("en", { weekday: "long", month: "short", day: "numeric", year: "numeric" }).format(new Date(`${dateKey}T00:00`));
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

function roomDisplayScreen() {
  const data = state.roomPanel.data || { rooms: [], bookings: [], users: [], departments: [] };
  const roomId = state.roomPanel.roomId || data.rooms[0]?.id || "";
  const room = data.rooms.find((item) => Number(item.id) === Number(roomId)) || data.rooms[0];
  const bookings = data.bookings
    .filter((booking) => isRoomPanelBooking(booking, room))
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const active = currentRoomBooking(bookings);
  const nextBooking = bookings.find((booking) => new Date(booking.startTime) > new Date());
  return `
    <main class="display-page">
      <section class="display-shell">
        <div class="display-header">
          ${brandMarkup()}
          <button class="btn ghost" data-action="back-login">${t("backToLogin")}</button>
        </div>
        <div class="display-toolbar">
          <div>
            <span class="status">${t("roomPanel")}</span>
            <h1>${escapeHtml(room?.name || t("roomDisplay"))}</h1>
            <p>${escapeHtml(room?.floor || "")} · ${formatDateLabel(localDate())}</p>
          </div>
          <div class="display-room-actions">
            <div class="field">
              <label>${t("selectRoom")}</label>
              <select data-display-room>${data.rooms.map((item) => `<option value="${item.id}"${Number(item.id) === Number(room?.id) ? " selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}</select>
            </div>
            <button class="btn" type="button" data-action="toggle-instant-meeting">${t("instantMeeting")}</button>
          </div>
        </div>
        ${state.roomPanel.notice ? `<div class="display-notice ${state.roomPanel.notice.tone || "success"}">${escapeHtml(state.roomPanel.notice.message)}</div>` : ""}
        <div class="display-status ${active ? "busy" : "free"}">
          <span>${t("now")}</span>
          <strong>${active ? t("busyNow") : t("freeNow")}</strong>
          <p>${roomPanelStatusLine(active, nextBooking, bookings.length)}</p>
        </div>
        <div class="display-grid">
          <section class="card display-card">
            <div class="section-title"><h2>${t("todayBookings")}</h2></div>
            <div class="display-scroll">
              ${bookings.length ? bookings.map((booking) => roomPanelBooking(booking, data)).join("") : `<div class="empty">${t("noMeetingsToday")}</div>`}
            </div>
          </section>
          <section class="card display-card">
            <div class="section-title"><h2>${t("dayTimeline")}</h2></div>
            <div class="display-scroll">
              <div class="display-timeline">${roomPanelTimeline(bookings)}</div>
            </div>
          </section>
        </div>
      </section>
      ${state.roomPanel.instantOpen ? instantMeetingForm(room, data) : ""}
    </main>
  `;
}

function instantMeetingForm(room, data) {
  const times = instantMeetingDefaultTimes();
  return `
    <div class="modal open instant-meeting-modal" role="dialog" aria-modal="true" aria-labelledby="instant-meeting-title">
      <div class="modal-panel card instant-meeting-panel">
        <div class="section-title">
          <h2 id="instant-meeting-title">${t("instantMeetingBooking")}</h2>
          <button class="btn ghost" type="button" data-action="toggle-instant-meeting">${t("close")}</button>
        </div>
        <form data-form="instant-meeting">
          <div class="form-grid instant-meeting-grid">
            ${input(t("meetingTitle"), "title", "text", "")}
            <div class="instant-time-range wide">
              ${instantTimeControl("start", t("from"), times.start)}
              ${instantTimeControl("end", t("to"), times.end)}
            </div>
            ${input(t("attendees"), "attendees", "number", "1")}
            ${input(t("requesterName"), "requesterName", "text", "")}
            <div class="field">
              <label>${t("room")}</label>
              <input type="hidden" name="roomId" value="${Number(room?.id || 0)}">
              <input value="${escapeHtml(room?.name || "-")}" disabled>
            </div>
            <div class="field">
              <label>${t("department")}</label>
              <select name="departmentId" required>${optionList(data.departments, "")}</select>
            </div>
            <div class="field wide">
              <label>${t("purpose")}</label>
              <textarea name="purpose" placeholder="${t("purpose")}"></textarea>
            </div>
          </div>
          <button class="btn" type="submit">${t("bookInstantMeeting")}</button>
        </form>
      </div>
    </div>
  `;
}

function instantMeetingDefaultTimes() {
  const start = new Date();
  start.setSeconds(0, 0);
  start.setMinutes(Math.ceil(start.getMinutes() / 5) * 5);
  const end = new Date(start.getTime() + 30 * 60000);
  return { start: time12Parts(start), end: time12Parts(end) };
}

function time12Parts(date) {
  const hour24 = date.getHours();
  return {
    hour: hour24 % 12 || 12,
    minute: date.getMinutes(),
    period: hour24 >= 12 ? "PM" : "AM"
  };
}

function instantTimeControl(prefix, label, selected) {
  const hourOptions = Array.from({ length: 12 }, (_, index) => index + 1)
    .map((hour) => `<option value="${hour}"${hour === selected.hour ? " selected" : ""}>${String(hour).padStart(2, "0")}</option>`)
    .join("");
  const minuteOptions = Array.from({ length: 12 }, (_, index) => index * 5)
    .map((minute) => `<option value="${minute}"${minute === selected.minute ? " selected" : ""}>${String(minute).padStart(2, "0")}</option>`)
    .join("");
  return `
    <div class="field">
      <label>${label}</label>
      <div class="instant-time-control">
        <select name="${prefix}Hour" aria-label="${label} hour" required>${hourOptions}</select>
        <span>:</span>
        <select name="${prefix}Minute" aria-label="${label} minute" required>${minuteOptions}</select>
        <select name="${prefix}Period" aria-label="${label} AM or PM" required>
          <option value="AM"${selected.period === "AM" ? " selected" : ""}>AM</option>
          <option value="PM"${selected.period === "PM" ? " selected" : ""}>PM</option>
        </select>
      </div>
    </div>
  `;
}

function instantLocalDateTime(hour, minute, period) {
  const hour12 = Number(hour);
  const hour24 = (hour12 % 12) + (period === "PM" ? 12 : 0);
  return `${localDate()}T${String(hour24).padStart(2, "0")}:${String(Number(minute)).padStart(2, "0")}`;
}

function isRoomPanelBooking(booking, room) {
  return Number(booking.roomId) === Number(room?.id)
    && booking.status !== "cancelled"
    && sameDateKey(booking.startTime, localDate());
}

function sameDateKey(value, dateKey) {
  return toDateKey(new Date(value)) === dateKey;
}

function currentRoomBooking(bookings) {
  const now = new Date();
  return bookings.find((booking) => new Date(booking.startTime) <= now && new Date(booking.endTime) > now);
}

function roomPanelStatusLine(active, nextBooking, bookingCount) {
  if (active) return `${timeOnly(active.startTime)} - ${timeOnly(active.endTime)} · ${escapeHtml(active.title)}`;
  if (nextBooking) return `Next: ${timeOnly(nextBooking.startTime)} - ${timeOnly(nextBooking.endTime)} · ${escapeHtml(nextBooking.title)}`;
  if (bookingCount) return "No active meeting now.";
  return t("noMeetingsToday");
}

function roomPanelBooking(booking, data) {
  const requester = data.users.find((user) => Number(user.id) === Number(booking.requesterId));
  const department = data.departments.find((item) => Number(item.id) === Number(booking.departmentId));
  return `
    <div class="display-booking">
      <strong>${timeOnly(booking.startTime)} - ${timeOnly(booking.endTime)}</strong>
      <span>${escapeHtml(booking.title)}</span>
      <small>${t("bookedBy")} ${escapeHtml(booking.requesterName || requester?.name || "-")} · ${escapeHtml(department?.name || "-")}</small>
    </div>
  `;
}

function roomPanelTimeline(bookings) {
  return Array.from({ length: 21 }, (_, index) => {
    const minutes = (8 * 60) + (index * 30);
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const dateKey = localDate();
    const timeLabel = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    const slotStart = new Date(`${dateKey}T${timeLabel}`);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotStart.getMinutes() + 30);
    const busy = bookings.find((booking) => bookingOverlapsSlot(booking, slotStart, slotEnd));
    return `
      <div class="display-slot ${busy ? "busy" : "free"}">
        <strong>${timeLabel}</strong>
        <span>${busy ? `${timeOnly(busy.startTime)} - ${timeOnly(busy.endTime)} · ${escapeHtml(busy.title)}` : t("available")}</span>
      </div>
    `;
  }).join("");
}

function bookingOverlapsSlot(booking, slotStart, slotEnd) {
  return new Date(booking.startTime) < slotEnd && new Date(booking.endTime) > slotStart;
}

function filters() {
  const sortOptions = [
    ["start-desc", "Newest first"],
    ["start-asc", "Oldest first"],
    ["title-asc", "Meeting A-Z"],
    ["room-asc", "Room A-Z"],
    ["department-asc", "Department A-Z"]
  ];
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
      <div class="field">
        <label>Sort</label>
        <select data-filter="sortBy">
          ${sortOptions.map(([value, label]) => `<option value="${value}"${state.filters.sortBy === value ? " selected" : ""}>${label}</option>`).join("")}
        </select>
      </div>
    </div>
  `;
}

function filteredBookings() {
  const bookings = visibleBookings().filter((booking) => {
    const dateOk = !state.filters.date || booking.startTime.startsWith(state.filters.date);
    const depOk = state.filters.departmentId === "all" || Number(booking.departmentId) === Number(state.filters.departmentId);
    const roomOk = state.filters.roomId === "all" || Number(booking.roomId) === Number(state.filters.roomId);
    return dateOk && depOk && roomOk;
  });
  return sortBookings(bookings);
}

function sortBookings(bookings) {
  const copy = [...bookings];
  const text = (value) => String(value || "").toLowerCase();
  const byRoom = (booking) => byId(state.data.rooms, booking.roomId)?.name || "";
  const byDepartment = (booking) => byId(state.data.departments, booking.departmentId)?.name || "";
  const sorters = {
    "start-asc": (a, b) => new Date(a.startTime) - new Date(b.startTime),
    "start-desc": (a, b) => new Date(b.startTime) - new Date(a.startTime),
    "title-asc": (a, b) => text(a.title).localeCompare(text(b.title)),
    "room-asc": (a, b) => text(byRoom(a)).localeCompare(text(byRoom(b))),
    "department-asc": (a, b) => text(byDepartment(a)).localeCompare(text(byDepartment(b)))
  };
  return copy.sort(sorters[state.filters.sortBy] || sorters["start-desc"]);
}

function bookingTable(bookings) {
  if (!bookings.length) return `<div class="empty">${t("noBookings")}</div>`;
  return `
    <div class="table-wrap desktop-record-table">
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
                    ${canCancelBooking(booking) ? `<button class="btn ghost" data-cancel="${booking.id}">Cancel</button>` : ""}
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
    <div class="mobile-record-list">
      ${bookings.map((booking) => bookingRecordCard(booking)).join("")}
    </div>
  `;
}

function userRecordCard(user) {
  const department = byId(state.data.departments, user.departmentId);
  return `
    <article class="mobile-record-card">
      <div class="mobile-record-header">
        <div>
          <h3>${escapeHtml(user.name)}</h3>
          <span class="record-subtitle">${escapeHtml(user.email)}</span>
        </div>
        <span class="status">${user.isActive ? "Active" : "Inactive"}</span>
      </div>
      <div class="mobile-record-grid">
        <div>
          <span>${t("role")}</span>
          <strong>${escapeHtml(user.role)}</strong>
        </div>
        <div>
          <span>${t("department")}</span>
          <strong>${escapeHtml(department?.name || "-")}</strong>
        </div>
      </div>
      <div class="mobile-record-actions">
        ${canManageUser(user) ? `<button class="btn ghost" data-edit="user" data-id="${user.id}">${t("edit")}</button>` : ""}
        ${canDeleteUser(user) ? `<button class="btn ghost" data-delete-user="${user.id}">${t("delete")}</button>` : ""}
      </div>
    </article>
  `;
}

function bookingRecordCard(booking) {
  const room = byId(state.data.rooms, booking.roomId);
  const department = byId(state.data.departments, booking.departmentId);
  const requester = byId(state.data.users, booking.requesterId);
  return `
    <article class="mobile-record-card">
      <div class="mobile-record-header">
        <div>
          <h3>${escapeHtml(booking.title)}</h3>
          <span class="record-subtitle">${escapeHtml(requester?.name || "Unknown")}</span>
        </div>
        <span class="status ${booking.status}">${escapeHtml(booking.status)}</span>
      </div>
      <div class="mobile-record-grid booking-record-grid">
        <div>
          <span>${t("room")}</span>
          <strong>${escapeHtml(room?.name || "-")}</strong>
        </div>
        <div>
          <span>${t("department")}</span>
          <strong>${escapeHtml(department?.name || "-")}</strong>
        </div>
        <div class="wide">
          <span>${t("time")}</span>
          <strong>${fmtDateTime(booking.startTime)} - ${fmtDateTime(booking.endTime)}</strong>
        </div>
        <div>
          <span>${t("totalHours")}</span>
          <strong>${bookingHours(booking)}</strong>
        </div>
        <div>
          <span>${t("people")}</span>
          <strong>${booking.attendees}</strong>
        </div>
      </div>
      ${canCancelBooking(booking) ? `
        <div class="mobile-record-actions single">
          <button class="btn ghost" data-cancel="${booking.id}">Cancel</button>
        </div>
      ` : ""}
    </article>
  `;
}

function modal() {
  if (!state.modal) return `<div class="modal"></div>`;
  const forms = {
    booking: bookingForm,
    "booking-detail": bookingDetail,
    "notification-detail": notificationDetail,
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
  const cancel = state.alert.confirmCancel;
  const update = state.alert.updateAvailable;
  const tone = state.alert.tone || "";
  return `
    <div class="modal open alert-modal">
      <div class="modal-panel alert-panel ${escapeHtml(tone)}">
        <div class="section-title">
          <h2>${escapeHtml(state.alert.title || "Notice")}</h2>
          <button type="button" class="btn ghost" data-action="close-alert">Close</button>
        </div>
        <p>${escapeHtml(state.alert.message)}</p>
        ${state.alert.detail ? `<div class="alert-detail">${state.alert.detail}</div>` : ""}
        ${confirm ? `
          <div class="actions confirm-actions">
            <button type="button" class="btn ghost" data-action="close-alert">Cancel</button>
            <button type="button" class="btn danger" data-confirm-delete="${escapeHtml(confirm.kind)}" data-id="${confirm.id}">Delete</button>
          </div>
        ` : cancel ? `
          <form data-form="cancel-booking">
            <input type="hidden" name="bookingId" value="${cancel.id}">
            <div class="field">
              <label>${t("cancelReason")}</label>
              <textarea name="reason" required placeholder="${t("cancelReason")}"></textarea>
            </div>
            <div class="actions confirm-actions">
              <button type="button" class="btn ghost" data-action="close-alert">Close</button>
              <button type="submit" class="btn danger">${t("confirmCancel")}</button>
            </div>
          </form>
        ` : update ? `
          <div class="actions confirm-actions">
            <button type="button" class="btn ghost" data-action="close-alert">Later</button>
            <button type="button" class="btn" data-action="refresh-app">Refresh</button>
          </div>
        ` : `<button type="button" class="btn full" data-action="close-alert">OK</button>`}
      </div>
    </div>
  `;
}

function canEditBooking(booking) {
  return canManage() || Number(booking?.requesterId) === Number(state.currentUser?.id);
}

function bookingDetail() {
  const booking = modalItem("bookings");
  if (!booking) return `<div class="empty">${t("noBookings")}</div>`;
  const room = byId(state.data.rooms, booking.roomId);
  const department = byId(state.data.departments, booking.departmentId);
  const requester = byId(state.data.users, booking.requesterId);
  const editable = canEditBooking(booking) && booking.status !== "cancelled";
  return `
    <div class="booking-detail">
      <div class="detail-accent"></div>
      <div class="section-title">
        <h2>${escapeHtml(booking.title)}</h2>
        <button type="button" class="btn ghost" data-action="close-modal">${t("close")}</button>
      </div>
      <div class="detail-row">
        ${icon("calendar")}
        <div>
          <strong>${fmtDateTime(booking.startTime)} - ${fmtDateTime(booking.endTime)}</strong>
          <span>${bookingHours(booking)} · <span class="status ${booking.status}">${booking.status}</span></span>
        </div>
      </div>
      <div class="detail-row">
        ${icon("rooms")}
        <div>
          <strong>${escapeHtml(room?.name || "-")}</strong>
          <span>${escapeHtml(room?.floor || "")}</span>
        </div>
      </div>
      <div class="detail-row">
        ${icon("users")}
        <div>
          <strong>${escapeHtml(requester?.name || "-")}</strong>
          <span>${escapeHtml(department?.name || "-")} · ${booking.attendees} ${t("people")}</span>
        </div>
      </div>
      ${booking.purpose ? `<div class="alert-detail">${escapeHtml(booking.purpose)}</div>` : ""}
      ${booking.cancelReason ? `<div class="alert-detail"><strong>${t("cancelReason")}</strong><br>${escapeHtml(booking.cancelReason)}</div>` : ""}
      <div class="actions detail-actions">
        ${editable ? `
          <button type="button" class="btn" data-edit-booking="${booking.id}">${t("edit")}</button>
          ${canCancelBooking(booking) ? `<button type="button" class="btn danger" data-cancel="${booking.id}">Cancel</button>` : ""}
        ` : `<span class="status">View only</span>`}
      </div>
    </div>
  `;
}

function notificationDetail() {
  const item = notifications().find((notification) => String(notification.id) === String(state.modal?.id));
  if (!item) return `<div class="empty">${t("notificationEmpty")}</div>`;
  const read = isNotificationRead(item);
  return `
    <div class="booking-detail">
      <div class="detail-accent"></div>
      <div class="section-title">
        <h2>${t("notificationDetail")}</h2>
        <button type="button" class="btn ghost" data-action="close-modal">${t("close")}</button>
      </div>
      <div class="detail-row">
        ${icon(item.type === "reminder" ? "bell" : "bookings")}
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <span>${fmtDateTime(item.createdAt)} · ${read ? t("read") : t("unread")}</span>
        </div>
      </div>
      <div class="alert-detail">${escapeHtml(item.message)}</div>
      <div class="actions detail-actions">
        <button type="button" class="btn" data-action="close-modal">OK</button>
      </div>
    </div>
  `;
}

function bookingForm() {
  const normalUser = !canManage();
  const booking = modalItem("bookings");
  const requesterId = normalUser ? state.currentUser.id : (booking?.requesterId || 2);
  const departmentId = normalUser ? state.currentUser.departmentId : (booking?.departmentId || "");
  const draft = state.bookingDraft || {};
  const data = { ...booking, ...draft };
  return `
    <form data-form="booking">
      <div class="section-title">
        <h2>${booking ? "Edit booking" : t("newBooking")}</h2>
        <button type="button" class="btn ghost" data-action="close-modal">${t("close")}</button>
      </div>
      <div class="form-grid">
        ${input(t("title"), "title", "text", data.title || "Project planning")}
        <div class="field">
          <label>${t("room")}</label>
          <select name="roomId" required>${optionList(state.data.rooms, data.roomId || "")}</select>
        </div>
        <div class="field">
          <label>${t("requester")}</label>
          ${normalUser
            ? `<input type="hidden" name="requesterId" value="${state.currentUser.id}"><input value="${escapeHtml(state.currentUser.name)}" disabled>`
            : `<select name="requesterId" required>${optionList(state.data.users, data.requesterId || requesterId)}</select>`}
        </div>
        <div class="field">
          <label>${t("department")}</label>
          ${normalUser
            ? `<input type="hidden" name="departmentId" value="${state.currentUser.departmentId}"><input value="${escapeHtml(byId(state.data.departments, state.currentUser.departmentId)?.name || "-")}" disabled>`
            : `<select name="departmentId" required>${optionList(state.data.departments, data.departmentId || departmentId)}</select>`}
        </div>
        ${timeInput(t("startTime"), "startTime", data.startTime || localDateAt("11:00"))}
        ${timeInput(t("endTime"), "endTime", data.endTime || localDateAt("12:00"))}
        <div class="field">
          <label>${t("availability")}</label>
          <button class="btn secondary" type="button" data-action="check-availability">${t("checkAvailability")}</button>
        </div>
        ${input(t("attendees"), "attendees", "number", data.attendees || "6")}
        <div class="field wide">
          <label>${t("purpose")}</label>
          <textarea name="purpose" placeholder="Meeting purpose">${escapeHtml(data.purpose || "")}</textarea>
        </div>
      </div>
      <br>
      <button class="btn" type="submit">${booking ? "Update booking" : t("saveBooking")}</button>
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
        ${input("Password", "password", "password", "", user ? false : true)}
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
  return availableRoles()
    .map((role) => `<option value="${role}"${selectedRole === role ? " selected" : ""}>${role === "user" ? "normal user" : role}</option>`)
    .join("");
}

function input(label, name, type, value, required = true) {
  return `
    <div class="field">
      <label>${label}</label>
      ${type === "password" ? passwordControl(name, value, required) : `<input name="${name}" type="${type}" value="${escapeHtml(value)}"${required ? " required" : ""}>`}
    </div>
  `;
}

function passwordControl(name, value = "", required = true) {
  return `
    <div class="password-control">
      <input name="${name}" type="password" value="${escapeHtml(value)}" autocomplete="${name === "password" ? "current-password" : "new-password"}"${required ? " required" : ""}>
      <button type="button" class="password-toggle" data-action="toggle-password" aria-label="Show password" title="Show password">
        ${icon("eye")}
      </button>
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

function showNavTooltip(target) {
  if (window.matchMedia("(max-width: 760px)").matches) return;
  const shell = target.closest(".shell");
  const tooltip = document.querySelector("#nav-hover-tooltip");
  const label = target.dataset.navTooltip;
  if (!shell?.classList.contains("nav-collapsed") || !tooltip || !label) return;

  tooltip.textContent = label;
  tooltip.classList.add("show");
  const targetRect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const top = Math.min(
    window.innerHeight - tooltipRect.height - 8,
    Math.max(8, targetRect.top + (targetRect.height - tooltipRect.height) / 2)
  );
  const left = Math.min(window.innerWidth - tooltipRect.width - 8, targetRect.right + 12);
  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
}

function hideNavTooltip() {
  document.querySelector("#nav-hover-tooltip")?.classList.remove("show");
}

function bindEvents() {
  document.querySelectorAll("[data-nav-tooltip]").forEach((button) => {
    button.addEventListener("mouseenter", () => showNavTooltip(button));
    button.addEventListener("mouseleave", hideNavTooltip);
    button.addEventListener("focus", () => showNavTooltip(button));
    button.addEventListener("blur", hideNavTooltip);
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.view = button.dataset.view;
      state.navOpen = false;
      if (state.currentUser) {
        try {
          await loadData();
        } catch (error) {
          // Keep navigation responsive if the session expires between refreshes.
        }
      }
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
      showSuccess("Deleted successfully", "The selected record has been deleted.");
    });
  });

  document.querySelectorAll("[data-action='toggle-nav']").forEach((button) => {
    button.addEventListener("click", () => {
      state.navOpen = !state.navOpen;
      render();
    });
  });

  document.querySelectorAll("[data-action='collapse-nav']").forEach((button) => {
    button.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 760px)").matches) {
        state.navOpen = false;
        render();
        return;
      }
      state.navCollapsed = !state.navCollapsed;
      localStorage.setItem("roombook-nav-collapsed", String(state.navCollapsed));
      render();
    });
  });

  document.querySelectorAll("[data-action='toggle-settings']").forEach((button) => {
    button.addEventListener("click", () => {
      state.settingsOpen = !state.settingsOpen;
      localStorage.setItem("roombook-settings-open", String(state.settingsOpen));
      render();
    });
  });

  document.querySelectorAll("[data-action='toggle-password']").forEach((button) => {
    button.addEventListener("click", () => {
      const inputEl = button.closest(".password-control")?.querySelector("input");
      if (!inputEl) return;
      const show = inputEl.type === "password";
      inputEl.type = show ? "text" : "password";
      button.innerHTML = icon(show ? "eyeOff" : "eye");
      button.setAttribute("aria-label", show ? "Hide password" : "Show password");
      button.title = show ? "Hide password" : "Show password";
    });
  });

  document.querySelectorAll("[data-date]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedDate = button.dataset.date;
      state.calendarMonth = state.selectedDate.slice(0, 7);
      render();
    });
    button.addEventListener("dblclick", () => {
      openBookingDraft(`${button.dataset.date}T09:00`);
    });
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        state.selectedDate = button.dataset.date;
        state.calendarMonth = state.selectedDate.slice(0, 7);
        render();
      }
    });
  });

  document.querySelectorAll("[data-slot-start]").forEach((slot) => {
    slot.addEventListener("dblclick", () => openBookingDraft(slot.dataset.slotStart));
  });

  document.querySelectorAll("[data-booking-detail]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      state.modal = { type: "booking-detail", id: Number(button.dataset.bookingDetail) };
      render();
    });
  });

  document.querySelectorAll("[data-notification]").forEach((button) => {
    button.addEventListener("click", () => {
      const notificationId = button.dataset.notification;
      markNotificationRead(notificationId);
      state.modal = { type: "notification-detail", id: notificationId };
      render();
      if (!String(notificationId).startsWith("reminder-")) {
        apiFetch(`/api/notifications/${notificationId}/read`, { method: "POST" })
          .then((updated) => {
            state.data.notifications = state.data.notifications.map((item) => Number(item.id) === Number(updated.id) ? updated : item);
            if (state.view === "notifications") render();
          })
          .catch(() => {
            // Local read state still keeps the badge responsive if the item was already removed.
          });
      }
    });
  });

  document.querySelectorAll("[data-action='mark-all-read']").forEach((button) => {
    button.addEventListener("click", async () => {
      markAllNotificationsRead();
      try {
        await apiFetch("/api/notifications/read-all", { method: "POST" });
      } catch (error) {
        // Keep the UI readable even if an old local reminder is the only unread item.
      }
      render();
    });
  });

  document.querySelectorAll("[data-delete-role]").forEach((button) => {
    button.addEventListener("click", async () => {
      const role = button.dataset.deleteRole;
      if (coreRoles().includes(role)) {
        state.alert = { message: "Core roles cannot be deleted.", tone: "danger" };
        return render();
      }
      if (state.data.users.some((user) => user.role === role)) {
        state.alert = { message: "This role is used by existing users. Move those users to another role first.", tone: "danger" };
        return render();
      }
      const roles = availableRoles().filter((item) => item !== role);
      const modulePermissions = { ...(state.data.settings?.modulePermissions || {}) };
      delete modulePermissions[role];
      const settings = await apiFetch("/api/settings", {
        method: "PUT",
        body: JSON.stringify({ roles, modulePermissions })
      });
      state.data.settings = settings;
      state.alert = null;
      showSuccess("Role deleted", "The selected role has been deleted.");
    });
  });

  document.querySelectorAll("[data-edit-booking]").forEach((button) => {
    button.addEventListener("click", () => {
      state.bookingDraft = null;
      state.modal = { type: "booking", id: Number(button.dataset.editBooking) };
      render();
    });
  });

  document.querySelectorAll("[data-action='open-room-display-login']").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentUser = null;
      state.roomPanel.login = true;
      state.roomPanel.active = false;
      state.alert = null;
      render();
    });
  });

  document.querySelectorAll("[data-action='back-login']").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await apiFetch("/api/logout", { method: "POST" });
      } catch (error) {
        // Returning to the login screen should still work if the session already expired.
      }
      localStorage.removeItem("roombook-current-user");
      stopNotificationPolling();
      state.currentUser = null;
      state.roomPanel.active = false;
      state.roomPanel.login = false;
      state.roomPanel.data = null;
      render();
    });
  });

  document.querySelectorAll("[data-display-room]").forEach((select) => {
    select.addEventListener("change", () => {
      state.roomPanel.roomId = select.value;
      localStorage.setItem("roombook-display-room", select.value);
      render();
    });
  });

  document.querySelectorAll("[data-action='toggle-instant-meeting']").forEach((button) => {
    button.addEventListener("click", () => {
      state.roomPanel.instantOpen = !state.roomPanel.instantOpen;
      state.roomPanel.notice = null;
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
    button.addEventListener("click", (event) => {
      event.preventDefault();
      button.disabled = true;
      void logoutCurrentUser();
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

  document.querySelectorAll("[data-calendar-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.calendarView = button.dataset.calendarView;
      localStorage.setItem("roombook-calendar-view", state.calendarView);
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
    form.addEventListener("submit", (event) => {
      handleForm(event).catch((error) => {
        if (form.dataset.form === "instant-meeting") {
          state.roomPanel.notice = { message: error.payload?.message || error.message || "Please try again.", tone: "danger" };
          return render();
        }
        state.alert = { title: "Request failed", message: error.payload?.message || error.message || "Please try again.", tone: "danger" };
        render();
      });
    });
  });

  document.querySelectorAll("[data-approve]").forEach((button) => {
    button.addEventListener("click", () => updateBookingStatus(Number(button.dataset.approve), "approved"));
  });

  document.querySelectorAll("[data-cancel]").forEach((button) => {
    button.addEventListener("click", () => cancelBooking(Number(button.dataset.cancel)));
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
    let sessionExpiresAt;
    try {
      ({ user, sessionExpiresAt } = await apiFetch("/api/login", {
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
    scheduleSessionTimeout(sessionExpiresAt);
    state.view = "dashboard";
    await loadData();
    startNotificationPolling();
    render();
    return notify("Logged in successfully.");
  }

  if (type === "room-display-login") {
    let user;
    let sessionExpiresAt;
    try {
      ({ user, sessionExpiresAt } = await apiFetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ login: values.login, password: values.password })
      }));
    } catch (error) {
      state.alert = { title: "Room display login failed", message: "Username or password is incorrect.", tone: "danger" };
      return render();
    }
    if (!user.isActive || user.role !== "administrator") {
      try {
        await apiFetch("/api/logout", { method: "POST" });
      } catch (error) {
        // The next render clears local state even if the server session is already gone.
      }
      state.currentUser = null;
      state.alert = { title: "Administrator required", message: t("adminOnly"), tone: "danger" };
      return render();
    }
    state.currentUser = user;
    scheduleSessionTimeout(sessionExpiresAt);
    await loadData();
    startNotificationPolling();
    await loadRoomPanelData();
    state.roomPanel.login = false;
    state.roomPanel.active = true;
    render();
    return notify("Room display opened.");
  }

  if (type === "instant-meeting") {
    const startTime = instantLocalDateTime(values.startHour, values.startMinute, values.startPeriod);
    const endTime = instantLocalDateTime(values.endHour, values.endMinute, values.endPeriod);
    const timeError = bookingTimeError(startTime, endTime);
    if (timeError) {
      state.roomPanel.notice = { message: timeError, tone: "danger" };
      return render();
    }
    const savedBooking = await apiFetch("/api/bookings/instant", {
      method: "POST",
      body: JSON.stringify({
        title: values.title,
        startTime,
        endTime,
        attendees: Number(values.attendees),
        requesterName: values.requesterName,
        roomId: Number(values.roomId),
        departmentId: Number(values.departmentId),
        purpose: values.purpose
      })
    });
    await loadData();
    await loadRoomPanelData();
    state.roomPanel.instantOpen = false;
    state.roomPanel.notice = { message: `${savedBooking.title} has been booked for ${timeOnly(savedBooking.startTime)} - ${timeOnly(savedBooking.endTime)}.`, tone: "success" };
    return render();
  }

  if (type === "booking") {
    state.bookingDraft = values;
    const timeError = bookingTimeError(values.startTime, values.endTime);
    if (timeError) {
      state.alert = { title: "Invalid time", message: timeError };
      return render();
    }
    await loadData();
    const conflict = findConflict(Number(values.roomId), values.startTime, values.endTime, editId);
    if (conflict) {
      return showConflict(conflict);
    }
    let savedBooking;
    try {
      savedBooking = await put("bookings", {
        ...(editId ? { id: editId } : {}),
        title: values.title,
        roomId: Number(values.roomId),
        requesterId: Number(values.requesterId),
        departmentId: Number(values.departmentId),
        startTime: values.startTime,
        endTime: values.endTime,
        attendees: Number(values.attendees),
        status: editId ? (byId(state.data.bookings, editId)?.status || "approved") : "approved",
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
    state.selectedDate = values.startTime.slice(0, 10);
    state.bookingDraft = null;
    const room = byId(state.data.rooms, Number(values.roomId));
    if (editId) {
      addNotification({
        type: "success",
        title: "Booking updated",
        message: `${savedBooking.title} - ${room?.name || "-"} - ${fmtDateTime(savedBooking.startTime)}`,
        createdAt: new Date().toISOString()
      });
    }
  }

  if (type === "cancel-booking") {
    const reason = String(values.reason || "").trim();
    if (!reason) {
      state.alert = { ...state.alert, message: `${t("cancelBookingMessage")} ${t("cancelReason")} is required.`, tone: "danger" };
      return render();
    }
    await apiFetch(`/api/bookings/${Number(values.bookingId)}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason })
    });
    state.alert = null;
    state.modal = null;
    await loadData();
    return showSuccess(t("bookingCancelled"), "The booking has been cancelled successfully.");
  }

  if (type === "settings") {
    const modulePermissions = {};
    availableRoles().forEach((role) => {
      modulePermissions[role] = role === "administrator" ? [...navItems.map((item) => item.id), "cancel-bookings", "settings"] : ["change-password", "settings"];
      permissionItems.forEach((permission) => {
        if (values[`${role}:${permission.id}`] === "on" && !modulePermissions[role].includes(permission.id)) {
          modulePermissions[role].push(permission.id);
        }
      });
      if (role !== "administrator") {
        modulePermissions[role] = modulePermissions[role].filter((id) => !["module-permissions", "role-setup"].includes(id));
      }
    });
    const settings = await apiFetch("/api/settings", {
      method: "PUT",
      body: JSON.stringify({ modulePermissions, roles: availableRoles() })
    });
    state.data.settings = settings;
    return showSuccess("Settings saved", "Module permissions have been updated successfully.");
  }

  if (type === "role-setup") {
    const roleName = String(values.roleName || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
    if (!/^[a-z][a-z0-9_-]{1,30}$/.test(roleName)) {
      state.alert = { message: "Role name must start with a letter and use letters, numbers, dash, or underscore.", tone: "danger" };
      return render();
    }
    if (availableRoles().includes(roleName)) {
      state.alert = { message: "This role already exists.", tone: "danger" };
      return render();
    }
    const roles = [...availableRoles(), roleName];
    const modulePermissions = { ...(state.data.settings?.modulePermissions || {}) };
    modulePermissions[roleName] = defaultModulesForRole(roleName);
    const settings = await apiFetch("/api/settings", {
      method: "PUT",
      body: JSON.stringify({ roles, modulePermissions })
    });
    state.data.settings = settings;
    state.alert = null;
    return showSuccess("Role saved", "The new role has been added successfully.");
  }

  if (type === "change-password") {
    await apiFetch("/api/me/password", {
      method: "POST",
      body: JSON.stringify({ oldPassword: values.oldPassword, newPassword: values.newPassword })
    });
    return showSuccess("Password updated", "Your password has been changed successfully.");
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
  showSuccess(editId ? "Updated successfully" : "Saved successfully", successMessageFor(type, editId));
}

function successMessageFor(type, editId = null) {
  const action = editId ? "updated" : "saved";
  const messages = {
    booking: `Booking ${action} successfully.`,
    room: `Room ${action} successfully.`,
    user: `User ${action} successfully.`,
    "assign-user": "User added to department successfully.",
    department: `Department ${action} successfully.`
  };
  return messages[type] || `Record ${action} successfully.`;
}

function showSuccess(title, message) {
  state.alert = { title, message, tone: "success" };
  render();
}

function findConflict(roomId, startTime, endTime, excludeId = null) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return state.data.bookings.find((booking) => {
    if (Number(booking.roomId) !== roomId || booking.status === "cancelled") return false;
    if (excludeId && Number(booking.id) === Number(excludeId)) return false;
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
  const conflict = findConflict(Number(values.roomId), values.startTime, values.endTime, state.modal?.id);
  if (conflict) return showConflict(conflict);
  state.alert = {
    title: "Room available",
    message: "This room is available for the selected date and time.",
    tone: "success"
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
    state.selectedDate = localDate();
    state.calendarMonth = state.selectedDate.slice(0, 7);
    return;
  }
  if (state.calendarView === "day" || state.calendarView === "workweek") {
    const date = new Date(`${state.selectedDate}T00:00`);
    date.setDate(date.getDate() + (direction === "next" ? 1 : -1) * (state.calendarView === "workweek" ? 7 : 1));
    state.selectedDate = toDateKey(date);
    state.calendarMonth = state.selectedDate.slice(0, 7);
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
  showSuccess(`Booking ${status}`, `The booking has been ${status} successfully.`);
}

async function cancelBooking(id) {
  const booking = byId(state.data.bookings, id);
  if (!booking) return;
  if (!canCancelBooking(booking)) {
    state.alert = { title: "View only", message: "You cannot cancel this booking." };
    render();
    return;
  }
  state.alert = {
    title: t("cancelBookingTitle"),
    message: t("cancelBookingMessage"),
    tone: "danger",
    confirmCancel: { id }
  };
  render();
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
let notificationTimer = null;
let updateTimer = null;
let sessionTimeoutTimer = null;
let notifiedUpdateVersion = null;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
});

document.addEventListener("click", async (event) => {
  if (event.target.matches("[data-action='refresh-app']")) {
    await refreshApp();
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

async function checkForAppUpdate() {
  if (IS_NATIVE_APP) return;
  try {
    const response = await fetch(`/version.json?ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    const availableVersion = String(payload.version || "");
    if (availableVersion && availableVersion !== APP_VERSION && availableVersion !== notifiedUpdateVersion) {
      notifiedUpdateVersion = availableVersion;
      state.alert = {
        title: "Update available",
        message: "A new version is ready. Refresh to load the latest changes.",
        tone: "success",
        updateAvailable: true
      };
      render();
    }
  } catch {
    // Version checks are best-effort so the app keeps working offline or during server restarts.
  }
}

async function refreshApp() {
  if (IS_NATIVE_APP) return window.location.reload();
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }
  window.location.reload();
}

async function refreshNotifications({ rerender = false } = {}) {
  if (!state.currentUser) return;
  const before = unreadNotifications().length;
  const payload = await apiFetch("/api/notifications");
  state.data.notifications = payload.notifications || [];
  const after = unreadNotifications().length;
  if (rerender || after !== before || state.view === "notifications") render();
}

function startNotificationPolling() {
  stopNotificationPolling();
  if (!state.currentUser) return;
  notificationTimer = window.setInterval(() => {
    refreshNotifications().catch(() => {});
  }, 7000);
}

function stopNotificationPolling() {
  if (!notificationTimer) return;
  window.clearInterval(notificationTimer);
  notificationTimer = null;
}

function stopSessionTimeout() {
  if (sessionTimeoutTimer) window.clearTimeout(sessionTimeoutTimer);
  sessionTimeoutTimer = null;
  state.sessionExpiresAt = null;
}

function scheduleSessionTimeout(expiresAt) {
  stopSessionTimeout();
  if (!state.currentUser || !expiresAt) return;
  const delay = new Date(expiresAt).getTime() - Date.now();
  state.sessionExpiresAt = expiresAt;
  if (!Number.isFinite(delay) || delay <= 0) return expireSession();
  sessionTimeoutTimer = window.setTimeout(expireSession, delay);
}

function expireSession() {
  stopNotificationPolling();
  stopSessionTimeout();
  localStorage.removeItem("roombook-current-user");
  state.currentUser = null;
  state.data = { departments: [], users: [], rooms: [], bookings: [], notifications: [], settings: { modulePermissions: {} } };
  state.navOpen = false;
  state.roomPanel.active = false;
  state.roomPanel.login = false;
  state.roomPanel.data = null;
  state.alert = {
    title: "Session expired",
    message: "Your session has expired. Please sign in again.",
    tone: "danger"
  };
  render();
}

function logoutCurrentUser() {
  const logoutRequest = fetch(`${API_ORIGIN}/api/logout`, {
    method: "POST",
    credentials: IS_NATIVE_APP ? "include" : "same-origin",
    headers: { "Content-Type": "application/json" },
    keepalive: true
  }).catch(() => null);

  stopNotificationPolling();
  stopSessionTimeout();
  localStorage.removeItem("roombook-current-user");
  state.currentUser = null;
  state.data = { departments: [], users: [], rooms: [], bookings: [], notifications: [], settings: { modulePermissions: {} } };
  state.navOpen = false;
  state.roomPanel.active = false;
  state.roomPanel.login = false;
  state.roomPanel.data = null;
  render();
  return logoutRequest;
}

function startUpdatePolling() {
  if (updateTimer) window.clearInterval(updateTimer);
  checkForAppUpdate();
  updateTimer = window.setInterval(() => {
    checkForAppUpdate();
  }, 60000);
}

async function init() {
  const launchParams = new URLSearchParams(window.location.search);
  const pathLaunch = window.location.pathname.replace(/\/+$/, "").endsWith("/room-display");
  const roomDisplayLaunch = IS_NATIVE_APP || pathLaunch || launchParams.get("roomDisplay") === "1" || launchParams.get("roomPanel") === "1";
  const { user, sessionExpiresAt } = await apiFetch("/api/me");
  state.currentUser = user;
  if (state.currentUser) {
    scheduleSessionTimeout(sessionExpiresAt);
    await loadData();
    startNotificationPolling();
    if (roomDisplayLaunch && state.currentUser.role === "administrator") {
      await loadRoomPanelData();
      state.roomPanel.login = false;
      state.roomPanel.active = true;
    }
  } else if (roomDisplayLaunch) {
    state.roomPanel.login = true;
    state.roomPanel.active = false;
  }
  render();
  if (!IS_NATIVE_APP) startUpdatePolling();
  if (!IS_NATIVE_APP && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

init().catch((error) => {
  document.querySelector("#app").innerHTML = `<main class="main"><div class="card"><h1>App failed to start</h1><p>${escapeHtml(error.message)}</p></div></main>`;
});
