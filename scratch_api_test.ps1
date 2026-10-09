$body = '{"name":"Raju Singh","email":"raju@test.com","phone":"9876001122","password":"Test@1234","role":"farmer"}'
$res = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/signup' -Method POST -Body $body -ContentType 'application/json'
Write-Host "=== CREATE USER ==="
$res | ConvertTo-Json -Depth 4

$token = $res.token
$headers = @{ Authorization = "Bearer $token" }

$loginBody = '{"identifier":"raju@test.com","password":"Test@1234"}'
$loginRes = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' -Method POST -Body $loginBody -ContentType 'application/json'
Write-Host "`n=== READ USER (Login) ==="
$loginRes | ConvertTo-Json -Depth 4

$lotBody = '{"crop":"Basmati Rice","variety":"Pusa 1121","quantity":2000,"unit":"kg","expectedPrice":65,"harvestDate":"2026-05-10"}'
$lotRes = Invoke-RestMethod -Uri 'http://localhost:3000/api/lots' -Method POST -Body $lotBody -ContentType 'application/json' -Headers $headers
Write-Host "`n=== CREATE PRODUCE LOT ==="
$lotRes | ConvertTo-Json -Depth 4

$mktRes = Invoke-RestMethod -Uri 'http://localhost:3000/api/marketplace' -Method GET
Write-Host "`n=== READ MARKETPLACE ==="
Write-Host "Total listings returned: $($mktRes.listings.Count)"
$mktRes.listings | ConvertTo-Json -Depth 3
