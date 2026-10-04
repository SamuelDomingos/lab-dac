# API Minhas Bandas — Aula 06

Backend de exemplo: app de **bandas de rock (anos 80, 90 e 2000)** com
**Node + Express** e **json-server** como banco de dados.

## Pré-requisitos

- Node.js LTS instalado (`node --version`)
- Extensão **Thunder Client** no VS Code

## Como rodar (2 terminais)

```bash
npm install
```

Terminal 1 — banco de dados (porta 3001):

```bash
npm run db
```

Terminal 2 — API Express (porta 3000):

```bash
npm run dev
```

## Testar

### Opção A — Thunder Client (visual)

1. Abra `http://localhost:3000` no navegador.
2. No VS Code, importe `thunder-collection_dac-aula06.json` no Thunder Client
   (coleção → `...` → Import) e execute cada requisição.

### Opção B — Terminal com curl (script)

O arquivo `test-api.sh` roda os **mesmos 14 testes** pelo terminal, mostrando
o corpo da resposta + o status HTTP de cada chamada:

```bash
bash test-api.sh
```

Como mexer nele:

- Cada bloco é um `curl` comum: copie a linha, cole no terminal e troque
  a URL ou o JSON para experimentar (ex.: mude `?estilo=rock` para `?pais=Brasil`).
- O `-w " [%{http_code}]"` no final imprime o status (200, 201, 404...).
- O teste 09 guarda o `id` criado numa variável e os testes 10–12
  reutilizam esse `id` — é assim que se encadeiam chamadas no terminal.
- Preferiu executar direto? Dê permissão uma vez (`chmod +x test-api.sh`)
  e rode com `./test-api.sh`.

## Endpoints

| Método | Rota | O que faz |
| ------ | ---- | ---------- |
| GET | `/` | Cartão de visitas da API |
| GET | `/health` | Saúde da API + conexão com o banco |
| GET | `/bandas` | Lista tudo (`?estilo=rock` e `?pais=Brasil` filtram) |
| GET | `/bandas/:id` | Busca uma (404 se não existir) |
| GET | `/estilos` | Estilos musicais disponíveis |
| GET | `/destaques` | Regra de negócio: 30+ milhões de ouvintes |
| POST | `/bandas` | Cadastra com validação (201 ou 400) |
| PUT | `/bandas/:id` | Troca a banda inteira (valida nome + estilo) |
| PATCH | `/bandas/:id` | Atualiza só os campos enviados |
| DELETE | `/bandas/:id` | Apaga (204 ou 404) |
