import { Product } from './types';

export const CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 'black-friday', name: 'Black Friday', isHighlight: true },
  { id: 'disposables', name: 'Pods Descartáveis' },
  { id: 'juices-br', name: 'Juices Nacionais' },
  { id: 'juices-import', name: 'Juices Importados' },
  { id: 'salts-br', name: 'SaltNic Nacional' },
  { id: 'salts-import', name: 'SaltNic Importado' },
  { id: 'pods', name: 'Pod Systems' },
  { id: 'coils', name: 'Coils & Acessórios' },
];

export const HERO_BANNERS = [
  {
    id: 1,
    title: "BLACK FRIDAY VAPE",
    subtitle: "Descontos de até 60% em toda a linha premium de Pods e Juices.",
    image: "https://placehold.co/1920x600/1a1a1a/FFF?text=BLACK+FRIDAY+VAPE+PROMO&font=roboto",
    cta: "Aproveitar Agora",
    color: "from-purple-900 to-indigo-900"
  },
  {
    id: 2,
    title: "XROS SERIES: A EVOLUÇÃO DO SABOR",
    subtitle: "DISPOSITIVOS PREMIUM. SESSÕES INIGUALÁVEIS.",
    image: "https://placehold.co/1920x600/0a0a0a/FFF?text=XROS+SERIES&font=roboto",
    cta: "Compre Agora",
    color: "from-blue-900 via-purple-900 to-orange-900"
  },
  {
    id: 3,
    title: "NOVO IGNITE V80",
    subtitle: "A revolução do sabor chegou. 8000 puffs de pura tecnologia.",
    image: "https://placehold.co/1920x600/064e3b/FFF?text=NEW+IGNITE+V80+LAUNCH&font=roboto",
    cta: "Conhecer Lançamento",
    color: "from-blue-900 to-indigo-900"
  },
  {
    id: 4,
    title: "JUICES IMPORTADOS",
    subtitle: "As melhores marcas do mundo com preços do Brasil.",
    image: "https://placehold.co/1920x600/1e3a8a/FFF?text=PREMIUM+IMPORTED+JUICES&font=roboto",
    cta: "Ver Coleção",
    color: "from-blue-900 to-slate-900"
  }
];

