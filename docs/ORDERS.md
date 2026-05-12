# ORDERS.md

Order journey architecture for HWOOD. The three order types are locked — do not rename or restructure without explicit approval.

---

## Platform Role (v2.0)

Hybrid model. WhatsApp stays the primary channel for the manager. The platform is a **parallel lead capture channel**.

First contact is always personal (call / WhatsApp). The platform makes that contact more productive: the manager knows **WHO + WHAT + WHEN** before picking up the phone.

---

## Entry Points

| Channel | Flow |
|---------|------|
| WhatsApp / phone | Manager directs client to platform |
| Google Search / AI-chat | Client arrives directly |
| Map / direct visit | Client arrives directly |

---

## Three Order Types (locked)

### 1. Browse & Order (`browse-and-order`)

**Services:** Cabinet & Storage Modules, Interior Fronts & Surfaces

| Field | Value |
|-------|-------|
| Client profile | Knows what they need, selects from catalog |
| Form | Product selection → parameters (optional) → contact + quantity |
| Files | NOT required |
| Goal | Capture product intent + contact |
| Min fields | 3 |

---

### 2. Send File & Process (`send-file-and-process`)

**Services:** CNC Services for Professionals

| Field | Value |
|-------|-------|
| Client profile | Has a cutting list or job description |
| Form | File upload (optional) OR text description + material + volume + contact |
| Files | OPTIONAL — "no file = OK, describe in words" |
| Goal | Capture job type + material + contact |
| Min fields | 4 |

---

### 3. Describe & Request (`describe-and-request`)

**Services:** Custom Kitchen Projects, Facade Systems & ACP

| Field | Value |
|-------|-------|
| Client profile | Has an idea or early project — no drawings yet |
| Form | 3–5 fields: object type, material, approx. volume, description + role selection + contact |
| Files | OPTIONAL — "have drawings? attach — it helps" |
| Goal | Capture project type + client role + contact |
| Min fields | 3–5 |

---

## Key Rule — All Three Types

Forms are **NOT** a WhatsApp replacement — they are a parallel channel.

Goal is **lead identification**, not full specification. Specification is clarified by the manager after first contact.

---

## Supabase columns (services table)

| Column | Type | Values |
|--------|------|--------|
| `brand` | `VARCHAR(20)` | `'hwood'` \| `'skylum'` |
| `order_type` | `VARCHAR(30)` | `'browse-and-order'` \| `'send-file-and-process'` \| `'describe-and-request'` \| `'informational'` |

Both columns must be mapped in `dataService.ts` for the services query.
