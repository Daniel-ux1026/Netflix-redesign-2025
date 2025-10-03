// Datos simples para la demo
const catalogo = [
  { id: 1, titulo: 'Arcadia', genero: 'Serie', badge: 'Top 10' },
  { id: 2, titulo: 'Horizonte', genero: 'Película', badge: 'Nuevo' },
  { id: 3, titulo: 'Neón', genero: 'Serie', badge: 'Top 10' },
  { id: 4, titulo: 'Aurora', genero: 'Película', badge: 'Destacado' },
  { id: 5, titulo: 'Delta', genero: 'Serie', badge: 'Nuevo' },
  { id: 6, titulo: 'Órbita', genero: 'Película', badge: 'Premiado' },
  { id: 7, titulo: 'Vector', genero: 'Serie', badge: 'Top 10' },
  { id: 8, titulo: 'Ícaro', genero: 'Película', badge: 'Nuevo' },
  { id: 9, titulo: 'Eclipse', genero: 'Serie', badge: 'Top 10' },
  { id: 10, titulo: 'Selva', genero: 'Película', badge: 'Destacado' },
  { id: 11, titulo: 'Píxel', genero: 'Serie', badge: 'Nuevo' },
  { id: 12, titulo: 'Bruma', genero: 'Película', badge: 'Premiado' },
];

const state = {
  miLista: new Set(JSON.parse(localStorage.getItem('miLista') || '[]')),
};

const $ = (sel) => document.querySelector(sel);
const app = $('#app');

function letraPoster(t) { return (t || '?').trim().charAt(0).toUpperCase(); }

function crearCard(item) {
  const card = document.createElement('div');
  card.className = 'card';
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', item.titulo);

  const poster = document.createElement('div');
  poster.className = 'poster';
  poster.textContent = letraPoster(item.titulo);

  const badge = document.createElement('span');
  badge.className = 'card-badge';
  badge.textContent = item.badge;

  const like = document.createElement('button');
  like.className = 'card-like';
  like.title = 'Agregar a Mi Lista';
  like.textContent = state.miLista.has(item.id) ? '♥' : '♡';

  like.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.miLista.has(item.id)) {
      state.miLista.delete(item.id);
      like.textContent = '♡';
    } else {
      state.miLista.add(item.id);
      like.textContent = '♥';
    }
    localStorage.setItem('miLista', JSON.stringify([...state.miLista]));
    renderMyNetflix();
  });

  // Simulación de preview: al enfocar o pasar el mouse, muestra “▶ Avance”
  const startPreview = () => poster.classList.add('playing');
  const stopPreview = () => poster.classList.remove('playing');
  card.addEventListener('mouseenter', startPreview);
  card.addEventListener('mouseleave', stopPreview);
  card.addEventListener('focus', startPreview);
  card.addEventListener('blur', stopPreview);

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = item.titulo;

  card.append(poster, badge, like, title);
  return card;
}

function crearSeccion(nombre, filtro) {
  const section = document.createElement('section');
  section.className = 'section';
  const h2 = document.createElement('h2');
  h2.textContent = nombre;
  const row = document.createElement('div');
  row.className = 'row';

  catalogo.filter(filtro).forEach(item => row.appendChild(crearCard(item)));
  if (!row.children.length) {
    const empty = document.createElement('small');
    empty.style.color = '#c9c9c9';
    empty.textContent = 'Sin resultados por ahora.';
    row.appendChild(empty);
  }

  section.append(h2, row);
  return section;
}

function renderHome() {
  app.innerHTML = '';
  app.appendChild(crearSeccion('Seguir viendo', it => it.id <= 6));
  app.appendChild(crearSeccion('Top 10', it => it.badge === 'Top 10'));
  app.appendChild(crearSeccion('Novedades', it => it.badge === 'Nuevo'));
}

function renderSearch(q) {
  app.innerHTML = '';
  const term = q.trim().toLowerCase();
  const filtro = it =>
    it.titulo.toLowerCase().includes(term) ||
    it.genero.toLowerCase().includes(term) ||
    it.badge.toLowerCase().includes(term);
  app.appendChild(crearSeccion(`Resultados para: “${q}”`, filtro));
}

function renderMyNetflix() {
  const list = $('#myList');
  list.innerHTML = '';
  const items = catalogo.filter(it => state.miLista.has(it.id));
  if (!items.length) {
    const s = document.createElement('small');
    s.style.color = '#c9c9c9';
    s.textContent = 'Aún no agregas títulos a tu lista.';
    list.appendChild(s);
    return;
  }
  items.forEach(it => list.appendChild(crearCard(it)));
}

function toggleDrawer(open) {
  $('#myNetflix').classList.toggle('hidden', !open);
  $('#backdrop').classList.toggle('hidden', !open);
  $('#myNetflix').setAttribute('aria-hidden', open ? 'false' : 'true');
  $('#backdrop').setAttribute('aria-hidden', open ? 'false' : 'true');
}

function toggleSearch(open) {
  $('#searchBox').classList.toggle('hidden', !open);
  $('#searchBox').setAttribute('aria-hidden', open ? 'false' : 'true');
  if (open) $('#searchInput').focus();
}

// Eventos UI
$('#btnMyNetflix').addEventListener('click', () => {
  renderMyNetflix(); toggleDrawer(true);
});
$('#closeMyNetflix').addEventListener('click', () => toggleDrawer(false));
$('#backdrop').addEventListener('click', () => toggleDrawer(false));

$('#btnBuscar').addEventListener('click', () => toggleSearch(true));
$('#closeSearch').addEventListener('click', () => { toggleSearch(false); renderHome(); });

$('#searchInput').addEventListener('input', (e) => {
  const v = e.target.value;
  if (!v) return renderHome();
  renderSearch(v);
});

// Inicial
renderHome();
