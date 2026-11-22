# Veri Modeli

Tüm kayıtlar `data/` altındaki JSON dizilerinde tutulur. `id` değerleri artan string, tarih alanları ISO 8601 biçimindedir.

## Task — `tasks.json`

| Alan | Tip | Zorunluluk | Açıklama |
|---|---|---|---|
| `id` | string | otomatik | Görev kimliği |
| `title` | string | evet | En fazla 120 karakter |
| `description` | string | evet | En fazla 1000 karakter |
| `priority` | enum | evet | `low`, `medium`, `high` |
| `status` | enum | varsayılan | `pending`, `in_progress`, `completed`; varsayılan `pending` |
| `assignee` | string | evet | Atanan çalışanın `username` değeri, en fazla 50 karakter |
| `projectId` | string veya null | hayır | Mevcut projenin ID'si; proje yoksa `null` |
| `createdAt` | string | otomatik | Oluşturma zamanı |
| `updatedAt` | string | otomatik | Son güncelleme zamanı |

## Project — `projects.json`

`id`, `name` (zorunlu, en fazla 100 karakter), `description` (opsiyonel, en fazla 500 karakter), `createdAt`, `updatedAt`.

## Employee — `employees.json`

`id`, `username` (zorunlu, benzersiz; harf/rakam/nokta/tire/alt çizgi, en fazla 30 karakter), `name` (zorunlu, en fazla 100 karakter), `email` (zorunlu, geçerli ve benzersiz), `role` (opsiyonel, en fazla 50 karakter), `createdAt`, `updatedAt`.

## İlişkiler ve silme kuralları

- `Project 1 → N Task`: Task üzerindeki `projectId` ile kurulur.
- `Employee 1 → N Task`: Task üzerindeki `assignee` metninin Employee `username` değeriyle eşleşmesiyle kurulur. Görevde Employee ID tutulmaz.
- `projectId` verildiyse var olan Project'i göstermelidir; aksi durumda `400`.
- Bağlı görevi bulunan Project veya `assignee` değerine atanmış Employee silinemez; `409 Conflict` döner.
- PUT'ta `projectId: null` ile görev proje bağlantısı kaldırılabilir.
