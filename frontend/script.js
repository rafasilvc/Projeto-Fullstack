// ─── OUTPUT ELEMENTS ───────────────────────────────────────────────────────────
const apiOutput       = document.getElementById('apiOutput');
const profileOutput   = document.getElementById('profileOutput');
const projectApiOutput = document.getElementById('projectApiOutput');
const taskApiOutput   = document.getElementById('taskApiOutput');
const projectsList    = document.getElementById('projectsList');
const tasksList       = document.getElementById('tasksList');

// ─── BASE URLS ─────────────────────────────────────────────────────────────────
const usersUrl    = '/api/users';
const projectsUrl = '/api/projects';
const tasksUrl    = '/api/tasks';

// ─── TOKEN ─────────────────────────────────────────────────────────────────────
function getToken()      { return localStorage.getItem('token'); }
function setToken(t)     { localStorage.setItem('token', t); }
function clearToken()    { localStorage.removeItem('token'); }

// ─── HELPERS ───────────────────────────────────────────────────────────────────
function showOutput(el, data) {
  el.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

async function request(url, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro na requisição.');
  return data;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

// ─── TABS ──────────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// ═══════════════════════════════════════════════════════════════
// USUÁRIOS
// ═══════════════════════════════════════════════════════════════
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const data = await request(`${usersUrl}/register`, {
      method: 'POST',
      body: JSON.stringify({
        name:     document.getElementById('registerName').value,
        email:    document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        role:     document.getElementById('registerRole').value
      })
    });
    showOutput(apiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(apiOutput, err.message); }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const data = await request(`${usersUrl}/login`, {
      method: 'POST',
      body: JSON.stringify({
        email:    document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
      })
    });
    setToken(data.token);
    showOutput(apiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(apiOutput, err.message); }
});

document.getElementById('loadProfileBtn').addEventListener('click', async () => {
  try {
    const data = await request(`${usersUrl}/me`);
    showOutput(profileOutput, data);
  } catch (err) { showOutput(profileOutput, err.message); }
});

document.getElementById('loadUsersBtn').addEventListener('click', async () => {
  try {
    const data = await request(usersUrl);
    showOutput(apiOutput, data);
  } catch (err) { showOutput(apiOutput, err.message); }
});

document.getElementById('updateForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const id = document.getElementById('updateId').value;
    const payload = {};
    const name  = document.getElementById('updateName').value;
    const email = document.getElementById('updateEmail').value;
    const role  = document.getElementById('updateRole').value;
    if (name)  payload.name  = name;
    if (email) payload.email = email;
    if (role)  payload.role  = role;
    const data = await request(`${usersUrl}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    showOutput(apiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(apiOutput, err.message); }
});

document.getElementById('passwordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const id = document.getElementById('passwordId').value;
    const data = await request(`${usersUrl}/${id}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ password: document.getElementById('newPassword').value })
    });
    showOutput(apiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(apiOutput, err.message); }
});

document.getElementById('deleteForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const id = document.getElementById('deleteId').value;
    const data = await request(`${usersUrl}/${id}`, { method: 'DELETE' });
    showOutput(apiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(apiOutput, err.message); }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  clearToken();
  showOutput(apiOutput, 'Token removido com sucesso.');
  showOutput(profileOutput, 'Sessão encerrada.');
});

// ═══════════════════════════════════════════════════════════════
// PROJETOS
// ═══════════════════════════════════════════════════════════════
function renderProjects(projects) {
  if (!projects.length) {
    projectsList.innerHTML = '<p style="color:#6b7280;font-size:14px">Nenhum projeto cadastrado.</p>';
    return;
  }
  projectsList.innerHTML = projects.map(p => `
    <div class="project-card">
      <div class="project-dot" style="background:${p.color || '#6366f1'}"></div>
      <div class="project-info">
        <strong>${p.name}</strong>
        <span>${p.description}</span>
        <span style="display:block;font-size:11px;color:#9ca3af;margin-top:3px">${p._id}</span>
      </div>
      <span class="project-status ${p.status}">${p.status}</span>
    </div>
  `).join('');
}

document.getElementById('createProjectForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const data = await request(projectsUrl, {
      method: 'POST',
      body: JSON.stringify({
        name:        document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value,
        color:       document.getElementById('projectColor').value,
        status:      document.getElementById('projectStatus').value
      })
    });
    showOutput(projectApiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(projectApiOutput, err.message); }
});

document.getElementById('loadProjectsBtn').addEventListener('click', async () => {
  try {
    const data = await request(projectsUrl);
    renderProjects(data);
    showOutput(projectApiOutput, `${data.length} projeto(s) carregado(s).`);
  } catch (err) { showOutput(projectApiOutput, err.message); }
});

