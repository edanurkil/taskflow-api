# TaskFlow - Proje Tanıtım Dokümanı

## Amaç

TaskFlow, bir yazılım şirketindeki ekiplerin görev ve sorumluluklarını merkezi olarak takip etmelerini sağlayan REST API sistemidir.

## Senaryo

Takım üyeleri; yeni görevler oluşturabilir, görevleri çalışanlara atayabilir, durum ve öncelik bilgilerini değiştirebilir, görevleri filtreleyebilir ve temel raporları görüntüleyebilir.

## Sistem Özellikleri

- Görev oluşturma, listeleme, detay görüntüleme, güncelleme ve silme
- Durum, öncelik, kullanıcı ve anahtar kelimeye göre sorgulama
- Sayfalama ve oluşturulma tarihine göre sıralama
- Görev verilerinin `JSON` dosyasında kalıcı tutulması
- Tüm HTTP isteklerinin konsola ve `logs/requests.log` dosyasına kaydedilmesi
- Gönderilen görev verilerinin validation middleware ile doğrulanması
- Tamamlanan, bekleyen ve genel özet raporları

## Kullanılan Teknolojiler

Node.js, Express.js, REST API, JavaScript, JSON ve Postman.
