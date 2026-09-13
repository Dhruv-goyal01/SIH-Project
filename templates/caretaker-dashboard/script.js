let nbActiveLang = 'en';
const nbTranslationCache = {}; // { langCode: { originalText: translatedText } }

function setToggle(isOn){
  document.getElementById('toggleOn').classList.toggle('on', isOn);
  document.getElementById('toggleOff').classList.toggle('on', !isOn);
}

let textScale = 1;
function resizeText(dir){
  textScale = Math.min(1.3, Math.max(0.85, textScale + dir * 0.08));
  document.body.style.fontSize = (16 * textScale) + 'px';
}

//  Render a patient's data into the dashboard 
function nbRenderPatient(id){
  const patient = nbGetPatient(id);

  // Greeting + banner photo
  const greetingTitle = document.getElementById('greetingTitle');
  if (greetingTitle) greetingTitle.textContent = `Good Morning, ${patient.name} and Care Team!`;

  nbSetAvatar('bannerPhoto', 'bannerPhotoFallback', patient);

  // Location chip
  const locationValue = document.getElementById('locationChipValue');
  if (locationValue) locationValue.textContent = patient.location;
  const liveDot = document.getElementById('liveDot');
  if (liveDot) liveDot.style.display = 'none';

  // Status card
  const statusHeading = document.getElementById('statusHeading');
  if (statusHeading) statusHeading.textContent = `${patient.name}'s Current Status`;

  nbSetAvatar('statusPhoto', 'statusPhotoFallback', patient);

  setText('statusLastActive', patient.lastActive);
  setText('statusMood', patient.mood);
  setText('statusActivity', patient.activityLevel);
  setText('statusFocus', patient.focusLevel);

  const alertPill = document.getElementById('statusAlertPill');
  const notifToggle = document.getElementById('notifToggle');
  if (alertPill) {
    const notifsOn = !notifToggle || notifToggle.checked;
    alertPill.style.display = (patient.alert && notifsOn) ? 'inline-block' : 'none';
  }

  // Exercise progress 
  const exerciseHeading = document.getElementById('exerciseHeading');
  if (exerciseHeading) exerciseHeading.textContent = `${patient.name}'s Exercise Progress`;

  const cognitiveEl = document.getElementById('cognitiveExerciseText');
  if (cognitiveEl) cognitiveEl.innerHTML = `${patient.cognitiveDone} of ${patient.cognitiveTotal}<span>Cognitive Exercises</span>`;

  const barFill = document.getElementById('exerciseBarFill');
  if (barFill) barFill.style.width = patient.exercisePercent + '%';

  setText('remainingText', patient.remainingText);

  // Daily Activity Overview
  setText('totalPlayTime', `Total Play Time: ${patient.totalPlayTime}`);

  const tagRow = document.getElementById('tagRow');
  if (tagRow) {
    tagRow.innerHTML = '';
    patient.tags.forEach(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      tagRow.appendChild(span);
    });
  }

  setText('memoryMeta', patient.games.memory.meta);
  setText('bestMeta', patient.games.best.meta);
  setText('logicMeta', patient.games.logic.meta);

  document.querySelectorAll('.game-row[data-game]').forEach(row => {
    const type = row.getAttribute('data-game');
    row.href = `/caretaker/analysis-${type}.html?patient=${patient.id}`;
  });

  // Today's Schedule
  nbRenderSchedule(patient.id);

  // Care Logs 
  nbRenderCareLog(patient.id);

  // Training Profiles
  nbRenderTrainingProfiles(patient.id);

  // Re-apply translation 
  if (typeof nbApplyActiveTranslation === 'function') nbApplyActiveTranslation();
}

