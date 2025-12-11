# Imagens dos Produtos - Guia de Nomenclatura

Este arquivo documenta as 5 imagens que devem ser adicionadas à pasta `public/images/` para os produtos do site.

## Imagens Necessárias

### 1. `/images/product-vape-1.png`
**Descrição:** Dispositivo vape preto retangular com logo branco de crânio de bode com chifres grandes. Texto "BANANA COCONUT WATER" na vertical. Display digital colorido com indicadores "ECO", "NORMAL" e "BOOST" e ícone de chama colorido.

**Usado nos produtos:**
- Produto 1: Pod System X-Pro 2
- Produto 7: Elfbar BC10000

---

### 2. `/images/product-juice-1.png`
**Descrição:** Garrafa de juice transparente com líquido âmbar. Label preto e branco com padrão geométrico/zebra. Logo "Born to Vape" no centro. Seção verde com ícone de morango/kiwi, texto "Strawberry Kiwi" e "20Mg". Aviso em espanhol sobre nicotina na parte inferior.

**Usado nos produtos:**
- Produto 2: Juice NicSalt Mint Freeze
- Produto 5: Juice Gold Label Tobacco
- Produto 8: Nasty Juice Cush Man

---

### 3. `/images/product-vape-2.png`
**Descrição:** Dispositivo vape dourado/champagne metálico, formato oval alongado achatado. Topo translúcido escuro revelando estrutura interna. Logo "kalmia" na parte inferior em tom mais escuro. Pequeno logo de floco de neve/estrela no meio.

**Usado nos produtos:**
- Produto 3: Ignite V50 Descartável

---

### 4. `/images/product-vape-3.png`
**Descrição:** Dispositivo vape preto retangular compacto. Topo transparente revelando pod interno escuro. Banda branca horizontal com texto "LIFE POD" e ícone de folha. Gráfico grande "4K" colorido em gradiente rosa/amarelo/laranja com acabamento metálico/brilhante.

**Usado nos produtos:**
- Produto 4: Coil Mesh Reposição

---

### 5. `/images/product-vape-4.png`
**Descrição:** Dispositivo vape branco retangular com bordas arredondadas. Padrão abstrato de pinceladas verdes na frente esquerda (verde-limão e verde-azulado). Texto "ELEBAR" na vertical, parcialmente coberto pelas pinceladas. Logo de folha estilizada. Painel lateral azul-petróleo com indicadores hexagonais luminosos azul-claro e display digital mostrando "00" em verde.

**Usado nos produtos:**
- Produto 6: Pod System Mini Fit

---

## Distribuição das Imagens nos 8 Produtos

| ID | Nome do Produto | Imagem | Categoria |
|----|----------------|--------|-----------|
| 1 | Pod System X-Pro 2 | product-vape-1.png | Pods |
| 2 | Juice NicSalt Mint Freeze | product-juice-1.png | Juices |
| 3 | Ignite V50 Descartável | product-vape-2.png | Descartáveis |
| 4 | Coil Mesh Reposição | product-vape-3.png | Coils |
| 5 | Juice Gold Label Tobacco | product-juice-1.png | Juices Importados |
| 6 | Pod System Mini Fit | product-vape-4.png | Pods |
| 7 | Elfbar BC10000 | product-vape-1.png | Descartáveis |
| 8 | Nasty Juice Cush Man | product-juice-1.png | Juices Importados |

## Instruções

1. Adicione as 5 imagens na pasta `public/images/` com os nomes exatos especificados acima
2. Formato recomendado: PNG com fundo transparente ou com fundo consistente
3. Tamanho recomendado: mínimo 500x500px para qualidade adequada
4. Após adicionar as imagens, as alterações aparecerão automaticamente ao recarregar a página
5. Se os produtos já estiverem salvos no localStorage, será necessário limpar o cache ou atualizar via painel administrativo

## Limpar Cache do localStorage (se necessário)

Abra o console do navegador (F12) e execute:

```javascript
localStorage.removeItem('white_cloud_brasil_products');
location.reload();
```











