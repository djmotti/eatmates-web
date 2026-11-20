const film = document.querySelector('#film');
const mute = document.querySelector('#mute');
const volume = document.querySelector('#volume');
const accessButton = document.querySelector('#access-button');
const menu = document.querySelector('#access-menu');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

function getPreference(key) {
  try { return localStorage.getItem('eatmates-welcome-' + key) === 'true'; }
  catch { return false; }
}

function bindPreference(id, apply) {
  const input = document.getElementById(id);
  input.checked = getPreference(id);
  apply(input.checked);
  input.addEventListener('change', () => {
    apply(input.checked);
    try { localStorage.setItem('eatmates-welcome-' + id, String(input.checked)); }
    catch { /* Preferences still apply to this page. */ }
  });
}

bindPreference('big-text', enabled => document.documentElement.classList.toggle('large', enabled));
bindPreference('contrast', enabled => document.documentElement.classList.toggle('contrast', enabled));
bindPreference('still', enabled => {
  film.autoplay = !enabled && !reduceMotion.matches;
  if (enabled) film.pause();
});
reduceMotion.addEventListener('change', event => {
  film.autoplay = !event.matches && !document.querySelector('#still').checked;
  if (event.matches) film.pause();
});

film.muted = true;
film.volume = 0.75;
if (film.volume !== 0.75) document.querySelector('#volume-label').hidden = true;
document.querySelector('.media-tools').hidden = false;
mute.addEventListener('click', () => {
  film.muted = !film.muted;
  if (!film.muted && film.volume === 0) film.volume = 0.75;
});
volume.addEventListener('input', () => {
  film.volume = Number(volume.value) / 100;
  film.muted = film.volume === 0;
});
film.addEventListener('volumechange', () => {
  mute.textContent = film.muted || film.volume === 0 ? 'הפעלת קול' : 'השתקה';
  volume.value = Math.round(film.volume * 100);
});
accessButton.hidden = false;
accessButton.addEventListener('click', () => menu.showModal());
