const defaults = {
  tasks: [
    { id: 1, title: 'Cambridge 18 · Test 2', detail: 'Section 3 & 4 · 30 min', skill: 'Listening', done: true },
    { id: 2, title: 'Academic reading practice', detail: 'Passage 2 · 40 min', skill: 'Reading', done: true },
    { id: 3, title: 'Write an opinion essay', detail: 'Task 2 · 45 min', skill: 'Writing', done: false },
    { id: 4, title: 'Record a speaking response', detail: 'Part 2 cue card · 15 min', skill: 'Speaking', done: false }
  ],
  minutesToday: 85,
  week: [55, 80, 65, 95, 75, 60, 20],
  results: []
};
const saved = JSON.parse(localStorage.getItem('ielts-dashboard') || 'null');
const state = { ...defaults, ...saved };

const skills = [
  { name: 'Listening', score: 7.5, icon: '🎧', color: '#5271d9', soft: '#eef2ff', change: '+0.5 this month' },
  { name: 'Reading', score: 7.0, icon: '📖', color: '#39a27b', soft: '#e8f8f1', change: '+0.5 this month' },
  { name: 'Writing', score: 6.5, icon: '✍️', color: '#e39a3e', soft: '#fff3e5', change: 'Keep practising' },
  { name: 'Speaking', score: 7.0, icon: '🎙️', color: '#e36b80', soft: '#fff0f3', change: '+0.5 this month' }
];
const practiceTypes = {
  listening: ['Full listening test', 'Section 1', 'Section 2', 'Section 3', 'Section 4'],
  reading: ['Full reading test', 'Passage 1', 'Passage 2', 'Passage 3'],
  writing: ['Task 1', 'Task 2'],
  speaking: ['Part 1', 'Part 2', 'Part 3']
};
let activeSkill = 'listening';
const $ = selector => document.querySelector(selector);

function save() { localStorage.setItem('ielts-dashboard', JSON.stringify(state)); }
function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2200); }
function formatMinutes(total) { return `${Math.floor(total / 60)}h ${total % 60}m`; }

function renderTasks() {
  $('#task-list').innerHTML = state.tasks.map(task => `<label class="task-item ${task.done ? 'completed' : ''}">
    <input type="checkbox" data-id="${task.id}" ${task.done ? 'checked' : ''}>
    <span class="task-info"><strong>${task.title}</strong><span>${task.detail}</span></span>
    <span class="skill-tag tag-${task.skill.toLowerCase()}">${task.skill}</span>
  </label>`).join('');
  const complete = state.tasks.filter(t => t.done).length;
  $('#task-summary-text').textContent = `${complete} of ${state.tasks.length} completed`;
  $('#task-progress').style.width = `${state.tasks.length ? complete / state.tasks.length * 100 : 0}%`;
  document.querySelectorAll('.task-item input').forEach(input => input.addEventListener('change', () => {
    const task = state.tasks.find(t => t.id === Number(input.dataset.id)); task.done = input.checked; save(); renderTasks();
  }));
}

function renderChart() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const max = Math.max(...state.week, 1);
  $('#weekly-chart').innerHTML = state.week.map((mins, i) => `<div class="bar-wrap"><div class="bar ${i === 2 ? 'today' : ''}" style="height:${mins / max * 115}px" title="${mins} minutes"></div><span>${days[i]}</span></div>`).join('');
  const total = state.week.reduce((a, b) => a + b, 0);
  $('#weekly-hours').textContent = `${(total / 60).toFixed(1)} hrs`;
}

function renderSkills() {
  $('#skills-grid').innerHTML = skills.map(skill => `<article class="skill-card" id="${skill.name.toLowerCase()}">
    <div class="skill-top"><div class="skill-name"><span class="skill-badge" style="background:${skill.soft}">${skill.icon}</span><div><h3>${skill.name}</h3><span>Estimated band</span></div></div><div class="band">${skill.score.toFixed(1)}<small>of 9.0</small></div></div>
    <div class="band-row"><span>Progress to target</span><span>${Math.round(skill.score / 8 * 100)}%</span></div>
    <div class="skill-progress"><span style="width:${skill.score / 8 * 100}%;background:${skill.color}"></span></div>
    <div class="skill-footer"><span>${skill.change}</span><button data-practice="${skill.name.toLowerCase()}">Practice & notes →</button></div>
  </article>`).join('');
  document.querySelectorAll('[data-practice]').forEach(button => button.addEventListener('click', () => { selectSkill(button.dataset.practice); $('.practice').scrollIntoView(); }));
}

function selectSkill(skill) {
  activeSkill = skill;
  document.querySelectorAll('.practice-tabs button').forEach(b => b.classList.toggle('active', b.dataset.skill === skill));
  $('#practice-type').innerHTML = practiceTypes[skill].map(type => `<option>${type}</option>`).join('');
  renderResults();
}
function renderResults() {
  const results = state.results.filter(r => r.skill === activeSkill).slice(-3).reverse();
  $('#recent-results').innerHTML = results.length ? `<h3>Recent results</h3>${results.map(r => `<div class="result-item"><strong>${r.type} · ${r.date}</strong><span class="result-score">Band ${r.score}</span>${r.notes ? `<p>${r.notes}</p>` : ''}</div>`).join('')}` : '';
}

$('#add-task').addEventListener('click', () => {
  const title = prompt('What would you like to study?');
  if (!title?.trim()) return;
  state.tasks.push({ id: Date.now(), title: title.trim(), detail: 'New study task', skill: 'Writing', done: false }); save(); renderTasks(); toast('Task added');
});
const dialog = $('#session-dialog');
$('#open-session').addEventListener('click', () => dialog.showModal());
$('#session-form').addEventListener('submit', event => {
  if (event.submitter?.value === 'cancel') return;
  event.preventDefault();
  const minutes = Number($('#session-minutes').value);
  if (!minutes) return;
  state.minutesToday += minutes; state.week[2] += minutes; save();
  $('#today-time').textContent = formatMinutes(state.minutesToday); renderChart(); dialog.close(); toast('Study session saved — great work!');
});
document.querySelectorAll('.practice-tabs button').forEach(button => button.addEventListener('click', () => selectSkill(button.dataset.skill)));
$('#practice-form').addEventListener('submit', event => {
  event.preventDefault();
  state.results.push({ skill: activeSkill, type: $('#practice-type').value, score: $('#practice-score').value, date: $('#practice-date').value, notes: $('#practice-notes').value.trim() });
  save(); event.target.reset(); $('#practice-date').valueAsDate = new Date(); selectSkill(activeSkill); toast('Practice result saved');
});

const now = new Date();
$('#today-date').textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
$('#practice-date').valueAsDate = now;
$('#today-time').textContent = formatMinutes(state.minutesToday);
renderTasks(); renderChart(); renderSkills(); selectSkill('listening');
