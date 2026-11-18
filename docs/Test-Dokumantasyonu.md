# Test Dokümantasyonu

## Otomatik Testler

Otomatik testleri çalıştırmak için:

```bash
npm test
```

Kapsanan senaryolar:

- Görevleri sayfalı listeleme
- Yeni görev oluşturma
- Geçersiz görev verisini reddetme
- Görev detayını görüntüleme
- Görev güncelleme
- Görev silme
- Sistem özetini raporlama

## Postman CRUD Testleri

Postman koleksiyonu `postman/TaskFlow.postman_collection.json` dosyasındadır.

1. `GET /tasks?page=1&limit=10` ile tüm görevleri listeleyin ve `200 OK` bekleyin.
2. `POST /tasks` ile örnek gövde gönderin ve `201 Created` bekleyin.
3. Dönen görevin `id` değerini detay isteğine ekleyin.
4. `PUT /tasks/:id` ile durum veya öncelik güncelleyin.
5. `DELETE /tasks/:id` ile görevi silin ve `200 OK` bekleyin.
6. Hatalı veya eksik POST gövdesi göndererek `400 Bad Request` doğrulayın.

## Beklenen Sonuçlar

- Başarılı CRUD işlemleri doğru HTTP durum kodunu döndürmelidir.
- Bulunmayan görev için `404` döndürülmelidir.
- Geçersiz görev verisi için açıklamalı `400` yanıtı döndürülmelidir.
