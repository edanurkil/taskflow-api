# Kullanım Kılavuzu

## Başlatma

`npm ci` ardından `npm start` çalıştırın. Varsayılan adres `http://localhost:3000`; `GET /` servis ve endpoint listesini gösterir.

## Ekip, proje ve görev oluşturma sırası

Çalışan kaydı:

```json
{
  "username": "eda",
  "name": "Eda",
  "email": "eda@taskflow.dev",
  "role": "Backend Developer"
}
```

`POST /employees` yanıtındaki `username` görevlerin `assignee` alanına yazılır.

Proje oluşturma:

```json
{
  "name": "Mobil Uygulama",
  "description": "iOS ve Android istemcisi"
}
```

Görev oluşturma:

```json
{
  "title": "Giriş ekranını tasarla",
  "description": "Login ekranı mockup'ını hazırla",
  "priority": "high",
  "assignee": "eda",
  "projectId": "2"
}
```

## Örnek istekler

```text
GET /tasks?status=pending&priority=high&sort=-createdAt&page=1&limit=5
GET /tasks/search?keyword=ekran
GET /tasks/assignee/eda
GET /projects/2/tasks
GET /employees/1/tasks
GET /reports/summary
```

Görevleri güncellemek için yalnızca değişen alanları `PUT /tasks/:id` gövdesinde gönderin. `projectId: null` proje bağlantısını kaldırır. Var olan görevleri olan proje/çalışan silinemez; önce görevleri başka kayda taşıyın veya silin.

## Hata yönetimi

`400` yanıtında `details` alanını, `404` yanıtında kayıt/URL'yi, `409` yanıtında ilişkili kayıt veya tekrarlayan kullanıcı/e-posta bilgisini kontrol edin. `500` durumunda sunucu konsolunu inceleyin.
