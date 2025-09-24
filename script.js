// ---------- Datos simulados ----------
const MEDICOS = [
  {id: 'm1', nombre: 'Dra. Pérez', especialidad: 'Pediatría'},
  {id: 'm2', nombre: 'Dr. Gómez', especialidad: 'Clínica'},
  {id: 'm3', nombre: 'Dra. Ruiz', especialidad: 'Ginecología'}
];
const USUARIOS = [
  {usuario: 'paciente', password: '1234'}
];
const TURNOS_KEY = 'turnos_demo';

// ---------- Utilidades ----------
function getTurnos() {
  return JSON.parse(localStorage.getItem(TURNOS_KEY) || '[]');
}
function saveTurnos(t) {
  localStorage.setItem(TURNOS_KEY, JSON.stringify(t));
}
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
document.getElementById('year2') && (document.getElementById('year2').textContent = new Date().getFullYear());

// ---------- Login ----------
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', e=>{
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const alertBox = document.getElementById('loginAlert');
    if (USUARIOS.find(x=>x.usuario===u && x.password===p)) {
      alertBox.className = 'alert alert-success';
      alertBox.textContent = 'Acceso correcto';
      setTimeout(()=>location.href='turnos.html', 1000);
    } else {
      alertBox.className = 'alert alert-danger';
      alertBox.textContent = 'Credenciales incorrectas';
    }
    alertBox.classList.remove('d-none');
  });
}

// ---------- Médicos ----------
if (document.getElementById('medicosList')) {
  const select = document.getElementById('especialidadSelect');
  const list = document.getElementById('medicosList');
  [...new Set(MEDICOS.map(m=>m.especialidad))].forEach(e=>{
    const o = document.createElement('option'); o.value=e; o.textContent=e; select.appendChild(o);
  });
  function render(filter='') {
    list.innerHTML='';
    MEDICOS.filter(m=>!filter||m.especialidad===filter).forEach(m=>{
      list.innerHTML += `<div class="col-md-4"><div class="card p-3"><h3 class="h6">${m.nombre}</h3><p>${m.especialidad}</p></div></div>`;
    });
  }
  render();
  select.addEventListener('change',()=>render(select.value));
}

// ---------- Turnos ----------
if (document.getElementById('turnoForm')) {
  const form = document.getElementById('turnoForm');
  const sel = document.getElementById('medicoSelect');
  const list = document.getElementById('turnosList');
  MEDICOS.forEach(m=>{ sel.innerHTML+=`<option value="${m.id}">${m.nombre} (${m.especialidad})</option>`; });
  function render() {
    const turnos=getTurnos();
    list.innerHTML='';
    if(!turnos.length){list.innerHTML='<p class="text-muted">Sin turnos</p>'; return;}
    turnos.forEach((t,i)=>{
      const med=MEDICOS.find(m=>m.id===t.medico);
      list.innerHTML+=`<div class="card p-2 mb-2"><b>${t.paciente}</b> - ${med.nombre} - ${t.fecha} ${t.hora} <button class="btn btn-sm btn-danger float-end" onclick="cancelar(${i})">X</button></div>`;
    });
  }
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const nuevo={paciente:pacienteName.value, medico:sel.value, fecha:fechaTurno.value, hora:horaTurno.value};
    const turnos=getTurnos(); turnos.push(nuevo); saveTurnos(turnos);
    form.reset(); render();
  });
  window.cancelar=i=>{const t=getTurnos();t.splice(i,1);saveTurnos(t);render();};
  render();
}
