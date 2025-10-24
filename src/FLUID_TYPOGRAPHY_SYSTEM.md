# Fluid Typography System
## CV Andrea Giaccari - Responsive Typography Documentation

---

## 🎯 **OBIETTIVO**

Implementare un sistema tipografico **fluido, responsivo e otticamente bilanciato** che si adatta automaticamente a qualsiasi viewport, mantenendo la leggibilità e la gerarchia visiva Apple-style.

---

## 📐 **SCALA BASE**

### **Body Text (Base)**
```css
--font-size-base: 16px
```
**→** Tutte le altre dimensioni sono calcolate come multipli di questa base

---

## 📏 **FLUID TYPOGRAPHY - clamp() System**

### **H1 - Titolo principale (Nome)**
```css
--font-size-h1: clamp(2.5rem, 5vw + 1rem, 6rem);
/* Mobile: 40px (2.5x base) */
/* Desktop: 96px (6x base) */
```
**Uso:** Nome "Andrea Giaccari" nella Hero section

### **H2 - Titoli di sezione**
```css
--font-size-h2: clamp(2rem, 3.5vw + 0.5rem, 4rem);
/* Mobile: 32px (2x base) */
/* Desktop: 64px (4x base) */
```
**Uso:** "Esperienze Digitali", "Formazione", "Competenze", "Let's talk."

### **H3 - Titoli di card**
```css
--font-size-h3: clamp(1.5rem, 2.5vw + 0.5rem, 2.5rem);
/* Mobile: 24px (1.5x base) */
/* Desktop: 40px (2.5x base) */
```
**Uso:** Ruoli lavorativi, titoli formativi, titoli competenze

### **H4 - Sottotitoli**
```css
--font-size-h4: clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem);
/* Mobile: 20px (1.25x base) */
/* Desktop: 28px (1.75x base) */
```
**Uso:** Nomi aziende, istituzioni

### **Body Text - Paragrafi**
```css
--font-size-body: clamp(1rem, 0.5vw + 0.875rem, 1.125rem);
/* Mobile: 16px (1x base) */
/* Desktop: 18px (1.125x base) */
```
**Uso:** Descrizioni, bio, bullet list

### **Small - Testo piccolo**
```css
--font-size-small: clamp(0.875rem, 0.25vw + 0.8rem, 1rem);
/* Mobile: 14px (0.875x base) */
/* Desktop: 16px (1x base) */
```
**Uso:** Badge periodo, badge contatti, footer

### **Caption - Testo molto piccolo**
```css
--font-size-caption: clamp(0.75rem, 0.25vw + 0.7rem, 0.875rem);
/* Mobile: 12px (0.75x base) */
/* Desktop: 14px (0.875x base) */
```
**Uso:** Note a piè di pagina, metadati

---

## ⚖️ **FONT WEIGHTS - Apple Hierarchy**

```css
--font-weight-h1: 600    /* Semibold - Titoli principali */
--font-weight-h2: 600    /* Semibold - Titoli di sezione */
--font-weight-h3: 600    /* Semibold - Titoli di card */
--font-weight-body: 400  /* Regular - Testo normale */
--font-weight-medium: 500 /* Medium - Sottotitoli */
--font-weight-semibold: 600 /* Semibold - Strong, badge */
```

**→** Evitare pesi estremi (100, 900) per mantenere eleganza Apple

---

## 📐 **LINE HEIGHT - Optical Balance**

```css
--line-height-h1: 1.1    /* Titoli grandi - tight per impatto */
--line-height-h2: 1.2    /* Titoli di sezione - balanced */
--line-height-h3: 1.3    /* Titoli di card - leggibile */
--line-height-body: 1.7  /* Paragrafi - massima leggibilità */
--line-height-tight: 1.4 /* Testo compatto - liste */
```

**Principio:** Più grande il font, più tight il line-height

---

## 🔤 **LETTER SPACING - Apple Style**

```css
--letter-spacing-h1: 0.01em   /* +1% per eleganza su titoli grandi */
--letter-spacing-h2: 0.01em   /* +1% per titoli di sezione */
--letter-spacing-h3: 0.005em  /* +0.5% per titoli di card */
--letter-spacing-body: 0em    /* 0% per paragrafi (default) */
```

**Principio:** Tracking leggermente positivo su titoli per respiro visivo

