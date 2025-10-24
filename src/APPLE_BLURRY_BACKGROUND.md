# Apple Blurry Background System
## CV Andrea Giaccari - Atmospheric Depth Layer Documentation

---

## 🎯 **OBIETTIVO**

Creare un background atmosferico con **sfere blurry colorate VIVIDE e DEFINITE** con distribuzione ottimizzata. Desktop 24 sfere, mobile 22 sfere (aumentate da 14!) con opacity alta (65-90%) e blur ridotto (5-30px) per colori brillanti e definizione cristallina.

**ANIMAZIONE CONTINUA AMPIA:** Le sfere hanno movimento organico X (±35px orizzontale) + pulsazione scale (±8%) + rotazione (±3°) infinito 17-40s SEMPRE attivo e FLUIDO.

**SCROLL PARALLAX SINCRONIZZATO:** Il movimento VERTICALE (Y) è 100% controllato dallo scroll. Quando scrolli 100px, large si muovono 5-10px, tiny 52-62px. Il movimento è **IMMEDIATO e FLUIDO** - scrolli veloce = si muovono veloce, scrolli lento = si muovono lento, ti fermi = rimangono stabili. NO animate.y per evitare conflitti/salti.

---

## 🌫️ **CONCETTO DESIGN**

### **Apple Philosophy**
- **Sfere vivide SENZA sovrapposizioni** - 24 desktop, 22 mobile con blur radius calcolato
- **Opacity alta** - 65-90% per colori brillanti e definiti
- **Blur ridotto** - 5-30px per definizione cristallina
- **Movimento organico** - Animazioni lente e naturali (17-40s)
- **Profondità stratificata** - 4 layer (large, medium, small, tiny)
- **Colori spettro brillanti** - 12 tonalità distribuite con formula (size/2 + blur)
- **Zero overlap** - Effective radius considerato per ogni posizione

### **Perché Sfere Blurry Colorate?**
✅ Creano **profondità cromatica** con layer stratificati  
✅ **Richiamano macOS Big Sur/Monterey** - Wallpaper dinamici iconici  
✅ Aggiungono **energia visiva** senza compromettere leggibilità  
✅ **Movimento fluido** + **gradient colorati** = depth perception naturale  
✅ Richiamano il design **glassmorphism** di macOS/iOS con twist vibrante

---

## 📐 **ARCHITETTURA DEL SISTEMA**

### **4 LAYER DI PROFONDITÀ**

```
┌─────────────────────────────────────┐
│  LARGE (500-600px)  - Background    │ ← Profondità sottile
│  MEDIUM (280-350px) - Middle        │ ← Layer principale
│  SMALL (130-180px) - Mid-front      │ ← Dettaglio visibile
│  TINY (70-90px) - Accent            │ ← Sparkle vivace
└─────────────────────────────────────┘
```

### **DISTRIBUZIONE SFERE**

**DESKTOP (24 sfere) - Anti-Overlap con Blur Radius**

| ID | Size | X | Y | Blur | Eff.Radius | Opacity | Duration | Color | Layer |
|----|------|---|---|------|-----------|---------|----------|-------|-------|
| large-1 | 650px | 10% | 15% | 45px | 370px | 0.45 | 35s | #FF6B6B Rosso | Large |
| large-2 | 620px | 88% | 78% | 42px | 352px | 0.42 | 40s | #4ECDC4 Turchese | Large |
| large-3 | 600px | 12% | 85% | 40px | 340px | 0.40 | 38s | #A78BFA Viola | Large |
| medium-1 | 380px | 75% | 18% | 32px | 222px | 0.50 | 28s | #FFA07A Arancione | Medium |
| medium-2 | 360px | 30% | 42% | 30px | 210px | 0.48 | 30s | #98D8C8 Verde acqua | Medium |
| medium-3 | 370px | 85% | 45% | 31px | 216px | 0.49 | 32s | #6C63FF Indaco | Medium |
| medium-4 | 350px | 48% | 78% | 28px | 203px | 0.47 | 29s | #FFD93D Giallo | Medium |
| small-1 | 200px | 58% | 12% | 18px | 118px | 0.54 | 22s | #6BCF7F Verde lime | Small |
| small-2 | 190px | 18% | 55% | 16px | 111px | 0.52 | 24s | #00D9FF Ciano | Small |
| small-3 | 195px | 68% | 88% | 17px | 115px | 0.53 | 23s | #FF6B9D Rosa fucsia | Small |
| tiny-1 | 110px | 40% | 30% | 10px | 65px | 0.58 | 18s | #C780FA Viola | Tiny |
| tiny-2 | 105px | 72% | 58% | 9px | 62px | 0.56 | 19s | #FFB6D9 Rosa magenta | Tiny |

