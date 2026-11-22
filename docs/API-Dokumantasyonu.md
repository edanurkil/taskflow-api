# TaskFlow API Dokümantasyonu

**Base URL:** `http://localhost:3000`  
**Biçim:** JSON  
**Kimlik doğrulama:** Bu eğitim projesinde yoktur.

## Listeleme, filtreleme ve sıralama

`GET /tasks`, `/tasks/search` ve `/tasks/assignee/:assignee` liste yanıtı olarak `{ data, pagination }` döndürür.

| Parametre | Değer / açıklama |
|---|---|
| `status` | `pending`, `in_progress`, `completed` |
| `priority` | `low`, `medium`, `high` |
| `assignee` | Kullanıcı adına göre filtre (büyük/küçük harf duyarsız) |
| `projectId` | Projeye göre filtre |
| `sort` | `createdAt`, `updatedAt`, `title`, `priority`; azalan sıralama için başına `-` ekleyin |
| `page` | 1 veya daha büyük tam sayı; varsayılan 1 |
| `limit` | 1–100 tam sayı; varsayılan 10 |

Filtreler birleştirilebilir: `GET /tasks?status=pending&priority=high&sort=-createdAt&page=1&limit=5`. Geçersiz değer `400` döndürür.

Örnek liste yanıtı:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

## Tasks

### `POST /tasks`

Zorunlu alanlar: `title` (1–120 karakter), `description` (1–1000), `priority`, `assignee` (en fazla 50). `status` varsayılanı `pending`; `projectId` isteğe bağlıdır ve mevcut proje ID'si olmalıdır.

```json
{
  "title": "API dokümantasyonunu yaz",
  "description": "Endpoint istek ve yanıt örneklerini ekle",
  "priority": "medium",
  "assignee": "eda",
  "projectId": "1"
}
```

Başarılı yanıt `201 Created` döndürür; `id`, `status`, `createdAt`, `updatedAt` otomatik oluşturulur. `projectId` verilmezse `null` olur.

### `GET /tasks/:id`

Tek görev nesnesi döndürür. Kayıt yoksa `404 {"error":"Görev bulunamadı"}`.

### `PUT /tasks/:id`

Kısmi güncellemedir. En az bir alan gönderin. `id` ve `createdAt` değiştirilemez; `updatedAt` otomatik güncellenir. `projectId: null` bağlantıyı kaldırır.

```json
{ "status": "in_progress" }
```

### `DELETE /tasks/:id`

Başarı yanıtı `200`: `{ "message": "Görev silindi", "task": { ... } }`. Kayıt yoksa `404`.

### Arama ve kullanıcıya göre listeleme

- `GET /tasks/search?keyword=backend`: Başlık, açıklama ve assignee içinde büyük/küçük harf duyarsız arama; keyword zorunludur.
- `GET /tasks/assignee/eda`: Kullanıcı adına ait görevleri listeler.

Her ikisi de sayfalı yanıt verir.

## Projects

- `POST /projects`: `{ "name": "Mobil Uygulama", "description": "İstemci uygulaması" }`
- `GET /projects`: Sayfalı proje listesi.
- `GET /projects/:id`: Proje detayı.
- `PUT /projects/:id`: `name` ve/veya `description` kısmi güncellemesi.
- `DELETE /projects/:id`: Silme. Bağlı görev varsa `409` ve `linkedTaskCount` döndürür.
- `GET /projects/:id/tasks`: Projenin sayfalı görev listesi.

`name` zorunlu (en fazla 100), `description` isteğe bağlı (en fazla 500 karakter).

## Employees

- `POST /employees`: `{ "username": "eda", "name": "Eda", "email": "eda@taskflow.dev", "role": "Backend Developer" }`
- `GET /employees`: Sayfalı çalışan listesi.
- `GET /employees/:id`: Çalışan detayı.
- `PUT /employees/:id`: `username`, `name`, `email`, `role` alanlarını kısmi günceller.
- `DELETE /employees/:id`: Çalışana atanmış görev varsa `409` ve `assignedTaskCount` döndürür.
- `GET /employees/:id/tasks`: `assignee` metni çalışanın `username` değeriyle eşleşen görevleri sayfalı döndürür.

`username` benzersiz olmalı ve harf/rakam/nokta/tire/alt çizgi içermelidir (en fazla 30). E-posta geçerli ve benzersiz olmalıdır; `name` zorunludur.

## Reports

- `GET /reports/completed`: `{ "status": "completed", "count": 0 }`
- `GET /reports/pending`: `{ "status": "pending", "count": 0 }`
- `GET /reports/summary`: Toplam görev, durum ve öncelik dağılımı, completion rate, atanan kişi dağılımı ve Project/Employee toplamlarını döndürür.

## Hatalar

| Kod | Açıklama |
|---|---|
| 400 | Geçersiz alan/sorgu, bulunmayan `projectId` veya hatalı JSON |
| 404 | Kayıt veya endpoint bulunamadı |
| 409 | Yinelenen çalışan username/e-posta veya ilişkili kaydı silme |
| 500 | Beklenmeyen sunucu hatası (ayrıntı sunucu konsolunda) |
