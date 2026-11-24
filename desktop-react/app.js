/* VERDIX Desktop — React sin build (UMD local, funciona offline) */
const h = React.createElement;
const { useState, useEffect, useRef } = React;

const APPS = [
  { id: 'browser', ico: '🌐', name: 'Navegador', desc: 'Web VERDIX', url: '/browser.html' },
  { id: 'search',  ico: '🔎', name: 'Buscador',  desc: 'Buscar en la red', url: '/search.html' },
  { id: 'ai',       ico: '✨', name: 'VERDIX AI', desc: 'Asistente inteligente', url: '/ai.html' },
  { id: 'game',     ico: '🎮', name: 'Juego',     desc: 'Ben 10 integrado', url: '/juego/index.html' },
  { id: 'terminal', ico: '⌨️', name: 'Terminal',  desc: 'Consola VERDIX' },
  { id: 'monitor',  ico: '📊', name: 'Monitor',   desc: 'Estado del sistema' },
  { id: 'control',  ico: '⚙️', name: 'Control',   desc: 'Configuración' },
  { id: 'power',    ico: '⏻', name: 'Apagar',    desc: 'Cerrar escritorio' },
];

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return h('div', { className: 'clock' }, now.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' }) + '  ' + now.toLocaleTimeString('es-ES'));
}

function Terminal() {
  const [lines, setLines] = useState(['VERDIX Shell 1.0 — escribe "help"', '']);
  const [cmd, setCmd] = useState('');
  const end = useRef(null);
  useEffect(() => { if (end.current) end.current.scrollIntoView(); }, [lines]);
  function run(e) {
    e.preventDefault();
    const c = cmd.trim();
    let out = '';
    if (!c) out = '';
    else if (c === 'help') out = 'comandos: help, whoami, date, ver, ls, clear';
    else if (c === 'whoami') out = 'verdix';
    else if (c === 'date') out = new Date().toString();
    else if (c === 'ver') out = 'VERDIX OS — Debian 13 / React Desktop';
    else if (c === 'ls') out = APPS.map(a => a.id).join('   ');
    else if (c === 'clear') { setLines([]); setCmd(''); return; }
    else out = c + ': comando no reconocido';
    setLines(p => [...p, 'verdix@os:~$ ' + c, out, '']);
    setCmd('');
  }
  return h('div', { className: 'term', onClick: () => end.current && end.current.focus() },
    lines.map((l, i) => h('div', { className: 'line', key: i }, l)),
    h('form', { onSubmit: run },
      h('span', null, 'verdix@os:~$ '),
      h('input', { ref: end, value: cmd, autoFocus: true, onChange: e => setCmd(e.target.value) })
    )
  );
}

function Monitor() {
  const [health, setHealth] = useState('consultando…');
  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(j => setHealth(j.status || 'ok')).catch(() => setHealth('local'));
  }, []);
  const rows = [
    ['Sistema', 'VERDIX OS 1.0'],
    ['Kernel', navigator.userAgent.includes('Linux') ? 'Linux x86_64' : 'Linux'],
    ['Servicio web', 'activo en :8099'],
    ['API', health],
    ['Escritorio', 'React 18'],
  ];
  return h('div', { className: 'monitor' }, rows.map(r =>
    h('div', { className: 'row', key: r[0] }, h('span', null, r[0]), h('span', null, r[1]))
  ));
}

function Control() {
  const [compact, setCompact] = useState(false);
  return h('div', { className: 'monitor' },
    h('div', { className: 'row' }, h('span', null, 'Modo compacto'),
      h('button', { onClick: () => { setCompact(!compact); document.body.style.zoom = compact ? '1' : '.9'; } }, compact ? 'Activar' : 'Desactivar')),
    h('div', { className: 'row' }, h('span', null, 'Servicio Verdix'), h('span', null, 'systemd activo')),
    h('div', { className: 'row' }, h('span', null, 'Red'), h('span', null, 'localhost:8099'))
  );
}

function Window({ win, onClose, onMove }) {
  const drag = useRef(null);
  const down = e => { drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y }; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = e => { if (drag.current) onMove(win.id, e.clientX - drag.current.dx, e.clientY - drag.current.dy); };
  const up = () => { drag.current = null; };
  const app = APPS.find(a => a.id === win.app) || APPS[0];
  let body = h('iframe', { src: app.url, title: app.name });
  if (win.app === 'terminal') body = h(Terminal);
  if (win.app === 'monitor') body = h(Monitor);
  if (win.app === 'control') body = h(Control);
  return h('div', { className: 'window', style: { left: win.x, top: win.y } },
    h('div', { className: 'wtitle', onPointerDown: down, onPointerMove: move, onPointerUp: up },
      h('span', { className: 'dot' }), h('span', null, app.name),
      h('span', { className: 'close', onClick: () => onClose(win.id) }, '✕')
    ),
    h('div', { className: 'wbody' }, body)
  );
}

function Desktop() {
  const [wins, setWins] = useState([]);
  const [power, setPower] = useState(false);
  function open(app) {
    if (app.id === 'power') { setPower(true); return; }
    const n = wins.length;
    setWins(p => [...p, { id: Date.now(), app: app.id, x: 90 + (n % 5) * 28, y: 42 + (n % 5) * 26 }]);
  }
  return h('div', null,
    h('div', { className: 'topbar' },
      h('div', { className: 'logo' }, h('b', null, 'VERDIX'), ' OS'),
      h('span', { className: 'pill on' }, '● SISTEMA ACTIVO'),
      h('span', { className: 'pill' }, 'React Desktop 1.0'),
      h('div', { className: 'spacer' }),
      h(Clock)
    ),
    h('div', { className: 'dock' }, APPS.map(a =>
      h('button', { className: 'dockbtn', key: a.id, onClick: () => open(a) },
        h('span', { className: 'ico' }, a.ico), h('span', { className: 'lbl' }, a.name))
    )),
    h('div', { className: 'stage' },
      h('div', { className: 'hero' },
        h('h1', null, 'Bienvenido a ', h('span', null, 'VERDIX OS')),
        h('p', null, 'Tu escritorio, tus herramientas, tu ecosistema.')
      ),
      h('div', { className: 'grid' }, APPS.filter(a => a.id !== 'power').map(a =>
        h('div', { className: 'card', key: a.id, onClick: () => open(a) },
          h('div', { className: 'ico' }, a.ico), h('h3', null, a.name), h('small', null, a.desc))
      ))
    ),
    wins.map(w => h(Window, { key: w.id, win: w,
      onClose: id => setWins(p => p.filter(x => x.id !== id)),
      onMove: (id, x, y) => setWins(p => p.map(v => v.id === id ? { ...v, x, y } : v)) })),
    power && h('div', { className: 'dialog', onClick: () => setPower(false) },
      h('div', { onClick: e => e.stopPropagation() },
        h('h2', null, '¿Cerrar escritorio?'),
        h('p', null, 'El sistema seguirá activo. Puedes volver a entrar con Firefox.'),
        h('button', { onClick: () => setPower(false) }, 'Cancelar')
      ))
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(h(Desktop));