**Formula Effective Radius:** `(size / 2) + blur`  
**→ Posizioni calcolate per evitare sovrapposizioni considerando blur radius!**

---

### **MOBILE (22 sfere) - <768px - ZERO Overlap**

| ID | Size | X | Y | Blur | Eff.Radius | Opacity | Duration | Color | Layer |
|----|------|---|---|------|-----------|---------|----------|-------|-------|
| large-m1 | 350px | 15% | 8% | 30px | 205px | 0.45 | 35s | #FF6B6B Rosso | Large |
| large-m2 | 340px | 82% | 92% | 28px | 198px | 0.42 | 40s | #4ECDC4 Turchese | Large |
| medium-m1 | 260px | 78% | 25% | 22px | 152px | 0.50 | 28s | #FFA07A Arancione | Medium |
| medium-m2 | 250px | 22% | 75% | 20px | 145px | 0.48 | 30s | #98D8C8 Verde acqua | Medium |
| small-m1 | 140px | 50% | 50% | 12px | 82px | 0.54 | 22s | #FFD93D Giallo | Small |
| tiny-m1 | 95px | 62% | 15% | 8px | 56px | 0.58 | 19s | #C780FA Viola | Tiny |

**Distribuzione mobile ottimizzata anti-overlap:**
```
     8%   12% 18%  25% 28%  35% 38%  42%48%  52%55% 58%  65% 68%  72% 75%  82% 85%  90%
   ┌──────────────────────────────────────────────────────────────────────────────────┐
 8%│  L1 🔴                                                                           │
   │                                                                                  │
15%│                        L3 🟣                                                     │
   │                                                                                  │
18%│                                        M6 🟢                                     │
   │                                                                                  │
22%│                                 T2 🟡                             M8 🌸          │
   │                                                                                  │
28%│             M1 🟠                                                                │
   │                                                                                  │
35%│                      S3 🌺                                                       │
   │                                                                                  │
38%│                                                                     M4 🟡        │
   │                                                                                  │
42%│      S1 🌿                                                                       │
   │                                                                                  │
48%│                                          T3 🔵                                   │
   │                                                                                  │
52%│                                      M3 🔷                                       │
   │                   M7 🔵                                                          │
55%│                                                S2 🔷                             │
   │                                                                                  │
62%│           T1 🟣                                                                  │
   │                                                                                  │
65%│                                                      M2 🌊                       │
   │                                                                                  │
68%│                                                                                  │
   │                                                              S6 🟢               │
72%│                                                                       T4 🟡      │
   │                                                                                  │
75%│                          M5 🍑                                                   │
   │                                                                                  │
78%│                                                                          S4 🟣   │
   │                                                                                  │
80%│                                                                                  │
   │                                                                                  │
85%│                                 S5 🌟                                            │
   │                                                                                  │
88%│                                     L4 🌸                                        │
   │                                                                                  │
92%│                                                                             L2 🔵│
   └──────────────────────────────────────────────────────────────────────────────────┘
```

**→ Distribuzione SINISTRA-CENTRO DOMINANTE (8-65% = 68% delle sfere)!**

---

## 🎨 **PALETTE COLORI**

### **Filosofia: Spettro Rainbow Apple-Style**
```css
/* LARGE LAYER - Colori primari soft */
#FF6B6B  /* Rosso coral - Warm depth */
#4ECDC4  /* Turchese - Cool depth */
#A78BFA  /* Viola soft - Purple depth */

/* MEDIUM LAYER - Spettro completo */
#FFA07A  /* Arancione salmone - Warm middle */
#98D8C8  /* Verde acqua - Fresh middle */
#6C63FF  /* Indaco vibrante - Electric middle */
#FFB6D9  /* Rosa magenta - Playful middle */

/* SMALL LAYER - Accenti vivaci */
#FFD93D  /* Giallo brillante - Sunshine */
#6BCF7F  /* Verde lime - Fresh */
#00D9FF  /* Ciano elettrico - Electric */
#FF6B9D  /* Rosa fucsia - Vibrant */
#C780FA  /* Viola elettrico - Purple accent */

/* TINY LAYER - Highlights spectrum */
#FF9A76  /* Arancione pesca - Warm sparkle */
#7DEFA1  /* Verde menta - Fresh sparkle */
#5DADEC  /* Azzurro cielo - Sky sparkle */
#FAA2C1  /* Rosa chiaro - Soft sparkle */
```