// Training Profiles (faces the patient is learning to recognise)
function nbRenderTrainingProfiles(id){
  const grid = document.getElementById('trainingGrid');
  if (!grid) return;

  const profiles = nbGetTrainingProfiles(id);
  grid.innerHTML = '';

  if (profiles.length === 0) {
    const empty = document.createElement('a');
    empty.className = 'training-empty';
    empty.href = `/caretaker/add-training-profile.html?patient=${id}`;
    empty.innerHTML = `
      <div class="training-empty-circle">+</div>
      <span class="training-name">Add profile</span>
    `;
    grid.appendChild(empty);
    return;
  }

  profiles.forEach(p => {
    const item = document.createElement('div');
    item.className = 'training-profile';

    const avatarBg = p.photo ? ` style="background-image:url('${p.photo}')"` : '';
    const initials = p.photo ? '' : (p.initial || p.name.charAt(0));

    item.innerHTML = `
      <div class="training-avatar-wrap">
        <div class="training-avatar"${avatarBg}>${initials}</div>
        <a class="training-avatar-add" href="/caretaker/add-training-profile.html?patient=${id}"
           title="Add more training photos for ${p.name}" aria-label="Add more training photos for ${p.name}">+</a>
      </div>
      <span class="training-name" title="${p.name}">${p.name}</span>
    `;
    grid.appendChild(item);
  });
}

// Top "+" on the Training Profiles card opens an inline form instead of
// navigating away, so caretakers can add a profile without leaving the dashboard.
const trainingAddBtn = document.getElementById('trainingAddBtn');
if (trainingAddBtn) {
  trainingAddBtn.addEventListener('click', () => {
    nbOpenTrainingModal();
  });
}

let nbTrainingPhotoDataUrl = null;

function nbOpenTrainingModal(){
  const overlay = document.getElementById('trainingModalOverlay');
  if (!overlay) return;

  nbTrainingPhotoDataUrl = null;
  document.getElementById('trainingNameInput').value = '';
  document.getElementById('trainingRelationInput').value = '';
  document.getElementById('trainingNameErrorWrap').style.display = 'none';

  const preview = document.getElementById('trainingPhotoPreview');
  preview.style.backgroundImage = '';
  preview.textContent = '+';

  overlay.classList.add('open');
}

function nbCloseTrainingModal(){
  document.getElementById('trainingModalOverlay')?.classList.remove('open');
}

const trainingPhotoInput = document.getElementById('trainingPhotoInput');
const trainingPhotoPreview = document.getElementById('trainingPhotoPreview');
if (trainingPhotoInput) {
  trainingPhotoInput.addEventListener('change', () => {
    const file = trainingPhotoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      nbTrainingPhotoDataUrl = reader.result;
      trainingPhotoPreview.style.backgroundImage = `url('${nbTrainingPhotoDataUrl}')`;
      trainingPhotoPreview.textContent = '';
    };
    reader.readAsDataURL(file);
  });
}

document.getElementById('trainingSaveBtn')?.addEventListener('click', () => {
  const patientId = nbGetActivePatientId();
  const name = document.getElementById('trainingNameInput').value.trim();
  const relation = document.getElementById('trainingRelationInput').value.trim();
  const errorWrap = document.getElementById('trainingNameErrorWrap');

  if (!name) {
    errorWrap.style.display = 'block';
    document.getElementById('trainingNameInput').focus();
    return;
  }
  errorWrap.style.display = 'none';

  const fullName = relation ? `${name} (${relation})` : name;
  nbAddTrainingProfile(patientId, {
    id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    name: fullName,
    initial: name.charAt(0).toUpperCase(),
    photo: nbTrainingPhotoDataUrl
  });

  nbRenderTrainingProfiles(patientId);
  nbCloseTrainingModal();
});

document.getElementById('trainingModalClose')?.addEventListener('click', nbCloseTrainingModal);
document.getElementById('trainingModalOverlay')?.addEventListener('click', (e) => {
  if (e.target.id === 'trainingModalOverlay') nbCloseTrainingModal();
});

