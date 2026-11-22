# TASKFLOW — Proje Tanıtım Dokümanı

## Amaç ve senaryo

TASKFLOW, Node.js ile Backend Programlama bitirme projesi kapsamında geliştirilen görev ve proje yönetim REST API'sidir. Bir yazılım ekibinin görevleri oluşturmasını, çalışan kullanıcı adlarına atamasını, durum ve öncelikleri takip etmesini ve görevleri projelere bağlamasını sağlar.

## Sistem özeti

| Bileşen | Açıklama |
|---|---|
| Teknoloji | Node.js 18+, Express.js |
| Mimari | REST; route → controller → JSON veri katmanı |
| Varlıklar | Task, Project, Employee |
| Veri saklama | `data/` içindeki JSON dosyaları |
| Test | Postman koleksiyonu ve `npm test` |

Görevlerde `assignee` bir çalışan kullanıcı adı metnidir (ör. `eda`); `projectId` ise mevcut bir projeye opsiyonel bağlantıdır. Kimlik doğrulama, veritabanı ve kullanıcı arayüzü kapsam dışıdır.

## PDF yönergesindeki zorunlu kapsam

- Görev ekleme, listeleme, detay görüntüleme, güncelleme ve silme
- Express routing yapısı
- Tüm istekleri method, endpoint ve zaman damgasıyla kaydeden logger middleware
- Görev CRUD uçlarının Postman üzerinden test edilmesi

## Eklenen isteğe bağlı özellikler

Durum ve öncelik filtreleri, anahtar kelime arama, kullanıcıya göre görev listeleme, sıralama, sayfalama, validation, raporlama, Project/Employee CRUD'u ve kapsamlı dokümantasyon.

## Teslim çıktıları

1. Proje kaynak kodları ve `package.json`
2. Bu proje tanıtım dokümanı
3. Kurulum ve kullanım yönergesi: [README.md](../README.md)
4. Postman CRUD test ekran görüntüleri: [screenshots yönergesi](screenshots/README.md)
