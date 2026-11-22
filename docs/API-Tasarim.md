# API Tasarımı

## İlkeler ve mimari

- REST kaynak URL'leri, HTTP metotları ve durum kodları
- JSON istek/yanıt gövdeleri
- `routes` yalnızca yönlendirir; iş kuralları `controllers`, dosya erişimi `models` katmanındadır.
- Başarılı liste yanıtı `{ "data": [], "pagination": {} }`; hatalar `{ "error": "...", "details": [] }` biçimindedir.

İstek akışı: logger → JSON parser → route → validation → controller → model → response. Bilinmeyen yollar `404`, bozuk JSON `400`, beklenmeyen hatalar `500` döndürür.

## Endpoint'ler

### Tasks

| Metot | Endpoint | İşlem |
|---|---|---|
| POST | `/tasks` | Görev oluştur |
| GET | `/tasks` | Filtrele, sırala ve sayfala |
| GET | `/tasks/:id` | Görev detayı |
| PUT | `/tasks/:id` | Kısmi güncelle |
| DELETE | `/tasks/:id` | Görev sil |
| GET | `/tasks/search?keyword=` | Başlık, açıklama veya assignee içinde ara |
| GET | `/tasks/assignee/:assignee` | Kullanıcı adına göre görevleri listele |

### Projects

`POST/GET /projects`, `GET/PUT/DELETE /projects/:id`, `GET /projects/:id/tasks`

### Employees

`POST/GET /employees`, `GET/PUT/DELETE /employees/:id`, `GET /employees/:id/tasks`

### Reports

`GET /reports/completed`, `GET /reports/pending`, `GET /reports/summary`

## Sorgu parametreleri

Task listeleri `status`, `priority`, `assignee`, `projectId`, `sort`, `page`, `limit` destekler. `sort` için `createdAt`, `updatedAt`, `title`, `priority` kullanılır; azalan sıralama alanın başına `-` koyarak belirtilir. `page` en az 1; `limit` 1–100 arasındadır.

## Durum kodları

| Kod | Anlam |
|---|---|
| 200 | Başarılı okuma, güncelleme veya silme |
| 201 | Kayıt oluşturuldu |
| 400 | Geçersiz veri/sorgu veya bozuk JSON |
| 404 | Kayıt ya da endpoint bulunamadı |
| 409 | Yinelenen çalışan kullanıcı adı/e-posta veya ilişkili kayıt silme çakışması |
| 500 | Beklenmeyen sunucu hatası |

Sabit route'lar (`/search`, `/assignee/:assignee`, `/:id/tasks`) değişken `/:id` route'larından önce tanımlanır.
