# TaskFlow API Dokümantasyonu

Temel URL: `http://localhost:3000`

## Görevleri Listeleme

`GET /tasks`

Desteklenen sorgular:

- `status`: `pending`, `in_progress`, `completed`
- `priority`: `low`, `medium`, `high`
- `page`: sayfa numarası
- `limit`: sayfa başına kayıt sayısı
- `sort=createdAt`: eski tarihten yeni tarihe sıralama
- `sort=-createdAt`: yeni tarihten eski tarihe sıralama

Örnek yanıt:

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

## Yeni Görev Oluşturma

`POST /tasks`

```json
{
  "title": "Postman testlerini hazırla",
  "description": "CRUD endpointlerini Postman ile doğrula",
  "priority": "high",
  "status": "pending",
  "assignee": "musa"
}
```

Başarılı yanıt: `201 Created`

## Görev Detayı

`GET /tasks/:id`

Bulunamazsa: `404 {"error":"Görev bulunamadı"}`

## Görev Güncelleme

`PUT /tasks/:id`

Gönderilen alanlar güncellenir. Başarılı yanıt: `200 OK`

## Görev Silme

`DELETE /tasks/:id`

Başarılı yanıt: `200 OK`

## Arama

`GET /tasks/search?keyword=backend`

Başlık, açıklama veya görevliye göre arama yapar.

## Kullanıcıya Göre Listeleme

`GET /tasks/assignee/musa`

## Raporlar

- `GET /reports/completed`: Tamamlanan görev sayısı
- `GET /reports/pending`: Bekleyen görev sayısı
- `GET /reports/summary`: Toplam ve duruma göre özet
