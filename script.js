// ── INICIALIZAÇÃO AUTOMÁTICA ────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // Se o elemento do gráfico existir, estamos no Dashboard
    if (document.getElementById('lineChart')) {
        initCharts();
    }
    if (document.getElementById('map')) {
        initMap();
    }
    buildGrids();
});

// ── UTILITÁRIOS ─────────────────────────────────────
// Função para mostrar/ocultar senha nos inputs
function togglePw(id) {
  const el = document.getElementById(id);
  if (el) {
      el.type = el.type === 'password' ? 'text' : 'password';
  }
}

// Função para exibir alertas (toasts) no canto da tela
function toast(msg) {
  const t = document.getElementById('toast');
  if (t) {
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2800);
  }
}

// ── CHARTS (Gráficos do Dashboard) ─────────────────
let chartsInit = false;
function initCharts() {
  if (chartsInit) return;
  chartsInit = true;

  // Gráfico de Linha (Visão Total do Mês)
  const lineCtx = document.getElementById('lineChart');
  if (lineCtx) {
    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['1','3','5','7','9','11','13','15','17','19','21','23','25','27','29','31'],
        datasets: [{
          data: [80,120,180,110,200,160,250,190,280,200,260,180,240,200,220,190],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245,158,11,.12)',
          fill: true,
          tension: 0.5,
          pointRadius: 0,
          borderWidth: 2.5
        }]
      },
      options: { plugins:{legend:{display:false}}, scales:{x:{display:false},y:{display:false}} }
    });
  }

  // Gráfico de Barras (Engajamento e Recompensa)
  const barCtx = document.getElementById('barChart');
  if (barCtx) {
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Emitidos','Resgatados'],
        datasets: [{
          data: [350,125],
          backgroundColor: ['#cbd5e1','#6366f1'],
          borderRadius: 4
        }]
      },
      options: {
        plugins:{legend:{display:false}},
        scales:{x:{display:false},y:{display:false}},
        indexAxis:'x'
      }
    });
  }

  // Gráfico Donut (Ranking de Categoria)
  const donutCtx = document.getElementById('donutCanvas');
  if (donutCtx) {
    new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [40,32,28],
          backgroundColor: ['#22a261','#5ddb99','#c8ebd9'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: { plugins:{legend:{display:false}}, cutout:'68%' }
    });
  }
}

// ── MAP (Mapa Interativo Leaflet) ────────────────────
let mapInit = false;
let leafMap;
function initMap() {
  if (mapInit) return;
  mapInit = true;
  
  // Coordenadas do mapa
  leafMap = L.map('map').setView([-12.9714, -38.5014], 14);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(leafMap);

  const greenIcon = L.divIcon({
    className:'',
    html: `<div style="background:#22a261;color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 3px 12px rgba(0,0,0,.3)">🗑</div>`,
    iconSize:[32,32]
  });
  const blueIcon = L.divIcon({
    className:'',
    html: `<div style="background:#0e7490;color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 3px 12px rgba(0,0,0,.3)">📍</div>`,
    iconSize:[32,32]
  });

  const pts = [
    [-12.9714,-38.4984,'Ferreira Costa – Av. Luis Viana', greenIcon],
    [-12.9688,-38.4920,'Terra Forte Paralela', blueIcon],
    [-12.9740,-38.5050,'Parque Shopping', greenIcon],
    [-12.9660,-38.5080,'Estação Metrô', greenIcon],
  ];
  
  pts.forEach(([lat,lng,name,icon]) => {
    L.marker([lat,lng],{icon}).addTo(leafMap).bindPopup(`<b>${name}</b>`);
  });
}

