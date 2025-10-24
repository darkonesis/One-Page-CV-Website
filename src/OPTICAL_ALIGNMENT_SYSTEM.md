# 🎨 Optical Alignment System - Apple Design Principles

## Sistema di Border-Radius Implementato

### 🎯 **IMPORTANTE: CSS Global Radius Variable**

La base del sistema di optical alignment parte dalla variabile CSS globale:

```css
/* /styles/globals.css */
:root {
  --radius: 12px;  /* ✅ Base radius per tutto il sistema */
}
```

**Derivazioni automatiche:**
- `--radius-sm`: 8px (12px - 4px)
- `--radius-md`: 10px (12px - 2px)  
- `--radius-lg`: 12px (valore base)
- `--radius-xl`: 16px (12px + 4px)

Questi valori influenzano automaticamente tutti i componenti UI che usano le classi Tailwind `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`.

---

### 📐 Gerarchia dei Corner Radius

Il sistema segue i principi di **optical alignment** Apple con una gerarchia coerente e fluida:

```
LIVELLO 1 - Card Principali (Container grandi)
├─ rounded-3xl (24px)
├─ Hero Bio Card
├─ Experience Cards
├─ Education Cards
├─ Skills Cards
└─ Contact Card

LIVELLO 2 - Buttons & CTA (Elementi interattivi medi)
├─ rounded-2xl (16px)
└─ Email CTA Button (Contact)

LIVELLO 3 - Badges & Small Elements (Elementi piccoli)
├─ rounded-xl (12px)
├─ Date Badges (Experience, Education)
├─ Skill Tags (Skills)
└─ Contact Info Tags (Hero)
```

---

## 🔍 Principi di Optical Alignment Applicati

### 1. **Proporzione Gerarchica**
```
Container Grande (24px) → Elemento Nested (12px)
Ratio: 2:1 = Armonia visiva perfetta
```

### 2. **Transizione Fluida tra Livelli**
```
24px (Card) → 16px (CTA Button) → 12px (Badge)
Scala progressiva = Continuità percettiva
```

### 3. **Shadow Scaling Coerente**
```css
Card grandi:        shadow-[8px_8px_0px]  → hover: shadow-[10px_10px_0px]
CTA Button:         shadow-[6px_6px_0px]  → hover: shadow-[8px_8px_0px]
```
**Regola:** Shadow offset aumenta proporzionalmente con border-radius

### 4. **Elementi Nested - Border Adjustment**
```
Card:   border-4 + rounded-3xl
Badge:  border-2 + rounded-xl
```
**Regola:** Border più sottili per elementi piccoli = equilibrio ottico

---

## 📏 Mappatura Completa Elementi

### Hero Section
| Elemento | Border-Radius | Border | Shadow |
|----------|---------------|--------|--------|
| Bio Card | `rounded-3xl` (24px) | `border-4` | `8px_8px` |
| Contact Tags | `rounded-xl` (12px) | `border-2` | none |

### Experience Section
| Elemento | Border-Radius | Border | Shadow |
|----------|---------------|--------|--------|
| Card | `rounded-3xl` (24px) | `border-4` | `8px_8px → 10px_10px` hover |
| Date Badge | `rounded-xl` (12px) | `border-2` | none |

### Education Section
| Elemento | Border-Radius | Border | Shadow |
|----------|---------------|--------|--------|
| Card | `rounded-3xl` (24px) | `border-4` | `8px_8px → 10px_10px` hover |
| Year Badge | `rounded-xl` (12px) | `border-2` | none |

### Skills Section
| Elemento | Border-Radius | Border | Shadow |
|----------|---------------|--------|--------|
| Card | `rounded-3xl` (24px) | `border-4` | `8px_8px → 10px_10px` hover |
| Skill Tags | `rounded-xl` (12px) | `border-2` | none |

### Contact Section
| Elemento | Border-Radius | Border | Shadow |
|----------|---------------|--------|--------|
| Card | `rounded-3xl` (24px) | `border-4` | `8px_8px → 10px_10px` hover |
| Email Button | `rounded-2xl` (16px) | `border-4` | `6px_6px → 8px_8px` hover |