**→** Palette spettro arcobaleno con 16 tonalità diverse che coprono tutto lo spettro visibile, ispirata ai wallpaper dinamici di macOS Big Sur/Monterey

---

## 🌀 **SISTEMA DI ANIMAZIONE**

### **Motion Pattern**
```javascript
animate={{
  x: [0, 35, -25, 30, -15, 0],       // Movimento orizzontale AMPIO (±35px)
  scale: [1, 1.08, 0.94, 1.05, 0.97, 1], // Pulsazione evidente (±8%)
  rotate: [0, 3, -2, 2.5, -1.5, 0],  // Rotazione evidente (±3°)
}}
```

**→ Movimento AMPIO dal centro + pulsazione visibile + rotazione fluida!**

### **Timing & Easing**
```javascript
transition={{
  duration: 17-40s,              // Dipende dalla dimensione
  repeat: Infinity,              // Loop continuo
  ease: [0.25, 0.1, 0.25, 1],   // Apple cubic-bezier
  repeatType: 'loop'             // Smooth restart
}}
```

**Principio:** Sfere grandi = movimenti lenti | Sfere piccole = movimenti più veloci

---

## 📜 **SCROLL PARALLAX SYSTEM**

### **Parallax SINCRONIZZATO con Scroll**

Le sfere si muovono **DIRETTAMENTE proporzionalmente** allo scroll. Non c'è limite - se scrolli 1000px, le sfere continuano a muoversi. Il movimento è **IMMEDIATO** e segue esattamente la velocità di scroll.

```javascript
// Parallax Speed per Layer (moltiplicatore diretto)
Large:   0.05 - 0.10  // Quando scrolli 100px, si muovono 5-10px
Medium:  0.18 - 0.25  // Quando scrolli 100px, si muovono 18-25px
Small:   0.32 - 0.40  // Quando scrolli 100px, si muovono 32-40px
Tiny:    0.52 - 0.62  // Quando scrolli 100px, si muovono 52-62px
```

### **Formula Parallax ILLIMITATA**

```javascript
const parallaxY = useTransform(
  scrollY,
  (latest) => -latest * sphere.parallaxSpeed
);

// NO RANGE! Direttamente proporzionale
// scrollY = 0px → parallaxY = 0px
// scrollY = 100px → parallaxY = -5px (large) a -62px (tiny)
// scrollY = 1000px → parallaxY = -50px (large) a -620px (tiny)
// scrollY = 5000px → parallaxY = -250px (large) a -3100px (tiny)
```

**Effetto:** Scrolli veloce → le sfere si muovono veloce. Scrolli lento → si muovono lento. **COMPLETAMENTE SINCRONIZZATO!**

### **Separazione Assi di Movimento**

```
PARALLAX Y (vertical scroll): Controllato da scrollY (sincronizzato) - SOLO movimento posizionale
ANIMATE X (horizontal):        Loop infinito ±35px (6 keyframes)
ANIMATE SCALE:                 Pulsazione ±8% (6 keyframes) - SOLO organica, non legata allo scroll
ANIMATE ROTATE:                Rotazione ±3° (6 keyframes)
```

**→ NO animate.y! Solo parallaxY controlla movimento verticale = ZERO conflitti/salti quando smetti di scrollare!**
**→ NO parallax scale! Le sfere mantengono dimensione costante e cambiano SOLO posizione Y con lo scroll!**

---

## 🔍 **BLUR & OPACITY SYSTEM**

### **Relazione Size → Blur → Opacity**