export const BRANDS = [
  { name: "Ignite", logo: "https://placehold.co/150x60/FFFFFF/000000?text=IGNITE" },
  { name: "Elfbar", logo: "https://placehold.co/150x60/FFFFFF/000000?text=ELFBAR" },
  { name: "Vaporesso", logo: "https://placehold.co/150x60/FFFFFF/000000?text=VAPORESSO" },
  { name: "Nasty", logo: "https://placehold.co/150x60/FFFFFF/000000?text=NASTY" },
  { name: "Voopoo", logo: "https://placehold.co/150x60/FFFFFF/000000?text=VOOPOO" },
  { name: "Smok", logo: "https://placehold.co/150x60/FFFFFF/000000?text=SMOK" },
  { name: "Geekvape", logo: "https://placehold.co/150x60/FFFFFF/000000?text=GEEKVAPE" },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pod System X-Pro 2',
    description: 'O mais avançado sistema de pod do mercado. Bateria de longa duração.',
    brand: 'Vaporesso',
    sku: 'VAP-XPRO2-001',
    detailedDescription: `Pod System X-Pro 2 - Vaporesso

A Revolução em Sistemas de Pod

O Pod System X-Pro 2 representa o ápice da tecnologia em sistemas de pod recarregáveis. Desenvolvido pela Vaporesso, líder mundial em inovação vaping, este dispositivo combina design elegante com performance excepcional.

Características Principais

• Bateria de 1000mAh com carregamento rápido USB-C
• Sistema de recarga magnética para máxima praticidade
• Resistência de 0.6Ω para vapor denso e sabor intenso
• Capacidade do tanque de 2ml com tecnologia anti-vazamento
• Display OLED para monitoramento de bateria e puffs
• Modo Boost para sessões mais intensas
• Design ergonômico com acabamento premium

Vantagens do Pod System X-Pro 2

Economia Superior: Com sistema recarregável, você economiza até 80% comparado a descartáveis. A bateria de longa duração garante mais de 300 puffs por carga completa.

Sabor Intenso: A tecnologia de coil mesh proporciona aquecimento uniforme, extraindo o máximo sabor de cada juice. Cada tragada é uma experiência única.

Durabilidade: Construído com materiais premium, o X-Pro 2 é resistente a quedas e desgaste. Garantia de 6 meses contra defeitos de fabricação.

Praticidade: Sistema de recarga magnética permite trocar o pod em segundos, sem necessidade de limpeza ou manutenção complexa.

Conteúdo da Embalagem

1 Pod System X-Pro 2 (dispositivo principal)
1 Pod recarregável de 2ml
1 Cabo USB-C para carregamento
1 Manual de instruções em português
1 Certificado de garantia

A Vaporesso e o Compromisso com a Qualidade

A Vaporesso é uma das marcas mais respeitadas no mercado mundial de vaping. Com mais de 10 anos de experiência, desenvolvemos produtos que combinam inovação, qualidade e segurança. O Pod System X-Pro 2 é testado rigorosamente em laboratórios certificados, garantindo que cada unidade atenda aos mais altos padrões de qualidade.

A White Cloud Brasil trabalha exclusivamente com produtos originais e autenticados. Todos os produtos Vaporesso vendidos em nossa loja possuem código de autenticidade e garantia oficial do fabricante.`,
    price: 249.90,
    originalPrice: 299.90,
    category: 'pods',
    images: ['/images/product-1.svg'],
    rating: 4.8,
    reviewsCount: 124,
    stock: 15,
    isBestSeller: true,
    flavors: ['Preto Carbono', 'Prata', 'Azul Metálico', 'Rosa Dourado'],
    specifications: {
      'Medidas': '73mm x 36mm x 14mm',
      'Potência': '8-12W',
      'Bateria': '1000mAh',
      'Capacidade': '2ml',
      'Resistência': '0.6Ω',
      'Materiais': 'Alumínio anodizado',
      'Display': 'OLED',
      'Carregamento': 'USB-C'
    },
    includedItems: [
      '1 Pod System X-Pro 2 (dispositivo principal)',
      '1 Pod recarregável de 2ml',
      '1 Cabo USB-C para carregamento',
      '1 Manual de instruções em português',
      '1 Certificado de garantia'
    ],
    warranty: 'Garantia de 6 meses contra defeitos de fabricação, contados a partir da data de entrega. Não cobre mau uso, quedas ou danos causados por líquidos de má qualidade.',
    paymentOptions: 'Em até 12x sem juros no cartão de crédito. 5% de desconto no pagamento via PIX.'
  },
  {
    id: '2',
    name: 'Juice NicSalt Mint Freeze',
    description: 'Refrescância pura. Menta gelada ideal para o verão.',
    brand: 'White Cloud',
    sku: 'WC-MINT-FREEZE-50',
    detailedDescription: `Juice NicSalt Mint Freeze - White Cloud Brasil

Refrescância Pura e Intensa

O Juice NicSalt Mint Freeze é a escolha perfeita para quem busca uma experiência refrescante e revigorante. Desenvolvido com tecnologia nacional de ponta, este juice combina a suavidade da menta natural com um toque gelado que proporciona sensação única de frescor.

Características do Produto

• Concentração de NicSalt: 35mg ou 50mg por ml
• Proporção VG/PG: 50/50 para equilíbrio perfeito entre vapor e sabor
• Sabor: Menta gelada intensa com notas refrescantes
• Volume: 30ml por frasco
• Produzido no Brasil com ingredientes de alta qualidade
• Livre de diacetil e outros aditivos prejudiciais

Por Que Escolher Mint Freeze?

Sabor Autêntico: Utilizamos extratos naturais de menta combinados com agentes de resfriamento premium, criando uma experiência sensorial única. Cada tragada proporciona uma explosão de frescor que limpa o paladar.

NicSalt de Alta Qualidade: O sal de nicotina utilizado é de grau farmacêutico, proporcionando absorção rápida e satisfação imediata, sem a necessidade de altas concentrações.

Ideal para Iniciantes: A suavidade do NicSalt combinada com o frescor da menta torna este produto perfeito para quem está começando no mundo do vaping.

Versatilidade: Funciona perfeitamente em qualquer dispositivo pod system ou vape pen. Compatível com resistências de 0.6Ω a 1.2Ω.

Conteúdo da Embalagem

1 Frasco de 30ml de Juice NicSalt Mint Freeze
1 Pipeta dosadora para facilitar o reabastecimento
1 Etiqueta com informações nutricionais e de segurança

Garantia de Qualidade White Cloud

Todos os nossos juices são produzidos em laboratórios certificados, seguindo rigorosos padrões de qualidade e segurança. Testamos cada lote para garantir pureza, sabor consistente e ausência de contaminantes.`,
    price: 89.90,
    category: 'salts-br',
    images: ['/images/product-2.svg'],
    rating: 4.5,
    reviewsCount: 56,
    stock: 40,
    isNew: true,
    nicotine: ['35mg', '50mg'],
    specifications: {
      'Concentração': '35mg ou 50mg por ml',
      'Proporção VG/PG': '50/50',
      'Volume': '30ml',
      'Sabor': 'Menta gelada intensa',
      'Origem': 'Produzido no Brasil',
      'Ingredientes': 'Livre de diacetil'
    },
    includedItems: [
      '1 Frasco de 30ml de Juice NicSalt Mint Freeze',
      '1 Pipeta dosadora',
      '1 Etiqueta com informações nutricionais'
    ],
    warranty: 'Garantia de qualidade e autenticidade. Produto testado em laboratórios certificados.',
    paymentOptions: 'Em até 6x sem juros. 5% de desconto no PIX.'
  },
  {
    id: '3',
    name: 'Ignite V50 Descartável',
    description: '5000 puffs de puro sabor. Design ergonômico.',
    brand: 'Ignite',
    sku: 'IGN-V50-5000PUFFS',
    detailedDescription: `Ignite V50 Descartável - 5000 Puffs

A Experiência Completa em um Dispositivo

O Ignite V50 representa a evolução dos pods descartáveis. Com capacidade para 5000 puffs, este dispositivo oferece a conveniência de um produto descartável com a qualidade e durabilidade que você espera.

Especificações Técnicas

• Capacidade: 12ml de e-liquid pré-carregado
• Bateria: 650mAh integrada (não recarregável)
• Puffs Aproximados: 5000 puffs
• Resistência: 1.2Ω mesh coil
• Nicotina: 50mg/ml (5%)
• Sabor: Watermelon, Grape, Mango, Strawberry e muito mais

Por Que o Ignite V50 é Diferente?

Tecnologia Mesh Coil: Utilizamos coils de malha que proporcionam aquecimento uniforme, garantindo sabor consistente do primeiro ao último puff. Não há perda de qualidade ao longo do uso.

Design Ergonômico: O formato arredondado e o peso balanceado tornam o V50 extremamente confortável para uso prolongado. Cabe perfeitamente na mão e no bolso.

Sabor Pré-Carregado Premium: Todos os sabores são desenvolvidos com e-liquids de alta qualidade, testados e aprovados por nossa equipe de especialistas em sabor.

Longa Duração: Com 5000 puffs, o Ignite V50 dura significativamente mais que a maioria dos descartáveis do mercado, oferecendo melhor custo-benefício.

Sabores Disponíveis

• Watermelon: Melancia doce e refrescante
• Grape: Uva intensa e suculenta
• Mango: Manga tropical com toque exótico
• Strawberry: Morango cremoso e doce
• Blue Razz: Framboesa azul azedinha
• Mint: Menta fresca e limpa

Conteúdo da Embalagem

1 Ignite V50 Descartável pré-carregado e pronto para uso
1 Manual de instruções básico
1 Certificado de autenticidade

A Ignite e a Inovação

A Ignite é uma marca reconhecida mundialmente pela qualidade e inovação em produtos descartáveis. Cada dispositivo passa por rigorosos testes de qualidade antes de chegar ao mercado, garantindo segurança e satisfação do consumidor.`,
    price: 110.00,
    originalPrice: 130.00,
    category: 'disposables',
    images: ['/images/product-3.svg'],
    rating: 4.9,
    reviewsCount: 342,
    stock: 5,
    isBestSeller: true,
    flavors: ['Watermelon', 'Grape', 'Mango', 'Strawberry', 'Blue Razz', 'Mint'],
    specifications: {
      'Capacidade': '12ml de e-liquid pré-carregado',
      'Bateria': '650mAh integrada',
      'Puffs Aproximados': '5000 puffs',
      'Resistência': '1.2Ω mesh coil',
      'Nicotina': '50mg/ml (5%)',
      'Tipo': 'Descartável (não recarregável)'
    },
    includedItems: [
      '1 Ignite V50 Descartável pré-carregado',
      '1 Manual de instruções básico',
      '1 Certificado de autenticidade'
    ],
    warranty: 'Garantia de autenticidade e qualidade. Produto original Ignite com código de verificação.',
    paymentOptions: 'Em até 10x sem juros. 5% de desconto no PIX.'
  },
  {
    id: '4',
    name: 'Coil Mesh Reposição',
    description: 'Resistências de malha alta durabilidade para Vaporesso.',
    brand: 'Vaporesso',
    sku: 'VAP-COIL-MESH-06',
    detailedDescription: `Coil Mesh Reposição Vaporesso - 0.6Ω

Máxima Durabilidade e Sabor

As resistências mesh Vaporesso são desenvolvidas com tecnologia de ponta para oferecer a melhor experiência de vaping possível. Com design em malha, essas coils proporcionam aquecimento uniforme, sabor intenso e vida útil prolongada.

Especificações Técnicas

• Resistência: 0.6Ω (ohm)
• Tipo: Mesh Coil (malha)
• Compatibilidade: Vaporesso XROS, XROS 2, XROS 3, XROS Mini
• Material: Algodão orgânico japonês + arame mesh premium
• Vida Útil: Aproximadamente 7-14 dias de uso moderado
• Potência Recomendada: 11-16W

Vantagens das Coils Mesh

Aquecimento Uniforme: A tecnologia mesh distribui o calor de forma uniforme por toda a superfície da resistência, eliminando pontos quentes e garantindo sabor consistente.

Maior Superfície de Contato: A estrutura em malha oferece maior área de contato com o e-liquid, resultando em produção de vapor mais densa e sabor mais intenso.

Durabilidade Superior: As coils mesh duram até 50% mais que coils tradicionais, oferecendo melhor custo-benefício a longo prazo.

Sabor Puro: O algodão orgânico japonês utilizado é de altíssima qualidade, garantindo que nenhum sabor residual interfira na experiência.

Como Usar

1. Remova a coil antiga do dispositivo (se houver)
2. Insira a nova coil mesh no pod/tanque
3. Aguarde 5-10 minutos para o algodão absorver o e-liquid (prime)
4. Comece a usar com potência baixa e aumente gradualmente
5. Substitua quando notar diminuição de sabor ou vapor

Dicas para Prolongar a Vida Útil

• Evite usar com e-liquids muito doces (podem queimar mais rápido)
• Mantenha o dispositivo sempre com e-liquid (nunca deixe secar)
• Use potência dentro da faixa recomendada
• Evite puffs muito longos consecutivos

Conteúdo da Embalagem

5 Coils Mesh Vaporesso 0.6Ω (pack com 5 unidades)
1 Manual de instruções
1 Certificado de autenticidade

Garantia de Qualidade

Todas as coils Vaporesso são originais e autenticadas. Trabalhamos diretamente com distribuidores autorizados, garantindo produtos 100% originais com garantia do fabricante.`,
    price: 75.00,
    category: 'coils',
    images: ['/images/product-4.svg'],
    rating: 4.7,
    reviewsCount: 89,
    stock: 100,
    specifications: {
      'Resistência': '0.6Ω (ohm)',
      'Tipo': 'Mesh Coil (malha)',
      'Compatibilidade': 'Vaporesso XROS, XROS 2, XROS 3, XROS Mini',
      'Material': 'Algodão orgânico japonês + arame mesh premium',
      'Vida Útil': '7-14 dias de uso moderado',
      'Potência Recomendada': '11-16W'
    },
    includedItems: [
      '5 Coils Mesh Vaporesso 0.6Ω (pack com 5 unidades)',
      '1 Manual de instruções',
      '1 Certificado de autenticidade'
    ],
    warranty: 'Garantia de autenticidade. Produtos 100% originais Vaporesso com garantia do fabricante.',
    paymentOptions: 'Em até 6x sem juros. 5% de desconto no PIX.'
  },
  {
    id: '5',
    name: 'Juice Gold Label Tobacco',
    description: 'Tabaco clássico com notas sutis de caramelo.',
    brand: 'Premium Vape Co',
    sku: 'PVC-GOLD-TOB-30',
    detailedDescription: `Juice Gold Label Tobacco - Premium Vape Co

O Sabor Clássico Redefinido

O Gold Label Tobacco é a escolha perfeita para quem busca o sabor autêntico do tabaco com um toque sofisticado de caramelo. Desenvolvido pela Premium Vape Co, este juice importado combina tradição e inovação em cada frasco.

Características do Produto

• Tipo: Freebase Nicotine (nicotina tradicional)
• Concentrações: 3mg/ml ou 6mg/ml
• Proporção VG/PG: 70/30 para vapor denso e sabor equilibrado
• Sabor: Tabaco clássico com notas de caramelo e nozes
• Volume: 60ml por frasco
• Origem: Importado dos Estados Unidos
• Produzido em laboratório certificado GMP

O Que Torna Este Juice Especial?

Perfil de Sabor Complexo: Desenvolvido por mestres mixologistas, o Gold Label Tobacco oferece um perfil de sabor em camadas. O tabaco robusto é complementado por notas sutis de caramelo tostado e um toque de nozes, criando uma experiência sofisticada.

Qualidade Premium: Utilizamos apenas ingredientes de grau farmacêutico, incluindo nicotina purificada e flavorizantes aprovados pela FDA. Cada lote é testado para garantir pureza e consistência.

Ideal para Sub-Ohm: Com proporção 70/30 VG/PG, este juice é perfeito para uso em dispositivos sub-ohm, produzindo nuvens densas e sabor intenso.

Envelhecimento Natural: O blend de sabores é cuidadosamente balanceado e envelhecido, permitindo que os sabores se integrem perfeitamente antes do envase.

Como Usar

Este juice é ideal para dispositivos com resistência abaixo de 1.0Ω (sub-ohm). Recomendamos potência entre 40-80W para melhor experiência. Agite bem antes de usar para garantir mistura uniforme dos ingredientes.

Armazenamento

Mantenha em local fresco e seco, longe da luz solar direta. Após aberto, consuma preferencialmente em até 6 meses. Mantenha sempre com a tampa fechada para preservar o sabor.

Conteúdo da Embalagem

1 Frasco de 60ml de Juice Gold Label Tobacco
1 Pipeta dosadora premium
1 Certificado de autenticidade e origem
1 Guia de uso e informações nutricionais

A Premium Vape Co

Com mais de 15 anos de experiência no mercado americano, a Premium Vape Co é reconhecida mundialmente pela excelência em desenvolvimento de e-liquids. Nossos produtos são vendidos em mais de 50 países e são a escolha de vapers experientes que buscam qualidade superior.`,
    price: 149.90,
    category: 'juices-import',
    images: ['/images/product-5.svg'],
    rating: 5.0,
    reviewsCount: 12,
    stock: 8,
    nicotine: ['3mg', '6mg'],
    specifications: {
      'Tipo': 'Freebase Nicotine',
      'Concentrações': '3mg/ml ou 6mg/ml',
      'Proporção VG/PG': '70/30',
      'Volume': '60ml',
      'Origem': 'Importado dos Estados Unidos',
      'Certificação': 'Produzido em laboratório GMP'
    },
    includedItems: [
      '1 Frasco de 60ml de Juice Gold Label Tobacco',
      '1 Pipeta dosadora premium',
      '1 Certificado de autenticidade',
      '1 Guia de uso'
    ],
    warranty: 'Garantia de autenticidade e qualidade. Produto importado original Premium Vape Co.',
    paymentOptions: 'Em até 10x sem juros. 5% de desconto no PIX.'
  },
  {
    id: '6',
    name: 'Pod System Mini Fit',
    description: 'Compacto, discreto e potente. Cabe no bolso.',
    brand: 'Voopoo',
    sku: 'VOO-MINIFIT-001',
    detailedDescription: `Pod System Mini Fit - Voopoo

Compacto, Discreto e Poderoso

O Mini Fit da Voopoo é a solução perfeita para quem busca praticidade sem abrir mão da qualidade. Com design ultra-compacto, este dispositivo cabe confortavelmente no bolso e oferece performance surpreendente para seu tamanho.

Especificações Técnicas

• Bateria: 370mAh com carregamento USB-C
• Capacidade: 2ml de e-liquid
• Resistência: 1.2Ω (coil incluída)
• Potência: Ajustável automaticamente (8-12W)
• Dimensões: 73mm x 36mm x 14mm (extremamente compacto)
• Peso: Apenas 28g (ultra leve)
• Material: Alumínio anodizado premium

Por Que Escolher o Mini Fit?

Tamanho Ideal: Com apenas 14mm de espessura, o Mini Fit é um dos pods mais compactos do mercado. Perfeito para uso discreto em qualquer situação.

Bateria Eficiente: Apesar do tamanho compacto, a bateria de 370mAh oferece autonomia suficiente para um dia inteiro de uso moderado. Carregamento rápido via USB-C.

Sabor Intenso: A tecnologia de coil da Voopoo garante que mesmo com tamanho reduzido, você não perde em sabor. Cada puff é rico e satisfatório.

Design Premium: O acabamento em alumínio anodizado oferece resistência a arranhões e um toque premium. Disponível em várias cores vibrantes.

Praticidade Total: Sistema de recarga por top-fill, sem necessidade de remover o pod. Basta abrir a tampa superior e adicionar o e-liquid.

Conteúdo da Embalagem

1 Pod System Mini Fit (dispositivo principal)
1 Pod de 2ml com coil 1.2Ω pré-instalada
1 Cabo USB-C para carregamento
1 Manual de instruções
1 Certificado de garantia

A Voopoo e a Inovação

A Voopoo é uma das marcas mais inovadoras do mercado, conhecida por combinar tecnologia avançada com design elegante. O Mini Fit é resultado de anos de pesquisa e desenvolvimento, criando o equilíbrio perfeito entre tamanho e performance.`,
    price: 129.90,
    originalPrice: 159.90,
    category: 'pods',
    images: ['/images/product-6.svg'],
    rating: 4.2,
    reviewsCount: 45,
    stock: 22,
    specifications: {
      'Bateria': '370mAh com carregamento USB-C',
      'Capacidade': '2ml',
      'Resistência': '1.2Ω',
      'Potência': '8-12W (ajustável automaticamente)',
      'Dimensões': '73mm x 36mm x 14mm',
      'Peso': '28g',
      'Material': 'Alumínio anodizado premium'
    },
    includedItems: [
      '1 Pod System Mini Fit',
      '1 Pod de 2ml com coil 1.2Ω pré-instalada',
      '1 Cabo USB-C',
      '1 Manual de instruções',
      '1 Certificado de garantia'
    ],
    warranty: 'Garantia de 6 meses contra defeitos de fabricação. Produto original Voopoo.',
    paymentOptions: 'Em até 10x sem juros. 5% de desconto no PIX.'
  },
  {
    id: '7',
    name: 'Elfbar BC10000',
    description: 'A nova era dos descartáveis com display digital.',
    brand: 'Elfbar',
    sku: 'ELF-BC10000-DISP',
    detailedDescription: `Elfbar BC10000 - A Nova Era dos Descartáveis

Tecnologia e Conveniência em um Dispositivo

O Elfbar BC10000 representa a evolução dos pods descartáveis. Com display digital integrado e capacidade para 10.000 puffs, este dispositivo oferece tudo que você precisa em um produto pronto para uso.

Características Revolucionárias

• Capacidade: 18ml de e-liquid pré-carregado
• Bateria: 650mAh com indicador de carga no display
• Puffs: Aproximadamente 10.000 puffs
• Display Digital: Mostra nível de bateria e puffs restantes
• Resistência: Mesh coil 1.0Ω para sabor intenso
• Nicotina: 50mg/ml (5%)
• Sabor: Pré-carregado com os melhores blends

Display Digital Inteligente

O Elfbar BC10000 é o primeiro descartável com display digital funcional. O visor mostra:
• Nível de bateria em tempo real
• Contador de puffs aproximado
• Indicador de e-liquid restante
• Status do dispositivo

Esta tecnologia permite que você saiba exatamente quando o dispositivo está chegando ao fim, evitando surpresas desagradáveis.

Tecnologia Mesh Coil

Utilizamos coils mesh de última geração que proporcionam:
• Aquecimento uniforme e rápido
• Sabor consistente do primeiro ao último puff
• Produção de vapor densa e satisfatória
• Maior durabilidade da coil

Sabores Premium Disponíveis

• Blue Razz Ice: Framboesa azul com toque gelado
• Strawberry Kiwi: Morango e kiwi tropical
• Watermelon Bubblegum: Melancia com goma de mascar
• Mango Peach: Manga e pêssego exóticos
• Cola Ice: Refrigerante cola gelado
• Energy Drink: Bebida energética revigorante

Por Que o BC10000 é Diferente?

Capacidade Extrema: Com 18ml de e-liquid, o BC10000 oferece uma das maiores capacidades entre descartáveis, garantindo durabilidade excepcional.

Tecnologia Avançada: O display digital e a tecnologia mesh coil colocam o BC10000 à frente da concorrência em termos de inovação.

Qualidade Garantida: Todos os dispositivos passam por testes rigorosos de qualidade, garantindo segurança e satisfação.

Conteúdo da Embalagem

1 Elfbar BC10000 pré-carregado e pronto para uso
1 Manual de instruções
1 Certificado de autenticidade Elfbar

A Elfbar e o Compromisso

A Elfbar é uma das marcas mais reconhecidas mundialmente em produtos descartáveis. Com milhões de unidades vendidas, estabelecemos o padrão de qualidade e inovação no mercado. Cada produto é desenvolvido com foco em segurança, qualidade e experiência do usuário.`,
    price: 115.00,
    category: 'disposables',
    images: ['/images/product-7.svg'],
    rating: 4.9,
    reviewsCount: 18,
    stock: 150,
    isNew: true,
    flavors: ['Blue Razz Ice', 'Strawberry Kiwi', 'Watermelon Bubblegum', 'Mango Peach', 'Cola Ice', 'Energy Drink'],
    specifications: {
      'Capacidade': '18ml de e-liquid pré-carregado',
      'Bateria': '650mAh com indicador de carga',
      'Puffs Aproximados': '10.000 puffs',
      'Display': 'Digital (bateria e puffs)',
      'Resistência': 'Mesh coil 1.0Ω',
      'Nicotina': '50mg/ml (5%)'
    },
    includedItems: [
      '1 Elfbar BC10000 pré-carregado',
      '1 Manual de instruções',
      '1 Certificado de autenticidade Elfbar'
    ],
    warranty: 'Garantia de autenticidade e qualidade. Produto original Elfbar com código de verificação.',
    paymentOptions: 'Em até 10x sem juros. 5% de desconto no PIX.'
  },
  {
    id: '8',
    name: 'Nasty Juice Cush Man',
    description: 'A melhor manga do mundo. Doce e refrescante.',
    brand: 'Nasty Juice',
    sku: 'NASTY-CUSHMAN-60',
    detailedDescription: `Nasty Juice Cush Man - A Lenda do Sabor

O Sabor Mais Procurado do Mundo

O Cush Man da Nasty Juice não é apenas um juice, é uma experiência. Reconhecido mundialmente como um dos melhores sabores de manga já criados, este e-liquid conquistou milhões de vapers ao redor do globo.

Sobre o Cush Man

O Cush Man é um blend único de manga doce e suculenta, com um toque refrescante que limpa o paladar a cada puff. Desenvolvido pela equipe de mixologistas da Nasty Juice, este sabor é resultado de anos de pesquisa e refinamento.

Características do Produto

• Tipo: Freebase Nicotine
• Concentrações: 0mg, 3mg, 6mg por ml
• Proporção VG/PG: 70/30 para vapor denso
• Sabor: Manga doce e suculenta com toque refrescante
• Volume: 60ml por frasco
• Origem: Malásia (importado)
• Linha: Bad Blood Series

Por Que o Cush Man é Tão Especial?

Sabor Autêntico: Utilizamos extratos naturais de manga combinados com flavorizantes premium, criando um sabor que é ao mesmo tempo doce, suculento e refrescante.

Reconhecimento Mundial: O Cush Man ganhou diversos prêmios internacionais e é constantemente eleito como um dos melhores sabores do mundo por comunidades de vapers.

Versatilidade: Funciona perfeitamente em qualquer dispositivo, desde pods simples até mods avançados. O sabor se adapta a diferentes configurações de potência.

Satisfação Garantida: Com mais de 5 milhões de frascos vendidos mundialmente, o Cush Man tem uma taxa de satisfação de 98% entre os consumidores.

A Linha Bad Blood

O Cush Man faz parte da linha Bad Blood da Nasty Juice, conhecida por sabores intensos e memoráveis. Cada produto da linha é desenvolvido para proporcionar uma experiência única e inesquecível.

Como Usar

O Cush Man é ideal para uso em dispositivos sub-ohm (resistência abaixo de 1.0Ω). Recomendamos potência entre 40-80W para melhor experiência. O sabor se intensifica com o aquecimento, então ajuste a potência conforme sua preferência.

Armazenamento e Validade

Mantenha em local fresco e seco, longe da luz solar. Após aberto, consuma preferencialmente em até 6 meses. Agite bem antes de usar para garantir mistura uniforme.

Conteúdo da Embalagem

1 Frasco de 60ml de Nasty Juice Cush Man
1 Pipeta dosadora
1 Certificado de autenticidade
1 Sticker exclusivo da Nasty Juice

A Nasty Juice

Fundada na Malásia, a Nasty Juice é uma das marcas mais respeitadas e premiadas do mundo do vaping. Com presença em mais de 80 países, desenvolvemos sabores que se tornaram ícones da indústria. O compromisso com qualidade e inovação faz da Nasty Juice a escolha de vapers experientes em todo o mundo.`,
    price: 95.00,
    originalPrice: 110.00,
    category: 'juices-import',
    images: ['/images/product-8.svg'],
    rating: 4.8,
    reviewsCount: 220,
    stock: 30,
    isBestSeller: true,
  }
];
