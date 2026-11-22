# Test Dokümantasyonu

## Otomatik testler

```powershell
npm test
```

Node.js `node:test` ve yerleşik `fetch` kullanılır. Test süreci `DATA_DIR` ve `LOG_DIR` değerlerini işletim sisteminin geçici klasörüne yönlendirir; gerçek proje verilerini değiştirmez ve ek test paketi gerektirmez.

Test kapsamı:

- Root ve bilinmeyen endpoint yanıtları
- Görev CRUD akışı, sayfalı liste, kısmi güncelleme ve korunan alanlar
- Zorunlu alan, enum, metin uzunluğu, proje referansı ve bozuk JSON doğrulaması
- Filtreleme, assignee arama, keyword search, sıralama ve sayfalama
- Project/Employee CRUD, benzersiz username/e-posta ve ilişkili görev listeleri
- İlişkili görev varken Project/Employee silmenin engellenmesi
- Rapor sayılarının tutarlılığı
- Logger'ın başarılı ve hatalı JSON isteklerinde durum/süre kaydı

## Postman

`postman/TaskFlow.postman_collection.json` dosyasını Postman'e aktarın ve sunucu çalışırken Collection Runner ile klasörleri sırasıyla çalıştırın. Testler oluşturulan employee, project ve task ID'lerini değişkenlere kaydeder; temizlik klasörü eklenen proje ve çalışanları kaldırır.

Temel CRUD kanıtı için `docs/screenshots/README.md` dosyasındaki beş Postman görüntüsünü kaydedin. Görüntüde method/URL, request body, HTTP status ve response body birlikte görünmelidir.

## Önemli beklenen durum kodları

- Geçerli POST: `201`
- Geçerli GET/PUT/DELETE: `200`
- Hatalı alan, sorgu ya da JSON: `400`
- Olmayan kayıt/endpoint: `404`
- Tekrarlayan username/e-posta veya bağlı kayıt silme: `409`