function setText(id, text){
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function nbSetAvatar(imgId, fallbackId, patient){
  const img = document.getElementById(imgId);
  const fallback = document.getElementById(fallbackId);
  if (!img || !fallback) return;

  fallback.textContent = patient.avatarInitial || patient.name.charAt(0);

  img.onerror = () => {
    img.style.display = 'none';
    fallback.style.display = 'flex';
  };
  img.onload = () => {
    img.style.display = '';
    fallback.style.display = 'none';
  };

  fallback.style.display = 'none';
  img.style.display = '';
  img.alt = patient.name;
  img.src = `assets/${patient.id}.jpg`;
}

function nbRenderCareLog(id){
  const careLogEntries = document.getElementById('careLogEntries');
  if (!careLogEntries) return;
  const entries = nbGetCareLog(id);

  careLogEntries.innerHTML = '';
  entries.forEach((entryText, index) => {
    const row = document.createElement('div');
    row.className = 'care-log-entry';

    const label = document.createElement('span');
    label.className = 'care-log-entry-text';
    label.textContent = entryText;
    row.appendChild(label);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'care-log-delete-btn';
    deleteBtn.title = 'Delete this note';
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', () => {
      nbRemoveCareLogEntry(id, index);
      nbRenderCareLog(id);
      if (typeof nbApplyActiveTranslation === 'function') nbApplyActiveTranslation();
    });
    row.appendChild(deleteBtn);

    careLogEntries.appendChild(row);
  });
}

