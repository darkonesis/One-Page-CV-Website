# Apple Dark Elegance Design System
## CV Andrea Giaccari - Design Documentation

---

## 🎨 **FILOSOFIA DI DESIGN**

Il CV di Andrea Giaccari è stato progettato seguendo l'estetica **Apple Dark Elegance**, un sistema visivo che combina:

- **Minimalismo elegante** - Focus sul contenuto senza distrazioni
- **Optical balance Apple-level** - Ogni elemento è bilanciato visivamente
- **Leggibilità ottimale** - Contrasti calibrati per ridurre l'affaticamento visivo
- **Microinterazioni fluide** - Transizioni naturali e piacevoli
- **Responsive perfetto** - Esperienza coerente su ogni dispositivo

---

## 🎯 **COLOR SYSTEM**

### **Background**
```css
--background: #0A0A0A (Nero soft)
--background-gradient: linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)
```
**→** Gradiente verticale che aggiunge profondità senza essere invasivo  
**→** Completato da **Apple Blurry Background** (vedi `APPLE_BLURRY_BACKGROUND.md`) con 16 sfere animate per depth atmosferico

### **Card & Contenuti**
```css
--card: #1C1C1E (Grigio scuro Apple)
--card-secondary: #2C2C2E (Badge e elementi secondari)
```
**→** Colori originali Apple per coerenza con l'ecosistema

### **Typography Colors**
```css
--foreground: #F2F2F2 (Bianco soft - Titoli e testo importante)
--foreground-secondary: #B3B3B3 (Grigio medio - Paragrafi)
--foreground-tertiary: #A6A6A6 (Grigio chiaro - Footer e testo secondario)
```
**→** Scala di contrasto ottimizzata per leggibilità senza affaticamento

### **Accent & Interactive**
```css
--accent: #0A84FF (Apple Blue - CTA e link)
--destructive: #FF453A (Apple Red - Errori)
```
**→** Colori Apple nativi per familiarità

### **Borders & Dividers**
```css
--border: rgba(255, 255, 255, 0.1) (Bordo standard)
--border-subtle: rgba(255, 255, 255, 0.06) (Bordo card)
```
**→** Separazione ottica senza essere invasivi

---

## 📐 **SPACING SYSTEM**

### **Padding Card**
```css
Mobile: 24px (px-6 py-6)
Desktop: 32px (px-8 py-8)
```

### **Section Spacing**
```css
Mobile: py-20 (80px)
Desktop: py-28 lg:py-36 (112px - 144px)
```

### **Card Gaps**
```css
Mobile: gap-6 (24px)
Desktop: gap-8 (32px)
```

---

## 🔘 **BORDER RADIUS SYSTEM**

### **Gerarchia a 3 livelli**
```css
--radius-sm: 12px (Badge piccoli)
--radius-md: 16px (Elementi standard)
--radius-lg: 20px (Card medie)
--radius-xl: 24px (Card principali - rounded-3xl)
```

**→** Border radius generosi per estetica Apple morbida e friendly

---

## 💫 **SHADOW SYSTEM**

### **Apple-style soft shadows**
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3)   (Badge)
--shadow-md: 0 2px 8px 0 rgba(0, 0, 0, 0.4)   (Elementi interattivi)
--shadow-lg: 0 4px 16px 0 rgba(0, 0, 0, 0.5)  (Card principali)
--shadow-xl: 0 8px 32px 0 rgba(0, 0, 0, 0.6)  (Elementi floating)
```

**→** Shadow molto soft per separazione ottica dei livelli, mai invadenti

---

## ✍️ **TYPOGRAPHY SYSTEM**

### **Font Stack**
```css
-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', Roboto, sans-serif
```

### **Titoli (H1, H2, H3)**
```css
font-weight: 600
letter-spacing: 0.01em (+1% tracking per eleganza)
line-height: 1.3
color: #F2F2F2
```

### **Paragrafi e testo lungo**
```css
font-weight: 400
line-height: 1.7 (Leggibilità ottimale)
color: #B3B3B3
```

### **Strong (enfasi)**
```css
font-weight: 600
color: #F2F2F2
```

---

## 🎬 **TRANSITIONS & ANIMATIONS**

### **Apple Cubic Bezier**
```css
--transition-fast: 150ms cubic-bezier(0.25, 0.1, 0.25, 1)
--transition-base: 200ms cubic-bezier(0.25, 0.1, 0.25, 1)
--transition-slow: 250ms cubic-bezier(0.25, 0.1, 0.25, 1)
```

### **Microinterazioni**
```css
/* Hover scale su card e button */
hover:scale-[1.01] (Card)
hover:scale-[1.02] (Button)

