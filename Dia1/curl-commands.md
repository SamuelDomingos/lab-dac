# API Minhas Bandas — curl commands

Mesmos 14 testes do `test-api.sh` e do `requests.http` (REST Client),
em formato copia-e-cola (um bloco por requisição).

Pré-requisitos:

```bash
# Terminal 1 — banco (porta 3001)
npm run db

# Terminal 2 — API (porta 3000)
npm run dev
```

> Todos esperam a API em `http://localhost:3000`.
> Respostas esperadas: `200 ok` · `201 criado` · `204 apagado (sem corpo)` ·
> `400 pedido inválido` · `404 não existe`.

---

## 01 - Raiz — `GET /`

```bash
curl -i http://localhost:3000/
```

## 02 - Health — `GET /health`

```bash
curl -i http://localhost:3000/health
```

## 03 - Listar bandas — `GET /bandas`

```bash
curl -s http://localhost:3000/bandas | head -c 500; echo
```

## 04 - Filtrar por estilo — `GET /bandas?estilo=rock`

```bash
curl -s "http://localhost:3000/bandas?estilo=rock"
```

## 05 - Filtrar por país — `GET /bandas?pais=Brasil`

```bash
curl -s "http://localhost:3000/bandas?pais=Brasil"
```

## 06 - Buscar por id — `GET /bandas/5`

```bash
curl -i http://localhost:3000/bandas/5
```

## 07 - Listar estilos — `GET /estilos`

```bash
curl -s http://localhost:3000/estilos
```

## 08 - Destaques — `GET /destaques`

Regra de negócio: 30+ milhões de ouvintes.

```bash
curl -s http://localhost:3000/destaques
```

## 09 - Cadastrar banda — `POST /bandas` → 201

```bash
curl -i -X POST http://localhost:3000/bandas \
  -H "Content-Type: application/json" \
  -d '{"nome":"CPM 22","estilo":"rock","pais":"Brasil","ano":1995,"ouvintes":4}'
```

Fluxo encadeado (guarda o id para os próximos testes, como no `test-api.sh`):

```bash
ID=$(curl -s -X POST http://localhost:3000/bandas \
  -H "Content-Type: application/json" \
  -d '{"nome":"CPM 22","estilo":"rock","pais":"Brasil","ano":1995}' \
  | grep -o '"id":[0-9]*' | grep -o '[0-9]*') && echo "criada com id $ID"
```

## 10 - Trocar banda inteira — `PUT /bandas/:id` → 200

```bash
# troque 9 pelo $ID criado acima se preferir: /bandas/$ID
curl -i -X PUT http://localhost:3000/bandas/9 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Pitty","estilo":"rock","pais":"Brasil","ano":2003,"ouvintes":7}'
```

## 11 - Atualizar parcial — `PATCH /bandas/:id` → 200

```bash
curl -i -X PATCH http://localhost:3000/bandas/9 \
  -H "Content-Type: application/json" \
  -d '{"ouvintes":8}'
```

## 12 - Apagar banda — `DELETE /bandas/:id` → 204 (sem corpo)

```bash
curl -i -X DELETE http://localhost:3000/bandas/9
```

## 13 - Erro 404 — `GET /bandas/999`

```bash
curl -i http://localhost:3000/bandas/999
```

## 14 - Erro 400 — `POST /bandas` sem `estilo`

```bash
curl -i -X POST http://localhost:3000/bandas \
  -H "Content-Type: application/json" \
  -d '{"nome":"Banda Sem Estilo"}'
```

---

Fonte: `requests.http` (14 requests no REST Client) e `test-api.sh`.
Equivalentes em GUI: importe `postman-collection_dac-aula06.json` no Postman
ou `insomnia-collection_dac-aula06.json` no Insomnia.