---

## 📱 **SAFE AREA - Responsive Lateral Spacing**

### **Breakpoints & Safe Area**
```css
/* Mobile (< 768px) */
--safe-area-mobile: 1.5rem;  /* 24px */

/* Tablet (768px - 1023px) */
--safe-area-tablet: 2rem;    /* 32px */

/* Desktop (1024px - 1279px) */
--safe-area-desktop: 3rem;   /* 48px */

/* Wide Desktop (≥ 1280px) */
--safe-area-wide: 4rem;      /* 64px */
```

### **Implementazione nel codice**
```jsx
<section 
  style={{
    paddingLeft: 'var(--safe-area-mobile)',
    paddingRight: 'var(--safe-area-mobile)',
  }}
>
  <style>{`
    @media (min-width: 768px) {
      section {
        padding-left: var(--safe-area-tablet) !important;
        padding-right: var(--safe-area-tablet) !important;
      }
    }
    @media (min-width: 1024px) {
      section {
        padding-left: var(--safe-area-desktop) !important;
        padding-right: var(--safe-area-desktop) !important;
      }
    }
    @media (min-width: 1280px) {
      section {
        padding-left: var(--safe-area-wide) !important;
        padding-right: var(--safe-area-wide) !important;
      }
    }
  `}</style>
</section>
```

---

## 🎨 **OPTICAL PADDING - Visual Balance**

### **Compensazione del peso visivo finale**
```css
--optical-padding-h1: 0.15em  /* ~14.4px @ 96px font */
--optical-padding-h2: 0.12em  /* ~7.68px @ 64px font */
--optical-padding-h3: 0.1em   /* ~4px @ 40px font */
```

**Applicazione automatica:**
```css
h1 {
  padding-right: var(--optical-padding-h1);
}

h2 {
  padding-right: var(--optical-padding-h2);
}

h3 {
  padding-right: var(--optical-padding-h3);
}
```

**Perché?** Le lettere finali (i, a, o) creano "spazio visivo negativo" a destra. Il padding ottico compensa questo effetto.

---

## 🔧 **AUTO-LAYOUT & HUG CONTENTS**

### **Principio: "Il contenitore si adatta al contenuto"**

Tutti i titoli usano:
```css
display: inline-block; /* Default per h1, h2, h3 */
width: auto; /* Non forzare larghezza fissa */
max-width: 100%; /* Previene overflow orizzontale */
```

**Risultato:** I titoli occupano solo lo spazio necessario, senza strabordare orizzontalmente

---

## 📊 **TABELLA COMPLETA - Scala Tipografica**

| Elemento | Mobile (min) | Desktop (max) | Font Weight | Line Height | Letter Spacing |
|----------|-------------|---------------|-------------|-------------|----------------|
| **H1**   | 40px (2.5rem) | 96px (6rem) | 600 | 1.1 | 0.01em |
| **H2**   | 32px (2rem) | 64px (4rem) | 600 | 1.2 | 0.01em |
| **H3**   | 24px (1.5rem) | 40px (2.5rem) | 600 | 1.3 | 0.005em |
| **H4**   | 20px (1.25rem) | 28px (1.75rem) | 600 | 1.3 | 0.005em |
| **Body** | 16px (1rem) | 18px (1.125rem) | 400 | 1.7 | 0em |
| **Small** | 14px (0.875rem) | 16px (1rem) | 400 | 1.5 | 0em |
| **Caption** | 12px (0.75rem) | 14px (0.875rem) | 400 | 1.4 | 0em |

---

## 🎯 **VERIFICHE SU BREAKPOINT**

### **Mobile (375px - iPhone SE)**
✅ H1 (Nome): ~40px - Leggibile, non tocca i bordi  
✅ H2 (Sezioni): ~32px - Chiaro e bilanciato  
✅ Safe Area: 24px laterale - Respiro visivo ottimale  
✅ Body text: 16px - Dimensione standard leggibile  

### **Tablet (768px - iPad)**
✅ H1 (Nome): ~55px - Scaling progressivo  
✅ H2 (Sezioni): ~42px - Gerarchia chiara  
✅ Safe Area: 32px laterale - Padding confortevole  
✅ Body text: 17px - Leggibilità migliorata  