---

## ✨ Benefici dell'Optical Alignment

### 🎯 **Continuità Visiva**
- Transizioni fluide tra elementi adiacenti
- Zero discontinuità percettive
- Flusso visivo naturale e armonioso

### 📐 **Proporzione Matematica**
```
24px : 16px : 12px = 2 : 1.33 : 1
```
Scala proporzionale basata su multipli di 4px (sistema Tailwind)

### 🧠 **Percezione Psicologica**
- Elementi grandi = Corner radius maggiori (stabilità visiva)
- Elementi piccoli = Corner radius ridotti (dettaglio fine)
- CTA Button = Transizione armoniosa (call-to-action bilanciato)

### 🍎 **Apple Human Interface Guidelines**
✅ Continuous curvature (curvature continue)  
✅ Optical centering (allineamento ottico, non geometrico)  
✅ Proportional scaling (scaling proporzionale)  
✅ Visual hierarchy (gerarchia visiva chiara)  

---

## 🔧 Implementazione Tecnica

### Esempio: Card con Badge Nested

```tsx
{/* Card principale - rounded-3xl */}
<div className="rounded-3xl border-4 shadow-[8px_8px_0px] p-10">
  
  {/* Badge nested - rounded-xl (proporzionale al container) */}
  <span className="rounded-xl border-2 px-6 py-3">
    2024
  </span>
  
</div>
```

**Optical Alignment Logic:**
1. Container grande (24px radius) richiede padding generoso (p-10 = 40px)
2. Badge nested (12px radius = 50% del container) mantiene proporzione visiva
3. Border ridotto (border-2 vs border-4) bilancia peso visivo
4. Padding badge (px-6 py-3) proporzionale al suo radius

---

## 🎨 Coerenza con Performance Brutalism

Il sistema di optical alignment si integra perfettamente con l'estetica Performance Brutalism:

✅ **Bordi spessi bianchi** → Visibilità massima + estetica neobrutalista  
✅ **Shadow nette** → Profondità senza sfumature (hard shadow)  
✅ **Corner arrotondati** → Morbidezza Apple + brutalismo pulito  
✅ **Contrasto B/N** → Nero background + elementi bianchi solidi  

**Risultato:** Design brutalist con fluidità Apple = "Performance Brutalism with Apple Polish"

---

## 📊 Metriche di Successo

### Prima (angoli inconsistenti):
- Discontinuità visive tra elementi
- Transizioni rigide e spezzate
- Percezione frammentata del layout

### Dopo (optical alignment):
✅ **Flusso visivo continuo** (100% armonia percettiva)  
✅ **Gerarchia chiara** (3 livelli proporzionali)  
✅ **Coerenza totale** (tutti gli elementi bilanciati)  
✅ **Apple-grade polish** (percezione premium)  

---

## 🚀 Best Practices

### ✅ DO:
- Usa multipli di 4px per border-radius (Tailwind scale)
- Riduci radius proporzionalmente per nested elements
- Scala shadow offset in base al radius
- Mantieni ratio 2:1 tra livelli gerarchici

### ❌ DON'T:
- Non mescolare rounded-lg e rounded-3xl nello stesso container
- Non usare shadow più grandi del radius (incoerenza ottica)
- Non applicare stesso radius a elementi di dimensioni molto diverse
- Non ignorare il border weight quando cambi radius

---

## 🎯 Conclusione

Il sistema implementato garantisce:

**Optical Alignment = Percezione > Geometria**

Ogni elemento è posizionato e curvato per ottimizzare la **percezione visiva umana**, non solo la matematica geometrica. Questo crea un'esperienza fluida, armoniosa e premium, degna degli standard Apple.

---

**Designed with Performance Brutalism + Apple Human Interface Guidelines**  
**© 2025 Andrea Giaccari CV - Optical Alignment System v1.0**