```
┌──────────────────────────────────────────────────┐
│ Size    Blur    Opacity   Layer      Percezione  │
├──────────────────────────────────────────────────┤
│ 600px → 120px → 0.03   → Large   → Sottilissima  │
│ 550px → 110px → 0.025  → Large   → Quasi invisib.│
│ 500px → 100px → 0.02   → Large   → Background    │
│ 350px → 80px  → 0.04   → Medium  → Visibile soft │
│ 320px → 75px  → 0.035  → Medium  → Texture       │
│ 300px → 70px  → 0.03   → Medium  → Depth         │
│ 280px → 65px  → 0.038  → Medium  → Presenza      │
│ 180px → 50px  → 0.05   → Small   → Evidente      │
│ 160px → 45px  → 0.045  → Small   → Dettaglio     │
│ 150px → 42px  → 0.048  → Small   → Definita      │
│ 140px → 40px  → 0.042  → Small   → Clear         │
│ 130px → 38px  → 0.046  → Small   → Netta         │
│  90px → 30px  → 0.06   → Tiny    → Accent        │
│  80px → 28px  → 0.055  → Tiny    → Sparkle       │
│  75px → 26px  → 0.058  → Tiny    → Highlight     │
│  70px → 25px  → 0.052  → Tiny    → Focal point   │
└──────────────────────────────────────────────────┘
```

**Formula approssimativa:**
```
Blur = Size × 0.2 (20%)
Opacity = 0.02 (large) → 0.06 (tiny)
```

---

## 📍 **POSIZIONAMENTO STRATEGICO**

### **Distribuzione Viewport (x%, y%)**

**Principio: Evitare clustering centrale**

```
     0%      25%     50%     75%     100%
   ┌───────────────────────────────────┐
0% │         S3      T3               │
   │  L1                     M2        │
25%│         T1              L2        │
   │                                   │
50%│         T2      L3                │
   │  M1                               │
75%│         T1              S2        │
   │                                   │
90%│  T4             S4                │
   └───────────────────────────────────┘
```

**→** Le sfere sono distribuite per coprire tutto il viewport senza sovrapposizioni pesanti

---

## 🎭 **GRADIENT OVERLAY SYSTEM**

### **Doppio Gradient per Vignetting**

```css
background: 
  /* Top vignette - Sfuma in alto */
  radial-gradient(
    ellipse at top, 
    transparent 0%, 
    rgba(10, 10, 10, 0.3) 50%, 
    rgba(10, 10, 10, 0.6) 100%
  ),
  /* Bottom vignette - Sfuma in basso */
  radial-gradient(
    ellipse at bottom, 
    transparent 0%, 
    rgba(10, 10, 10, 0.4) 70%
  );
```

**Perché?**
- ✅ **Focus centrale** - Guida l'occhio verso il contenuto
- ✅ **Depth perception** - Le sfere "svaniscono" ai bordi
- ✅ **Integration** - Sfuma il background nel gradiente principale

### **Subtle Radial Background**

```css
background: radial-gradient(
  ellipse at 50% 50%, 
  rgba(255, 255, 255, 0.008) 0%, 
  transparent 50%
);
```

**→** Aggiunge un glow centrale impercettibile (0.8% opacity)

---

## ⚡ **PERFORMANCE OPTIMIZATIONS**

### **GPU Acceleration**
```javascript
style={{
  willChange: 'transform',          // Hint al browser
  backfaceVisibility: 'hidden',     // Anti-aliasing GPU
  perspective: 1000                  // 3D context
}}
```

### **Reduced Motion Support**
```javascript
const shouldReduceMotion = useReducedMotion();

animate={shouldReduceMotion ? {} : {
  // animazioni
}}
```

**→** Rispetta le preferenze di accessibilità dell'utente

### **Absolute Positioning con Full Document Height**
```css
position: absolute;
inset: 0;
z-index: 0;
pointer-events: none;
min-height: 100vh;
```

**Vantaggi:**
- ✅ Non influenza il layout del contenuto
- ✅ Segue il flow del documento (le sfere rimangono distribuite lungo tutta la pagina)
- ✅ Z-index 0 garantisce che sia dietro tutto
- ✅ **RISOLVE il problema mobile** - Le sfere non "spariscono" perché il background copre tutta l'altezza del documento
- ✅ Parallax funziona perfettamente - scrollY traccia sempre la posizione corretta

---

## 📊 **TABELLA COMPLETA SFERE**

### **DESKTOP (24 sfere) - Anti-Overlap con Blur Radius**

