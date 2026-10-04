// ============================================================================
// DAC — Aula 06: Backend com Node + Express
// App de MÚSICAS: este servidor NÃO guarda nada em memória. Ele conversa com
// o json-server (o nosso "banco de dados" da aula) e adiciona FILTROS e
// REGRAS DE NEGÓCIO por cima.
// Suba primeiro o banco:  npm run db     (porta 3001)
// Depois a API:            npm run dev    (porta 3000)
// ============================================================================
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DB_URL = 'http://localhost:3001'; // json-server = nosso banco

app.use(cors());         // libera o acesso do frontend (aula futura)
app.use(express.json()); // entende corpo JSON no POST

// Raiz: cartão de visitas da API
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API Minhas Bandas no ar!',
    endpoints: [
      'GET  /health',
      'GET  /bandas (?estilo=rock | ?pais=Brasil)',
      'GET  /bandas/:id',
      'GET  /estilos',
      'GET  /destaques',
      'POST /bandas',
      'PUT  /bandas/:id',
      'PATCH /bandas/:id',
      'DELETE /bandas/:id'
    ]
  });
});

// Saúde da API + do banco (se o json-server estiver fora, avisa aqui)
app.get('/health', async (req, res) => {
  try {
    const r = await fetch(`${DB_URL}/bandas`);
    const bandas = await r.json();
    res.json({ status: 'ok', banco: 'conectado', totalBandas: bandas.length });
  } catch {
    res.status(500).json({ status: 'erro', banco: 'desconectado — rode: npm run db' });
  }
});

// Lista tudo, com filtros simples: /bandas?estilo=rock ou /bandas?pais=Brasil
app.get('/bandas', async (req, res) => {
  const r = await fetch(`${DB_URL}/bandas`);
  let bandas = await r.json();
  if (req.query.estilo) {
    bandas = bandas.filter((b) => b.estilo === req.query.estilo);
  }
  if (req.query.pais) {
    bandas = bandas.filter((b) => b.pais === req.query.pais);
  }
  res.json(bandas);
});

// Busca uma por id (404 quando não existe)
app.get('/bandas/:id', async (req, res) => {
  const r = await fetch(`${DB_URL}/bandas/${req.params.id}`);
  if (r.status === 404) {
    return res.status(404).json({ erro: 'Banda não encontrada' });
  }
  res.json(await r.json());
});

// Lista os estilos musicais disponíveis
app.get('/estilos', async (req, res) => {
  const r = await fetch(`${DB_URL}/estilos`);
  res.json(await r.json());
});

// REGRA DE NEGÓCIO: só o Express faz isso, o json-server sozinho não sabe.
// Destaque = banda com 30+ milhões de ouvintes mensais.
app.get('/destaques', async (req, res) => {
  const r = await fetch(`${DB_URL}/bandas`);
  const bandas = await r.json();
  res.json(bandas.filter((b) => b.ouvintes >= 30));
});

// Cadastra banda com VALIDAÇÃO antes de salvar no banco
app.post('/bandas', async (req, res) => {
  const { nome, estilo, pais, ano, ouvintes } = req.body;
  if (!nome || !estilo) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome e estilo' });
  }
  const r = await fetch(`${DB_URL}/bandas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome,
      estilo,
      pais: pais || 'Desconhecido',
      ano: ano || new Date().getFullYear(),
      ouvintes: ouvintes || 0
    })
  });
  res.status(201).json(await r.json());
});

// TROCA COMPLETA: o PUT substitui a banda inteira (nome + estilo continuam obrigatórios)
app.put('/bandas/:id', async (req, res) => {
  const { nome, estilo, pais, ano, ouvintes } = req.body;
  if (!nome || !estilo) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome e estilo' });
  }
  const r = await fetch(`${DB_URL}/bandas/${req.params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, estilo, pais, ano, ouvintes })
  });
  if (r.status === 404) {
    return res.status(404).json({ erro: 'Banda não encontrada' });
  }
  res.json(await r.json());
});

// TROCA PARCIAL: o PATCH atualiza só os campos enviados (ex.: só ouvintes)
app.patch('/bandas/:id', async (req, res) => {
  const r = await fetch(`${DB_URL}/bandas/${req.params.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  if (r.status === 404) {
    return res.status(404).json({ erro: 'Banda não encontrada' });
  }
  res.json(await r.json());
});

// APAGA: o DELETE remove a banda (204 = sumiu e não há o que devolver)
app.delete('/bandas/:id', async (req, res) => {
  const r = await fetch(`${DB_URL}/bandas/${req.params.id}`, { method: 'DELETE' });
  if (r.status === 404) {
    return res.status(404).json({ erro: 'Banda não encontrada' });
  }
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`API no ar: http://localhost:${PORT}`);
});