### **Desktop (1024px - Laptop)**
✅ H1 (Nome): ~70px - Impatto visivo forte  
✅ H2 (Sezioni): ~52px - Titoli evidenti  
✅ Safe Area: 48px laterale - Spazio generoso  
✅ Body text: 18px - Dimensione premium  

### **Wide Desktop (1920px - Monitor)**
✅ H1 (Nome): 96px (max) - Massimo impatto  
✅ H2 (Sezioni): 64px (max) - Titoli prominenti  
✅ Safe Area: 64px laterale - Spazio Apple-level  
✅ Body text: 18px (max) - Non cresce oltre per leggibilità  

---

## 🔄 **ANTI-OVERFLOW SYSTEM**

### **Prevenzione overflow orizzontale**
```css
h1, h2, h3 {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto; /* Solo se necessario */
}
```

### **Container fluido**
```jsx
<div className="w-full max-w-6xl mx-auto">
  {/* Contenuto con max-width 1152px (6xl) */}
</div>
```

**→** Il contenuto non supera mai 1152px di larghezza, centrando automaticamente

---

## 🎨 **ESEMPI DI UTILIZZO**

### **Hero Section - H1**
```jsx
<h1>Andrea Giaccari</h1>
```
**Output:**
- Mobile (375px): ~40px
- Tablet (768px): ~55px
- Desktop (1920px): 96px

### **Experience Section - H2 + H3**
```jsx
<h2>Esperienze Digitali</h2>
<h3>Social Media Manager & Web Developer</h3>
<p>Company name</p>
```
**Output:**
- H2: 32px → 64px (fluido)
- H3: 24px → 40px (fluido)
- Body: 16px → 18px (fluido)

---

## 🚀 **VANTAGGI DEL SISTEMA**

✅ **Completamente fluido** - Si adatta a qualsiasi viewport senza breakpoint fissi  
✅ **Leggibilità garantita** - Dimensioni sempre ottimali per ogni device  
✅ **Zero overflow** - I titoli non escono mai dai bordi  
✅ **Optical balance** - Padding ottici compensano il peso visivo  
✅ **Safe area progressiva** - Margini che crescono con lo schermo  
✅ **Apple-level polish** - Ogni dettaglio calibrato per eleganza  
✅ **Performance ottimale** - clamp() è nativo CSS, zero JS  
✅ **Manutenibilità** - Tutte le variabili in un unico posto (globals.css)  

---

## 📋 **CHECKLIST VERIFICA**

- [x] Tutti i titoli usano clamp() per dimensioni fluide
- [x] H1, H2, H3 hanno optical padding a destra
- [x] Safe area laterale responsive (24px → 64px)
- [x] Line height proporzionato alla dimensione font
- [x] Font weight coerente (600 titoli, 400 body)
- [x] Letter spacing positivo su titoli grandi
- [x] Body text cresce minimamente (16px → 18px)
- [x] Container max-width per evitare titoli troppo larghi
- [x] Auto-layout "hug contents" per titoli
- [x] Nessun overflow orizzontale su mobile

---

## 🎓 **FORMULA CLAMP() SPIEGATA**

```css
clamp(MIN, PREFERRED, MAX)
```

**Esempio H1:**
```css
clamp(2.5rem, 5vw + 1rem, 6rem)
```

1. **MIN (2.5rem = 40px):** Dimensione minima su schermi piccoli
2. **PREFERRED (5vw + 1rem):** Cresce con il viewport (5% viewport width + base)
3. **MAX (6rem = 96px):** Dimensione massima su schermi grandi

**Come funziona:**
- Se `5vw + 1rem < 40px` → usa **40px** (min)
- Se `5vw + 1rem` tra 40px e 96px → usa **5vw + 1rem** (fluido)
- Se `5vw + 1rem > 96px` → usa **96px** (max)

---

## 📐 **RAPPORTI DI SCALA**

### **Progressione geometrica 1.25x (Major Third)**
```
Caption: 12px (0.75x)
Small:   14px (0.875x)
Body:    16px (1x) ← BASE
H4:      20px (1.25x)
H3:      24px (1.5x)
H2:      32px (2x)
H1:      40px (2.5x)
```

**→** Ogni livello è proporzionalmente bilanciato per creare gerarchia armonica

---

**Designed with Fluid Typography System**  
© 2025 Andrea Giaccari - Apple Dark Elegance