// Today's Schedule 
// Rich, multi-colored SVG icons matching Image 2 design
const NB_SCHEDULE_ICONS = {
  pill: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-45 12 12)"><rect x="7" y="4.5" width="10" height="7.5" rx="5" fill="#EF4444"/><rect x="7" y="12" width="10" height="7.5" rx="5" fill="#F59E0B"/><line x1="7" y1="12" x2="17" y2="12" stroke="#FFFFFF" stroke-width="1.2"/><path d="M9 7C9 6 10 5.5 11 5.5" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/></g></svg>',
  meal: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 11.5C4 16.2 7.6 20 12 20C16.4 20 20 16.2 20 11.5H4Z" fill="#8B5CF6"/><path d="M4 11.5C4 16.2 7.6 20 12 20C16.4 20 20 16.2 20 11.5H4Z" stroke="#7C3AED" stroke-width="1.2"/><ellipse cx="12" cy="11.5" rx="8" ry="3.2" fill="#F59E0B"/><circle cx="9.5" cy="11.5" r="1.3" fill="#EF4444"/><circle cx="14.2" cy="11" r="1.1" fill="#10B981"/><circle cx="12" cy="12.3" r="0.9" fill="#FFFFFF"/><path d="M2.5 11C1.8 11 1.5 10 2 9.5C2.5 9 3.5 9.5 4 10" stroke="#7C3AED" stroke-width="1.6" stroke-linecap="round"/><path d="M21.5 11C22.2 11 22.5 10 22 9.5C21.5 9 20.5 9.5 20 10" stroke="#7C3AED" stroke-width="1.6" stroke-linecap="round"/></svg>',
  walk: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="4" r="2.3" fill="#6B21A8"/><path d="M10 8.5L7.8 11.2" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round"/><path d="M10.2 7.5H14.5C15.1 7.5 15.4 8.1 15.1 8.6L13.2 13.5H10.5L9.3 9C9.1 8.1 9.7 7.5 10.2 7.5Z" fill="#F59E0B"/><path d="M13.5 8.5L16.2 11.5" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round"/><path d="M11.2 13.5L8.5 19.8" stroke="#EA580C" stroke-width="2.6" stroke-linecap="round"/><path d="M12.6 13.5L15.2 16.8L14.2 20.2" stroke="#EA580C" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  music: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 17V6L19 4V15" stroke="#8B5CF6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 9.5L19 7.5" stroke="#EC4899" stroke-width="2.2" stroke-linecap="round"/><circle cx="6.5" cy="17" r="2.8" fill="#EC4899"/><circle cx="16.5" cy="15" r="2.8" fill="#8B5CF6"/></svg>',
  puzzle: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H5V10C6.1 10 7 10.9 7 12C7 13.1 6.1 14 5 14V20H11C11 18.9 11.9 18 13 18C14.1 18 15 18.9 15 20H19V14C17.9 14 17 13.1 17 12C17 10.9 17.9 10 19 10V4H13C13 5.1 12.1 6 11 6C9.9 6 9 5.1 9 4Z" fill="#3B82F6" stroke="#1D4ED8" stroke-width="1.2" stroke-linejoin="round"/><circle cx="12" cy="5" r="1.5" fill="#60A5FA"/><circle cx="18" cy="12" r="1.5" fill="#60A5FA"/></svg>',
  sleep: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="#F59E0B" stroke="#D97706" stroke-width="1.2"/><path d="M18 4L18.6 5.4L20 6L18.6 6.6L18 8L17.4 6.6L16 6L17.4 5.4L18 4Z" fill="#A855F7"/><path d="M13 2L13.4 2.8L14.2 3.1L13.4 3.4L13 4.2L12.6 3.4L11.8 3.1L12.6 2.8L13 2Z" fill="#A855F7"/></svg>',
  bath: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12H20V15C20 17.2 18.2 19 16 19H8C5.8 19 4 17.2 4 15V12Z" fill="#06B6D4" stroke="#0891B2" stroke-width="1.2"/><path d="M4 12V7C4 5.9 4.9 5 6 5C7.1 5 8 5.9 8 7V8" stroke="#64748B" stroke-width="2" stroke-linecap="round"/><circle cx="11" cy="7" r="1.2" fill="#38BDF8"/><circle cx="14.5" cy="5" r="1.4" fill="#38BDF8"/><circle cx="17" cy="8" r="1" fill="#38BDF8"/><line x1="6" y1="19" x2="5" y2="21" stroke="#64748B" stroke-width="2" stroke-linecap="round"/><line x1="18" y1="19" x2="19" y2="21" stroke="#64748B" stroke-width="2" stroke-linecap="round"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 16V11C18 7.7 15.3 5 12 5C8.7 5 6 7.7 6 11V16L4 18H20L18 16Z" fill="#F59E0B" stroke="#D97706" stroke-width="1.2"/><path d="M10 20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20" stroke="#D97706" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="3" r="1.5" fill="#EF4444"/></svg>'
};

function nbRenderSchedule(id){
  const scheduleList = document.getElementById('scheduleList');
  if (!scheduleList) return;

  const items = nbGetSchedule(id);
  scheduleList.innerHTML = '';

  if (items.length === 0) {
    scheduleList.innerHTML = '<div class="schedule-item"><span class="s-desc">No items scheduled.</span></div>';
    return;
  }

  items.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'schedule-item';

    const iconMarkup = NB_SCHEDULE_ICONS[item.icon] || item.icon;

    row.innerHTML = `
      <div class="s-icon">${iconMarkup}</div>
      <span class="s-time">${item.time}</span>
      <span class="s-desc">${item.desc}</span>
      <div class="s-actions">
        <button type="button" class="s-action-btn s-edit-btn" title="Edit" aria-label="Edit schedule item">✎</button>
        <button type="button" class="s-action-btn s-delete-btn" title="Delete" aria-label="Delete schedule item">🗑</button>
      </div>
    `;

    row.querySelector('.s-edit-btn')?.addEventListener('click', () => nbOpenScheduleModal(id, index));
    row.querySelector('.s-delete-btn')?.addEventListener('click', () => {
      nbDeleteScheduleItem(id, index);
      nbRenderSchedule(id);
      if (typeof nbApplyActiveTranslation === 'function') nbApplyActiveTranslation();
    });

    scheduleList.appendChild(row);
  });
}

