# TaskFlow API

TaskFlow; Node.js, Express.js ve REST mimarisi ile geliştirilmiş görev ve proje yönetim API'sidir.

## Kurulum

1. Node.js 18 veya üzerini kurun.
2. Proje klasöründe bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Sunucuyu başlatın:
   ```bash
   npm start
   ```
4. API varsayılan olarak `http://localhost:3000` adresinden çalışır.

## Test

```bash
npm test
```

## Temel Endpointler

| Method | Endpoint | Açıklama |
|---|---|---|
| GET | `/tasks` | Görevleri listeler |
| POST | `/tasks` | Yeni görev oluşturur |
| GET | `/tasks/:id` | Görev detayını getirir |
| PUT | `/tasks/:id` | Görevi günceller |
| DELETE | `/tasks/:id` | Görevi siler |
| GET | `/tasks/search?keyword=backend` | Görevlerde arama yapar |
| GET | `/tasks/assignee/musa` | Kullanıcıya göre listeler |
| GET | `/reports/summary` | Genel sistem özeti |

## Görev Gövdesi Örneği

```json
{
  "title": "Postman testlerini hazırla",
  "description": "CRUD endpointleri için test koleksiyonu oluştur",
  "priority": "high",
  "status": "pending",
  "assignee": "musa"
}
```

## Dosya Yapısı

- `src/app.js`: Express uygulaması
- `src/server.js`: Sunucu başlatma
- `src/routes`: Görev ve rapor rotaları
- `src/middleware`: Logger ve doğrulama middleware'leri
- `src/models`: JSON veri deposu işlemleri
- `data/tasks.json`: Görev verileri
- `logs/requests.log`: İstek kayıtları

## Postman Testleri

`postman/TaskFlow.postman_collection.json` dosyasını Postman'e içe aktarın.
Toplu URL değeri olarak `http://localhost:3000` kullanılır.

## Ek Dokümantasyon

- [Proje tanıtım dokümanı](docs/Proje-Tanitim-Dokumani.md)
- [API dokümantasyonu](docs/API-Dokumantasyonu.md)
- [Test dokümantasyonu](docs/Test-Dokumantasyonu.md)
