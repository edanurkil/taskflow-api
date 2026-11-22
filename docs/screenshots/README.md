# Postman Ekran Görüntüleri

PDF yönergesinin zorunlu teslim çıktısı olan temel CRUD kanıtlarını Postman uygulamasından kaydedin. Her görüntüde method ve URL, request gövdesi, HTTP durum kodu ve response gövdesi birlikte görünmelidir.

| Dosya | Postman isteği |
|---|---|
| `01-gorev-ekle-201.png` | `POST /tasks` |
| `02-gorev-listele-200.png` | `GET /tasks` |
| `03-gorev-detay-200.png` | `GET /tasks/{{taskId}}` |
| `04-gorev-guncelle-200.png` | `PUT /tasks/{{taskId}}` |
| `05-gorev-sil-200.png` | `DELETE /tasks/{{taskId}}` |

Ek kanıt olarak Postman Collection Runner sonuçlarını, `400`/`404` senaryolarını ve `logs/requests.log` veya konsol logger çıktısını da kaydedebilirsiniz.