function nbRenderIconPicker(selectedKey){
  const picker = document.getElementById('scheduleIconPicker');
  if (!picker) return;

  picker.innerHTML = '';
  Object.keys(NB_SCHEDULE_ICONS).forEach(key => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'icon-picker-btn' + (key === selectedKey ? ' active' : '');
    btn.title = key;
    btn.innerHTML = NB_SCHEDULE_ICONS[key];
    btn.addEventListener('click', () => {
      picker.querySelectorAll('.icon-picker-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      picker.dataset.selected = key;
    });
    picker.appendChild(btn);
  });
  picker.dataset.selected = selectedKey || Object.keys(NB_SCHEDULE_ICONS)[0];
}

// "8:00 AM" -> "08:00" so it can seed an <input type="time">
function nbTo24Hour(timeStr){
  const match = /^(\d{1,2}):(\d{2})\s*([AP]M)$/i.exec((timeStr || '').trim());
  if (!match) return '';
  let [, h, m, ap] = match;
  h = parseInt(h, 10);
  if (ap.toUpperCase() === 'PM' && h !== 12) h += 12;
  if (ap.toUpperCase() === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${m}`;
}

// "08:00" -> "8:00 AM" so it renders the way the rest of the schedule does
function nbTo12Hour(timeStr){
  const [h, m] = (timeStr || '').split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return timeStr;
  const ap = h >= 12 ? 'PM' : 'AM';
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${ap}`;
}

let nbScheduleEditIndex = null;

function nbOpenScheduleModal(patientId, index){
  const overlay = document.getElementById('scheduleModalOverlay');
  const title = document.getElementById('scheduleModalTitle');
  const timeInput = document.getElementById('scheduleTimeInput');
  const descInput = document.getElementById('scheduleDescInput');
  if (!overlay) return;

  nbScheduleEditIndex = (typeof index === 'number') ? index : null;

  if (nbScheduleEditIndex !== null) {
    const items = nbGetSchedule(patientId);
    const item = items[nbScheduleEditIndex];
    if (title) title.textContent = 'Edit Schedule Item';
    if (timeInput) timeInput.value = nbTo24Hour(item.time);
    if (descInput) descInput.value = item.desc;
    nbRenderIconPicker(NB_SCHEDULE_ICONS[item.icon] ? item.icon : Object.keys(NB_SCHEDULE_ICONS)[0]);
  } else {
    if (title) title.textContent = 'Add Schedule Item';
    if (timeInput) timeInput.value = '';
    if (descInput) descInput.value = '';
    nbRenderIconPicker(Object.keys(NB_SCHEDULE_ICONS)[0]);
  }

  overlay.classList.add('open');
}

function nbCloseScheduleModal(){
  document.getElementById('scheduleModalOverlay')?.classList.remove('open');
  nbScheduleEditIndex = null;
}

document.getElementById('scheduleAddBtn')?.addEventListener('click', () => {
  nbOpenScheduleModal(nbGetActivePatientId());
});

document.getElementById('scheduleSaveBtn')?.addEventListener('click', () => {
  const patientId = nbGetActivePatientId();
  const timeInput = document.getElementById('scheduleTimeInput');
  const descInput = document.getElementById('scheduleDescInput');
  const picker = document.getElementById('scheduleIconPicker');

  const desc = descInput ? descInput.value.trim() : '';
  const time24 = timeInput ? timeInput.value : '';
  if (!desc || !time24) return;

  const item = {
    time: nbTo12Hour(time24),
    desc,
    icon: picker?.dataset.selected || Object.keys(NB_SCHEDULE_ICONS)[0]
  };

  const activePatientId = nbGetActivePatientId();
  if (nbScheduleEditIndex !== null) {
    nbUpdateScheduleItem(activePatientId, nbScheduleEditIndex, item);
  } else {
    nbAddScheduleItem(activePatientId, item);
  }

  nbRenderSchedule(activePatientId);
  if (typeof nbApplyActiveTranslation === 'function') nbApplyActiveTranslation();
  nbCloseScheduleModal();
});

document.getElementById('scheduleModalClose')?.addEventListener('click', nbCloseScheduleModal);
document.getElementById('scheduleModalOverlay')?.addEventListener('click', (e) => {
  if (e.target.id === 'scheduleModalOverlay') nbCloseScheduleModal();
});

//  Patient switcher 
const patientSelect = document.getElementById('patientSelect');

if (patientSelect) {
  nbGetPatients().forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.fullName;
    patientSelect.appendChild(opt);
  });

  const activeId = (new URLSearchParams(window.location.search).get('patient')) || nbGetActivePatientId();
  patientSelect.value = activeId;
  nbSetActivePatientId(activeId);
  nbRenderPatient(activeId);

  patientSelect.addEventListener('change', () => {
    nbSetActivePatientId(patientSelect.value);
    nbRenderPatient(patientSelect.value);
  });
}