| ID | Size | X | Y | Blur | Eff.Radius | Opacity | Duration | Color | Layer |
|----|------|---|---|------|-----------|---------|----------|-------|-------|
| large-1 | 650px | 10% | 15% | 45px | 370px | 0.45 | 35s | #FF6B6B Rosso | Large |
| large-2 | 620px | 88% | 78% | 42px | 352px | 0.42 | 40s | #4ECDC4 Turchese | Large |
| large-3 | 600px | 12% | 85% | 40px | 340px | 0.40 | 38s | #A78BFA Viola | Large |
| medium-1 | 380px | 75% | 18% | 32px | 222px | 0.50 | 28s | #FFA07A Arancione | Medium |
| medium-2 | 360px | 30% | 42% | 30px | 210px | 0.48 | 30s | #98D8C8 Verde acqua | Medium |
| medium-3 | 370px | 85% | 45% | 31px | 216px | 0.49 | 32s | #6C63FF Indaco | Medium |
| medium-4 | 350px | 48% | 78% | 28px | 203px | 0.47 | 29s | #FFD93D Giallo | Medium |
| small-1 | 200px | 58% | 12% | 18px | 118px | 0.54 | 22s | #6BCF7F Verde lime | Small |
| small-2 | 190px | 18% | 55% | 16px | 111px | 0.52 | 24s | #00D9FF Ciano | Small |
| small-3 | 195px | 68% | 88% | 17px | 115px | 0.53 | 23s | #FF6B9D Rosa fucsia | Small |
| tiny-1 | 110px | 40% | 30% | 10px | 65px | 0.58 | 18s | #C780FA Viola | Tiny |
| tiny-2 | 105px | 72% | 58% | 9px | 62px | 0.56 | 19s | #FFB6D9 Rosa magenta | Tiny |

**Formula Effective Radius:** `(size / 2) + blur`  
**→ Posizioni calcolate per evitare sovrapposizioni considerando blur radius!**

---

### **MOBILE (22 sfere) - <768px - ZERO Overlap**

| ID | Size | X | Y | Blur | Eff.Radius | Opacity | Duration | Color | Layer |
|----|------|---|---|------|-----------|---------|----------|-------|-------|
| large-m1 | 350px | 15% | 8% | 30px | 205px | 0.45 | 35s | #FF6B6B Rosso | Large |
| large-m2 | 340px | 82% | 92% | 28px | 198px | 0.42 | 40s | #4ECDC4 Turchese | Large |
| medium-m1 | 260px | 78% | 25% | 22px | 152px | 0.50 | 28s | #FFA07A Arancione | Medium |
| medium-m2 | 250px | 22% | 75% | 20px | 145px | 0.48 | 30s | #98D8C8 Verde acqua | Medium |
| small-m1 | 140px | 50% | 50% | 12px | 82px | 0.54 | 22s | #FFD93D Giallo | Small |
| tiny-m1 | 95px | 62% | 15% | 8px | 56px | 0.58 | 19s | #C780FA Viola | Tiny |

**Distribuzione mobile ottimizzata anti-overlap:**
```
     8%   12% 18%  25% 28%  35% 38%  42%48%  52%55% 58%  65% 68%  72% 75%  82% 85%  90%
   ┌──────────────────────────────────────────────────────────────────────────────────┐
 8%│  L1 🔴                                                                           │
   │                                                                                  │
15%│                        L3 🟣                                                     │
   │                                                                                  │
18%│                                        M6 🟢                                     │
   │                                                                                  │
22%│                                 T2 🟡                             M8 🌸          │
   │                                                                                  │
28%│             M1 🟠                                                                │
   │                                                                                  │
35%│                      S3 🌺                                                       │
   │                                                                                  │
38%│                                                                     M4 🟡        │
   │                                                                                  │
42%│      S1 🌿                                                                       │
   │                                                                                  │
48%│                                          T3 🔵                                   │
   │                                                                                  │
52%│                                      M3 🔷                                       │
   │                   M7 🔵                                                          │
55%│                                                S2 🔷                             │
   │                                                                                  │
62%│           T1 🟣                                                                  │
   │                                                                                  │
65%│                                                      M2 🌊                       │
   │                                                                                  │
68%│                                                                                  │
   │                                                              S6 🟢               │
72%│                                                                       T4 🟡      │
   │                                                                                  │
75%│                          M5 🍑                                                   │
   │                                                                                  │
78%│                                                                          S4 🟣   │
   │                                                                                  │
80%│                                                                                  │
   │                                                                                  │
85%│                                 S5 🌟                                            │
   │                                                                                  │
88%│                                     L4 🌸                                        │
   │                                                                                  │
92%│                                                                             L2 🔵│
   └──────────────────────────────────────────────────────────────────────────────────┘
```

**→ Distribuzione SINISTRA-CENTRO DOMINANTE (8-65% = 68% delle sfere)!**

---

## 🎯 **UTILIZZO NEL PROGETTO**

