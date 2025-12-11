# 📐 Dimensões Recomendadas para Imagens de Produtos

## 📊 Resumo das Dimensões

### ✅ **Recomendação Principal**
**Tamanho ideal: 1200x1500 pixels (proporção 4:5)**
- **Largura:** 1200px
- **Altura:** 1500px
- **Proporção:** 4:5 (vertical, retrato)
- **Formato:** JPG, PNG ou WebP
- **Tamanho do arquivo:** Máximo 500KB (otimizado)

---

## 🎯 Onde as Imagens são Usadas

### 1. **ProductCard (Loja - Cards de Produtos)**
- **Proporção:** `aspect-[4/5]` (4:5 - vertical)
- **Exibição:** Cards na home, catálogo, favoritos
- **Recomendação:** 800x1000px a 1200x1500px

### 2. **ProductDetail (Página de Detalhes)**
- **Proporção:** `aspect-square` (1:1 - quadrada)
- **Exibição:** Imagem principal grande + miniaturas
- **Recomendação:** 1200x1200px (quadrada)

### 3. **ProductsManager (Admin)**
- **Proporção:** `aspect-square` (1:1 - quadrada)
- **Exibição:** Grid de produtos no painel admin
- **Preview no modal:** Pequeno (96px altura)
- **Recomendação:** 600x600px a 800x800px (quadrada)

---

## 💡 Solução Universal

### **Opção 1: Imagem Quadrada (Mais Versátil) ⭐ RECOMENDADO**
- **Dimensões:** 1200x1200 pixels
- **Proporção:** 1:1 (quadrada)
- **Vantagem:** Funciona bem em todos os contextos
- **Desvantagem:** Pode ter recorte nas laterais no card da loja

### **Opção 2: Imagem Vertical (Melhor para Cards)**
- **Dimensões:** 1200x1500 pixels
- **Proporção:** 4:5 (vertical)
- **Vantagem:** Preenche melhor os cards da loja
- **Desvantagem:** Pode ter espaço em branco na página de detalhes

### **Opção 3: Imagem Horizontal**
- **Dimensões:** 1500x1200 pixels
- **Proporção:** 5:4 (horizontal)
- **Não recomendado** para este layout

---

## 🎨 Especificações Técnicas

### **Formato de Arquivo:**
- **WebP** (melhor compressão, recomendado)
- **JPG** (boa compressão, compatível)
- **PNG** (qualidade, mas arquivo maior - use só se precisar transparência)

### **Tamanho do Arquivo:**
- **Máximo:** 500KB por imagem
- **Ideal:** 200-300KB
- **Tool de otimização:** TinyPNG, Squoosh, ImageOptim

### **Qualidade:**
- **Resolução:** 1200px (largura ou altura maior)
- **DPI:** 72 DPI (suficiente para web)
- **Cor:** RGB (não CMYK)

---

## 📱 Responsividade

As imagens são redimensionadas automaticamente pelo CSS:
- **Desktop:** Até 1200px
- **Tablet:** Até 768px
- **Mobile:** Até 480px

**Dica:** Use imagens de alta resolução e deixe o navegador redimensionar.

---

## ✨ Boas Práticas

1. **Múltiplas Imagens:** 
   - Primeira imagem: Principal (mostrada nos cards)
   - Segunda imagem: Vista alternativa (aparece no hover)
   - Demais: Galeria na página de detalhes

2. **Fundo:**
   - Fundo branco ou transparente (PNG)
   - Evite fundos coloridos que possam conflitar

3. **Produto Centralizado:**
   - Produto no centro da imagem
   - Espaço ao redor para recorte automático

4. **Consistência:**
   - Mantenha proporção consistente entre produtos
   - Use mesmo estilo/estúdio para fotos similares

---

## 🛠️ Ferramentas Recomendadas

- **Otimização:** [TinyPNG](https://tinypng.com/)
- **Redimensionamento:** [Canva](https://www.canva.com/), Photoshop, GIMP
- **Conversão para WebP:** [Squoosh](https://squoosh.app/)

---

## 📋 Checklist

- [ ] Imagem quadrada: 1200x1200px OU vertical: 1200x1500px
- [ ] Tamanho do arquivo < 500KB
- [ ] Formato WebP ou JPG
- [ ] Fundo branco ou transparente
- [ ] Produto centralizado
- [ ] Imagem otimizada para web
- [ ] Boa qualidade visual

---

**Resumo Final:** Use imagens de **1200x1200px (quadrada)** ou **1200x1500px (vertical 4:5)** com no máximo **500KB**, formatos **WebP** ou **JPG**, fundo branco/transparente.