// Quick caretaker note
const quickNoteInput = document.getElementById('quickNoteInput');

if (quickNoteInput) {
  quickNoteInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const text = quickNoteInput.value.trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const activeId = nbGetActivePatientId();
    nbAddCareLogEntry(activeId, `${time}: (Caregiver log) ${text}`);
    nbRenderCareLog(activeId);
    if (typeof nbApplyActiveTranslation === 'function') nbApplyActiveTranslation();
    quickNoteInput.value = '';
  });
}

// hamburger toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

//  Settings panel 
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettings = document.getElementById('closeSettings');

function hideSettings(){ settingsPanel.classList.remove('open'); }

if (settingsBtn && settingsPanel) {
  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsPanel.classList.toggle('open');
  });

  closeSettings?.addEventListener('click', hideSettings);

  document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
      hideSettings();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideSettings();
  });
}

// Notifications toggle
const notifToggle = document.getElementById('notifToggle');
if (notifToggle) {
  notifToggle.addEventListener('change', () => {
    nbRenderPatient(nbGetActivePatientId());
  });
}

// Dark mode toggle in Settings panel
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
  darkModeToggle.checked = typeof nbIsDarkMode === 'function' && nbIsDarkMode();
  darkModeToggle.addEventListener('change', () => {
    if (typeof nbSetDarkMode === 'function') {
      nbSetDarkMode(darkModeToggle.checked);
    }
  });
}

// Default text size buttons 
const textSizeBtns = document.querySelectorAll('#settingsTextSize button');
const sizeMap = { small: 9, medium: 16, large: 24 };
textSizeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    textSizeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const size = btn.getAttribute('data-size');
    document.body.style.fontSize = sizeMap[size] + 'px';
  });
});

// Manual location override from settings dropdown
// Persists the saved-location list and the active pick in
// localStorage so both survive a page refresh, instead of always
// resetting to the three hardcoded defaults.
const NB_LOCATION_KEY = 'neurobloom_locations';
const NB_ACTIVE_LOCATION_KEY = 'neurobloom_active_location';
const NB_DEFAULT_LOCATIONS = ['Guwahati, Assam', 'Jhansi, Uttar Pradesh', 'Delhi NCR'];

const locationSelect = document.getElementById('locationSelect');
const locationValueEl = document.getElementById('locationChipValue');
const liveDotEl = document.getElementById('liveDot');
const locationManageList = document.getElementById('locationManageList');
const newLocationInput = document.getElementById('newLocationInput');
const addLocationBtn = document.getElementById('addLocationBtn');

function nbGetSavedLocations() {
  try {
    const saved = JSON.parse(localStorage.getItem(NB_LOCATION_KEY));
    return Array.isArray(saved) && saved.length ? saved : [...NB_DEFAULT_LOCATIONS];
  } catch {
    return [...NB_DEFAULT_LOCATIONS];
  }
}