### **Integrazione in App.tsx**

```jsx
import { AppleBlurryBackground } from './components/AppleBlurryBackground';

export default function App() {
  return (
    <div className="relative min-h-screen">
      {/* Background fisso dietro tutto */}
      <AppleBlurryBackground />
      
      {/* Contenuto principale */}
      <main className="relative" style={{ zIndex: 1 }}>
        {/* Sezioni CV */}
      </main>
    </div>
  );
}
```

### **Z-Index Hierarchy**

```
┌────────────────────────────────┐
│ Contact, Skills, etc (z: 1)   │ ← Contenuto
├────────────────────────────────┤
│ AppleBlurryBackground (z: 0)   │ ← Background layer
├────────────────────────────────┤
│ body gradient (CSS)            │ ← Base layer
└───────────────────────────────┘
```

---

## 🔧 **CUSTOMIZZAZIONE**

### **Aumentare/Diminuire Visibilità**

**Più visibile:**
```javascript
opacity: 0.08 (invece di 0.03)
blur: 80px (invece di 120px)
```

**Più sottile:**
```javascript
opacity: 0.015 (invece di 0.03)
blur: 150px (invece di 120px)
```

### **Accelerare/Rallentare Animazioni**

**Più veloci:**
```javascript
duration: sphere.duration * 0.5  // 2x velocità
```

**Più lente:**
```javascript
duration: sphere.duration * 1.5  // 1.5x lentezza
```

### **Aggiungere Colore (subtle accent)**

```javascript
color: '#0A84FF' // Accent blu Apple
opacity: 0.01    // Ridurre per subtlety
```

---

## ✅ **CHECKLIST DESIGN**

- [x] Desktop: 24 sfere | Mobile: 22 sfere (AUMENTATE da 14!) - Distribuzione densa
- [x] Blur da 5px (tiny) a 30px (large) - **RIDOTTO -35%** per definizione cristallina
- [x] Opacity da 65% (large) a 90% (tiny) - **AUMENTATA +25%** per colori vividi
- [x] Distribuzione densa mobile - Copre tutto lo schermo senza zone nere
- [x] Animazioni 17-40s con Apple cubic-bezier
- [x] Movimento organico 6-keyframe loop (X/Scale/Rotate)
- [x] Palette spettro 16 colori vividi e bilanciati
- [x] Vignetting ridotto (20%) per massimo colore
- [x] GPU acceleration con willChange
- [x] Reduced motion support (a11y)
- [x] **Absolute positioning** (z-index 0, min-height 100vh) - Segue document flow
- [x] Pointer-events none (no interazione)
- [x] Aria-hidden true (accessibilità)
- [x] Responsive detection (window resize listener)
- [x] **Scroll parallax SINCRONIZZATO** - Movimento diretto proporzionale (illimitato)
- [x] **Parallax speed stratificata** - 0.05-0.62x scroll (12x differenza tiny vs large)
- [x] **Dimensione costante** - Le sfere mantengono size fissa, cambia SOLO posizione Y
- [x] **Animazione organica continua** - X/Scale/Rotate indipendenti dallo scroll

---

## 🚀 **VANTAGGI DEL SISTEMA**

✅ **Profondità cromatica** - 4 layer stratificati con 16 colori spettro  
✅ **Movimento organico** - Animazioni lente e naturali (17-40s)  
✅ **Eleganza Apple** - Opacity calibrata (6-14%) mantiene leggibilità  
✅ **Performance GPU** - willChange + backfaceVisibility ottimizzati  
✅ **Accessibilità** - Rispetta prefers-reduced-motion  
✅ **Zero impatto layout** - Fixed + pointer-events: none  
✅ **Responsive** - Si adatta a qualsiasi viewport senza modifiche  
✅ **Scalabile** - Facile aggiungere/rimuovere sfere  
✅ **Vibrante** - Richiama macOS Big Sur/Monterey wallpaper dinamici

---

## 🎨 **ISPIRAZIONE DESIGN**

Questo background system è ispirato a:
- **macOS Big Sur/Ventura** - Wallpaper dinamici con sfere colorate
- **Apple.com Hero Sections** - Backgrounds atmosferici subtili
- **iOS Glassmorphism** - Blur effects e trasparenze
- **Apple Vision Pro UI** - Depth layers e spatial design

---

**Designed with Apple Blurry Background System**  
© 2025 Andrea Giaccari - Atmospheric Depth Layer