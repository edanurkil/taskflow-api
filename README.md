# TASKFLOW — Görev ve Proje Yönetim Sistemi API

Node.js ve Express.js ile geliştirilmiş REST API. PDF yönergesindeki zorunlu görev CRUD'u, logger ve Postman tesliminin yanında ZIP kaynağındaki filtreleme, doğrulama, raporlama ve proje/çalışan yönetimi özelliklerini de içerir.

## Gereksinimler

- Node.js 18 veya üzeri
- npm (Node.js ile birlikte gelir)

## Kurulum ve çalıştırma

```powershell
npm ci
npm start
```

API varsayılan olarak `http://localhost:3000` adresinde çalışır. `GET /` ile endpoint listesini kontrol edin.

Geliştirme sırasında dosya değişikliklerinde otomatik yeniden başlatma:

```powershell
npm run dev
```

## Test

```powershell
npm test
```

Testler Node.js'in yerleşik test altyapısını kullanır ve geçici bir veri klasöründe çalışır; `data/` içeriğini değiştirmez.

## İsteğe bağlı ortam değişkenleri

| Değişken | Varsayılan | Açıklama |
|---|---|---|
| `PORT` | `3000` | HTTP portu |
| `DATA_DIR` | `./data` | JSON veri dosyalarının klasörü |
| `LOG_DIR` | `./logs` | İstek loglarının klasörü |
| `LOG_CONSOLE` | `true` | `false` ise konsol logunu kapatır |
| `LOG_TO_FILE` | `true` | `false` ise dosya logunu kapatır |

PowerShell örneği:

```powershell
$env:PORT=4000
npm start
```

## Endpoint özeti

| Kaynak | Endpoint |
|---|---|
| Görev CRUD | `POST/GET /tasks`, `GET/PUT/DELETE /tasks/:id` |
| Görev arama/liste | `GET /tasks/search?keyword=`, `GET /tasks/assignee/:assignee`, `GET /tasks?status=&priority=&assignee=&projectId=&sort=&page=&limit=` |
| Projeler | `POST/GET /projects`, `GET/PUT/DELETE /projects/:id`, `GET /projects/:id/tasks` |
| Çalışanlar | `POST/GET /employees`, `GET/PUT/DELETE /employees/:id`, `GET /employees/:id/tasks` |
| Raporlar | `GET /reports/completed`, `GET /reports/pending`, `GET /reports/summary` |

Görev durumları `pending`, `in_progress`, `completed`; öncelikler `low`, `medium`, `high` değerlerini alır. Liste endpoint'leri `{ data, pagination }` yanıtı verir. Atanan kişi `assignee` alanında metin kullanıcı adı olarak tutulur (ör. `eda`); göreve yalnızca opsiyonel `projectId` ilişkisi eklenir.

## Postman

`postman/TaskFlow.postman_collection.json` dosyasını Postman'e aktarın. Koleksiyonu Collection Runner ile sırasıyla çalıştırın. `baseUrl`, `employeeId`, `employeeUsername`, `projectId` ve `taskId` koleksiyon değişkenleri otomatik kullanılır.

## Veri ve mimari

- `data/tasks.json`, `data/projects.json`, `data/employees.json`: JSON veri deposu
- `logs/requests.log`: method, URL, zaman damgası, durum kodu ve süre içeren istek logu
- `src/routes` → `src/controllers` → `src/models`: route, iş mantığı ve veri erişim katmanları
- Logger, JSON body parser'dan önce; not-found ve error handler'lar route'lardan sonra çalışır.

## Dokümantasyon ve teslim

- [Proje Tanıtım Dokümanı](docs/Proje-Tanitim-Dokumani.md)
- [Veri Modeli](docs/Veri-Modeli.md)
- [API Tasarımı](docs/API-Tasarim.md)
- [API Dokümantasyonu](docs/API-Dokumantasyonu.md)
- [Test Dokümantasyonu](docs/Test-Dokumantasyonu.md)
- [Kullanım Kılavuzu](docs/Kullanim-Kilavuzu.md)
- [Postman ekran görüntüsü yönergesi](docs/screenshots/README.md)