function nbSaveLocations(list) {
  localStorage.setItem(NB_LOCATION_KEY, JSON.stringify(list));
}

function nbGetActiveLocation() {
  return localStorage.getItem(NB_ACTIVE_LOCATION_KEY) || nbGetSavedLocations()[0];
}

function nbSetActiveLocation(loc) {
  localStorage.setItem(NB_ACTIVE_LOCATION_KEY, loc);
  if (locationValueEl) locationValueEl.textContent = loc;
  if (liveDotEl) liveDotEl.style.display = 'none';
}

function nbRenderLocationDropdown() {
  if (!locationSelect) return;
  const locations = nbGetSavedLocations();
  const active = nbGetActiveLocation();

  locationSelect.innerHTML = '';
  locations.forEach((loc) => {
    const opt = document.createElement('option');
    opt.value = loc;
    opt.textContent = loc;
    if (loc === active) opt.selected = true;
    locationSelect.appendChild(opt);
  });
}

function nbRenderLocationManageList() {
  if (!locationManageList) return;
  const locations = nbGetSavedLocations();
  const active = nbGetActiveLocation();

  locationManageList.innerHTML = '';
  locations.forEach((loc) => {
    const chip = document.createElement('span');
    chip.className = 'location-chip-item' + (loc === active ? ' active' : '');

    const label = document.createElement('span');
    label.textContent = loc;
    chip.appendChild(label);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'location-remove-btn';
    removeBtn.title = `Remove ${loc}`;
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', () => nbRemoveLocation(loc));
    chip.appendChild(removeBtn);

    locationManageList.appendChild(chip);
  });
}

function nbRefreshLocationUI() {
  nbRenderLocationDropdown();
  nbRenderLocationManageList();
}

function nbAddLocation(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) return;

  const locations = nbGetSavedLocations();
  if (!locations.includes(trimmed)) {
    locations.push(trimmed);
    nbSaveLocations(locations);
  }
  nbSetActiveLocation(trimmed);
  nbRefreshLocationUI();
}

function nbRemoveLocation(name) {
  let locations = nbGetSavedLocations();

  if (locations.length <= 1) {
    const statusEl = document.getElementById('locationStatus');
    if (statusEl) {
      statusEl.textContent = 'You need at least one saved location.';
      statusEl.classList.add('error');
    }
    return;
  }

  locations = locations.filter((loc) => loc !== name);
  nbSaveLocations(locations);

  if (nbGetActiveLocation() === name) {
    nbSetActiveLocation(locations[0]);
  }
  nbRefreshLocationUI();
}

// Initial paint on page load
nbRefreshLocationUI();
if (locationValueEl) locationValueEl.textContent = nbGetActiveLocation();

if (locationSelect) {
  locationSelect.addEventListener('change', () => {
    nbSetActiveLocation(locationSelect.value);
    nbRenderLocationManageList();
  });
}

if (addLocationBtn && newLocationInput) {
  addLocationBtn.addEventListener('click', () => {
    nbAddLocation(newLocationInput.value);
    newLocationInput.value = '';
  });
  newLocationInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      nbAddLocation(newLocationInput.value);
      newLocationInput.value = '';
    }
  });
}

// Use My Live Location 
const useLiveLocationBtn = document.getElementById('useLiveLocationBtn');
const locationStatus = document.getElementById('locationStatus');