/* Opacity su link */
a:hover { opacity: 0.8 }
```

**→** Transizioni fluide e naturali, mai brusche o troppo veloci

---

## 📱 **RESPONSIVE BREAKPOINTS**

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

### **Layout Behavior**
- **Mobile**: 1 colonna, padding ridotti (24px)
- **Tablet**: 2 colonne per Skills, padding aumentati
- **Desktop**: Layout ottimizzato, padding massimi (32px)

---

## 🎯 **OPTICAL ALIGNMENT PRINCIPLES**

### **1. Icon + Text Alignment**
```jsx
<Icon className="w-12 h-12" strokeWidth={2} />
```
**→** Icone con strokeWidth uniforme (2) per coerenza visiva

### **2. Card Hover States**
```css
transition-all duration-200 hover:scale-[1.01]
```
**→** Scale molto soft per feedback visivo senza essere invasivi

### **3. Badge Positioning**
```jsx
sm:order-2 // Badge a destra su desktop
sm:order-1 // Titolo a sinistra su desktop
```
**→** Layout che si inverte responsivamente per ottimizzare lo spazio

---

## 🔧 **COMPONENTI PRINCIPALI**

### **Hero Section**
- Nome grande (text-6xl → text-9xl)
- Badge contatti con icone (MapPin, Mail, Phone)
- Bio card con strong highlights
- Background: #1C1C1E con shadow-lg

### **Experience / Education Cards**
- Layout flex responsive (colonna → riga)
- Period badge in alto a destra
- Titolo + Company con gerarchia chiara
- Descrizione o bullet list
- Hover scale-[1.01]

### **Skills Grid**
- 1 colonna mobile → 2 colonne desktop
- Icone categoria + titolo
- Bullet list con optical spacing
- Uniform card heights

### **Contact Section**
- CTA card con messaggio
- Email button con Apple Blue (#0A84FF)
- Footer con copyright
- Shadow + hover effects

---

## ⚡ **PERFORMANCE OPTIMIZATIONS**

### **iOS Safari Fixes**
```css
min-height: -webkit-fill-available
padding-top: env(safe-area-inset-top)
padding-bottom: env(safe-area-inset-bottom)
```

### **Font Rendering**
```css
-webkit-font-smoothing: antialiased
-moz-osx-font-smoothing: grayscale
text-rendering: optimizeLegibility
```

### **GPU Acceleration**
```css
will-change: transform, opacity
transform: translateZ(0)
backface-visibility: hidden
```

---

## ♿ **ACCESSIBILITY**

### **Motion Reduction**
```css
@media (prefers-reduced-motion: reduce) {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

### **Contrasti**
- Tutti i testi rispettano WCAG AA
- Background #0A0A0A + Foreground #F2F2F2 = 18.2:1 ✅
- Background #1C1C1E + Text #B3B3B3 = 7.8:1 ✅

### **Touch Targets**
```css
Mobile: min-height 44px (Apple standard)
Desktop: min-height 48px
```

---

## 🎨 **DESIGN PRINCIPLES RECAP**

✅ **NO bianco puro (#FFFFFF)** → Uso #F2F2F2 per evitare affaticamento  
✅ **NO nero puro (#000000)** → Uso #0A0A0A per profondità morbida  
✅ **Spacing generosi** → Respiro visivo e leggibilità  
✅ **Border radius soft** → Estetica Apple friendly  
✅ **Shadow discrete** → Separazione ottica senza invasività  
✅ **Transizioni fluide** → Cubic-bezier Apple-standard  
✅ **Optical balance** → Ogni elemento bilanciato visivamente  

---

## 📊 **FILE STRUCTURE**

```
/App.tsx                    → Main container
/components/Hero.tsx        → Hero section con nome e bio
/components/Experience.tsx  → Esperienze lavorative
/components/Education.tsx   → Formazione
/components/Skills.tsx      → Competenze (grid 2 colonne)
/components/Contact.tsx     → CTA e contatti
/styles/globals.css         → Design system globale
```

---

## 🚀 **NEXT STEPS SUGGESTIONS**

- Aggiungere dark/light mode toggle
- Implementare animazioni on-scroll (fade-in)
- Aggiungere download CV PDF button
- Integrare LinkedIn/GitHub links con icone
- Implementare section anchor navigation
- Aggiungere portfolio projects gallery

---

**Designed with Apple Dark Elegance**  
© 2025 Andrea Giaccari