// ── GRIDS (Listas dinâmicas) ─────────────────────────
function buildGrids() {
  
  // 1. Grid de Monitoramento de Contêineres
  const containersGrid = document.getElementById('containers-grid');
  if (containersGrid) {
    const containers = [
      {id:'01', loc:'Parque Shopping', status:'warn', statusTxt:'Atenção/Quase cheio', pct:74, col:'#f97316', last:'2h atrás', peso:'25 KG', tempo:'18 horas'},
      {id:'02', loc:'Estação Mêtro', status:'ok', statusTxt:'Operante/Vazio', pct:4, col:'#22a261', last:'1h atrás', peso:'8 KG', tempo:'5 dias'},
      {id:'03', loc:'Campus Universitário', status:'full', statusTxt:'Bloqueado/Cheio', pct:100, col:'#ef4444', last:'Ontem às 18h', peso:'185 KG', tempo:'Aguardando Coleta'},
      {id:'04', loc:'Ferreira Costa', status:'warn', statusTxt:'Atenção/Quase cheio', pct:82, col:'#f97316', last:'2h atrás', peso:'25 KG', tempo:'18 horas'},
      {id:'05', loc:'Alphaville', status:'ok', statusTxt:'Operante/Vazio', pct:12, col:'#22a261', last:'5h atrás', peso:'72 KG', tempo:'14 horas'},
      {id:'06', loc:'Campus Universitário UFBA', status:'full', statusTxt:'Bloqueado/Cheio', pct:100, col:'#ef4444', last:'Ontem às 18h', peso:'185 KG', tempo:'Aguardando Coleta'},
    ];
    containersGrid.innerHTML = containers.map(c => `
      <div class="container-card">
        <div class="container-name">Contêiner #${c.id} – ${c.loc}</div>
        <div class="container-status status-${c.status}">${c.statusTxt}</div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${c.pct}%;background:${c.col}"></div></div>
        <div class="progress-pct" style="color:${c.col}">${c.pct}%</div>
        <div class="container-meta">
          <div class="meta-item"><div class="meta-label">Última Coleta</div><div class="meta-val">${c.last}</div></div>
          <div class="meta-item"><div class="meta-label">Peso Atual</div><div class="meta-val">${c.peso}</div></div>
          <div class="meta-item"><div class="meta-label">Tempo Estimado</div><div class="meta-val">${c.tempo}</div></div>
        </div>
      </div>
    `).join('');
  }

  // 2. Grid de Histórico de Coletas
  const historyGrid = document.getElementById('history-grid');
  if (historyGrid) {
    const items = [
      {name:'Carcaça de iPhone',pts:'+20 ponts',date:'26/02/2021'},
      {name:'Televisão LG',pts:'+1500 ponts',date:'26/02/2021'},
      {name:'Bateria',pts:'+10 ponts',date:'26/02/2021'},
      {name:'Monitor PC',pts:'+50 ponts',date:'26/02/2021'},
      {name:'Carcaça de iPhone',pts:'+20 ponts',date:'26/02/2021'},
      {name:'Bateria',pts:'+10 ponts',date:'26/02/2021'},
      {name:'Carcaça de iPhone',pts:'+20 ponts',date:'26/02/2021'},
      {name:'Bateria',pts:'+10 ponts',date:'26/02/2021'},
    ];
    historyGrid.innerHTML = items.map(i => `
      <div class="history-card">
        <div class="history-top">
          <div class="history-name">${i.name}</div>
          <div class="history-date">${i.date}</div>
        </div>
        <div class="history-pts">${i.pts}</div>
      </div>
    `).join('');
  }

  // 3. Grid de Histórico de Resgates (Página Carteira)
  const resgatesGrid = document.getElementById('resgates-grid');
  if (resgatesGrid) {
    const resgates = Array(6).fill({name:'20% de Desconto (FERREIRACOSTA)',pts:'– 3500 ponts',date:'26/02/2021'});
    resgatesGrid.innerHTML = resgates.map(r => `
      <div class="history-card">
        <div class="history-top">
          <div class="history-name">${r.name}</div>
          <div class="history-date">${r.date}</div>
        </div>
        <div class="history-pts" style="color:var(--red)">${r.pts}</div>
      </div>
    `).join('');
  }

  // 4. Grid de Cupons
  const cuponsGrid = document.getElementById('cupons-grid');
  if (cuponsGrid) {
    const cupons = Array(8).fill({title:'Cupom 20% de Desconto (FERREIRACOSTA)',desc:'Garanta já seu cupom na Ferreira Costa',date:'01/05/2027'});
    cuponsGrid.innerHTML = cupons.map(c => `
      <div class="cupon-card">
        <div>
          <div class="cupon-title">${c.title}</div>
          <div class="cupon-date">${c.date}</div>
          <div class="cupon-desc">${c.desc}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px">
          <div class="cupon-icon">🏷️</div>
          <button class="btn-quero" onclick="toast('Cupom resgatado com sucesso!')">Quero</button>
        </div>
      </div>
    `).join('');
  }
}