if (useLiveLocationBtn && locationValueEl) {
  useLiveLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      locationStatus.textContent = 'Geolocation is not supported on this device.';
      locationStatus.classList.add('error');
      return;
    }

    locationStatus.classList.remove('error');
    locationStatus.textContent = 'Getting current location…';
    useLiveLocationBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          const city = addr.city || addr.town || addr.village || addr.county || 'Unknown area';
          const state = addr.state || addr.state_district || '';
          const label = state ? `${city}, ${state}` : city;

          locationValueEl.textContent = label;
          if (liveDotEl) liveDotEl.style.display = 'inline-flex';
          locationStatus.textContent = 'Updated just now.';
        } catch (err) {
          locationStatus.textContent = 'Could not resolve address, but coordinates were captured.';
          locationValueEl.textContent = `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;
          if (liveDotEl) liveDotEl.style.display = 'inline-flex';
        } finally {
          useLiveLocationBtn.disabled = false;
        }
      },
      (err) => {
        locationStatus.classList.add('error');
        locationStatus.textContent =
          err.code === 1
            ? 'Location permission denied.'
            : 'Could not get your location. Try again.';
        useLiveLocationBtn.disabled = false;
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

// Translate feature
const NB_LANG_CODES = {
  'অসমীয়া': 'as',
  'English': 'en',
  'বাংলা': 'bn',
  'Mizo': 'lus'
};

// Containers whose text should NEVER be translated
const NB_TRANSLATE_EXCLUDE_SELECTORS = [
  '.brand',            
  '.lang-btns',        
  '#patientSelect',   
  '#locationSelect',   
  '.settings-select',
  '#locationChipValue',
  '#locationManageList', 
  '#newLocationInput',    
  '#statusLastActive', 
  '.s-time',           
  '.text-size-btns',   
  '#settingsTextSize'  
];

function nbShouldSkipTextNode(node){
  const text = node.nodeValue;
  if (!text || !text.trim()) return true;

  const parent = node.parentElement;
  if (!parent) return true;
  if (NB_TRANSLATE_EXCLUDE_SELECTORS.some(sel => parent.closest(sel))) return true;

  // Skip strings 
  if (!/\p{L}/u.test(text)) return true;

  return false;
}

// Walks every text node inside the dashboard 
function nbCollectTranslatableTextNodes(){
  const root = document.querySelector('.wrap');
  if (!root) return [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) {
    if (!nbShouldSkipTextNode(n)) nodes.push(n);
  }
  return nodes;
}

async function nbTranslateText(text, langCode){
  if (!text || !text.trim()) return text;
  if (!nbTranslationCache[langCode]) nbTranslationCache[langCode] = {};
  if (nbTranslationCache[langCode][text]) return nbTranslationCache[langCode][text];

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${langCode}`
    );
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    if (!translated || data.responseStatus !== 200) return text; // fall back silently
    nbTranslationCache[langCode][text] = translated;
    return translated;
  } catch (err) {
    return text; // offline or API hiccup — keep original text
  }
}

// The quick-note input placeholder
async function nbTranslatePlaceholder(langCode){
  const input = document.getElementById('quickNoteInput');
  if (!input) return;
  if (!input.dataset.nbOriginal) input.dataset.nbOriginal = input.placeholder;

  if (langCode === 'en') {
    input.placeholder = input.dataset.nbOriginal;
    return;
  }
  input.placeholder = await nbTranslateText(input.dataset.nbOriginal, langCode);
}

async function nbTranslatePage(langCode){
  nbActiveLang = langCode;

  const nodes = nbCollectTranslatableTextNodes();

  nodes.forEach(node => {
    if (node.nbOriginal === undefined) node.nbOriginal = node.nodeValue;
  });

  if (langCode === 'en') {
    nodes.forEach(node => { node.nodeValue = node.nbOriginal; });
    await nbTranslatePlaceholder('en');
    return;
  }

  await Promise.all([
    ...nodes.map(async node => {
      const translated = await nbTranslateText(node.nbOriginal, langCode);
      node.nodeValue = translated;
    }),
    nbTranslatePlaceholder(langCode)
  ]);
}

function nbApplyActiveTranslation(){
  if (nbActiveLang !== 'en') nbTranslatePage(nbActiveLang);
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const label = btn.querySelector('.top')?.textContent.trim();
    const langCode = NB_LANG_CODES[label] || 'en';
    nbTranslatePage(langCode);
  });
});