document.getElementById('getProjectForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const id = document.getElementById('getProjectId').value;
    const data = await request(`${projectsUrl}/${id}`);
    showOutput(projectApiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(projectApiOutput, err.message); }
});

document.getElementById('updateProjectForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const id = document.getElementById('updateProjectId').value;
    const payload = {};
    const name   = document.getElementById('updateProjectName').value;
    const desc   = document.getElementById('updateProjectDescription').value;
    const status = document.getElementById('updateProjectStatus').value;
    if (name)   payload.name        = name;
    if (desc)   payload.description = desc;
    if (status) payload.status      = status;
    const data = await request(`${projectsUrl}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    showOutput(projectApiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(projectApiOutput, err.message); }
});

document.getElementById('deleteProjectForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const id = document.getElementById('deleteProjectId').value;
    const data = await request(`${projectsUrl}/${id}`, { method: 'DELETE' });
    showOutput(projectApiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(projectApiOutput, err.message); }
});

// ═══════════════════════════════════════════════════════════════
// TAREFAS
// ═══════════════════════════════════════════════════════════════
function renderTasks(tasks) {
  if (!tasks.length) {
    tasksList.innerHTML = '<p style="color:#6b7280;font-size:14px">Nenhuma tarefa encontrada.</p>';
    return;
  }
  tasksList.innerHTML = tasks.map(t => `
    <div class="task-card">
      <div class="task-priority priority-${t.priority}"></div>
      <div class="task-info">
        <strong>${t.title}</strong>
        <span>
          ${t.project ? `📁 ${t.project.name}` : ''} · Prioridade: ${t.priority}
          ${t.dueDate ? ` · Prazo: ${formatDate(t.dueDate)}` : ''}
        </span>
        ${t.description ? `<span class="task-desc">${t.description}</span>` : ''}
        <span class="task-id">${t._id}</span>
      </div>
      <span class="task-status ${t.status}">${t.status.replace('_', ' ')}</span>
    </div>
  `).join('');
}

document.getElementById('createTaskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const dueDate = document.getElementById('taskDueDate').value;
    const data = await request(tasksUrl, {
      method: 'POST',
      body: JSON.stringify({
        title:       document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        project:     document.getElementById('taskProjectId').value,
        priority:    document.getElementById('taskPriority').value,
        status:      document.getElementById('taskStatus').value,
        dueDate:     dueDate || null
      })
    });
    showOutput(taskApiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(taskApiOutput, err.message); }
});

document.getElementById('loadTasksBtn').addEventListener('click', async () => {
  try {
    const data = await request(tasksUrl);
    renderTasks(data);
    showOutput(taskApiOutput, `${data.length} tarefa(s) carregada(s).`);
  } catch (err) { showOutput(taskApiOutput, err.message); }
});

document.getElementById('filterTasksBtn').addEventListener('click', async () => {
  try {
    const projectId = document.getElementById('filterProjectId').value;
    const status    = document.getElementById('filterStatus').value;
    const params    = new URLSearchParams();
    if (projectId) params.append('project', projectId);
    if (status)    params.append('status', status);
    const url  = `${tasksUrl}${params.toString() ? '?' + params.toString() : ''}`;
    const data = await request(url);
    renderTasks(data);
    showOutput(taskApiOutput, `${data.length} tarefa(s) encontrada(s).`);
  } catch (err) { showOutput(taskApiOutput, err.message); }
});

document.getElementById('getTaskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const id = document.getElementById('getTaskId').value;
    const data = await request(`${tasksUrl}/${id}`);
    showOutput(taskApiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(taskApiOutput, err.message); }
});

document.getElementById('updateTaskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const id = document.getElementById('updateTaskId').value;
    const payload = {};
    const title    = document.getElementById('updateTaskTitle').value;
    const desc     = document.getElementById('updateTaskDescription').value;
    const priority = document.getElementById('updateTaskPriority').value;
    const status   = document.getElementById('updateTaskStatus').value;
    const dueDate  = document.getElementById('updateTaskDueDate').value;
    if (title)    payload.title       = title;
    if (desc)     payload.description = desc;
    if (priority) payload.priority    = priority;
    if (status)   payload.status      = status;
    if (dueDate)  payload.dueDate     = dueDate;
    const data = await request(`${tasksUrl}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    showOutput(taskApiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(taskApiOutput, err.message); }
});

document.getElementById('deleteTaskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const id = document.getElementById('deleteTaskId').value;
    const data = await request(`${tasksUrl}/${id}`, { method: 'DELETE' });
    showOutput(taskApiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(taskApiOutput, err.message); }
});

// ─── PWA: SERVICE WORKER ───────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
