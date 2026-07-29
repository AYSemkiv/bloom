// script.js — populates the gallery and handles interactions

let wallpapers = {};

const gallery = document.getElementById('gallery');
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');

const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalDownload = document.getElementById('modalDownload');
const closeModal = document.getElementById('closeModal');

let theme = 'Light';

function rawUrl(folder, name) {
  return `${folder}/${encodeURIComponent(name)}`;
}

function buildCard(folder, name) {
  const card = document.createElement('div');
  card.className = 'card';

  const img = document.createElement('img');
  img.className = 'thumb';
  img.src = rawUrl(folder, name);
  img.alt = name;
  img.loading = 'lazy';

  img.addEventListener('click', () => openModal(folder, name));

  card.appendChild(img);

  const meta = document.createElement('div');
  meta.className = 'meta';

  const title = document.createElement('div');
  title.className = 'name';
  title.textContent = name.replace(/\.[^/.]+$/, '');

  const actions = document.createElement('div');
  actions.className = 'actions';

  const dl = document.createElement('a');
  dl.href = rawUrl(folder, name);
  dl.download = name;
  dl.textContent = 'Download';
  dl.setAttribute('aria-label', `Download ${name}`);

  actions.appendChild(dl);

  meta.appendChild(title);
  meta.appendChild(actions);

  card.appendChild(meta);

  return card;
}

function render() {
  gallery.innerHTML = '';

  const folder = theme === 'Light' ? 'Light' : 'Dark';

  wallpapers[folder].forEach(name => {
    gallery.appendChild(buildCard(folder, name));
  });
}

themeToggle.addEventListener('change', (e) => {
  theme = e.target.checked ? 'Dark' : 'Light';

  document.body.classList.toggle(
    'theme-dark',
    theme === 'Dark'
  );

  themeLabel.textContent = theme;

  render();
});

function openModal(folder, name) {
  modalImage.src = rawUrl(folder, name);

  modalDownload.href = rawUrl(folder, name);
  modalDownload.download = name;
  modalDownload.textContent = 'Download';

  modal.setAttribute('aria-hidden', 'false');
}

function closeModalFn() {
  modal.setAttribute('aria-hidden', 'true');
  modalImage.src = '';
}

closeModal.addEventListener('click', closeModalFn);

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModalFn();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModalFn();
  }
});

// Load wallpaper list
fetch("wallpapers.json")
  .then(response => response.json())
  .then(data => {
    wallpapers = data;
    render();
  })
  .catch(error => {
    console.error("Failed to load wallpapers.json:", error);
    gallery.innerHTML = "<p>Failed to load wallpapers.</p>";
  });
