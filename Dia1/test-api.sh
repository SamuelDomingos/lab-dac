#!/bin/bash
# ============================================================================
# API Minhas Bandas — testes via terminal (curl)
#
# COMO USAR:
#   1. Suba o banco e a API em 2 terminais:  npm run db  |  npm run dev
#   2. Rode este arquivo:                    bash test-api.sh
#      (ou dê permissão uma vez: chmod +x test-api.sh, depois ./test-api.sh)
#
# O QUE OBSERVAR: cada chamada mostra o corpo JSON + [status HTTP] no final.
#   200 ok · 201 criado · 204 apagado (sem corpo) · 400 pedido inválido ·
#   404 não existe · 500 banco fora do ar
#
# DICA: copie qualquer linha curl daqui, cole no terminal e mude URL ou
# dados para experimentar. É assim que se testa API sem frontend.
# ============================================================================
BASE="http://localhost:3000"

titulo() { echo ""; echo "=== $1 ==="; }

titulo "01 - Raiz"
curl -s "$BASE/"; echo

titulo "02 - Health (API + banco vivos?)"
curl -s "$BASE/health"; echo

titulo "03 - Listar bandas"
curl -s "$BASE/bandas" | head -c 300; echo "..."

titulo "04 - Filtrar por estilo (?estilo=rock)"
curl -s "$BASE/bandas?estilo=rock" | grep -o '"nome":"[^"]*"' | head -5

titulo "05 - Filtrar por pais (?pais=Brasil)"
curl -s "$BASE/bandas?pais=Brasil" | grep -o '"nome":"[^"]*"'

titulo "06 - Buscar por id (/bandas/5)"
curl -s "$BASE/bandas/5"; echo

titulo "07 - Listar estilos"
curl -s "$BASE/estilos" | grep -o '"nome":"[^"]*"'

titulo "08 - Destaques (regra: 30+ milhoes de ouvintes)"
curl -s "$BASE/destaques" | grep -o '"nome":"[^"]*"'

titulo "09 - Cadastrar banda (POST -> 201)"
ID=$(curl -s -X POST "$BASE/bandas" -H "Content-Type: application/json" \
  -d '{"nome":"CPM 22","estilo":"rock","pais":"Brasil","ano":1995}' \
  | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
echo "criada com id $ID"

titulo "10 - Trocar banda inteira (PUT -> 200)"
curl -s -X PUT "$BASE/bandas/$ID" -H "Content-Type: application/json" \
  -d '{"nome":"CPM 22","estilo":"rock","pais":"Brasil","ano":1995,"ouvintes":4}' \
  -w " [%{http_code}]"; echo

titulo "11 - Atualizar um pedaco (PATCH -> 200)"
curl -s -X PATCH "$BASE/bandas/$ID" -H "Content-Type: application/json" \
  -d '{"ouvintes":5}' -w " [%{http_code}]"; echo

titulo "12 - Apagar banda (DELETE -> 204, sem corpo)"
curl -s -X DELETE "$BASE/bandas/$ID" -w "[%{http_code}]"; echo

titulo "13 - Erro 404 (banda 999 nao existe)"
curl -s "$BASE/bandas/999" -w " [%{http_code}]"; echo

titulo "14 - Erro 400 (POST sem estilo)"
curl -s -X POST "$BASE/bandas" -H "Content-Type: application/json" \
  -d '{"nome":"Banda Sem Estilo"}' -w " [%{http_code}]"; echo

echo ""
echo "Fim! Compare com a collection do Thunder Client: mesmos testes, outra ferramenta."
