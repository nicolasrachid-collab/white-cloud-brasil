import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

import { Routes, Route, useParams, useNavigate as useNavigateRouter } from 'react-router-dom';

import { 

  ShoppingCart, Search, Menu, X, User, Star, Truck, ShieldCheck, 

  CreditCard, ArrowRight, Minus, Plus, Trash2, 

  MapPin, CheckCircle, TrendingUp, DollarSign, 

  Users, ChevronLeft, ChevronRight, ChevronDown, Mail, Instagram, Facebook, Youtube, Twitter,

  Heart, Eye, Share2, Calendar, MessageCircle, Grid3x3, List
} from './components/Icons';

import { Button } from './components/Button';

import Toast from './components/Toast';

import { CartBadge } from './components/CartBadge';

import { FavoritesBadge } from './components/FavoritesBadge';

import { QuickViewModal } from './components/QuickViewModal';

import { AgeVerificationModal } from './components/AgeVerificationModal';

import { CartDrawer } from './components/CartDrawer';

import { ProductCardSkeleton, ProductGridSkeleton, ProductDetailSkeleton } from './components/Skeleton';

import { LoadingSpinner } from './components/LoadingSpinner';

import { ProductFilters } from './components/ProductFilters';

import { useToast } from './hooks/useToast';

import { useDebounce } from './hooks/useDebounce';

import { useCart } from './contexts/CartContext';

import { useApp } from './contexts/AppContext';

import { useFavorites } from './contexts/FavoritesContext';

import { useProducts } from './contexts/ProductsContext';

import { MOCK_PRODUCTS, CATEGORIES, HERO_BANNERS, BRANDS, MenuItem } from './constants';

import { Logos3 } from './components/ui/Logos3';

import { Product, CartItem, ViewState, Order, Review } from './types';



// --- CONFIGURAÃ‡ÃƒO DO LOGOTIPO ---

// IMPORTANTE: Caminhos locais (C:\Users...) NÃƒO funcionam em navegadores web.

// Mova seu arquivo 'logo.png' para a pasta 'public/images/' do projeto.

const LOGO_URL = "/images/logo-whitecloud.png";



// --- COMPONENTS ---



const Header = () => {

  const { searchTerm, setSearchTerm, isBannerVisible, setIsBannerVisible } = useApp();
  const navigateRouter = useNavigateRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [categorySearch, setCategorySearch] = useState<Record<string, string>>({});

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);

  const navContainerRef = useRef<HTMLDivElement>(null);

  const navListRef = useRef<HTMLUListElement>(null);

  const miniBannerRef = useRef<HTMLDivElement>(null);

  const headerRef = useRef<HTMLElement>(null);



  // Fecha o menu se a tela for redimensionada para desktop

  useEffect(() => {

    const handleResize = () => {

      if (window.innerWidth >= 1024) setIsMenuOpen(false);

    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);

  }, []);



  // Impede o scroll do body quando o menu estÃ¡ aberto

  useEffect(() => {

    if (isMenuOpen) {

      document.body.style.overflow = 'hidden';

    } else {

      document.body.style.overflow = 'unset';

    }

    return () => { document.body.style.overflow = 'unset'; };

  }, [isMenuOpen]);



  // Medir dimensões dos elementos de navegação e hierarquia visual

  useEffect(() => {

    const applyFlexWrap = () => {

      if (navListRef.current) {

        navListRef.current.style.setProperty('flex-wrap', 'wrap', 'important');
        navListRef.current.classList.add('flex-wrap');

        navListRef.current.classList.remove('flex-nowrap');
      }

    };

    

    // Aplicar imediatamente

    applyFlexWrap();

    

    // Aplicar após o próximo frame para garantir que o DOM está renderizado

    requestAnimationFrame(() => {

      requestAnimationFrame(() => {

        applyFlexWrap();

      });

    });

    
    // Usar MutationObserver para detectar quando o estilo é alterado e forçar wrap novamente
    // Aguardar um frame para garantir que o elemento está montado
    requestAnimationFrame(() => {
      if (navListRef.current) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
              const target = mutation.target as HTMLElement;
              if (target === navListRef.current) {
                const computed = window.getComputedStyle(target);
                if (computed.flexWrap === 'nowrap') {
                  applyFlexWrap();
                  
                  // #region agent log
                  fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:MutationObserver',message:'MutationObserver detected nowrap and applied wrap',data:{flexWrap:computed.flexWrap,inlineStyle:navListRef.current.style.flexWrap},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'O'})}).catch(()=>{});
                  // #endregion
                }
              }
            }
          });
        });
        
        observer.observe(navListRef.current, {
          attributes: true,
          attributeFilter: ['style', 'class']
        });
        
        // Limpar observer quando o componente for desmontado
        return () => {
          observer.disconnect();
        };
      }
    });
    

    const measureHierarchy = () => {

      try {

        // Função de medição removida - código de debug limpo para produção

      } catch (error) {

        console.error('Error measuring hierarchy:', error);

      }

      

      // Continuar com medições de navegação apenas se os refs estiverem disponíveis

      if (!navRef.current || !navContainerRef.current || !navListRef.current) {

        return;

      }

      

      // Forçar flex-wrap: wrap repetidamente para garantir que seja aplicado
      const forceFlexWrap = () => {
        if (navListRef.current) {
          // Remover qualquer classe que possa estar forçando nowrap
          navListRef.current.classList.remove('flex-nowrap');
      navListRef.current.classList.add('flex-wrap');

          // Forçar via estilo inline com !important
          navListRef.current.style.setProperty('flex-wrap', 'wrap', 'important');
          // Também forçar via style.flexWrap como fallback
          navListRef.current.style.flexWrap = 'wrap';
          
          // #region agent log
          const computed = window.getComputedStyle(navListRef.current);
          fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:forceFlexWrap',message:'forceFlexWrap executed',data:{flexWrap:computed.flexWrap,inlineStyle:navListRef.current.style.flexWrap,hasFlexWrapClass:navListRef.current.classList.contains('flex-wrap'),hasFlexNowrapClass:navListRef.current.classList.contains('flex-nowrap'),className:navListRef.current.className},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'N'})}).catch(()=>{});
          // #endregion
        }
      };
      
      // Aplicar imediatamente
      forceFlexWrap();
      
      // Aplicar após um pequeno delay para garantir que seja aplicado após qualquer outro código
      setTimeout(forceFlexWrap, 0);
      setTimeout(forceFlexWrap, 10);
      setTimeout(forceFlexWrap, 50);
      setTimeout(forceFlexWrap, 100);
      setTimeout(forceFlexWrap, 200);
      setTimeout(forceFlexWrap, 500);
      
      // Forçar estilos nos itens li e botões para garantir que sejam aplicados
      const allListItemsForced = Array.from(navListRef.current.querySelectorAll('li'));
      allListItemsForced.forEach((li) => {
        const element = li as HTMLElement;
        element.style.setProperty('flex-shrink', '1', 'important');
        element.style.setProperty('min-width', '0', 'important');
        element.style.setProperty('max-width', '100%', 'important');
        // NÃO aplicar overflow: hidden nos li, pois isso corta os dropdowns
        // element.style.setProperty('overflow', 'hidden', 'important');
        
        const button = element.querySelector('button') as HTMLElement;
        if (button) {
          button.style.setProperty('flex-shrink', '1', 'important');
          button.style.setProperty('min-width', '0', 'important');
          button.style.setProperty('max-width', '100%', 'important');
          button.style.setProperty('overflow', 'hidden', 'important');
          button.style.setProperty('text-overflow', 'ellipsis', 'important');
        }
      });
      

      const navRect = navRef.current.getBoundingClientRect();

      const containerRect = navContainerRef.current.getBoundingClientRect();

      const listRect = navListRef.current.getBoundingClientRect();

      const computedNav = window.getComputedStyle(navRef.current);

      const computedContainer = window.getComputedStyle(navContainerRef.current);

      const computedList = window.getComputedStyle(navListRef.current);

      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:measureHierarchy',message:'measureHierarchy - flexWrap check',data:{flexWrap:computedList.flexWrap,inlineStyle:navListRef.current.style.flexWrap,hasFlexWrapClass:navListRef.current.classList.contains('flex-wrap'),hasFlexNowrapClass:navListRef.current.classList.contains('flex-nowrap'),className:navListRef.current.className,allClasses:Array.from(navListRef.current.classList)},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'N'})}).catch(()=>{});
      // #endregion
      

      // Medir apenas os itens principais do menu (não os dropdowns)

      const allListItems = Array.from(navListRef.current.querySelectorAll('li'));

      const listItems = allListItems.filter(li => {

        const element = li as HTMLElement;

        const parent = element.parentElement;

        return parent === navListRef.current; // Apenas filhos diretos do ul

      });

      

      const itemWidths = listItems.map((li, idx) => {

        const element = li as HTMLElement;

        const rect = element.getBoundingClientRect();

        const computed = window.getComputedStyle(element);

        return { index: idx, width: rect.width, minWidth: computed.minWidth, maxWidth: computed.maxWidth, flexShrink: computed.flexShrink };

      });

      

      const totalItemsWidth = itemWidths.reduce((sum, item) => sum + item.width, 0);

      const gap = parseFloat(computedList.gap) || 0;

      const estimatedTotalWidth = totalItemsWidth + (gap * (listItems.length - 1));

      

      // Verificar overflow em outros elementos

      const htmlElement = document.documentElement;

      const bodyElement = document.body;

      const headerElement = navRef.current?.closest('header') as HTMLElement;

      const htmlRect = htmlElement.getBoundingClientRect();

      const bodyRect = bodyElement.getBoundingClientRect();

      const headerRect = headerElement?.getBoundingClientRect();

      const htmlComputed = window.getComputedStyle(htmlElement);

      const bodyComputed = window.getComputedStyle(bodyElement);

      const headerComputed = headerElement ? window.getComputedStyle(headerElement) : null;

      

      // Verificar scrollWidth vs clientWidth para detectar overflow

      const htmlHasOverflow = htmlElement.scrollWidth > htmlElement.clientWidth;

      const bodyHasOverflow = bodyElement.scrollWidth > bodyElement.clientWidth;

      const headerHasOverflow = headerElement ? headerElement.scrollWidth > headerElement.clientWidth : false;

      const navHasOverflow = navRef.current ? navRef.current.scrollWidth > navRef.current.clientWidth : false;

      const containerHasOverflow = navContainerRef.current ? navContainerRef.current.scrollWidth > navContainerRef.current.clientWidth : false;

      const listHasOverflow = navListRef.current ? navListRef.current.scrollWidth > navListRef.current.clientWidth : false;

      
      // Verificar estilos dos itens li
      const liStyles = listItems.map((li, idx) => {
        const element = li as HTMLElement;
        const computed = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const buttonEl = element.querySelector('button') as HTMLElement;
        const buttonComputed = buttonEl ? window.getComputedStyle(buttonEl) : null;
        const buttonRect = buttonEl ? buttonEl.getBoundingClientRect() : null;
        return {
          index: idx,
          flexShrink: computed.flexShrink,
          whiteSpace: computed.whiteSpace,
          width: computed.width,
          minWidth: computed.minWidth,
          maxWidth: computed.maxWidth,
          rectWidth: rect.width,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          buttonStyles: buttonEl ? {
            flexShrink: buttonComputed?.flexShrink,
            whiteSpace: buttonComputed?.whiteSpace,
            width: buttonComputed?.width,
            minWidth: buttonComputed?.minWidth,
            maxWidth: buttonComputed?.maxWidth,
            rectWidth: buttonRect?.width,
            scrollWidth: buttonEl.scrollWidth,
            clientWidth: buttonEl.clientWidth,
            inlineStyle: buttonEl.getAttribute('style') || '',
            className: buttonEl.className
          } : null
        };
      });
      
      // Verificar se as regras CSS estão sendo aplicadas
      const firstLi = listItems[0] as HTMLElement;
      const firstButton = firstLi?.querySelector('button') as HTMLElement;
      const cssApplied = firstLi ? {
        liInlineStyle: firstLi.getAttribute('style') || '',
        liComputedFlexShrink: window.getComputedStyle(firstLi).flexShrink,
        liComputedMaxWidth: window.getComputedStyle(firstLi).maxWidth,
        buttonInlineStyle: firstButton?.getAttribute('style') || '',
        buttonComputedFlexShrink: firstButton ? window.getComputedStyle(firstButton).flexShrink : null,
        buttonComputedMaxWidth: firstButton ? window.getComputedStyle(firstButton).maxWidth : null,
        cssRules: firstLi ? Array.from(document.styleSheets).flatMap(sheet => {
          try {
            return Array.from(sheet.cssRules || []).map((rule: any) => {
              if (rule.selectorText && (rule.selectorText.includes('header > nav > div > ul > li') || rule.selectorText.includes('header > nav > div > ul > li > button'))) {
                return {
                  selector: rule.selectorText,
                  cssText: rule.cssText,
                  style: rule.style ? {
                    flexShrink: rule.style.flexShrink,
                    maxWidth: rule.style.maxWidth,
                    minWidth: rule.style.minWidth
                  } : null
                };
              }
              return null;
            }).filter(Boolean);
          } catch (e) {
            return [];
          }
        }).filter(Boolean) : []
      } : null;
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:89',message:'Navigation overflow investigation v3 - CSS rules check',data:{
        viewportWidth: window.innerWidth,
        htmlOverflow: {scrollWidth: htmlElement.scrollWidth, clientWidth: htmlElement.clientWidth, hasOverflow: htmlHasOverflow, overflowX: htmlComputed.overflowX},
        bodyOverflow: {scrollWidth: bodyElement.scrollWidth, clientWidth: bodyElement.clientWidth, hasOverflow: bodyHasOverflow, overflowX: bodyComputed.overflowX},
        headerOverflow: headerElement ? {scrollWidth: headerElement.scrollWidth, clientWidth: headerElement.clientWidth, hasOverflow: headerHasOverflow, overflowX: headerComputed?.overflowX, width: headerComputed?.width, maxWidth: headerComputed?.maxWidth} : null,
        navOverflow: {scrollWidth: navRef.current?.scrollWidth, clientWidth: navRef.current?.clientWidth, hasOverflow: navHasOverflow, overflowX: computedNav.overflowX, width: computedNav.width, maxWidth: computedNav.maxWidth, rect: {width: navRect.width, left: navRect.left}},
        containerOverflow: {scrollWidth: navContainerRef.current?.scrollWidth, clientWidth: navContainerRef.current?.clientWidth, hasOverflow: containerHasOverflow, overflowX: computedContainer.overflowX, width: computedContainer.width, maxWidth: computedContainer.maxWidth, paddingLeft: computedContainer.paddingLeft, paddingRight: computedContainer.paddingRight, boxSizing: computedContainer.boxSizing, rect: {width: containerRect.width, left: containerRect.left}},
        listOverflow: {scrollWidth: navListRef.current?.scrollWidth, clientWidth: navListRef.current?.clientWidth, hasOverflow: listHasOverflow, overflowX: computedList.overflowX, width: computedList.width, maxWidth: computedList.maxWidth, flexWrap: computedList.flexWrap, rect: {width: listRect.width, left: listRect.left}},
        itemsInfo: {count: listItems.length, totalItemsWidth, estimatedTotalWidth, gap, itemWidths, liStyles},
        cssApplied
      },timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'I,J'})}).catch(()=>{});
      // #endregion
    };

    

    // Executar imediatamente após um pequeno delay para garantir que o DOM está renderizado

    const timeoutId1 = setTimeout(measureHierarchy, 100);

    const timeoutId2 = setTimeout(measureHierarchy, 500);

    const timeoutId3 = setTimeout(measureHierarchy, 1000);

    window.addEventListener('resize', measureHierarchy);

    return () => {

      clearTimeout(timeoutId1);

      clearTimeout(timeoutId2);

      clearTimeout(timeoutId3);

      window.removeEventListener('resize', measureHierarchy);

    };

  }, []);



  // Função para abrir dropdown com delay

  const handleMouseEnter = (categoryId: string) => {

    // #region agent log

    fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:handleMouseEnter:start',message:'handleMouseEnter called',data:{categoryId},timestamp:Date.now(),sessionId:'debug-session',runId:'overflow-debug-v2',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion

    console.log('handleMouseEnter chamado para:', categoryId);
    if (closeTimeoutRef.current) {

      clearTimeout(closeTimeoutRef.current);

      closeTimeoutRef.current = null;

    }

    
    // Atualizar o estado
    setOpenDropdown(categoryId);

    console.log('setOpenDropdown chamado com:', categoryId);
    
    // Forçar visibilidade imediatamente
    const dropdownEl = document.querySelector(`[data-dropdown-id="${categoryId}"]`) as HTMLElement;
    console.log('Dropdown encontrado:', !!dropdownEl, dropdownEl);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:handleMouseEnter:dropdownFound',message:'Dropdown element found',data:{categoryId,dropdownFound:!!dropdownEl},timestamp:Date.now(),sessionId:'debug-session',runId:'overflow-debug-v2',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
      if (dropdownEl) {
        dropdownEl.setAttribute('data-dropdown-open', 'true');
        dropdownEl.classList.remove('invisible', 'dropdown-closed');
        dropdownEl.classList.add('visible', 'dropdown-open');
        // Usar cssText para sobrescrever completamente qualquer estilo inline do React
        dropdownEl.style.cssText = `
          position: absolute !important;
          z-index: 99999 !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          height: auto !important;
          overflow: visible !important;
          top: 100% !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          margin-top: 4px !important;
          width: 90vw !important;
          max-width: 900px !important;
        `;
        
        // Verificar posicionamento após aplicar estilos e corrigir se necessário
        setTimeout(() => {
          const rect = dropdownEl.getBoundingClientRect();
          const parentLi = dropdownEl.closest('li');
          const parentRect = parentLi ? parentLi.getBoundingClientRect() : null;
          const navEl = dropdownEl.closest('nav');
          const navRect = navEl ? navEl.getBoundingClientRect() : null;
          
          // Calcular posição correta para manter dropdown dentro da viewport
          const viewportWidth = window.innerWidth;
          const dropdownWidth = 900; // max-width do dropdown
          const halfDropdownWidth = dropdownWidth / 2;
          
          let leftPosition = '50%';
          let transformValue = 'translateX(-50%)';
          
          if (parentRect) {
            const parentCenterX = parentRect.left + (parentRect.width / 2);
            
            // Se o dropdown sair pela esquerda
            if (parentCenterX - halfDropdownWidth < 0) {
              const leftOffset = Math.abs(parentCenterX - halfDropdownWidth) + 16; // 16px de padding
              leftPosition = `${leftOffset}px`;
              transformValue = 'translateX(0)';
            }
            // Se o dropdown sair pela direita
            else if (parentCenterX + halfDropdownWidth > viewportWidth) {
              const rightOffset = viewportWidth - (parentCenterX + halfDropdownWidth) - 16; // 16px de padding
              leftPosition = `calc(50% + ${rightOffset}px)`;
              transformValue = 'translateX(-50%)';
            }
          }
          
          // Aplicar posição corrigida
          dropdownEl.style.setProperty('left', leftPosition, 'important');
          dropdownEl.style.setProperty('transform', transformValue, 'important');
          
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:handleMouseEnter:positionFix',message:'Applied position fix to dropdown',data:{categoryId,viewportWidth,dropdownWidth,halfDropdownWidth,parentCenterX:parentRect ? parentRect.left + (parentRect.width / 2) : null,leftPosition,transformValue,originalLeft:rect.left,originalRight:rect.right},timestamp:Date.now(),sessionId:'debug-session',runId:'overflow-debug-v2',hypothesisId:'H4'})}).catch(()=>{});
          // #endregion
          
          console.log('=== DIAGNÓSTICO DE POSICIONAMENTO ===');
          console.log('Dropdown rect:', {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            bottom: rect.bottom,
            right: rect.right
          });
          console.log('Viewport:', {
            width: window.innerWidth,
            height: window.innerHeight
          });
          console.log('Dropdown está visível?', 
            rect.top >= 0 && 
            rect.left >= 0 && 
            rect.bottom <= window.innerHeight && 
            rect.right <= window.innerWidth
          );
          
          // Verificar overflow dos pais
          let current = dropdownEl.parentElement;
          const overflowParents: Array<{element: HTMLElement, tagName: string, className: string, id: string, overflow: string, computed: {overflow: string, overflowX: string, overflowY: string}, inlineStyle: string, hasOverflowHiddenClass: boolean}> = [];
          while (current && current !== document.body) {
            const computed = window.getComputedStyle(current);
            if (computed.overflow === 'hidden' || computed.overflowX === 'hidden' || computed.overflowY === 'hidden') {
              // #region agent log
              fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:handleMouseEnter:overflowCheck',message:'Parent element with overflow hidden found',data:{tagName:current.tagName,className:current.className,id:current.id || 'no-id',overflow:computed.overflow,overflowX:computed.overflowX,overflowY:computed.overflowY,inlineStyle:current.style.cssText || 'no-inline-style',hasOverflowHiddenClass:current.classList.contains('overflow-hidden') || current.classList.contains('overflow-x-hidden') || current.classList.contains('overflow-y-hidden'),allClasses:Array.from(current.classList)},timestamp:Date.now(),sessionId:'debug-session',runId:'overflow-debug',hypothesisId:'H1'})}).catch(()=>{});
              // #endregion
              overflowParents.push({
                element: current,
                tagName: current.tagName,
                className: current.className,
                id: current.id || '',
                overflow: `${computed.overflow} / ${computed.overflowX} / ${computed.overflowY}`,
                computed: {
                  overflow: computed.overflow,
                  overflowX: computed.overflowX,
                  overflowY: computed.overflowY
                },
                inlineStyle: current.style.cssText || 'no-inline-style',
                hasOverflowHiddenClass: current.classList.contains('overflow-hidden') || current.classList.contains('overflow-x-hidden') || current.classList.contains('overflow-y-hidden')
              });
              
              // Aplicar correção em tempo de execução
              // #region agent log
              fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:handleMouseEnter:beforeFix',message:'About to apply overflow fix',data:{tagName:current.tagName,className:current.className,id:current.id || 'no-id',overflow:computed.overflow,overflowX:computed.overflowX,overflowY:computed.overflowY,isLI:current.tagName === 'LI',isUL:current.tagName === 'UL',isDIV:current.tagName === 'DIV',hasOverflowXHidden:current.classList.contains('overflow-x-hidden'),isRoot:current.id === 'root'},timestamp:Date.now(),sessionId:'debug-session',runId:'overflow-debug-v2',hypothesisId:'H2'})}).catch(()=>{});
              // #endregion
              if (current.tagName === 'LI' || current.tagName === 'UL' || (current.tagName === 'DIV' && (current.classList.contains('overflow-x-hidden') || current.id === 'root'))) {
                current.style.setProperty('overflow', 'visible', 'important');
                current.style.setProperty('overflow-y', 'visible', 'important');
                if (current.tagName !== 'UL' && !current.classList.contains('overflow-x-hidden')) {
                  current.style.setProperty('overflow-x', 'visible', 'important');
                }
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:handleMouseEnter:overflowFix',message:'Applied overflow visible fix to element',data:{tagName:current.tagName,className:current.className,id:current.id || 'no-id',beforeOverflow:computed.overflow,beforeOverflowX:computed.overflowX,beforeOverflowY:computed.overflowY,afterOverflow:window.getComputedStyle(current).overflow,afterOverflowX:window.getComputedStyle(current).overflowX,afterOverflowY:window.getComputedStyle(current).overflowY},timestamp:Date.now(),sessionId:'debug-session',runId:'overflow-debug-v2',hypothesisId:'H2'})}).catch(()=>{});
                // #endregion
              } else {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:handleMouseEnter:skipFix',message:'Skipped overflow fix - element not in fix list',data:{tagName:current.tagName,className:current.className,id:current.id || 'no-id'},timestamp:Date.now(),sessionId:'debug-session',runId:'overflow-debug-v2',hypothesisId:'H2'})}).catch(()=>{});
                // #endregion
              }
            }
            current = current.parentElement;
          }
          if (overflowParents.length > 0) {
            console.warn('⚠️ Elementos pais com overflow hidden:', overflowParents);
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:handleMouseEnter:overflowSummary',message:'Summary of all parent elements with overflow hidden',data:{count:overflowParents.length,elements:overflowParents.map(p => ({tagName:p.tagName,className:p.className,id:p.id,overflow:p.overflow,hasOverflowHiddenClass:p.hasOverflowHiddenClass,inlineStyle:p.inlineStyle}))},timestamp:Date.now(),sessionId:'debug-session',runId:'overflow-debug',hypothesisId:'H1'})}).catch(()=>{});
            // #endregion
          } else {
            console.log('✅ Nenhum elemento pai com overflow hidden');
          }
        }, 100);
        
        console.log('Estilos aplicados. Computed:', {
          display: window.getComputedStyle(dropdownEl).display,
          visibility: window.getComputedStyle(dropdownEl).visibility,
          opacity: window.getComputedStyle(dropdownEl).opacity,
          zIndex: window.getComputedStyle(dropdownEl).zIndex,
          position: window.getComputedStyle(dropdownEl).position
        });
    } else {
      console.error('Dropdown não encontrado para:', categoryId);
    }
    
    // Forçar novamente após um pequeno delay para garantir
    setTimeout(() => {
      const dropdownElAfter = document.querySelector(`[data-dropdown-id="${categoryId}"]`) as HTMLElement;
      if (dropdownElAfter) {
        dropdownElAfter.setAttribute('data-dropdown-open', 'true');
        dropdownElAfter.classList.remove('invisible', 'dropdown-closed');
        dropdownElAfter.classList.add('visible', 'dropdown-open');
        dropdownElAfter.style.setProperty('visibility', 'visible', 'important');
        dropdownElAfter.style.setProperty('opacity', '1', 'important');
        dropdownElAfter.style.setProperty('pointer-events', 'auto', 'important');
        dropdownElAfter.style.setProperty('height', 'auto', 'important');
        dropdownElAfter.style.setProperty('overflow', 'visible', 'important');
      }
    }, 10);
    
    // #region agent log

    setTimeout(() => {

      const dropdownEl = document.querySelector(`[data-dropdown-id="${categoryId}"]`) as HTMLElement;

      const navEl = navRef.current;

      const liEl = dropdownEl?.closest('li') as HTMLElement;

      const navComputed = navEl ? window.getComputedStyle(navEl) : null;

      const liComputed = liEl ? window.getComputedStyle(liEl) : null;

      const dropdownComputed = dropdownEl ? window.getComputedStyle(dropdownEl) : null;

      

      // Verificar todos os elementos fixos na página

      const allFixedElements = Array.from(document.querySelectorAll('*')).filter(el => {

        const style = window.getComputedStyle(el);

        return style.position === 'fixed' || style.position === 'sticky';

      }).map(el => {

        const style = window.getComputedStyle(el);

        const rect = el.getBoundingClientRect();

        return {

          tag: el.tagName,

          className: el.className,

          zIndex: style.zIndex,

          position: style.position,

          rect: {top: rect.top, left: rect.left, width: rect.width, height: rect.height}

        };

      });

      

      fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:165',message:'Dropdown z-index check',data:{

        categoryId,

        dropdownZIndex: dropdownComputed?.zIndex || 'none',

        dropdownPosition: dropdownComputed?.position || 'none',

        dropdownVisibility: dropdownComputed?.visibility || 'none',

        dropdownOpacity: dropdownComputed?.opacity || 'none',

        navZIndex: navComputed?.zIndex || 'none',

        liZIndex: liComputed?.zIndex || 'none',

        dropdownRect: dropdownEl ? {top: dropdownEl.getBoundingClientRect().top, left: dropdownEl.getBoundingClientRect().left, width: dropdownEl.getBoundingClientRect().width, height: dropdownEl.getBoundingClientRect().height} : null,

        navOverflow: navComputed?.overflow || 'none',

        liOverflow: liComputed?.overflow || 'none',

        allFixedElements

      },timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});

    }, 100);

    // #endregion

  };



  // Função para fechar dropdown com delay

  const handleMouseLeave = () => {

    closeTimeoutRef.current = setTimeout(() => {

      // Remover atributo de dados e classes antes de atualizar o estado
      const allDropdowns = document.querySelectorAll('[data-dropdown-id]') as NodeListOf<HTMLElement>;
      allDropdowns.forEach(dropdown => {
        dropdown.removeAttribute('data-dropdown-open');
        dropdown.classList.remove('visible', 'dropdown-open');
        dropdown.classList.add('invisible', 'dropdown-closed');
      });
      setOpenDropdown(null);

    }, 200); // Delay de 200ms antes de fechar

  };



  // Limpar timeout ao desmontar

  useEffect(() => {

    return () => {

      if (closeTimeoutRef.current) {

        clearTimeout(closeTimeoutRef.current);

      }

    };

  }, []);


  // Adicionar event listeners diretos no DOM para garantir que os eventos sejam capturados
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:useEffect:directEventListener:setup',message:'Setting up direct event listeners',data:{navListRefExists:!!navListRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'dropdown-menu-debug',hypothesisId:'MENU9'})}).catch(()=>{});
    // #endregion
    
    const setupListeners = () => {
      const navList = navListRef.current;
      if (!navList) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:useEffect:directEventListener:navListNotFound',message:'navList not found',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'dropdown-menu-debug',hypothesisId:'MENU9'})}).catch(()=>{});
        // #endregion
        return;
      }

      const handleLiMouseEnter = (e: MouseEvent) => {
        const li = (e.target as HTMLElement).closest('li');
        if (!li) return;
        
        const categoryId = li.getAttribute('data-category-id');
        if (!categoryId) return;
        
        const cat = CATEGORIES.find(c => c.id === categoryId);
        if (cat && cat.hasDropdown) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:useEffect:directEventListener',message:'Direct event listener triggered',data:{categoryId,hasDropdown:cat.hasDropdown},timestamp:Date.now(),sessionId:'debug-session',runId:'dropdown-menu-debug',hypothesisId:'MENU9'})}).catch(()=>{});
          // #endregion
          handleMouseEnter(categoryId);
        }
      };

      // Adicionar data-category-id aos li elements
      const listItems = navList.querySelectorAll('li');
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:useEffect:directEventListener:foundItems',message:'Found list items',data:{listItemsCount:listItems.length},timestamp:Date.now(),sessionId:'debug-session',runId:'dropdown-menu-debug',hypothesisId:'MENU9'})}).catch(()=>{});
      // #endregion
      
      listItems.forEach((li, index) => {
        const cat = CATEGORIES[index];
        if (cat) {
          li.setAttribute('data-category-id', cat.id);
          li.addEventListener('mouseenter', handleLiMouseEnter);
        }
      });

      return () => {
        listItems.forEach(li => {
          li.removeEventListener('mouseenter', handleLiMouseEnter);
        });
      };
    };

    // Tentar configurar imediatamente
    const cleanup = setupListeners();
    
    // Se não encontrou, tentar novamente após um delay
    if (!navListRef.current) {
      setTimeout(() => {
        setupListeners();
      }, 100);
      setTimeout(() => {
        setupListeners();
      }, 500);
    }

    return cleanup;
  }, []);

  // Monitorar mudanças no estado openDropdown e forçar visibilidade
  useEffect(() => {
    console.log('useEffect openDropdown executado. openDropdown:', openDropdown);
    // Fechar apenas os dropdowns que NÃO são o que está sendo aberto
    const allDropdowns = document.querySelectorAll('[data-dropdown-id]') as NodeListOf<HTMLElement>;
    console.log('Total de dropdowns encontrados:', allDropdowns.length);
    allDropdowns.forEach((dropdown) => {
      const dropdownId = dropdown.getAttribute('data-dropdown-id');
      // Se este dropdown NÃO é o que está sendo aberto, fechá-lo
      if (dropdownId !== openDropdown) {
        dropdown.removeAttribute('data-dropdown-open');
        dropdown.classList.remove('dropdown-open', 'visible', 'dropdown-closed', 'invisible');
        dropdown.style.setProperty('visibility', 'hidden', 'important');
        dropdown.style.setProperty('opacity', '0', 'important');
        dropdown.style.setProperty('pointer-events', 'none', 'important');
        dropdown.style.setProperty('display', 'none', 'important');
      }
    });
    
    // Forçar visibilidade do dropdown que está sendo aberto
    if (openDropdown) {
      console.log('Abrindo dropdown:', openDropdown);
      // Forçar visibilidade imediatamente
      const dropdownEl = document.querySelector(`[data-dropdown-id="${openDropdown}"]`) as HTMLElement;
      console.log('useEffect: Dropdown element encontrado:', !!dropdownEl);
      if (dropdownEl) {
        dropdownEl.setAttribute('data-dropdown-open', 'true');
        dropdownEl.classList.remove('invisible', 'dropdown-closed');
        dropdownEl.classList.add('visible', 'dropdown-open');
        // Usar cssText para sobrescrever completamente qualquer estilo inline do React
        dropdownEl.style.cssText = `
          position: absolute !important;
          z-index: 99999 !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          height: auto !important;
          overflow: visible !important;
          top: 100% !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          margin-top: 4px !important;
          width: 90vw !important;
          max-width: 900px !important;
        `;
        console.log('useEffect: Estilos aplicados. Computed:', {
          display: window.getComputedStyle(dropdownEl).display,
          visibility: window.getComputedStyle(dropdownEl).visibility,
          opacity: window.getComputedStyle(dropdownEl).opacity,
          zIndex: window.getComputedStyle(dropdownEl).zIndex
        });
      } else {
        console.error('useEffect: Dropdown element NÃO encontrado para:', openDropdown);
      }
      
      // Também forçar após requestAnimationFrame para garantir
      requestAnimationFrame(() => {
        const dropdownElRAF = document.querySelector(`[data-dropdown-id="${openDropdown}"]`) as HTMLElement;
        if (dropdownElRAF) {
          dropdownElRAF.setAttribute('data-dropdown-open', 'true');
          dropdownElRAF.classList.remove('invisible', 'dropdown-closed');
          dropdownElRAF.classList.add('visible', 'dropdown-open');
          // Usar cssText para sobrescrever completamente qualquer estilo inline do React
          dropdownElRAF.style.cssText = `
            position: absolute !important;
            z-index: 99999 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            height: auto !important;
            overflow: visible !important;
            top: 100% !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            margin-top: 4px !important;
            width: 90vw !important;
            max-width: 900px !important;
          `;
        }
      });
      
      // Usar MutationObserver para garantir que as classes sejam mantidas
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
            const target = mutation.target as HTMLElement;
            if (target.hasAttribute('data-dropdown-id') && target.getAttribute('data-dropdown-id') === openDropdown) {
              // Verificar se as classes foram removidas
              if (!target.classList.contains('dropdown-open') || !target.classList.contains('visible')) {
                target.classList.remove('invisible', 'dropdown-closed');
                target.classList.add('visible', 'dropdown-open');
                target.setAttribute('data-dropdown-open', 'true');
                // Usar cssText para sobrescrever completamente qualquer estilo inline do React
                target.style.cssText = `
                  position: absolute !important;
                  z-index: 99999 !important;
                  display: block !important;
                  visibility: visible !important;
                  opacity: 1 !important;
                  pointer-events: auto !important;
                  height: auto !important;
                  overflow: visible !important;
                  top: 100% !important;
                  left: 50% !important;
                  transform: translateX(-50%) !important;
                  margin-top: 4px !important;
                  width: 90vw !important;
                  max-width: 900px !important;
                `;
              }
            }
          }
        });
      });
      
      // Observar o dropdown aberto
      const dropdownToObserve = document.querySelector(`[data-dropdown-id="${openDropdown}"]`) as HTMLElement;
      if (dropdownToObserve) {
        observer.observe(dropdownToObserve, {
          attributes: true,
          attributeFilter: ['class', 'style'],
          subtree: false
        });
      }
      
      // Limpar observer quando o dropdown fechar
      return () => {
        observer.disconnect();
      };
    } else {
      // Fechar todos os dropdowns quando openDropdown é null
      const allDropdowns = document.querySelectorAll('[data-dropdown-id]') as NodeListOf<HTMLElement>;
      allDropdowns.forEach(dropdown => {
        dropdown.classList.remove('visible');
        dropdown.classList.add('invisible');
        dropdown.style.setProperty('visibility', 'hidden', 'important');
        dropdown.style.setProperty('opacity', '0', 'important');
        dropdown.style.setProperty('pointer-events', 'none', 'important');
      });
    }
  }, [openDropdown]);


  // Função para atualizar busca de uma categoria específica

  const handleCategorySearch = (categoryKey: string, value: string) => {

    setCategorySearch(prev => ({

      ...prev,

      [categoryKey]: value

    }));

  };



  // Função para filtrar itens baseado na busca

  const filterItems = (items: string[], searchValue: string) => {

    if (!searchValue) return items;

    return items.filter(item => 

      item.toLowerCase().includes(searchValue.toLowerCase())

    );

  };


  // #region agent log
  useEffect(() => {
    const logNavRender = () => {
      if (navRef.current && navContainerRef.current && navListRef.current) {
        const navComputed = window.getComputedStyle(navRef.current);
        const containerComputed = window.getComputedStyle(navContainerRef.current);
        const listComputed = window.getComputedStyle(navListRef.current);
        fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:262',message:'Nav render initial state',data:{
          viewportWidth: window.innerWidth,
          navStyles: {width: navComputed.width, maxWidth: navComputed.maxWidth, overflowX: navComputed.overflowX, boxSizing: navComputed.boxSizing},
          containerStyles: {width: containerComputed.width, maxWidth: containerComputed.maxWidth, overflowX: containerComputed.overflowX, paddingLeft: containerComputed.paddingLeft, paddingRight: containerComputed.paddingRight, boxSizing: containerComputed.boxSizing},
          listStyles: {width: listComputed.width, maxWidth: listComputed.maxWidth, overflowX: listComputed.overflowX, boxSizing: listComputed.boxSizing}
        },timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B'})}).catch(()=>{});
      }
    };
    const timeout = setTimeout(logNavRender, 200);
    return () => clearTimeout(timeout);
  }, []);
  // #endregion

  // Função para fechar o banner
  const handleCloseBanner = () => {
    setIsBannerVisible(false);
    // Salvar preferência no localStorage
    localStorage.setItem('promo-banner-closed', 'true');
  };


  return (

    <>

      {/* Mini Banner de Destaque */}

      {isBannerVisible && (
        <div 
          ref={miniBannerRef} 
          className="fixed top-0 left-0 right-0 bg-gradient-to-r from-primary-600 via-primary-700 to-blue-600 border-b border-primary-800 z-[10000] banner-shimmer overflow-hidden animate-fade-in" 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, width: '100%' }}
        >
        <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-2.5 relative z-10">

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 relative">
              {/* Botão de fechar */}
              <button
                onClick={handleCloseBanner}
                className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
                aria-label="Fechar banner"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="text-center pr-6 sm:pr-8 md:pr-12 flex-1 min-w-0">
                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-extrabold text-white mb-1 sm:mb-0.5 tracking-tight leading-tight">
                🎉 Mega Promoção Monstrinho Misterioso

              </p>

                <p className="text-[9px] sm:text-[10px] md:text-xs text-white/95 font-medium leading-tight px-1">
                A cada <span className="font-bold text-white">R$400,00</span> em compra, leve um <span className="font-bold text-white">Labubu Misterioso</span> grátis!

              </p>

            </div>

            

            <button 

              onClick={() => navigateRouter('/catalogo')}

                className="group bg-white hover:bg-gray-50 active:bg-gray-100 text-primary-600 font-semibold px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 whitespace-nowrap text-[9px] sm:text-[10px] md:text-xs shadow-md hover:shadow-lg hover:scale-105 active:scale-100 relative z-10 border border-transparent hover:border-white/20 touch-manipulation min-h-[36px] sm:min-h-[40px]"
              >
                <span className="flex items-center gap-1 sm:gap-1.5">
                  <span className="hidden sm:inline">Confira Agora</span>
                  <span className="sm:hidden">Ver</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </span>

            </button>

          </div>

        </div>

      </div>

      )}


      <header ref={headerRef} className={`fixed left-0 right-0 z-[9998] bg-white shadow-sm border-b border-gray-100 w-full overflow-x-hidden h-14 sm:h-16 md:h-20 lg:h-24 transition-all duration-300 ${isBannerVisible ? 'top-[67px]' : 'top-0'}`} style={{ maxWidth: '100vw', overflowX: 'hidden', overflowY: 'visible', overflow: 'visible', width: '100%', boxSizing: 'border-box' }}>
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 max-w-7xl flex items-center justify-between gap-2 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-5 h-14 sm:h-16 md:h-20 lg:h-24" style={{ overflowX: 'hidden', overflowY: 'visible', overflow: 'visible', width: '100%', boxSizing: 'border-box' }}>
          {/* Logo */}

          <div 

            className="cursor-pointer flex-shrink-0 min-w-0"

            onClick={() => navigateRouter('/')}

          >

            <img 

              src={LOGO_URL} 

              alt="White Cloud Brasil" 

              className="h-10 sm:h-12 md:h-16 lg:h-[70px] w-auto object-contain transition-transform hover:scale-105"
              onError={(e) => {

                // Fallback caso a imagem não exista
                e.currentTarget.style.display = 'none';

                e.currentTarget.parentElement!.innerHTML = '<span class="text-base sm:text-lg md:text-xl lg:text-2xl font-black tracking-tighter text-gray-900">WHITE CLOUD <span class="text-primary-600">BRASIL</span></span>';
              }}

            />

          </div>



          {/* Search Bar (Desktop) */}

          <div className="hidden lg:flex flex-1 max-w-2xl relative min-w-0">

            <input

              type="text"

              placeholder="Pesquise seu produto na White Cloud :)"

              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"

              value={searchTerm}

              onChange={(e) => setSearchTerm(e.target.value)}

            />

            <button 

              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"

              aria-label="Buscar produtos"

            >

              <Search className="w-4 h-4" />

            </button>

          </div>



          {/* User Actions - Mobile Optimized */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-3 xl:gap-4 text-sm font-medium text-gray-700 flex-shrink-0 min-w-0">
             {/* Login/Cadastro Button - Visible on md+ screens, appears in hamburger menu on smaller screens */}
             <button 

              className="hidden md:flex items-center hover:text-primary-600 transition-colors min-h-[44px] cursor-pointer"
              onClick={() => navigateRouter('/conta')}

              aria-label="Entrar ou criar conta"

             >

               <User className="w-5 h-5 md:w-6 md:h-6 mr-2" />
               <div className="flex flex-col items-start leading-tight">

                 <span className="text-xs md:text-sm font-medium">Entrar</span>
                 <span className="text-[10px] text-gray-500">ou criar conta</span>

               </div>

             </button>



             {/* White Club Button - Visible on md+ screens, appears in hamburger menu on smaller screens */}
             <button 

              className="hidden md:flex items-center hover:text-primary-600 transition-colors min-h-[44px] cursor-pointer"
              onClick={() => navigateRouter('/white-club')}

              aria-label="White Club"

             >

               <div className="relative">
                 <Star className="w-5 h-5 md:w-6 md:h-6" />
               </div>

               <span className="ml-2 leading-none text-xs md:text-sm">
                 White Club

               </span>

             </button>



             {/* Mobile Actions - Right side */}
             {/* Mobile Search Button */}
             <button 
               className="lg:hidden p-1.5 sm:p-2 text-gray-700 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center touch-manipulation hover:text-primary-600 transition-colors"
               onClick={() => setIsSearchOpen(true)}
               aria-label="Buscar produtos"
             >
               <Search className="w-5 h-5 sm:w-6 sm:h-6" />
             </button>

             <button 

              className="relative cursor-pointer flex items-center justify-center hover:text-primary-600 transition-colors min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] p-1.5 sm:p-2 touch-manipulation"
              onClick={() => navigateRouter('/favoritos')}

              aria-label="Ver favoritos"

             >

                <div className="relative">
                   <Heart className="w-5 h-5 sm:w-6 sm:h-6" />

                   <FavoritesBadge />

                </div>

             </button>



             <button 

              className="relative cursor-pointer flex items-center justify-center hover:text-primary-600 transition-colors min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] p-1.5 sm:p-2 touch-manipulation"
              onClick={() => setIsCartOpen(true)}

              aria-label="Abrir carrinho"

             >

                <div className="relative">
                   <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />

                   <CartBadge />

                </div>

             </button>

             {/* Mobile Menu Trigger - Moved to right */}
             <button 
               className="lg:hidden p-1.5 sm:p-2 text-gray-700 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center touch-manipulation" 
               onClick={() => setIsMenuOpen(true)}
               aria-label="Abrir menu"
               aria-expanded={isMenuOpen}
             >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
             </button>

          </div>

        </div>



        {/* Desktop Navigation Bar */}

        <nav ref={navRef} className={`hidden lg:block border-t border-gray-100 bg-white fixed left-0 right-0 z-[9997] w-full overflow-x-hidden transition-all duration-300 ${isBannerVisible ? 'top-[163px]' : 'top-[96px]'}`} style={{ overflowX: 'hidden', overflowY: 'visible', overflow: 'visible', width: '100%', position: 'fixed', boxSizing: 'border-box' }}>
          <div ref={navContainerRef} className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto overflow-x-hidden flex justify-center" style={{ overflowX: 'hidden', overflowY: 'visible', overflow: 'visible', width: '100%', maxWidth: '100%', boxSizing: 'border-box', textAlign: 'center', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', minWidth: 0 }}>
            <ul 
              ref={(el) => {
                navListRef.current = el;
                if (el) {
                  // Forçar flex-wrap: wrap imediatamente quando o elemento é montado
                  el.style.setProperty('flex-wrap', 'wrap', 'important');
                  el.classList.add('flex-wrap');
                  el.classList.remove('flex-nowrap');
                }
              }}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-gray-600 py-4 sm:py-5 overflow-x-hidden" 
              style={{ maxWidth: '100%', overflowX: 'hidden', overflowY: 'visible', overflow: 'visible', flexWrap: 'wrap', boxSizing: 'border-box', display: 'flex', margin: 0, padding: 0, listStyle: 'none', minHeight: '58px', textAlign: 'center', verticalAlign: 'middle' }}>
              {CATEGORIES.map(cat => {
                // #region agent log
                if (cat.hasDropdown) {
                  fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:category:render',message:'Category render',data:{categoryId:cat.id,hasDropdown:cat.hasDropdown,openDropdown,isOpen:openDropdown === cat.id,hasSubmenu:!!cat.submenu,submenuType:cat.submenu ? (cat.submenu.categories ? 'categories' : cat.submenu.sections ? 'sections' : cat.submenu.items ? 'items' : 'none') : 'none',submenuCategoriesCount:cat.submenu?.categories?.length || 0,submenuSectionsCount:cat.submenu?.sections?.length || 0,submenuItemsCount:cat.submenu?.items?.length || 0},timestamp:Date.now(),sessionId:'debug-session',runId:'dropdown-menu-debug',hypothesisId:'MENU1'})}).catch(()=>{});
                }
                // #endregion
                return (
                <li 

                  key={cat.id} 

                  className="relative z-[100]"

                  onMouseEnter={(e) => {
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:li:onMouseEnter',message:'Mouse entered li element',data:{categoryId:cat.id,hasDropdown:cat.hasDropdown,willCallHandleMouseEnter:cat.hasDropdown,targetTagName:e.target.tagName,targetClassName:(e.target as HTMLElement).className},timestamp:Date.now(),sessionId:'debug-session',runId:'dropdown-menu-debug',hypothesisId:'MENU5'})}).catch(()=>{});
                    // #endregion
                    // Não usar stopPropagation aqui para permitir que o evento chegue ao botão também
                    if (cat.hasDropdown) {
                      handleMouseEnter(cat.id);
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    handleMouseLeave();
                  }}
                  style={{ flexShrink: 1, minWidth: 0, maxWidth: '100%', whiteSpace: 'nowrap', margin: 0, padding: 0, overflow: 'visible', overflowX: 'visible', overflowY: 'visible', position: 'relative', pointerEvents: 'auto' }}
                >

                  {cat.hasDropdown ? (

                    <>

                  <button 

                        className={`hover:text-primary-600 transition-colors py-1 px-2 relative uppercase flex items-center gap-1 whitespace-nowrap text-xs ${cat.isHighlight ? 'text-white bg-gradient-to-r from-primary-600 to-primary-700 px-2 sm:px-3 rounded-full hover:from-primary-800 hover:to-primary-900 hover:text-white highlight-button-shimmer transition-all duration-300 ease-in-out' : ''}`}

                        style={{ overflow: 'hidden', flexShrink: 1, minWidth: 0, maxWidth: '100%', width: 'auto', margin: 0, textOverflow: 'ellipsis', pointerEvents: 'auto' }}
                        onMouseEnter={(e) => {
                          // #region agent log
                          fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:button:onMouseEnter',message:'Mouse entered button element',data:{categoryId:cat.id,hasDropdown:cat.hasDropdown,willCallHandleMouseEnter:cat.hasDropdown},timestamp:Date.now(),sessionId:'debug-session',runId:'dropdown-menu-debug',hypothesisId:'MENU7'})}).catch(()=>{});
                          // #endregion
                          e.stopPropagation();
                          if (cat.hasDropdown) {
                            handleMouseEnter(cat.id);
                          }
                        }}
                      >

                        <span className={cat.isHighlight ? 'relative z-10' : ''}>{cat.name}</span>

                        <ChevronDown className={`w-3 h-3 opacity-60 transition-all duration-300 ${openDropdown === cat.id ? 'opacity-100 rotate-180' : ''}`} />

                        {!cat.isHighlight && <span className={`absolute bottom-0 left-0 h-0.5 bg-primary-500 transition-all ${openDropdown === cat.id ? 'w-full' : 'w-0'}`}></span>}

                      </button>

                      

                      {/* Dropdown Menu - Design Moderno */}

                      <div 

                        data-dropdown-id={cat.id}

                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[90vw] max-w-[900px] bg-white rounded-xl shadow-2xl border border-gray-200 z-[99999] overflow-x-hidden ${
                          openDropdown === cat.id 

                            ? 'translate-y-0' 
                            : '-translate-y-2'
                        }`}
                        style={{
                          position: 'absolute',
                          zIndex: 99999,
                          display: 'block',
                          visibility: openDropdown === cat.id ? 'visible' : 'hidden',
                          opacity: openDropdown === cat.id ? 1 : 0,
                          pointerEvents: openDropdown === cat.id ? 'auto' : 'none'
                        }}
                        // NÃO controlar dropdown-open/dropdown-closed aqui
                        // O React sobrescreve as classes que adicionamos via JavaScript
                        // Essas serão controladas apenas via JavaScript direto no DOM
                        onMouseEnter={() => {
                          // Cancelar o timeout quando o mouse entra no dropdown
                          if (closeTimeoutRef.current) {
                            clearTimeout(closeTimeoutRef.current);
                            closeTimeoutRef.current = null;
                          }
                          // Garantir que o dropdown permaneça aberto
                          setOpenDropdown(cat.id);
                        }}
                        onMouseLeave={handleMouseLeave}
                        ref={(el) => {

                          if (el) {
                            const isOpen = openDropdown === cat.id;
                            // Forçar visibilidade se o dropdown está aberto
                            if (isOpen) {
                              el.setAttribute('data-dropdown-open', 'true');
                              el.classList.remove('invisible', 'dropdown-closed');
                              el.classList.add('visible', 'dropdown-open');
                              // Usar cssText para sobrescrever completamente qualquer estilo inline do React
                              el.style.cssText = `
                                position: absolute !important;
                                z-index: 99999 !important;
                                display: block !important;
                                visibility: visible !important;
                                opacity: 1 !important;
                                pointer-events: auto !important;
                                height: auto !important;
                                overflow: visible !important;
                                top: 100% !important;
                                left: 50% !important;
                                transform: translateX(-50%) !important;
                                margin-top: 4px !important;
                                width: 90vw !important;
                                max-width: 900px !important;
                              `;
                            } else {
                              // Limpar interval se existir
                              if ((el as any).__forceInterval) {
                                clearInterval((el as any).__forceInterval);
                                delete (el as any).__forceInterval;
                              }
                            }
                          }
                        }}
                      >

                        {/* Padding invisível no topo para facilitar transição do mouse */}

                        <div 
                          className="absolute -top-4 left-0 right-0 h-4 pointer-events-auto"
                          onMouseEnter={() => {
                            // Cancelar o timeout quando o mouse entra na área de transição
                            if (closeTimeoutRef.current) {
                              clearTimeout(closeTimeoutRef.current);
                              closeTimeoutRef.current = null;
                            }
                            // Garantir que o dropdown permaneça aberto
                            setOpenDropdown(cat.id);
                          }}
                        ></div>
                        <div className="overflow-hidden">

                        {/* Header do Dropdown melhorado com gradiente sutil e campo de busca */}
                        <div className="bg-gradient-to-r from-primary-50 via-blue-50 to-primary-50 border-b-2 border-primary-100 px-6 sm:px-8 py-5 sm:py-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                            <div>

                              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-wide">
                                {cat.name}

                              </h3>

                              <p className="text-xs sm:text-sm text-gray-600 mt-1.5 font-medium">Explore nossa seleção completa</p>
                            </div>

                          </div>

                          

                          {/* Campo de busca único melhorado */}
                          <div className="relative">

                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input

                              type="text"

                              placeholder="Buscar em todas as categorias..."

                              value={categorySearch[cat.id] || ''}

                              onChange={(e) => handleCategorySearch(cat.id, e.target.value)}

                              className="w-full pl-11 pr-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white shadow-sm hover:shadow-md"
                              onClick={(e) => e.stopPropagation()}

                            />

                          </div>

                        </div>



                        <div className="p-6 sm:p-8 lg:p-10">
                          {cat.submenu?.categories ? (

                            // Menu com categorias organizadas (Juices) - Layout melhorado
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
                              {cat.submenu.categories.map((category, idx) => {

                                const searchValue = categorySearch[cat.id] || '';

                                const filteredItems = filterItems(category.items, searchValue);

                                

                                return (

                                  <div key={idx} className="group/category">

                                    {/* Título da categoria melhorado */}
                                    <div className="flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-primary-200 group-hover/category:border-primary-500 transition-colors duration-300">
                                      <div className="w-2 h-2 rounded-full bg-primary-500 group-hover/category:bg-primary-600 transition-colors duration-300"></div>
                                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">
                                        {category.title}

                                      </h4>

                                    </div>

                                    

                                    {/* Lista de itens filtrados melhorada */}
                                    <ul className="space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                                      {filteredItems.length > 0 ? (

                                        filteredItems.map((item, itemIdx) => (

                                          <li key={itemIdx}>

                                            <button

                                              onClick={() => {
                                                navigateRouter('/catalogo');
                                                setOpenDropdown(null);
                                              }}
                                              className="text-xs sm:text-sm text-gray-600 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 text-left w-full px-3 py-2 rounded-md group/item relative overflow-hidden"
                                            >
                                              <span className="relative z-10 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/item:bg-primary-500 transition-colors duration-200 flex-shrink-0"></span>
                                                {item}

                                              </span>

                                              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 group-hover/item:w-full transition-all duration-300"></span>
                                            </button>

                                          </li>

                                        ))

                                      ) : (

                                        <li className="text-xs text-gray-400 py-3 text-center">
                                          Nenhum item encontrado

                                        </li>

                                      )}

                                    </ul>

                                  </div>

                                );

                              })}

                            </div>

                          ) : cat.submenu?.sections ? (

                            // Menu com seções (SaltNic) - Layout em 2 colunas melhorado
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
                              {cat.submenu.sections.map((section, idx) => {

                                const searchValue = categorySearch[cat.id] || '';

                                const filteredItems = filterItems(section.items, searchValue);

                                

                                return (

                                  <div key={idx} className="group/section">

                                    {/* Título da seção melhorado */}
                                    <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-primary-200 group-hover/section:border-primary-500 transition-colors duration-300">
                                      <div className="w-2 h-2 rounded-full bg-primary-500 group-hover/section:bg-primary-600 transition-colors duration-300"></div>
                                      <h4 className="font-bold text-gray-900 text-base sm:text-lg uppercase tracking-wider">
                                        {section.title}

                                      </h4>

                                    </div>

                                    

                                    {/* Grid de itens em 2 colunas filtrados melhorado */}
                                    <ul className="grid grid-cols-2 gap-x-5 gap-y-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                                      {filteredItems.length > 0 ? (

                                        filteredItems.map((item, itemIdx) => (

                                          <li key={itemIdx}>

                                            <button

                                              onClick={() => {
                                                navigateRouter('/catalogo');
                                                setOpenDropdown(null);
                                              }}
                                              className="text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 text-left w-full px-4 py-2.5 rounded-lg group/item relative overflow-hidden hover:shadow-sm"
                                            >
                                              <span className="relative z-10 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/item:bg-primary-500 transition-colors duration-200 flex-shrink-0"></span>
                                                {item}

                                              </span>

                                              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 group-hover/item:w-full transition-all duration-300"></span>
                                            </button>

                                          </li>

                                        ))

                                      ) : (

                                        <li className="col-span-2 text-sm text-gray-400 py-4 text-center">

                                          Nenhum item encontrado

                                        </li>

                                      )}

                                    </ul>

                                  </div>

                                );

                              })}

                            </div>

                          ) : (

                            // Menu simples (Pods, Coils, etc.) - Layout em grid moderno melhorado
                            <div>

                              {/* Campo de busca global para menu simples melhorado */}
                              <div className="mb-6">
                                <div className="relative">

                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                                  <input

                                    type="text"

                                    placeholder="Buscar..."

                                    value={categorySearch[cat.id] || ''}

                                    onChange={(e) => handleCategorySearch(cat.id, e.target.value)}

                                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                                    onClick={(e) => e.stopPropagation()}

                                  />

                                </div>

                              </div>

                              

                              {/* Grid de itens filtrados melhorado */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                {filterItems(cat.submenu?.items || [], categorySearch[cat.id] || '').length > 0 ? (

                                  filterItems(cat.submenu?.items || [], categorySearch[cat.id] || '').map((item, idx) => (

                                    <button

                                      key={idx}

                                      onClick={() => {
                                        navigateRouter('/catalogo');
                                        setOpenDropdown(null);
                                      }}
                                      className="group/item relative p-4 rounded-lg border-2 border-gray-200 hover:border-primary-300 hover:bg-gradient-to-br hover:from-primary-50 hover:to-blue-50 transition-all duration-200 text-left shadow-sm hover:shadow-md"
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-2 h-2 rounded-full bg-gray-300 group-hover/item:bg-primary-500 transition-colors duration-200"></div>
                                        <span className="text-sm font-medium text-gray-700 group-hover/item:text-primary-700 transition-colors duration-200">
                                          {item}

                                        </span>

                                      </div>

                                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover/item:w-full transition-all duration-300"></div>
                                    </button>

                                  ))

                                ) : (

                                  <div className="col-span-2 sm:col-span-3 lg:col-span-4 text-sm text-gray-400 py-6 text-center">
                                    Nenhum item encontrado

                                  </div>

                                )}

                              </div>

                            </div>

                          )}

                        </div>



                        {/* Footer do Dropdown melhorado */}
                        <div className="bg-gradient-to-r from-gray-50 to-primary-50/30 border-t-2 border-primary-100 px-6 py-4">
                          <button

                            onClick={() => {
                              navigateRouter('/catalogo');
                              setOpenDropdown(null);
                            }}
                            className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-2 group w-full justify-center sm:justify-start transition-all duration-200 hover:gap-3"
                          >
                            <span>Ver todos os produtos</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                          </button>

                        </div>

                        </div>

                      </div>

                    </>

                  ) : (

                    // Link simples (Promoções e Perfumes)

                    <button 

                      onClick={() => navigateRouter('/catalogo')}

                      className={`hover:text-primary-600 transition-colors py-1 px-2 relative uppercase whitespace-nowrap text-xs ${cat.isHighlight ? 'text-white bg-gradient-to-r from-primary-600 to-primary-700 px-2 sm:px-3 rounded-full hover:from-primary-800 hover:to-primary-900 hover:text-white highlight-button-shimmer transition-all duration-300 ease-in-out' : ''}`}

                     style={{ overflow: 'visible', flexShrink: 1, minWidth: 0, maxWidth: '100%', width: 'auto', margin: 0 }}
                    >

                      <span className={cat.isHighlight ? 'relative z-10' : ''}>{cat.name}</span>

                    {!cat.isHighlight && <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>}

                  </button>

                  )}

                </li>

                );
              })}
            </ul>

          </div>

        </nav>

      </header>



      {/* Mobile Menu Overlay & Drawer */}

      <div 

        className={`fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${

          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'

        }`}

        onClick={() => setIsMenuOpen(false)}

      />



      <aside 

        className={`fixed top-0 left-0 z-[10001] h-full w-[90%] sm:w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'

        }`}

      >

        <div className="flex flex-col h-full">

          {/* Mobile Menu Header */}

          <div className="flex items-center justify-between p-3 sm:p-4 md:p-5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
            <img 

              src={LOGO_URL} 

              alt="White Cloud Brasil" 

              className="h-10 sm:h-12 w-auto object-contain"
              onError={(e) => {

                e.currentTarget.style.display = 'none';

                e.currentTarget.parentElement!.innerHTML = '<span class="text-base sm:text-lg font-black tracking-tighter text-gray-900">WHITE CLOUD <span class="text-primary-600">BRASIL</span></span>';
              }}

            />

            <button 

              onClick={() => setIsMenuOpen(false)}

              className="p-1.5 sm:p-2 text-gray-500 hover:text-red-500 hover:bg-gray-200 rounded-full transition-colors touch-manipulation min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center"
              aria-label="Fechar menu"

            >

              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

          </div>



          {/* Scrollable Content */}

          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {/* Mobile Search */}

            <div className="mb-4 sm:mb-6 relative">
              <input

                type="text"

                placeholder="Buscar produtos..."

                className="w-full bg-gray-100 border-none rounded-lg py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                value={searchTerm}

                onChange={(e) => setSearchTerm(e.target.value)}

              />

              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

            </div>



            {/* Mobile Account Links */}

            <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100">
              <button 

                onClick={() => { navigateRouter('/conta'); setIsMenuOpen(false); }}
                className="flex items-center w-full py-2.5 sm:py-3 text-gray-700 font-medium hover:text-primary-600 hover:bg-gray-50 rounded-lg px-2 transition-colors touch-manipulation min-h-[44px]"
              >

                <div className="bg-primary-50 p-2 rounded-full mr-3 flex-shrink-0">
                   <User className="w-5 h-5 text-primary-600" />
                </div>

                <div className="flex flex-col items-start">
                  <span className="text-sm sm:text-base">Entrar</span>
                  <span className="text-xs text-gray-500">ou criar conta</span>
                </div>
              </button>

              <button 

                onClick={() => { navigateRouter('/white-club'); setIsMenuOpen(false); }}
                className="flex items-center w-full py-2.5 sm:py-3 text-gray-700 font-medium hover:text-primary-600 hover:bg-gray-50 rounded-lg px-2 mt-2 transition-colors touch-manipulation min-h-[44px]"
              >

                <div className="bg-yellow-50 p-2 rounded-full mr-3 flex-shrink-0">
                   <Star className="w-5 h-5 text-yellow-600" />
                </div>

                <span className="text-sm sm:text-base">White Club</span>
              </button>



              <button 

                onClick={() => { navigateRouter('/favoritos'); setIsMenuOpen(false); }}
                className="flex items-center w-full py-2.5 sm:py-3 text-gray-700 font-medium hover:text-primary-600 hover:bg-gray-50 rounded-lg px-2 mt-2 transition-colors touch-manipulation min-h-[44px]"
              >

                <div className="bg-red-50 p-2 rounded-full mr-3 relative flex-shrink-0">
                   <Heart className="w-5 h-5 text-red-500" />
                   <FavoritesBadge />
                </div>

                <span className="text-sm sm:text-base">Meus Favoritos</span>
              </button>

            </div>



            {/* Mobile Categories */}

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 sm:mb-3 px-2">Categorias</h3>
            <div className="space-y-1">

              {CATEGORIES.map(cat => (

                <button 

                  key={cat.id} 

                  onClick={() => { navigateRouter('/catalogo'); setIsMenuOpen(false); }}

                  className={`flex items-center justify-between w-full text-left py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors touch-manipulation min-h-[44px] ${
                    cat.isHighlight 

                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold highlight-button-shimmer' 

                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 active:bg-gray-100'
                  }`}

                >

                  <span className={`text-sm sm:text-base ${cat.isHighlight ? 'relative z-10' : ''}`}>{cat.name}</span>
                  {!cat.isHighlight && <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 flex-shrink-0" />}
                </button>

              ))}

            </div>
          </div>



          {/* Mobile Menu Footer */}

          <div className="p-5 border-t border-gray-100 bg-gray-50 text-center">

            <p className="text-xs text-gray-400">Â© 2025 White Cloud Brasil</p>

          </div>

        </div>

      </aside>

      {/* Mobile Search Drawer */}
      <div 
        className={`fixed inset-0 z-[10002] bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          isSearchOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center gap-3 p-3 sm:p-4 border-b border-gray-200 bg-white">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Pesquise seu produto na White Cloud..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400 text-sm min-h-[44px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.trim()) {
                  navigateRouter('/catalogo');
                  setIsSearchOpen(false);
                }
              }}
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Fechar busca"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cart Drawer */}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

    </>

  );

};



const ProductCard: React.FC<{ 

  product: Product; 

  onClick: () => void;

  onQuickView?: (product: Product) => void;

  onQuickAdd?: (product: Product) => void;

  showTimer?: boolean;
  timerEndDate?: Date;
}> = ({ product, onClick, onQuickView, onQuickAdd, showTimer = false, timerEndDate }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const [hoverImageLoaded, setHoverImageLoaded] = useState(false);

  const { toggleFavorite, isFavorite } = useFavorites();

  const { showSuccess } = useToast();

  const hasSecondImage = product.images && product.images.length > 1;

  const mainImage = product.images[0];

  const hoverImage = hasSecondImage ? product.images[1] : null;

  const favorited = isFavorite(product.id);



  const handleToggleFavorite = (e: React.MouseEvent) => {

    e.stopPropagation();

    toggleFavorite(product);

    if (favorited) {

      showSuccess(`${product.name} removido dos favoritos`);

    } else {

      showSuccess(`${product.name} adicionado aos favoritos`);

    }

  };



  return (

    <div 

      className="group bg-white rounded-lg sm:rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full w-full min-w-[187px] relative hover:shadow-xl sm:hover:shadow-2xl hover:scale-[1.01] sm:hover:scale-[1.02] hover:border-primary-200 hover:z-10"
      onClick={onClick}

    >

      {/* Floating Badges */}

      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">

        {product.originalPrice && (

          <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm">

            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%

          </span>

        )}

        {product.isNew && (

          <span className="bg-blue-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm">

            NOVO

          </span>

        )}

      </div>



      {/* BotÃ£o de Favorito */}

      <button

        onClick={handleToggleFavorite}

        className="absolute top-2 right-2 z-30 p-2 sm:p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95 border border-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center"

        aria-label={favorited ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`}

      >

        <Heart 

          className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${

            favorited 

              ? 'fill-red-500 text-red-500' 

              : 'text-gray-400 hover:text-red-400'

          }`}

        />

      </button>



      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">

        {/* Placeholder Skeleton */}

        <div className={`absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />

        

        {/* Imagem principal */}

        <img 

          src={mainImage} 

          alt={product.name} 

          loading="lazy"

          decoding="async"

          onLoad={() => setImageLoaded(true)}

          className={`object-cover w-full h-full group-hover:scale-105 transition-all duration-700 ${

            imageLoaded ? 'opacity-100' : 'opacity-0'

          } ${hasSecondImage && hoverImageLoaded ? 'group-hover:opacity-0' : ''}`}

        />

        

        {/* Imagem hover (segunda imagem) */}

        {hasSecondImage && hoverImage && (

          <img 

            src={hoverImage} 

            alt={`${product.name} - Vista alternativa`} 

            loading="lazy"

            decoding="async"

            onLoad={() => setHoverImageLoaded(true)}

            className={`absolute inset-0 object-cover w-full h-full transition-all duration-700 group-hover:scale-105 ${

              hoverImageLoaded ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'

            }`}

          />

        )}

        

        {/* Overlay com botÃµes no hover */}

        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex items-center justify-center">

          <div className="flex flex-col gap-3 px-4 w-full max-w-[200px]">

            <button 

              className="w-full bg-white text-gray-900 px-4 py-2.5 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg min-h-[44px]"

              onClick={(e) => {

                e.stopPropagation();

                if (onQuickView) {

                  onQuickView(product);

                }

              }}

              aria-label="Compra rápida"

            >

              <Eye className="w-4 h-4" />

              <span className="hidden sm:inline">Compra rápida</span>

              <span className="sm:hidden">Ver</span>

            </button>

            

            <button 

              className="w-full bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors shadow-lg min-h-[44px]"

              onClick={(e) => {

                e.stopPropagation();

                onClick(); // Sempre navega para a página do produto

              }}

              aria-label="Ver detalhes do produto"

            >

              <ShoppingCart className="w-4 h-4" />

              Comprar

            </button>

          </div>

        </div>

      </div>



      <div className="p-3 sm:p-4 lg:p-5 xl:p-6 flex flex-col flex-1">

        {/* Tag de Miligramagem */}
        {product.nicotine && Array.isArray(product.nicotine) && product.nicotine.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {product.nicotine.map((mg, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-primary-100 text-primary-700 border border-primary-200"
              >
                {mg}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-medium text-sm sm:text-base text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-primary-600 transition-colors">

          {product.name}

        </h3>

        <div className="mt-auto">

          {showTimer && timerEndDate && (
            <div className="mb-3 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200/60 rounded-lg sm:rounded-xl px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 w-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <OfferTimer endDate={timerEndDate} size="small" />
            </div>
          )}

          {product.originalPrice && (

            <span className="text-[10px] sm:text-xs text-gray-400 line-through block mb-0.5">

              R$ {product.originalPrice.toFixed(2)}

            </span>

          )}

          <div className="flex items-end gap-2">

            <span className="text-base sm:text-lg font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>

            <span className="text-[10px] sm:text-xs text-gray-500 mb-1">Ã  vista</span>

          </div>

          <p className="text-[9px] sm:text-[10px] text-gray-400 mt-1">

            ou em até 12x no cartão

          </p>

        </div>

      </div>

    </div>

  );

};


// Componente de visualização em lista
const ProductListItem: React.FC<{
  product: Product;
  onClick: () => void;
  onQuickView?: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
}> = ({ product, onClick, onQuickView, onQuickAdd }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showSuccess } = useToast();
  const mainImage = product.images[0];
  const favorited = isFavorite(product.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product);
    if (favorited) {
      showSuccess(`${product.name} removido dos favoritos`);
    } else {
      showSuccess(`${product.name} adicionado aos favoritos`);
    }
  };

  return (
    <div
      className="group bg-white rounded-lg sm:rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col sm:flex-row h-full w-full relative hover:shadow-xl hover:border-primary-200 touch-manipulation"
      onClick={onClick}
    >
      {/* Imagem */}
      <div className="relative w-full sm:w-48 md:w-56 lg:w-64 h-48 sm:h-auto sm:flex-shrink-0 bg-gray-50 overflow-hidden">
        <div className={`absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />
        <img
          src={mainImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`object-cover w-full h-full transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.originalPrice && (
            <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-blue-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm">
              NOVO
            </span>
          )}
        </div>

        {/* Botão de Favorito */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 z-30 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95 border border-gray-200 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center touch-manipulation"
          aria-label={favorited ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`}
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${
              favorited
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 hover:text-red-400'
            }`}
          />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col">
        {/* Tags de Nicotina */}
        {product.nicotine && Array.isArray(product.nicotine) && product.nicotine.length > 0 && (
          <div className="mb-2 sm:mb-3 flex flex-wrap gap-1.5">
            {product.nicotine.map((mg, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-semibold bg-primary-100 text-primary-700 border border-primary-200"
              >
                {mg}
              </span>
            ))}
          </div>
        )}

        {/* Nome do Produto */}
        <h3 className="font-semibold text-base sm:text-lg md:text-xl text-gray-900 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Descrição (opcional) */}
        {product.description && (
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 hidden sm:block">
            {product.description}
          </p>
        )}

        {/* Preço e Ações */}
        <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through mb-1">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                R$ {product.price.toFixed(2)}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">à vista</span>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
              ou em até 12x no cartão
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {onQuickView && (
              <button
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-colors shadow-sm hover:shadow-md min-h-[44px] touch-manipulation"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(product);
                }}
                aria-label="Compra rápida"
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Compra rápida</span>
                <span className="sm:hidden">Ver</span>
              </button>
            )}
            <button
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-colors shadow-sm hover:shadow-md min-h-[44px] touch-manipulation"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              aria-label="Comprar produto"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const HeroSlider = () => {

  const { navigate } = useApp();

  const [current, setCurrent] = useState(0);

  const [isAutoPlay, setIsAutoPlay] = useState(true);



  const displayBanners = HERO_BANNERS;



  useEffect(() => {

    if (displayBanners.length === 0 || !isAutoPlay) return;

    const timer = setInterval(() => {

      setCurrent(prev => (prev + 1) % displayBanners.length);

    }, 5000);

    return () => clearInterval(timer);

  }, [displayBanners.length, isAutoPlay]);



  const goToNext = () => {

    setIsAutoPlay(false);

    setCurrent(prev => (prev + 1) % displayBanners.length);

    // Retomar autoplay após 10 segundos

    setTimeout(() => setIsAutoPlay(true), 10000);

  };



  const goToPrev = () => {

    setIsAutoPlay(false);

    setCurrent(prev => (prev - 1 + displayBanners.length) % displayBanners.length);

    // Retomar autoplay após 10 segundos

    setTimeout(() => setIsAutoPlay(true), 10000);

  };



  if (displayBanners.length === 0) {

    return null;

  }



  return (

    <div className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[400px] 2xl:h-[450px] w-full overflow-hidden bg-gray-900 group z-0">
      <div 

        className="flex transition-transform duration-700 ease-out h-full" 

        style={{ transform: `translateX(-${current * 100}%)` }}

      >

        {displayBanners.map((banner) => (

          <div key={banner.id} className="w-full h-full flex-shrink-0 relative">

            {/* Background Image - Responsivo com Picture Element */}

            <picture className="absolute inset-0 w-full h-full">

              {/* Imagem Mobile (até 768px) */}

              <source 

                media="(max-width: 768px)" 

                srcSet={banner.imageMobile || banner.image}

              />

              {/* Imagem Desktop (acima de 768px) */}

              <source 

                media="(min-width: 769px)" 

                srcSet={banner.image}

              />

              {/* Fallback para navegadores que não suportam picture */}

              <img 

                src={banner.image} 

                alt={banner.title} 

                className="absolute inset-0 w-full h-full object-cover" 

              />

            </picture>

          </div>

        ))}

      </div>



      {/* Navigation Arrows */}

      <button

        onClick={goToPrev}

        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 md:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center"

        aria-label="Banner anterior"

      >

        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />

      </button>

      <button

        onClick={goToNext}

        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 md:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center"

        aria-label="Próximo banner"

      >

        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />

      </button>



      {/* Navigation Dots - Melhorado para Mobile */}

      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-0 w-full flex justify-center gap-1.5 sm:gap-2 px-4">
        {displayBanners.map((_, idx) => (

          <button

            key={idx}

            className="rounded-full transition-all duration-300 flex items-center justify-center"
            onClick={() => {

              setIsAutoPlay(false);

              setCurrent(idx);

              setTimeout(() => setIsAutoPlay(true), 10000);

            }}

            aria-label={`Ir para slide ${idx + 1}`}

          >

            {/* Elemento visual interno - permite controle preciso do tamanho */}

            <span

              className={`rounded-full transition-all duration-300 block ${

                current === idx 

                  ? 'bg-white w-6 h-1.5 shadow-md' 
                  : 'bg-white/40 w-1.5 h-1.5 hover:bg-white/70 hover:scale-125'
              }`}

            />

          </button>

        ))}

      </div>

    </div>

  );

};



const SectionHeader = ({ title, linkText = "Ver todos", onLinkClick }: { title: string, linkText?: string, onLinkClick: () => void }) => (

  <div className="flex items-center justify-between mb-6 sm:mb-8 lg:mb-10 xl:mb-12 pb-4 border-b border-gray-100">

    <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 relative pl-4">

      <span className="absolute left-0 top-1 w-1 h-6 bg-primary-500 rounded-full"></span>

      {title}

    </h2>

    <button onClick={onLinkClick} className="text-sm font-medium text-gray-500 hover:text-primary-600 flex items-center group">

      {linkText} <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />

    </button>

  </div>

);


// Componente de Timer de Oferta
const OfferTimer = ({ endDate, size = 'default' }: { endDate: Date; size?: 'default' | 'small' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = endDate.getTime();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  const isSmall = size === 'small';
  const textSize = isSmall ? 'text-[7px] sm:text-[8px] md:text-[9px]' : 'text-xs sm:text-sm';
  const numberSize = isSmall ? 'text-[9px] sm:text-[10px] md:text-xs' : 'text-sm sm:text-base';
  const gap = isSmall ? 'gap-0.5 sm:gap-1' : 'gap-1 sm:gap-2';
  const iconSize = isSmall ? 'w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5' : 'w-4 h-4';

  return (
    <div className={`flex items-center flex-wrap ${gap} ${textSize} font-semibold leading-tight`}>
      <Calendar className={`${iconSize} text-orange-600 flex-shrink-0`} />
      <span className="text-orange-600 whitespace-nowrap">TERMINA EM:</span>
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <span className={`bg-orange-600 text-white px-0.5 sm:px-1 md:px-1.5 py-0.5 rounded font-bold ${numberSize} min-w-[1.5em] text-center`}>
          {String(timeLeft.days).padStart(2, '0')}D
        </span>
        <span className="text-orange-600 text-[8px] sm:text-[9px]">:</span>
        <span className={`bg-orange-600 text-white px-0.5 sm:px-1 md:px-1.5 py-0.5 rounded font-bold ${numberSize} min-w-[1.5em] text-center`}>
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-orange-600 text-[8px] sm:text-[9px]">:</span>
        <span className={`bg-orange-600 text-white px-0.5 sm:px-1 md:px-1.5 py-0.5 rounded font-bold ${numberSize} min-w-[1.5em] text-center`}>
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-orange-600 text-[8px] sm:text-[9px]">:</span>
        <span className={`bg-orange-600 text-white px-0.5 sm:px-1 md:px-1.5 py-0.5 rounded font-bold ${numberSize} min-w-[1.5em] text-center`}>
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};


// --- AI EDITOR COMPONENT ---



// --- HOME SECTIONS ---



const Home = ({ onQuickView, onQuickAdd }: { onQuickView?: (product: Product) => void; onQuickAdd?: (product: Product) => void }) => {

  const { setActiveCategory } = useApp();

  const navigateRouter = useNavigateRouter();

  const { products } = useProducts();

  const [isLoading, setIsLoading] = useState(false);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const [isAutoPlay, setIsAutoPlay] = useState(true);

  

  const testimonials = [

    {

      name: 'Maria Silva',

      rating: 5,

      comment: 'Produtos de excelente qualidade! Entrega super rápida e o atendimento é impecável. Recomendo muito!',

      location: 'São Paulo, SP',

      verified: true

    },

    {

      name: 'João Santos',

      rating: 5,

      comment: 'Melhor loja de vapes que já comprei. Variedade incrível e preços justos. Já sou cliente há mais de 2 anos!',

      location: 'Rio de Janeiro, RJ',

      verified: true

    },

    {

      name: 'Ana Costa',

      rating: 5,

      comment: 'Adorei a experiência de compra! Site fácil de usar, produtos chegando bem embalados e em perfeito estado.',

      location: 'Belo Horizonte, MG',

      verified: true

    },

    {

      name: 'Pedro Oliveira',

      rating: 5,

      comment: 'Atendimento excepcional e produtos originais. Sempre compro aqui e nunca tive problemas. 5 estrelas!',

      location: 'Curitiba, PR',

      verified: true

    },

    {

      name: 'Juliana Ferreira',

      rating: 5,

      comment: 'Amo os juices da White Cloud! Sabores incríveis e qualidade premium. Vale cada centavo investido.',

      location: 'Porto Alegre, RS',

      verified: true

    },

    {

      name: 'Carlos Mendes',

      rating: 5,

      comment: 'Loja confiável e produtos de primeira linha. Já indiquei para vários amigos e todos ficaram satisfeitos!',

      location: 'Brasília, DF',

      verified: true

    }

  ];



  // Autoplay do carrossel de depoimentos

  useEffect(() => {

    if (!isAutoPlay || testimonials.length === 0) return;

    const timer = setInterval(() => {

      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);

    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(timer);

  }, [isAutoPlay, testimonials.length]);



  const goToNextTestimonial = () => {

    setIsAutoPlay(false);

    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);

    setTimeout(() => setIsAutoPlay(true), 10000);

  };



  const goToPrevTestimonial = () => {

    setIsAutoPlay(false);

    setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);

    setTimeout(() => setIsAutoPlay(true), 10000);

  };



  const goToTestimonial = (index: number) => {

    setIsAutoPlay(false);

    setCurrentTestimonial(index);

    setTimeout(() => setIsAutoPlay(true), 10000);

  };

  

  const handleProductClick = (id: string) => {

    navigateRouter(`/produto/${id}`);

  };

  

  // Simular loading inicial (pode ser removido quando houver API real)

  useEffect(() => {

    setIsLoading(true);

    const timer = setTimeout(() => setIsLoading(false), 500);

    return () => clearTimeout(timer);

  }, []);

  

  if (isLoading) {

    return (

      <div className="space-y-16 pb-16">

        <div className="container mx-auto px-4">

          <ProductGridSkeleton count={5} />

        </div>

      </div>

    );

  }



  return (

  <div className="space-y-12 sm:space-y-16 pb-12 sm:pb-16">

    {/* 2. Hero Slider */}

    <HeroSlider />



    {/* 3. Feature Bar */}

    <section className="bg-white border-b border-gray-100">

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 max-w-7xl py-3 sm:py-4 md:py-5 lg:py-6 xl:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">

          {[

            { icon: Truck, title: "Envio para todo Brasil", sub: "Entrega expressa e rastreada" },

            { icon: CreditCard, title: "Compra Facilitada", sub: "Parcelamos em até 12x" },

            { icon: ShieldCheck, title: "Compra 100% Segura", sub: "Seus dados protegidos" },

          ].map((item, idx) => (

            <div key={idx} className="flex items-center justify-center space-x-3 pt-3 md:pt-0">

              <div className="text-primary-600">

                <item.icon className="w-8 h-8 stroke-[1.5]" />

              </div>

              <div>

                <h3 className="font-bold text-gray-900 text-sm sm:text-base">{item.title}</h3>

                <p className="text-xs sm:text-sm text-gray-500">{item.sub}</p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>



    {/* 4. New Arrivals */}

    <section className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 max-w-7xl py-4 sm:py-6 md:py-8 lg:py-10">
      <SectionHeader title="Novidades Chegando" onLinkClick={() => navigateRouter('/catalogo')} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5">

        {(products || []).slice(0, 5).map(product => (
          <ProductCard 

            key={product.id} 

            product={{...product, isNew: true}} 

            onClick={() => handleProductClick(product.id)}

            onQuickView={onQuickView}

            onQuickAdd={onQuickAdd}

          />

        ))}

      </div>

    </section>



    {/* 5. Promotional Banners */}

    <section className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 max-w-7xl py-4 sm:py-6 md:py-8 lg:py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">

        <div className="relative aspect-[2.5/1] sm:aspect-[2.8/1] md:aspect-[2.6/1] lg:aspect-[2.7/1] rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300">
          <img src="/images/banner01.svg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Promoção Pod Systems" loading="lazy" />
        </div>

        <div className="relative aspect-[2.5/1] sm:aspect-[2.8/1] md:aspect-[2.6/1] lg:aspect-[2.7/1] rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300">
          <img src="/images/banner02.svg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Promoção Premium Juices" loading="lazy" onError={(e) => {
            // Fallback para banner01 se banner02 não existir
            e.currentTarget.src = '/images/banner01.png';
          }} />
        </div>

      </div>

    </section>



    {/* 6. Best Sellers Layout */}

    <section className="bg-gray-50 py-8 sm:py-12 lg:py-16 xl:py-20">

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 max-w-7xl">

        <SectionHeader title="Os Mais Vendidos" onLinkClick={() => navigateRouter('/catalogo')} />

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr] 2xl:grid-cols-[280px_1fr] gap-3 lg:gap-4 xl:gap-5 w-full">

          {/* Banner Vertical */}

          <div className="hidden lg:block">

            <div 

              onClick={() => navigateRouter('/catalogo')}

              className="h-full min-h-[400px] bg-gradient-to-br from-primary-600 via-primary-700 to-blue-600 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group relative"

            >

              {/* Imagem de fundo ou gradiente */}

              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/90 to-blue-600/90"></div>

              

              {/* Conteúdo do banner */}

              <div className="relative h-full flex flex-col justify-between p-6 lg:p-8 xl:p-10 text-white">

                <div>

                  <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border border-white/30">

                    <span className="text-sm font-black tracking-wider">🔥 DESTAQUE</span>

                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight">

                    Produtos em Destaque

                  </h3>

                  <p className="text-white/90 text-sm mb-4 leading-relaxed">

                    Descubra os produtos mais vendidos e aproveite nossas ofertas especiais!

                  </p>

                </div>

                

                <div className="mt-auto">

                  <div className="flex items-center gap-2 text-white/90 group-hover:text-white transition-colors">

                    <span className="font-semibold text-base">Ver todos</span>

                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />

                  </div>

                </div>

              </div>

              

              {/* Efeito shimmer */}

              <div className="absolute inset-0 banner-shimmer pointer-events-none"></div>

            </div>

          </div>

          

          {/* Grid de Produtos */}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5">
            {(products || []).filter(p => p.isBestSeller).slice(0, 4).map(product => (

              <ProductCard 

                key={product.id} 

                product={product} 

                onClick={() => handleProductClick(product.id)}

                onQuickView={onQuickView}

                onQuickAdd={onQuickAdd}

              />

            ))}

          </div>

        </div>

      </div>

    </section>



    {/* 7. Best Offers */}

    <section className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 max-w-7xl py-4 sm:py-6 md:py-8 lg:py-10">
      <div className="mb-6 sm:mb-8 lg:mb-10 xl:mb-12 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 relative pl-4">
            <span className="absolute left-0 top-1 w-1 h-6 bg-primary-500 rounded-full"></span>
            Ofertas Relâmpago
          </h2>
          <div className="flex items-center gap-4">
            <OfferTimer endDate={new Date(Date.now() + 13 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000 + 16 * 60 * 1000 + 41 * 1000)} />
            <button onClick={() => navigateRouter('/catalogo')} className="text-sm font-medium text-gray-500 hover:text-primary-600 flex items-center group">
              Ver todos <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5">

        {(products || []).map(product => (

           <ProductCard 

             key={`offer-${product.id}`} 

             product={{...product, price: product.price * 0.8, originalPrice: product.price}} 

             onClick={() => handleProductClick(product.id)}

             onQuickView={onQuickView}

             onQuickAdd={onQuickAdd}

             showTimer={true}
             timerEndDate={new Date(Date.now() + 13 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000 + 16 * 60 * 1000 + 41 * 1000)}
           />

        )).slice(0, 5)}
      </div>

    </section>



    {/* 8. Customer Favorites */}

    <section className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 max-w-7xl py-4 sm:py-6 md:py-8 lg:py-10">
      <SectionHeader title="Queridinhos dos Clientes" onLinkClick={() => navigateRouter('/catalogo')} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5">

        {(products || []).slice(0, 5).map(product => (
           <ProductCard 

             key={`fav-${product.id}`} 

             product={product} 

             onClick={() => handleProductClick(product.id)}

             onQuickView={onQuickView}

             onQuickAdd={onQuickAdd}

           />

        ))}

      </div>

    </section>



    {/* 10. Depoimentos de Clientes - Carrossel */}

    <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">

      <div className="text-center mb-8 sm:mb-12">

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">

          O Que Nossos Clientes Dizem

        </h2>

        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">

          Mais de 10.000 clientes satisfeitos confiam na White Cloud Brasil

        </p>

      </div>

      

      <div className="relative max-w-5xl mx-auto">
        {/* Card do Depoimento */}

        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
          {/* Gradiente de fundo aprimorado */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/40 via-white to-blue-50/30 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-blue-500" />
          
          {/* Botões de Navegação - Design aprimorado */}
          <button

            onClick={goToPrevTestimonial}

            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-primary-50 backdrop-blur-sm rounded-full p-2 sm:p-2.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center border border-gray-200 hover:border-primary-300 group"
            aria-label="Depoimento anterior"

          >

            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
          </button>

          

          <button

            onClick={goToNextTestimonial}

            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-primary-50 backdrop-blur-sm rounded-full p-2 sm:p-2.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center border border-gray-200 hover:border-primary-300 group"
            aria-label="Próximo depoimento"

          >

            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
          </button>



          {/* Conteúdo do Depoimento com animação */}

          <div key={currentTestimonial} className="animate-fade-in relative z-10">

            {/* Header com estrelas - Design aprimorado */}
            <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (

                  <Star

                    key={i}

                    className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400 text-amber-400 drop-shadow-sm"
                  />

                ))}

              </div>

            </div>

            

            {/* Comentário - Design mais moderno e legível */}
            <div className="relative mb-6 sm:mb-8 px-2 sm:px-4">
              <div className="absolute -top-2 -left-1 sm:-top-3 sm:-left-2 text-5xl sm:text-6xl md:text-7xl text-primary-100/60 font-serif leading-none select-none">"</div>
              <blockquote className="text-base sm:text-lg md:text-xl lg:text-base text-gray-800 leading-relaxed text-center relative z-10 font-light italic px-2 sm:px-4">
                {testimonials[currentTestimonial].comment}

              </blockquote>
              <div className="absolute -bottom-2 -right-1 sm:-bottom-3 sm:-right-2 text-5xl sm:text-6xl md:text-7xl text-primary-100/60 font-serif leading-none select-none">"</div>
            </div>

            

            {/* Footer com avatar, nome e localização - Design mais elegante */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-200">
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-primary-100">
                <img 

                  src={`https://i.pravatar.cc/128?img=${currentTestimonial + 1}`}

                  alt={testimonials[currentTestimonial].name}

                  className="w-full h-full object-cover"

                  onError={(e) => {

                    const target = e.currentTarget;

                    target.style.display = 'none';

                    if (target.parentElement) {

                        target.parentElement.innerHTML = `<span class="text-white font-bold text-base sm:text-lg">${testimonials[currentTestimonial].name.charAt(0)}</span>`;
                        target.parentElement.className = 'w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0 shadow-md ring-2 ring-primary-100';
                    }

                  }}

                />

              </div>

                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-white" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-bold text-base sm:text-lg text-gray-900 mb-0.5">
                  {testimonials[currentTestimonial].name}

                </p>

                <div className="flex items-center justify-center sm:justify-start gap-1 text-xs sm:text-sm text-gray-500">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500" />
                  <span className="font-medium">{testimonials[currentTestimonial].location}</span>
                </div>
              </div>

            </div>

          </div>

        </div>



        {/* Indicadores (Dots) */}

        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
          {testimonials.map((_, idx) => (

            <button

              key={idx}

              onClick={() => goToTestimonial(idx)}

              className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                idx === currentTestimonial

                  ? 'w-6 h-1.5 bg-primary-600 shadow-md'
                  : 'w-1.5 h-1.5 bg-gray-300 hover:bg-primary-400 hover:scale-125'
              }`}

              aria-label={`Ir para depoimento ${idx + 1}`}

            />

          ))}

        </div>



        {/* Contador */}

        <div className="text-center mt-4">

          <span className="text-sm text-gray-500">

            {currentTestimonial + 1} de {testimonials.length}

          </span>

        </div>

      </div>

    </section>



    {/* 9. Brand Strip */}

    <section className="border-t border-b border-gray-100 bg-white py-8 sm:py-12 overflow-hidden">

      <div className="container mx-auto px-3 sm:px-4">

        <h3 className="text-center font-bold text-gray-400 text-sm tracking-widest uppercase mb-8">As Melhores Marcas</h3>

        <div className="relative">

          <div className="flex animate-scroll-left items-center gap-8 md:gap-12">

            {/* Primeira linha de logos */}

            {BRANDS.map((brand, idx) => (

              <img key={idx} src={brand.logo} alt={brand.name} className="h-8 md:h-12 object-contain hover:scale-110 transition-transform cursor-pointer flex-shrink-0" />

            ))}

            {/* Duplicar para scroll infinito */}

            {BRANDS.map((brand, idx) => (

              <img key={`duplicate-${idx}`} src={brand.logo} alt={brand.name} className="h-8 md:h-12 object-contain hover:scale-110 transition-transform cursor-pointer flex-shrink-0" />

            ))}

          </div>

        </div>

      </div>

    </section>

  </div>

  );

};



// --- OTHER VIEWS (Simplified for brevity, maintaining functionality) ---



const FinalizeOrderPage = () => {

  const { cart, cartTotal } = useCart();

  const navigateRouter = useNavigateRouter();

  const { showSuccess, showError } = useToast();

  

  // Estados do formulário

  const [formData, setFormData] = useState({

    firstName: 'Nicolas',

    lastName: 'Rachid',

    cpf: '134.729.036-27',

    birthDate: '19/96/1219',

    gender: '',

    country: 'Brasil',

    zipCode: '',

    address: '',

    number: '',

    complement: '',

    neighborhood: '',

    city: '',

    state: 'São Paulo',

    phone: '(32) 99161-3714',

    email: 'nicolasrachido@gmail.com',

    orderNotes: '',

  });



  const [showCouponBanner, setShowCouponBanner] = useState(true);

  const [couponCode, setCouponCode] = useState('');

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const [differentShippingAddress, setDifferentShippingAddress] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('pix');

  const [termsAccepted, setTermsAccepted] = useState(false);



  // Estados do cartão de crédito

  const [cardData, setCardData] = useState({

    cardNumber: '1234 1234 1234 1234',

    cardholderName: '',

    expiryMonth: '12',

    expiryYear: '2025',

    cvv: '123',

    installments: '12',

  });



  // Estados do endereço de entrega

  const [shippingAddress, setShippingAddress] = useState({

    firstName: '',

    lastName: '',

    companyName: '',

    country: 'Brasil',

    zipCode: '',

    address: '',

    number: '',

    complement: '',

    neighborhood: '',

    city: '',

    state: 'São Paulo',

  });



  // Calcular subtotal

  const subtotal = useMemo(() => {

    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  }, [cart]);



  // Calcular desconto PIX (5%)

  const pixDiscount = useMemo(() => {

    return paymentMethod === 'pix' ? subtotal * 0.05 : 0;

  }, [subtotal, paymentMethod]);



  // Calcular total

  const total = useMemo(() => {

    return subtotal - pixDiscount;

  }, [subtotal, pixDiscount]);



  const handleInputChange = (field: string, value: string) => {

    setFormData(prev => ({ ...prev, [field]: value }));

  };



  const handleShippingAddressChange = (field: string, value: string) => {

    setShippingAddress(prev => ({ ...prev, [field]: value }));

  };



  const formatCPF = (value: string) => {

    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 11) {

      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

    }

    return value;

  };



  const formatPhone = (value: string) => {

    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 11) {

      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

    }

    return value;

  };



  const formatDate = (value: string) => {

    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 8) {

      return numbers.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');

    }

    return value;

  };



  const formatCEP = (value: string) => {

    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 8) {

      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');

    }

    return value;

  };



  const formatCardNumber = (value: string) => {

    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 16) {

      return numbers.replace(/(\d{4})(?=\d)/g, '$1 ');

    }

    return value;

  };



  const handleCardDataChange = (field: string, value: string) => {

    setCardData(prev => ({ ...prev, [field]: value }));

  };



  // Calcular parcelas

  const installments = useMemo(() => {

    const installmentsList = [];

    for (let i = 1; i <= 12; i++) {

      const installmentValue = total / i;

      const totalValue = total;

      installmentsList.push({

        value: i.toString(),

        label: i === 1 

          ? `À vista R$ ${totalValue.toFixed(2).replace('.', ',')}`

          : `${i}x de R$ ${installmentValue.toFixed(2).replace('.', ',')} (R$ ${totalValue.toFixed(2).replace('.', ',')})`

      });

    }

    return installmentsList;

  }, [total]);



  // Meses do ano

  const months = [

    { value: '01', label: '01 | Janeiro' },

    { value: '02', label: '02 | Fevereiro' },

    { value: '03', label: '03 | Março' },

    { value: '04', label: '04 | Abril' },

    { value: '05', label: '05 | Maio' },

    { value: '06', label: '06 | Junho' },

    { value: '07', label: '07 | Julho' },

    { value: '08', label: '08 | Agosto' },

    { value: '09', label: '09 | Setembro' },

    { value: '10', label: '10 | Outubro' },

    { value: '11', label: '11 | Novembro' },

    { value: '12', label: '12 | Dezembro' },

  ];



  // Anos (próximos 10 anos)

  const years = useMemo(() => {

    const currentYear = new Date().getFullYear();

    return Array.from({ length: 10 }, (_, i) => (currentYear + i).toString());

  }, []);



  const handleApplyCoupon = () => {

    if (!couponCode.trim()) {

      showError('Digite um código de cupom');

      return;

    }

    setAppliedCoupon(couponCode);

    showSuccess('Cupom aplicado com sucesso!');

  };



  const handleFinalizeOrder = () => {

    if (!termsAccepted) {

      showError('Você precisa aceitar os termos e condições');

      return;

    }

    // Aqui você processaria o pedido

    showSuccess('Pedido finalizado com sucesso!');

    // navigateRouter('/pedido-confirmado');

  };



  if (cart.length === 0) {

    return (

      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">

        <div className="text-center py-20">

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h2>

          <Button onClick={() => navigateRouter('/catalogo')} className="min-h-[44px]">

            Continuar Comprando

          </Button>

        </div>

      </div>

    );

  }



  // Estados brasileiros

  const brazilianStates = [

    'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',

    'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',

    'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',

    'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',

    'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'

  ];



  return (

    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Finalizar Compra</h1>



      {/* Banner de Cupom */}

      {showCouponBanner && (

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">

          <div className="flex items-start gap-3">

            <input

              type="checkbox"

              id="coupon-banner"

              checked={false}

              onChange={() => setShowCouponBanner(false)}

              className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"

            />

            <label htmlFor="coupon-banner" className="flex-1 text-sm text-gray-700 cursor-pointer">

              Você tem um cupom de desconto? Clique aqui e informe o código do seu cupom de desconto

            </label>

            <button

              onClick={() => setShowCouponBanner(false)}

              className="text-gray-400 hover:text-gray-600"

            >

              <X className="w-5 h-5" />

            </button>

          </div>

        </div>

      )}



      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

        {/* Coluna Esquerda - Detalhes de Cobrança */}

        <div className="flex-1">

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">

            <h2 className="text-xl font-bold text-gray-900 mb-6">Detalhes de cobrança</h2>



            <div className="space-y-8">
              {/* Seção: Dados Gerais */}
            <div className="space-y-4">

                <h3 className="text-base font-semibold text-gray-800 mb-4">Dados Gerais</h3>

              {/* Nome e Sobrenome */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">

                    Nome* <span className="text-red-500">*</span>

                  </label>

                  <input

                    id="firstName"

                    type="text"

                    value={formData.firstName}

                    onChange={(e) => handleInputChange('firstName', e.target.value)}

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                  />

                </div>

                <div>

                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">

                    Sobrenome* <span className="text-red-500">*</span>

                  </label>

                  <input

                    id="lastName"

                    type="text"

                    value={formData.lastName}

                    onChange={(e) => handleInputChange('lastName', e.target.value)}

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                  />

                </div>

              </div>



              {/* CPF e Data de Nascimento */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">

                    CPF* <span className="text-red-500">*</span>

                  </label>

                  <input

                    id="cpf"

                    type="text"

                    value={formData.cpf}

                    onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}

                    maxLength={14}

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                  />

                </div>

                <div>

                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">

                    Data de Nascimento* <span className="text-red-500">*</span>

                  </label>

                  <input

                    id="birthDate"

                    type="text"

                    value={formData.birthDate}

                    onChange={(e) => handleInputChange('birthDate', formatDate(e.target.value))}

                    placeholder="DD/MM/AAAA"

                    maxLength={10}

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                  />

                </div>

              </div>



              {/* Gênero e País */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">

                    Gênero* <span className="text-red-500">*</span>

                  </label>

                  <select

                    id="gender"

                    value={formData.gender}

                    onChange={(e) => handleInputChange('gender', e.target.value)}

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                  >

                    <option value="">Selecionar</option>

                    <option value="masculino">Masculino</option>

                    <option value="feminino">Feminino</option>

                    <option value="outro">Outro</option>

                    <option value="prefiro-nao-informar">Prefiro não informar</option>

                  </select>

                </div>

                <div>

                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">

                    País* <span className="text-red-500">*</span>

                  </label>

                  <input

                    id="country"

                    type="text"

                    value={formData.country}

                    onChange={(e) => handleInputChange('country', e.target.value)}

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                  />

                  </div>
                </div>

              </div>



              {/* Seção: Endereço */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Endereço</h3>

              {/* CEP */}

              <div>

                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">

                  CEP* <span className="text-red-500">*</span>

                </label>

                <input

                  id="zipCode"

                  type="text"

                  value={formData.zipCode}

                  onChange={(e) => handleInputChange('zipCode', formatCEP(e.target.value))}

                  maxLength={9}

                  placeholder="00000-000"

                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                />

              </div>



              {/* Endereço e Número */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div className="sm:col-span-2">

                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">

                    Endereço* <span className="text-red-500">*</span>

                  </label>

                  <input

                    id="address"

                    type="text"

                    value={formData.address}

                    onChange={(e) => handleInputChange('address', e.target.value)}

                    placeholder="Nome da rua e número da casa"

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                  />

                </div>

                <div>

                  <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">

                    Número* <span className="text-red-500">*</span>

                  </label>

                  <input

                    id="number"

                    type="text"

                    value={formData.number}

                    onChange={(e) => handleInputChange('number', e.target.value)}

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                  />

                </div>

              </div>



              {/* Complemento e Bairro */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-2">

                    Apartamento, suíte, unidade, etc. (opcional)

                  </label>

                  <input

                    id="complement"

                    type="text"

                    value={formData.complement}

                    onChange={(e) => handleInputChange('complement', e.target.value)}

                    placeholder="Apartamento, suíte, unidade, etc."

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                  />

                </div>

                <div>

                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">

                    Bairro (opcional)

                  </label>

                  <input

                    id="neighborhood"

                    type="text"

                    value={formData.neighborhood}

                    onChange={(e) => handleInputChange('neighborhood', e.target.value)}

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                  />

                </div>

              </div>



              {/* Cidade e Estado */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">

                    Cidade* <span className="text-red-500">*</span>

                  </label>

                  <input

                    id="city"

                    type="text"

                    value={formData.city}

                    onChange={(e) => handleInputChange('city', e.target.value)}

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                  />

                </div>

                <div>

                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">

                    Estado* <span className="text-red-500">*</span>

                  </label>

                  <select

                    id="state"

                    value={formData.state}

                    onChange={(e) => handleInputChange('state', e.target.value)}

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                  >

                    {brazilianStates.map(state => (

                      <option key={state} value={state}>{state}</option>

                    ))}

                  </select>

                  </div>
                </div>

              </div>



              {/* Seção: Contato */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Contato</h3>

              {/* Telefone e Email */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">

                    Telefone* <span className="text-red-500">*</span>

                  </label>

                  <input

                    id="phone"

                    type="text"

                    value={formData.phone}

                    onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}

                    maxLength={15}

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                  />

                </div>

                <div>

                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">

                    Endereço de e-mail* <span className="text-red-500">*</span>

                  </label>

                  <input

                    id="email"

                    type="email"

                    value={formData.email}

                    onChange={(e) => handleInputChange('email', e.target.value)}

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                  />

                  </div>
                </div>

              </div>



              {/* Seção: Observações */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Observações</h3>

              {/* Notas do Pedido */}

              <div>

                <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-700 mb-2">

                  Notas de Pedido (opcional)

                </label>

                <textarea

                  id="orderNotes"

                  value={formData.orderNotes}

                  onChange={(e) => handleInputChange('orderNotes', e.target.value)}

                  rows={4}

                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"

                  placeholder="Notas sobre seu pedido, por exemplo, instruções especiais para entrega."

                />

                </div>
              </div>

            </div>

          </div>

        </div>



        {/* Coluna Direita - Resumo e Pagamento */}

        <div className="w-full lg:w-96 flex-shrink-0">

          {/* Checkbox Endereço Diferente */}

          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">

            <label className="flex items-center gap-3 cursor-pointer">

              <input

                type="checkbox"

                checked={differentShippingAddress}

                onChange={(e) => setDifferentShippingAddress(e.target.checked)}

                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"

              />

              <span className="text-sm text-gray-700">Entregar em um endereço diferente?</span>

            </label>

          </div>



          {/* Campos de Endereço de Entrega */}

          {differentShippingAddress && (

            <div className="bg-primary-50 rounded-lg border border-primary-200 p-6 mb-6">

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço de Entrega</h3>

              

              <div className="space-y-4">

                {/* Nome e Sobrenome */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>

                    <label htmlFor="shippingFirstName" className="block text-sm font-medium text-gray-700 mb-2">

                      Nome* <span className="text-red-500">*</span>

                    </label>

                    <input

                      id="shippingFirstName"

                      type="text"

                      value={shippingAddress.firstName}

                      onChange={(e) => handleShippingAddressChange('firstName', e.target.value)}

                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                    />

                  </div>

                  <div>

                    <label htmlFor="shippingLastName" className="block text-sm font-medium text-gray-700 mb-2">

                      Sobrenome* <span className="text-red-500">*</span>

                    </label>

                    <input

                      id="shippingLastName"

                      type="text"

                      value={shippingAddress.lastName}

                      onChange={(e) => handleShippingAddressChange('lastName', e.target.value)}

                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                    />

                  </div>

                </div>



                {/* Nome da Empresa */}

                <div>

                  <label htmlFor="shippingCompanyName" className="block text-sm font-medium text-gray-700 mb-2">

                    Nome da empresa (opcional)

                  </label>

                  <input

                    id="shippingCompanyName"

                    type="text"

                    value={shippingAddress.companyName}

                    onChange={(e) => handleShippingAddressChange('companyName', e.target.value)}

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                  />

                </div>



                {/* País */}

                <div>

                  <label htmlFor="shippingCountry" className="block text-sm font-medium text-gray-700 mb-2">

                    País* <span className="text-red-500">*</span>

                  </label>

                  <input

                    id="shippingCountry"

                    type="text"

                    value={shippingAddress.country}

                    onChange={(e) => handleShippingAddressChange('country', e.target.value)}

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                    readOnly

                  />

                </div>



                {/* CEP */}

                <div>

                  <label htmlFor="shippingZipCode" className="block text-sm font-medium text-gray-700 mb-2">

                    CEP* <span className="text-red-500">*</span>

                  </label>

                  <input

                    id="shippingZipCode"

                    type="text"

                    value={shippingAddress.zipCode}

                    onChange={(e) => handleShippingAddressChange('zipCode', formatCEP(e.target.value))}

                    maxLength={9}

                    placeholder="00000-000"

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                  />

                </div>



                {/* Endereço e Número */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <div className="sm:col-span-2">

                    <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-2">

                      Endereço* <span className="text-red-500">*</span>

                    </label>

                    <input

                      id="shippingAddress"

                      type="text"

                      value={shippingAddress.address}

                      onChange={(e) => handleShippingAddressChange('address', e.target.value)}

                      placeholder="Nome da rua e número da casa"

                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                    />

                  </div>

                  <div>

                    <label htmlFor="shippingNumber" className="block text-sm font-medium text-gray-700 mb-2">

                      Número* <span className="text-red-500">*</span>

                    </label>

                    <input

                      id="shippingNumber"

                      type="text"

                      value={shippingAddress.number}

                      onChange={(e) => handleShippingAddressChange('number', e.target.value)}

                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                    />

                  </div>

                </div>



                {/* Complemento e Bairro */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>

                    <label htmlFor="shippingComplement" className="block text-sm font-medium text-gray-700 mb-2">

                      Apartamento, suíte, unidade, etc. (opcional)

                    </label>

                    <input

                      id="shippingComplement"

                      type="text"

                      value={shippingAddress.complement}

                      onChange={(e) => handleShippingAddressChange('complement', e.target.value)}

                      placeholder="Apartamento, suíte, sala, etc. (opcional)"

                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                    />

                  </div>

                  <div>

                    <label htmlFor="shippingNeighborhood" className="block text-sm font-medium text-gray-700 mb-2">

                      Bairro (opcional)

                    </label>

                    <input

                      id="shippingNeighborhood"

                      type="text"

                      value={shippingAddress.neighborhood}

                      onChange={(e) => handleShippingAddressChange('neighborhood', e.target.value)}

                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                    />

                  </div>

                </div>



                {/* Cidade e Estado */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>

                    <label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700 mb-2">

                      Cidade* <span className="text-red-500">*</span>

                    </label>

                    <input

                      id="shippingCity"

                      type="text"

                      value={shippingAddress.city}

                      onChange={(e) => handleShippingAddressChange('city', e.target.value)}

                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                    />

                  </div>

                  <div>

                    <label htmlFor="shippingState" className="block text-sm font-medium text-gray-700 mb-2">

                      Estado* <span className="text-red-500">*</span>

                    </label>

                    <select

                      id="shippingState"

                      value={shippingAddress.state}

                      onChange={(e) => handleShippingAddressChange('state', e.target.value)}

                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                    >

                      {brazilianStates.map(state => (

                        <option key={state} value={state}>{state}</option>

                      ))}

                    </select>

                  </div>

                </div>

              </div>

            </div>

          )}



          {/* Resumo do Pedido */}

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">

            <h2 className="text-xl font-bold text-gray-900 mb-4">Seu pedido</h2>

            

            <div className="border-b border-gray-200 pb-4 mb-4">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-gray-200">

                    <th className="text-left py-2 text-sm font-semibold text-gray-900">PRODUTO</th>

                    <th className="text-right py-2 text-sm font-semibold text-gray-900">SUBTOTAL</th>

                  </tr>

                </thead>

                <tbody>

                  {cart.map((item) => (

                    <tr key={item.id} className="border-b border-gray-100">

                      <td className="py-3 text-sm text-gray-700">

                        {item.name} {item.selectedNicotine && `- ${item.selectedNicotine}`} * {item.quantity}

                      </td>

                      <td className="py-3 text-sm text-gray-700 text-right">

                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>



            <div className="space-y-3">

              <div className="flex justify-between items-center">

                <span className="text-sm font-medium text-gray-700">SUBTOTAL</span>

                <span className="text-sm font-bold text-gray-900">

                  R$ {subtotal.toFixed(2).replace('.', ',')}

                </span>

              </div>

              

              {paymentMethod === 'pix' && pixDiscount > 0 && (

                <div className="flex justify-between items-center text-green-600">

                  <span className="text-sm font-medium">DESCONTO PARA PIX</span>

                  <span className="text-sm font-bold">-R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>

                </div>

              )}



              <div className="flex justify-between items-center pt-3 border-t border-gray-200">

                <span className="text-lg font-bold text-gray-900">TOTAL</span>

                <span className="text-lg font-bold text-gray-900">

                  R$ {total.toFixed(2).replace('.', ',')}

                </span>

              </div>

            </div>

          </div>



          {/* Métodos de Pagamento */}

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">

            <h2 className="text-xl font-bold text-gray-900 mb-4">Métodos de pagamento</h2>

            

            <div className="space-y-4">

              {/* PIX */}

              <label className="flex items-start gap-3 cursor-pointer p-4 border-2 border-primary-500 rounded-lg bg-primary-50">

                <input

                  type="radio"

                  name="payment"

                  value="pix"

                  checked={paymentMethod === 'pix'}

                  onChange={(e) => setPaymentMethod(e.target.value)}

                  className="mt-1 w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500"

                />

                <div className="flex-1">

                  <div className="font-semibold text-gray-900">Pix (5% de desconto)</div>

                </div>

              </label>



              {/* Instruções PIX */}

              {paymentMethod === 'pix' && (

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">

                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">

                    <li>Finalize a sua compra e abra o app do banco na opção Pix.</li>

                    <li>Aponte a câmera do celular para o QR Code ou copie e cole o código Pix.</li>

                    <li>Confira os dados e confirme o seu pagamento pelo app do Banco.</li>

                    <li>Assim que o pagamento for identificado, enviaremos uma mensagem de confirmação.</li>

                  </ol>

                </div>

              )}



              {/* Cartão de Crédito */}

              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-300 rounded-lg hover:border-primary-500 transition-colors">

                <input

                  type="radio"

                  name="payment"

                  value="credit"

                  checked={paymentMethod === 'credit'}

                  onChange={(e) => setPaymentMethod(e.target.value)}

                  className="w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500"

                />

                <div className="flex items-center gap-2">

                  <CreditCard className="w-5 h-5 text-gray-600" />

                  <span className="font-medium text-gray-900">Cartão de Crédito</span>

                </div>

              </label>



              {/* Formulário de Cartão de Crédito */}

              {paymentMethod === 'credit' && (

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-4">

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pague com o cartão de crédito.</h3>

                  

                  {/* Logos das Bandeiras */}

                  <div className="flex items-center gap-3 mb-6">

                    <div className="text-xs text-gray-600 font-medium">Bandeiras aceitas:</div>

                    <div className="flex items-center gap-2">

                      <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>

                      <div className="w-10 h-6 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>

                      <div className="w-10 h-6 bg-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">ELO</div>

                      <div className="w-10 h-6 bg-yellow-600 rounded flex items-center justify-center text-white text-xs font-bold">AMEX</div>

                      <div className="w-10 h-6 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">HIPER</div>

                      <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-white text-xs font-bold">DC</div>

                    </div>

                  </div>



                  {/* Visualização do Cartão */}

                  <div className="relative mb-6">

                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl p-6 text-white shadow-lg">

                      <div className="flex items-start justify-between mb-8">

                        <div className="w-12 h-8 bg-yellow-400 rounded flex items-center justify-center">

                          <div className="w-8 h-6 bg-yellow-300 rounded-sm"></div>

                        </div>

                        <CreditCard className="w-8 h-8 opacity-80" />

                      </div>

                      <div className="space-y-4">

                        <div>

                          <div className="text-xs text-white/80 mb-1">NÚMERO DO CARTÃO</div>

                          <div className="text-lg font-mono tracking-wider">

                            {cardData.cardNumber || '•••• •••• •••• ••••'}

                          </div>

                        </div>

                        <div>

                          <div className="text-xs text-white/80 mb-1">NOME DO TITULAR</div>

                          <div className="text-base font-medium uppercase">

                            {cardData.cardholderName || 'NOME DO TITULAR'}

                          </div>

                        </div>

                        <div className="flex items-center justify-between">

                          <div>

                            <div className="text-xs text-white/80 mb-1">VALID.</div>

                            <div className="text-sm font-mono">

                              {cardData.expiryMonth || 'MM'}/{cardData.expiryYear || 'AAAA'}

                            </div>

                          </div>

                          <div>

                            <div className="text-xs text-white/80 mb-1">CVV</div>

                            <div className="text-sm font-mono">

                              {cardData.cvv ? '•••' : '•••'}

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>



                  {/* Campos do Formulário */}

                  <div className="space-y-4">

                    {/* Número do Cartão */}

                    <div>

                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">

                        Número do cartão* <span className="text-red-500">*</span>

                      </label>

                      <input

                        id="cardNumber"

                        type="text"

                        value={cardData.cardNumber}

                        onChange={(e) => handleCardDataChange('cardNumber', formatCardNumber(e.target.value))}

                        maxLength={19}

                        placeholder="1234 1234 1234 1234"

                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                      />

                    </div>



                    {/* Nome do Titular */}

                    <div>

                      <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">

                        Nome e sobrenome do titular* <span className="text-red-500">*</span>

                      </label>

                      <input

                        id="cardholderName"

                        type="text"

                        value={cardData.cardholderName}

                        onChange={(e) => handleCardDataChange('cardholderName', e.target.value.toUpperCase())}

                        placeholder="ex.: João Miguel"

                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                      />

                    </div>



                    {/* Mês e Ano de Expiração */}

                    <div className="grid grid-cols-2 gap-4">

                      <div>

                        <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-2">

                          Mês de Expiração* <span className="text-red-500">*</span>

                        </label>

                        <select

                          id="expiryMonth"

                          value={cardData.expiryMonth}

                          onChange={(e) => handleCardDataChange('expiryMonth', e.target.value)}

                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                        >

                          {months.map(month => (

                            <option key={month.value} value={month.value}>{month.label}</option>

                          ))}

                        </select>

                      </div>

                      <div>

                        <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-2">

                          Ano de Expiração* <span className="text-red-500">*</span>

                        </label>

                        <select

                          id="expiryYear"

                          value={cardData.expiryYear}

                          onChange={(e) => handleCardDataChange('expiryYear', e.target.value)}

                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                        >

                          {years.map(year => (

                            <option key={year} value={year}>{year}</option>

                          ))}

                        </select>

                      </div>

                    </div>



                    {/* CVV e Parcelas */}

                    <div className="grid grid-cols-2 gap-4">

                      <div>

                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">

                          Cod. de segurança (CVV)* <span className="text-red-500">*</span>

                        </label>

                        <input

                          id="cvv"

                          type="text"

                          value={cardData.cvv}

                          onChange={(e) => handleCardDataChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}

                          maxLength={4}

                          placeholder="123"

                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                        />

                      </div>

                      <div>

                        <label htmlFor="installments" className="block text-sm font-medium text-gray-700 mb-2">

                          N° de Parcelas* <span className="text-red-500">*</span>

                        </label>

                        <select

                          id="installments"

                          value={cardData.installments}

                          onChange={(e) => handleCardDataChange('installments', e.target.value)}

                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"

                        >

                          {installments.map(inst => (

                            <option key={inst.value} value={inst.value}>{inst.label}</option>

                          ))}

                        </select>

                      </div>

                    </div>

                  </div>

                </div>

              )}



              {/* EQUIPE - WCB */}

              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-300 rounded-lg hover:border-primary-500 transition-colors">

                <input

                  type="radio"

                  name="payment"

                  value="team"

                  checked={paymentMethod === 'team'}

                  onChange={(e) => setPaymentMethod(e.target.value)}

                  className="w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500"

                />

                <span className="font-medium text-gray-900">EQUIPE - WCB</span>

              </label>

            </div>

          </div>



          {/* Termos e Condições */}

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">

            <p className="text-xs text-gray-600 mb-4">

              Seus dados pessoais serão usados para processar seu pedido, apoiar sua experiência em todo este site e para outros fins descritos em nossa política de privacidade.

            </p>

            <label className="flex items-start gap-3 cursor-pointer">

              <input

                type="checkbox"

                checked={termsAccepted}

                onChange={(e) => setTermsAccepted(e.target.checked)}

                className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"

              />

              <span className="text-sm text-gray-700">

                Li e concordo com os termos e condições do site <span className="text-red-500">*</span>

              </span>

            </label>

          </div>



          {/* Botão Finalizar Pedido */}

          <button

            onClick={handleFinalizeOrder}

            disabled={!termsAccepted}

            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors min-h-[44px] text-lg disabled:opacity-50 disabled:cursor-not-allowed"

          >

            FINALIZAR PEDIDO

          </button>

        </div>

      </div>

    </div>

  );

};



const CheckoutPage = () => {

  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  const navigateRouter = useNavigateRouter();

  const [couponCode, setCouponCode] = useState('');

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const [shippingCost, setShippingCost] = useState<number | null>(null);

  const { showSuccess, showError } = useToast();



  // Calcular subtotal

  const subtotal = useMemo(() => {

    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  }, [cart]);



  // Calcular total (subtotal + frete - desconto do cupom)

  const total = useMemo(() => {

    let finalTotal = subtotal;

    if (shippingCost !== null) {

      finalTotal += shippingCost;

    }

    // Aqui você pode adicionar lógica de desconto do cupom se necessário

    return finalTotal;

  }, [subtotal, shippingCost]);



  const handleApplyCoupon = () => {

    if (!couponCode.trim()) {

      showError('Digite um código de cupom');

      return;

    }

    // Simular aplicação de cupom (você pode implementar lógica real aqui)

    setAppliedCoupon(couponCode);

    showSuccess('Cupom aplicado com sucesso!');

  };



  const handleUpdateCart = () => {

    showSuccess('Carrinho atualizado!');

  };



  const handleCalculateShipping = () => {

    // Simular cálculo de frete (você pode implementar lógica real aqui)

    setShippingCost(15.90);

    showSuccess('Frete calculado!');

  };



  const handleCheckout = () => {

    if (cart.length === 0) {

      showError('Seu carrinho está vazio');

      return;

    }

    navigateRouter('/finalizar-pedido');

  };



  if (cart.length === 0) {

    return (

      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">

        <div className="text-center py-20">

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h2>

          <p className="text-gray-500 mb-8">Adicione produtos ao carrinho para continuar</p>

          <Button onClick={() => navigateRouter('/catalogo')} className="min-h-[44px]">

            Continuar Comprando

          </Button>

        </div>

      </div>

    );

  }



  return (

    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">

      {/* Breadcrumb */}

      <nav className="mb-6" aria-label="Breadcrumb">

        <ol className="flex items-center gap-2 text-sm text-gray-500">

          <li>

            <button 

              onClick={() => navigateRouter('/')}

              className="hover:text-gray-900 transition-colors"

            >

              Início

            </button>

          </li>

          <li className="text-gray-400">/</li>

          <li>

            <button 

              onClick={() => navigateRouter('/catalogo')}

              className="hover:text-gray-900 transition-colors"

            >

              Catálogo

            </button>

          </li>

          <li className="text-gray-400">/</li>

          <li>

            <span className="text-gray-900 font-medium">Carrinho</span>

          </li>

        </ol>

      </nav>



      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Carrinho de Compras</h1>



      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

        {/* Coluna Principal - Produtos */}

        <div className="flex-1">

          {/* Tabela de Produtos */}

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">

            {/* Cabeçalho da Tabela (Desktop) */}

            <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-4 py-3 border-b border-gray-200">

              <div className="col-span-1"></div>

              <div className="col-span-5 font-semibold text-gray-900 text-sm">PRODUTO</div>

              <div className="col-span-2 font-semibold text-gray-900 text-sm text-center">PREÇO</div>

              <div className="col-span-2 font-semibold text-gray-900 text-sm text-center">QUANTIDADE</div>

              <div className="col-span-2 font-semibold text-gray-900 text-sm text-right">SUBTOTAL</div>

            </div>



            {/* Lista de Produtos */}

            <div className="divide-y divide-gray-200">

              {cart.map((item) => (

                <div key={item.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors">

                  {/* Botão Remover */}

                  <div className="col-span-12 md:col-span-1 flex items-center justify-center">

                    <button

                      onClick={() => removeFromCart(item.id)}

                      className="text-red-500 hover:text-red-700 transition-colors p-1"

                      aria-label="Remover produto"

                    >

                      <Trash2 className="w-5 h-5" />

                    </button>

                  </div>



                  {/* Imagem e Nome do Produto */}

                  <div className="col-span-12 md:col-span-5 flex gap-4">

                    <img

                      src={item.images[0] || '/images/product-placeholder.png'}

                      alt={item.name}

                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg border border-gray-200"

                    />

                    <div className="flex-1 min-w-0">

                      <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-1 line-clamp-2">

                        {item.name}

                      </h3>

                      {item.selectedNicotine && (

                        <p className="text-xs text-gray-500">Teor: {item.selectedNicotine}</p>

                      )}

                      {item.selectedFlavor && (

                        <p className="text-xs text-gray-500">Sabor: {item.selectedFlavor}</p>

                      )}

                    </div>

                  </div>



                  {/* Preço */}

                  <div className="col-span-6 md:col-span-2 flex items-center">

                    <div className="md:hidden text-xs text-gray-500 mr-2">Preço:</div>

                    <span className="font-semibold text-gray-900 text-sm sm:text-base">

                      R$ {item.price.toFixed(2).replace('.', ',')}

                    </span>

                  </div>



                  {/* Quantidade */}

                  <div className="col-span-6 md:col-span-2 flex items-center justify-center">

                    <div className="flex items-center border border-gray-300 rounded-lg">

                      <button

                        onClick={() => updateQuantity(item.id, item.quantity - 1)}

                        className="p-2 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"

                        aria-label="Diminuir quantidade"

                      >

                        <Minus className="w-4 h-4" />

                      </button>

                      <input

                        type="number"

                        value={item.quantity}

                        onChange={(e) => {

                          const newQuantity = parseInt(e.target.value) || 1;

                          updateQuantity(item.id, newQuantity);

                        }}

                        min="1"

                        className="w-12 sm:w-16 text-center border-0 focus:ring-0 text-sm font-medium text-gray-900"

                      />

                      <button

                        onClick={() => updateQuantity(item.id, item.quantity + 1)}

                        className="p-2 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"

                        aria-label="Aumentar quantidade"

                      >

                        <Plus className="w-4 h-4" />

                      </button>

                    </div>

                  </div>



                  {/* Subtotal */}

                  <div className="col-span-12 md:col-span-2 flex items-center justify-end">

                    <div className="md:hidden text-xs text-gray-500 mr-2">Subtotal:</div>

                    <span className="font-semibold text-gray-900 text-sm sm:text-base">

                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}

                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>



          {/* Seção de Cupom e Atualizar */}

          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">

              {/* Cupom */}

              <div className="flex-1 w-full sm:w-auto">

                <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">

                  Cupom

                </label>

                <div className="flex gap-2">

                  <input

                    id="coupon"

                    type="text"

                    value={couponCode}

                    onChange={(e) => setCouponCode(e.target.value)}

                    placeholder="Cupom"

                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"

                  />

                  <button

                    onClick={handleApplyCoupon}

                    className="px-4 sm:px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors whitespace-nowrap min-h-[44px]"

                  >

                    APLICAR CUPOM

                  </button>

                </div>

                {appliedCoupon && (

                  <p className="text-xs text-green-600 mt-1">Cupom "{appliedCoupon}" aplicado!</p>

                )}

              </div>



              {/* Botão Atualizar */}

              <div className="w-full sm:w-auto">

                <button

                  onClick={handleUpdateCart}

                  className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors min-h-[44px]"

                >

                  ATUALIZAR PRODUTOS

                </button>

              </div>

            </div>

          </div>

        </div>



        {/* Coluna Lateral - Resumo do Pedido */}

        <div className="w-full lg:w-96 flex-shrink-0">

          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">

            <h2 className="text-xl font-bold text-gray-900 mb-6">Total no carrinho</h2>



            {/* Subtotal */}

            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">

              <span className="text-sm font-medium text-gray-700">SUBTOTAL</span>

              <span className="text-lg font-bold text-gray-900">

                R$ {subtotal.toFixed(2).replace('.', ',')}

              </span>

            </div>



            {/* Entrega */}

            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">

              <span className="text-sm font-medium text-gray-700">ENTREGA</span>

              {shippingCost !== null ? (

                <span className="text-lg font-bold text-gray-900">

                  R$ {shippingCost.toFixed(2).replace('.', ',')}

                </span>

              ) : (

                <button

                  onClick={handleCalculateShipping}

                  className="text-sm text-primary-600 hover:text-primary-700 underline"

                >

                  Calcular entrega

                </button>

              )}

            </div>



            {/* Total */}

            <div className="flex justify-between items-center mb-6">

              <span className="text-lg font-bold text-gray-900">TOTAL</span>

              <span className="text-2xl font-bold text-gray-900">

                R$ {total.toFixed(2).replace('.', ',')}

              </span>

            </div>



            {/* Botão Finalizar Compra */}

            <button

              onClick={handleCheckout}

              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors min-h-[44px] text-lg"

            >

              FINALIZAR COMPRA

            </button>



            {/* Link Voltar */}

            <button

              onClick={() => navigateRouter('/catalogo')}

              className="w-full mt-3 text-sm text-gray-600 hover:text-gray-900 transition-colors underline"

            >

              Continuar comprando

            </button>

          </div>

        </div>

      </div>

    </div>

  );

};



const Catalog = ({ onQuickView, onQuickAdd }: { onQuickView?: (product: Product) => void; onQuickAdd?: (product: Product) => void }) => {

  const { searchTerm, activeCategory, setActiveCategory } = useApp();

  const navigateRouter = useNavigateRouter();

  const { products } = useProducts();

  const [isLoading, setIsLoading] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  const [filteredProductsFromFilters, setFilteredProductsFromFilters] = useState<Product[]>(products);

  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [currentPage, setCurrentPage] = useState(1);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('catalog-view-mode');
    return (saved === 'grid' || saved === 'list') ? saved : 'grid';
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  
  // Salvar preferência de visualização
  useEffect(() => {
    localStorage.setItem('catalog-view-mode', viewMode);
  }, [viewMode]);
  

  const handleProductClick = (id: string) => {

    navigateRouter(`/produto/${id}`);

  };



  // Filtrar produtos baseado em busca e categoria primeiro

  const productsByCategoryAndSearch = useMemo(() => {

    return products.filter(p => {

      const matchesSearch = debouncedSearchTerm === '' || p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;

      return matchesSearch && matchesCategory;

    });

  }, [products, activeCategory, debouncedSearchTerm]);



  // Produtos finais após aplicar filtros avançados

  const filteredProducts = useMemo(() => {

    return filteredProductsFromFilters;

  }, [filteredProductsFromFilters]);



  // Calcular produtos paginados

  const paginatedProducts = useMemo(() => {

    const startIndex = (currentPage - 1) * itemsPerPage;

    const endIndex = startIndex + itemsPerPage;

    return filteredProducts.slice(startIndex, endIndex);

  }, [filteredProducts, currentPage, itemsPerPage]);



  // Calcular total de páginas

  const totalPages = useMemo(() => {

    return Math.ceil(filteredProducts.length / itemsPerPage);

  }, [filteredProducts.length, itemsPerPage]);



  // Resetar página quando filtros mudarem

  useEffect(() => {

    setCurrentPage(1);

  }, [filteredProducts.length, itemsPerPage]);

  

  // Simular loading ao filtrar (pode ser removido quando houver API real)

  useEffect(() => {

    if (searchTerm !== debouncedSearchTerm) {

      setIsLoading(true);

    } else {

      setIsLoading(false);

    }

  }, [searchTerm, debouncedSearchTerm, activeCategory]);



  const handleFilterChange = useCallback((filtered: Product[]) => {

    setFilteredProductsFromFilters(filtered);

    setIsLoading(false);

  }, []);



  const handleClearFilters = useCallback(() => {

    setFilteredProductsFromFilters(productsByCategoryAndSearch);

  }, [productsByCategoryAndSearch]);



  // Atualizar produtos filtrados quando categoria ou busca mudar

  useEffect(() => {

    setFilteredProductsFromFilters(productsByCategoryAndSearch);

  }, [productsByCategoryAndSearch]);



  return (

    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">

      {/* BotÃ£o para mostrar/ocultar filtros em mobile */}

      <div className="lg:hidden mb-4">

        <Button 

          variant="outline" 

          onClick={() => setShowFilters(!showFilters)}

          className="w-full flex items-center justify-center gap-2 min-h-[44px]"

        >

          <span>{showFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>

          <ChevronRight className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-90' : ''}`} />

        </Button>

      </div>



      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

        <aside className={`w-full lg:w-80 flex-shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>

          {/* Filtros Avançados */}

          <ProductFilters

            products={productsByCategoryAndSearch}

            onFilterChange={handleFilterChange}

            onClearFilters={handleClearFilters}

          />

        </aside>



        <div className="flex-1">

          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6 shadow-sm">

            <span className="text-gray-500 font-medium text-sm sm:text-base">{filteredProducts.length} produtos encontrados</span>

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
              {/* Dropdown Exibir por página */}

              <div className="flex items-center gap-2">

                <label htmlFor="items-per-page" className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">

                  Exibir:

                </label>

                <select

                  id="items-per-page"

                  value={itemsPerPage}

                  onChange={(e) => {

                    setItemsPerPage(Number(e.target.value));

                    setCurrentPage(1);

                  }}

                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white cursor-pointer hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"

                >

                  <option value={20}>20 por página</option>

                  <option value={40}>40 por página</option>

                  <option value={60}>60 por página</option>

                  <option value={80}>80 por página</option>

                  <option value={100}>100 por página</option>

                </select>

              </div>

              {/* Dropdown Ordenação */}

              <select className="border-none text-xs sm:text-sm font-medium focus:ring-0 text-gray-700 bg-transparent cursor-pointer hover:text-primary-600 min-h-[44px]">

                <option>Mais Relevantes</option>

                <option>Menor Preço</option>

                <option>Maior Preço</option>

                <option>Mais Recentes</option>

              </select>

              
              {/* Botões de Visualização Grid/Lista - Movido para o final */}
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center touch-manipulation ${
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
                  }`}
                  aria-label="Visualização em grade"
                  title="Visualização em grade"
                >
                  <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center touch-manipulation ${
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
                  }`}
                  aria-label="Visualização em lista"
                  title="Visualização em lista"
                >
                  <List className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

          </div>



          {isLoading ? (

            <ProductGridSkeleton count={6} />

          ) : filteredProducts.length === 0 ? (

            <div className="text-center py-8 sm:py-12">

              <p className="text-gray-500 text-base sm:text-lg">Nenhum produto encontrado</p>

              <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros de busca</p>

            </div>

          ) : (

            <>

              {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">

                {paginatedProducts.map(product => (

                  <ProductCard 

                    key={product.id} 

                    product={product} 

                    onClick={() => handleProductClick(product.id)}

                    onQuickView={onQuickView}

                    onQuickAdd={onQuickAdd}

                  />

                ))}

              </div>

              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {paginatedProducts.map(product => (
                    <ProductListItem
                      key={product.id}
                      product={product}
                      onClick={() => handleProductClick(product.id)}
                      onQuickView={onQuickView}
                      onQuickAdd={onQuickAdd}
                    />
                  ))}
                </div>
              )}
              

              {/* Controles de Paginação */}

              {totalPages > 1 && (

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">

                  <div className="text-sm text-gray-600">

                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de {filteredProducts.length} produtos

                  </div>

                  <div className="flex items-center gap-2">

                    <button

                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}

                      disabled={currentPage === 1}

                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"

                    >

                      Anterior

                    </button>

                    <div className="flex items-center gap-1">

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {

                        let pageNum;

                        if (totalPages <= 5) {

                          pageNum = i + 1;

                        } else if (currentPage <= 3) {

                          pageNum = i + 1;

                        } else if (currentPage >= totalPages - 2) {

                          pageNum = totalPages - 4 + i;

                        } else {

                          pageNum = currentPage - 2 + i;

                        }

                        return (

                          <button

                            key={pageNum}

                            onClick={() => setCurrentPage(pageNum)}

                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors min-h-[44px] min-w-[44px] ${

                              currentPage === pageNum

                                ? 'bg-primary-600 text-white'

                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'

                            }`}

                          >

                            {pageNum}

                          </button>

                        );

                      })}

                    </div>

                    <button

                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}

                      disabled={currentPage === totalPages}

                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"

                    >

                      Próxima

                    </button>

                  </div>

                </div>

              )}

            </>

          )}

        </div>

      </div>

    </div>

  );

};



const ProductDetailWrapper = () => {

  const { id } = useParams<{ id: string }>();

  const { products } = useProducts();

  const navigateRouter = useNavigateRouter();

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  

  useEffect(() => {

    if (products && products.length > 0) {

      setIsInitialLoad(false);

    }

  }, [products]);

  

  const productsLoading = isInitialLoad && (!products || products.length === 0);

  

  if (productsLoading) {

    return <ProductDetailSkeleton />;

  }

  

  const product = (products || []).find(p => p.id === id);

  

  if (!product) {

    return (

      <div className="container mx-auto px-4 py-20 text-center">

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto nÃ£o encontrado</h2>

        <p className="text-gray-500 mb-8">O produto que vocÃª estÃ¡ procurando nÃ£o estÃ¡ disponÃ­vel.</p>

        <Button onClick={() => navigateRouter('/catalogo')}>Voltar para CatÃ¡logo</Button>

      </div>

    );

  }

  

  return <ProductDetail product={product} />;

};



const ProductDetail = ({ product }: { product: Product }) => {

  const { addToCart } = useCart();

  const navigateRouter = useNavigateRouter();

  const { products } = useProducts();

  const { showSuccess } = useToast();

  const [quantity, setQuantity] = useState(1);

  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0] || '');

  const [selectedNicotine, setSelectedNicotine] = useState(product.nicotine?.[0] || '');

  const [isLoading, setIsLoading] = useState(true);

  const [imageLoaded, setImageLoaded] = useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [hoveredFlavorImageIndex, setHoveredFlavorImageIndex] = useState<number | null>(null);

  const [fixedFlavorImageIndex, setFixedFlavorImageIndex] = useState<number | null>(null);

  const [imageUpdateKey, setImageUpdateKey] = useState(0); // Contador para forçar atualização da imagem

  // Estados para notificação de estoque

  const [selectedFlavorsForNotification, setSelectedFlavorsForNotification] = useState<string[]>([]);

  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

  const [isFlavorsDropdownOpen, setIsFlavorsDropdownOpen] = useState(false);

  const flavorsDropdownRef = useRef<HTMLDivElement>(null);

  // Estado para controlar expansão da seção "Fora de Estoque"

  const [isOutOfStockExpanded, setIsOutOfStockExpanded] = useState(false);

  // Estado para produtos complementares selecionados
  const [selectedComplementaryProducts, setSelectedComplementaryProducts] = useState<string[]>([]);

  
  // Estados para formulário de comentário
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  

  // Produtos relacionados (mesma categoria, excluindo o produto atual)

  const relatedProducts = (products || []).filter(

    p => p.category === product.category && p.id !== product.id

  ).slice(0, 8);

  

  // Mock de reviews (substituir por dados reais depois)

  const [reviews, setReviews] = useState<Review[]>([
    {

      id: '1',

      productId: product.id,

      customerName: 'João Silva',

      customerPhoto: 'https://ui-avatars.com/api/?name=João+Silva&background=3765FF&color=fff',

      rating: 5,

      comment: 'Produto excelente! Superou minhas expectativas. Qualidade premium e entrega rápida. Recomendo muito!',

      date: '2024-01-15',

    },

    {

      id: '2',

      productId: product.id,

      customerName: 'Maria Santos',

      customerPhoto: 'https://ui-avatars.com/api/?name=Maria+Santos&background=10b981&color=fff',

      rating: 4,

      comment: 'Muito bom produto, recomendo! A única coisa é que poderia ter mais opções de sabores disponíveis.',

      date: '2024-01-10',

    },

    {

      id: '3',

      productId: product.id,

      customerName: 'Pedro Oliveira',

      customerPhoto: 'https://ui-avatars.com/api/?name=Pedro+Oliveira&background=f59e0b&color=fff',

      rating: 5,

      comment: 'Perfeito! Exatamente como descrito. Vou comprar novamente com certeza.',

      date: '2024-01-05',

    },

  ]);

  

  const handleAddToCart = () => {

    // Adiciona o produto principal
    addToCart(product, quantity, { selectedFlavor, selectedNicotine });

    
    // Adiciona produtos complementares automaticamente se existirem
    if (product.complementaryProducts && product.complementaryProducts.length > 0) {
      const complementaryItems = (products || []).filter(p => 
        product.complementaryProducts?.includes(p.id)
      );
      
      complementaryItems.forEach(item => {
        addToCart(item, 1);
      });
      
      const totalItems = complementaryItems.length + 1;
      showSuccess(`${totalItems} produto(s) adicionado(s) ao carrinho! (${product.name} + ${complementaryItems.length} complementar${complementaryItems.length > 1 ? 'es' : ''})`);
    } else {
    showSuccess(`${product.name} adicionado ao carrinho!`);

    }
  };

  

  const handleProductClick = (id: string) => {

    navigateRouter(`/produto/${id}`);

  };



  // Função para alternar seleção de sabor para notificação

  const toggleFlavorForNotification = (flavor: string) => {

    setSelectedFlavorsForNotification(prev => {

      if (prev.includes(flavor)) {

        return prev.filter(f => f !== flavor);

      } else {

        return [...prev, flavor];

      }

    });

  };



  // Fechar dropdown ao clicar fora

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {

      if (flavorsDropdownRef.current && !flavorsDropdownRef.current.contains(event.target as Node)) {

        setIsFlavorsDropdownOpen(false);

      }

    };



    if (isFlavorsDropdownOpen) {

      document.addEventListener('mousedown', handleClickOutside);

    }



    return () => {

      document.removeEventListener('mousedown', handleClickOutside);

    };

  }, [isFlavorsDropdownOpen]);



  // Função para obter índice da imagem baseado no sabor

  const getImageIndexForFlavor = (flavor: string): number => {

    if (!product.flavors || product.flavors.length === 0 || !product.images || product.images.length === 0) {

      return 0;

    }

    const flavorIndex = product.flavors.indexOf(flavor);

    const result = flavorIndex % product.images.length;

    // Distribui os sabores entre as imagens disponíveis

    return result;

  };



  // Função para lidar com hover no sabor

  const handleFlavorHover = (flavor: string) => {

    const imageIndex = getImageIndexForFlavor(flavor);

    setHoveredFlavorImageIndex(imageIndex);

    setImageUpdateKey(prev => prev + 1); // Incrementar contador para forçar atualização

    setImageLoaded(false);

  };



  // Função para lidar com saída do hover

  const handleFlavorLeave = () => {

    setHoveredFlavorImageIndex(null);

  };



  // Função para lidar com click no sabor (fixar imagem)

  const handleFlavorClick = (flavor: string) => {

    const imageIndex = getImageIndexForFlavor(flavor);

    setFixedFlavorImageIndex(imageIndex);

    setSelectedImageIndex(imageIndex);

    setImageLoaded(false);

    setHoveredFlavorImageIndex(null);

  };



  // Determinar qual imagem exibir (hover tem prioridade sobre fixado)

  const displayImageIndex = useMemo(() => {

    const result = hoveredFlavorImageIndex !== null

      ? hoveredFlavorImageIndex

      : (fixedFlavorImageIndex !== null ? fixedFlavorImageIndex : selectedImageIndex);

    return result;

  }, [hoveredFlavorImageIndex, fixedFlavorImageIndex, selectedImageIndex]);



  // Calcular src da imagem baseado no displayImageIndex

  const currentImageSrc = useMemo(() => {

    const src = product.images[displayImageIndex] || product.images[0];

    return src;

  }, [displayImageIndex, product.images]);



  // Função para confirmar notificação

  const handleConfirmNotification = () => {

    if (!privacyPolicyAccepted) {

      showSuccess('Por favor, autorize o recebimento de notificações.');

      return;

    }

    if (selectedFlavorsForNotification.length === 0) {

      showSuccess('Por favor, selecione pelo menos um sabor para receber notificação.');

      return;

    }

    // Aqui você pode adicionar a lógica para salvar a notificação (localStorage, API, etc.)

    showSuccess(`Você será notificado quando os sabores selecionados estiverem disponíveis!`);

    // Limpar formulário

    setSelectedFlavorsForNotification([]);

    setPrivacyPolicyAccepted(false);

  };



  // Função para alternar seleção de produto complementar

  const toggleComplementaryProduct = (productId: string) => {

    setSelectedComplementaryProducts(prev => {

      if (prev.includes(productId)) {

        return prev.filter(id => id !== productId);

      } else {

        return [...prev, productId];

      }

    });

  };



  // Função para calcular o total dos produtos complementares selecionados

  const calculateComplementaryTotal = () => {

    if (!product.complementaryProducts || selectedComplementaryProducts.length === 0) {

      return 0;

    }

    

    const complementaryItems = (products || []).filter(p => 

      product.complementaryProducts?.includes(p.id) && 

      selectedComplementaryProducts.includes(p.id)

    );

    

    return complementaryItems.reduce((total, item) => total + item.price, 0);

  };



  // Função para comprar todos os produtos (principal + complementares)

  const handleBuyAllProducts = () => {

    // Adiciona o produto principal

    addToCart(product, quantity, { selectedFlavor, selectedNicotine });

    

    // Adiciona produtos complementares selecionados

    const complementaryItems = (products || []).filter(p => 

      selectedComplementaryProducts.includes(p.id)

    );

    

    complementaryItems.forEach(item => {

      addToCart(item, 1);

    });

    

    const totalItems = complementaryItems.length + 1;

    showSuccess(`${totalItems} produto(s) adicionado(s) ao carrinho!`);

    setSelectedComplementaryProducts([]);

  };



  // Calcular totais

  const totalComplementary = calculateComplementaryTotal();

  const totalWithMainProduct = product.price + totalComplementary;

  const pixDiscount = totalWithMainProduct * 0.02;

  const totalWithPix = totalWithMainProduct - pixDiscount;

  const installments = Math.ceil(totalWithMainProduct / 100);

  const installmentValue = totalWithMainProduct / installments;

  

  useEffect(() => {

    setIsLoading(true);

    setImageLoaded(false);

    setSelectedImageIndex(0);

    setSelectedFlavor(product.flavors?.[0] || '');

    setSelectedNicotine(product.nicotine?.[0] || '');

    setHoveredFlavorImageIndex(null);

    // Fixar imagem do primeiro sabor ao carregar o produto

    if (product.flavors && product.flavors.length > 0 && product.images && product.images.length > 0) {

      const firstFlavorImageIndex = getImageIndexForFlavor(product.flavors[0]);

      setFixedFlavorImageIndex(firstFlavorImageIndex);

      setSelectedImageIndex(firstFlavorImageIndex);

    } else {

      setFixedFlavorImageIndex(null);

    }

    const timer = setTimeout(() => setIsLoading(false), 500);

    return () => clearTimeout(timer);

  }, [product.id, product.flavors, product.nicotine]);



  // Recarregar imagem quando displayImageIndex mudar

  useEffect(() => {

    setImageLoaded(false);

  }, [displayImageIndex]);

  

  if (!product) {

    return (

      <div className="container mx-auto px-4 py-20 text-center">

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto nÃ£o encontrado</h2>

        <Button onClick={() => navigateRouter('/catalogo')}>Voltar para CatÃ¡logo</Button>

      </div>

    );

  }

  

  if (isLoading) {

    return <ProductDetailSkeleton />;

  }



  // Formatar data do review

  const formatReviewDate = (dateString: string) => {

    const date = new Date(dateString);

    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  };



  // Calcular economia

  const calculateSavings = () => {

    if (!product.originalPrice) return null;

    const savingsPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    const savingsValue = product.originalPrice - product.price;

    return { percent: savingsPercent, value: savingsValue };

  };



  const savings = calculateSavings();



  // Função para compartilhar

  const handleShare = (platform: string) => {

    const url = window.location.href;

    const text = `Confira ${product.name} na White Cloud Brasil!`;

    

    switch (platform) {

      case 'whatsapp':

        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');

        break;

      case 'twitter':

        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');

        break;

      case 'facebook':

        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');

        break;

      case 'instagram':

        // Instagram não permite compartilhamento direto via URL, então copiamos o link para área de transferência

        navigator.clipboard.writeText(url).then(() => {

          window.open('https://www.instagram.com/', '_blank');

        });

        break;

    }

  };



  // Scroll para avaliações

  const scrollToReviews = () => {

    const reviewsSection = document.getElementById('reviews-section');

    if (reviewsSection) {

      reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    }

  };


  // Função para enviar comentário
  const handleSubmitReview = () => {
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      showSuccess('Por favor, preencha todos os campos.');
      return;
    }

    setIsSubmittingReview(true);
    
    // Simular envio (substituir por chamada de API depois)
    setTimeout(() => {
      const newReview: Review = {
        id: Date.now().toString(),
        productId: product.id,
        customerName: newReviewName.trim(),
        customerPhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(newReviewName.trim())}&background=3765FF&color=fff`,
        rating: newReviewRating,
        comment: newReviewComment.trim(),
        date: new Date().toISOString().split('T')[0]
      };
      
      setReviews(prev => [newReview, ...prev]);
      setNewReviewName('');
      setNewReviewComment('');
      setNewReviewRating(5);
      setIsSubmittingReview(false);
      showSuccess('Avaliação enviada com sucesso!');
    }, 500);
  };


  return (

    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">

      {/* Breadcrumb Navigation */}

      <nav className="mb-4 sm:mb-6" aria-label="Breadcrumb">

        <ol className="flex items-center flex-wrap gap-2 text-sm text-gray-500">

          <li>

            <button 

              onClick={() => navigateRouter('/')}

              className="hover:text-gray-900 transition-colors"

            >

              Início

            </button>

          </li>

          <li className="text-gray-400">/</li>

          <li>

            <button 

              onClick={() => navigateRouter('/catalogo')}

              className="hover:text-gray-900 transition-colors"

            >

              loja

            </button>

          </li>

          <li className="text-gray-400">/</li>

          <li>

            <button 

              onClick={() => navigateRouter('/catalogo')}

              className="hover:text-gray-900 transition-colors"

            >

              {CATEGORIES.find(c => c.id === product.category)?.name || product.category}

            </button>

          </li>

          <li className="text-gray-400">/</li>

          <li>

            <span className="text-gray-900">

              Ignite

            </span>

          </li>

          <li className="text-gray-400">/</li>

          <li>

            <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">

              {product.name}

            </span>

          </li>

        </ol>

      </nav>



      {/* 1. SEÃ‡ÃƒO PRINCIPAL: Galeria + InformaÃ§Ãµes */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12">

        {/* Coluna Esquerda: Galeria de Imagens */}

        <div className="space-y-3 sm:space-y-4">

          {/* Foto Principal */}

          <div className="aspect-square bg-white border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden p-4 sm:p-8 flex items-center justify-center relative shadow-sm hover:shadow-md transition-shadow">

            {!imageLoaded && (

              <div className="absolute inset-0 bg-gray-200 animate-pulse" />

            )}

            <img 

              key={`product-image-${displayImageIndex}-${product.id}-${hoveredFlavorImageIndex !== null ? `hover-${hoveredFlavorImageIndex}-${imageUpdateKey}` : fixedFlavorImageIndex !== null ? `fixed-${fixedFlavorImageIndex}` : `selected-${selectedImageIndex}`}`}

              src={currentImageSrc}

              alt={product.name} 

              loading="eager"

              decoding="async"

              className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}

              onLoad={() => setImageLoaded(true)}

              onError={() => setImageLoaded(true)}

            />

          </div>

          

          {/* Miniaturas das Imagens */}

          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1.5 sm:gap-2">

            {product.images.map((img, idx) => (

              <div 

                key={idx} 

                onClick={() => {

                  setSelectedImageIndex(idx);

                  setImageLoaded(false);

                  setFixedFlavorImageIndex(null); // Resetar fixação de sabor ao clicar em miniatura

                  setHoveredFlavorImageIndex(null);

                }}

                className={`aspect-square bg-white border rounded-lg p-1 cursor-pointer hover:border-primary-500 transition-colors ${

                  selectedImageIndex === idx && fixedFlavorImageIndex === null ? 'border-primary-500 border-2' : 'border-gray-100'

                }`}

              >

                <img src={img} alt="" className="w-full h-full object-contain" />

              </div>

            ))}

          </div>



          {/* PRODUTOS COMPLEMENTARES / KIT */}

          {product.complementaryProducts && product.complementaryProducts.length > 0 && (() => {

            const complementaryItems = (products || []).filter(p => 

              product.complementaryProducts?.includes(p.id)

            );

            

            // Debug: verificar se os produtos estão sendo encontrados
            console.log('Produtos complementares configurados:', product.complementaryProducts);
            console.log('Total de produtos disponíveis:', products?.length);
            console.log('Produtos complementares encontrados:', complementaryItems.length);
            console.log('IDs dos produtos encontrados:', complementaryItems.map(p => p.id));
            
            if (complementaryItems.length === 0) {
              console.warn('Nenhum produto complementar encontrado. Verifique se os IDs estão corretos.');
              return null;
            }
            

            return (

              <div className="mt-6 sm:mt-8">

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Complete seu Kit

                </h3>

                <p className="text-xs sm:text-sm text-gray-600 mb-4">
                  Estes produtos serão adicionados automaticamente ao carrinho junto com o produto principal.
                </p>
                

                <div className="space-y-3 border-b border-dashed border-gray-300 pb-4 mb-4">

                  {complementaryItems.map((complementaryProduct) => {

                    const isSelected = selectedComplementaryProducts.includes(complementaryProduct.id);

                    

                    return (

                      <div 

                        key={complementaryProduct.id}

                        className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${

                          isSelected 

                            ? 'border-primary-500 bg-primary-50' 

                            : 'border-gray-200 hover:border-primary-300'

                        }`}

                      >

                        <input

                          type="checkbox"

                          checked={isSelected}

                          onChange={() => toggleComplementaryProduct(complementaryProduct.id)}

                          className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"

                        />

                        

                        <div className="flex-1 flex items-start gap-3">

                          <img

                            src={complementaryProduct.images[0]}

                            alt={complementaryProduct.name}

                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-lg border border-gray-200 bg-white"

                          />

                          

                          <div className="flex-1 min-w-0">

                            <p className="text-xs text-gray-500 mb-0.5 truncate">

                              Cód.: {complementaryProduct.sku || 'N/A'}

                            </p>

                            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 line-clamp-2">

                              {complementaryProduct.name}

                            </h4>

                            <p className="text-sm sm:text-base font-bold text-primary-600">

                              R$ {complementaryProduct.price.toFixed(2).replace('.', ',')}

                            </p>

                            <button

                              onClick={() => handleProductClick(complementaryProduct.id)}

                              className="text-xs text-primary-600 hover:text-primary-700 mt-1"

                            >

                              Mais detalhes

                            </button>

                          </div>

                        </div>

                      </div>

                    );

                  })}

                </div>

                

                {/* Resumo e Total */}

                {selectedComplementaryProducts.length > 0 && (

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">

                    <div className="flex items-center justify-center mb-3">

                      <span className="text-2xl text-gray-400">=</span>

                    </div>

                    

                    <div className="text-center">

                      <p className="text-xl sm:text-2xl font-bold text-primary-600 mb-1">

                        R$ {totalWithMainProduct.toFixed(2).replace('.', ',')}

                      </p>

                      <p className="text-xs text-gray-600 mb-0.5">

                        {installments}x de R$ {installmentValue.toFixed(2).replace('.', ',')} sem juros

                      </p>

                      <p className="text-xs text-gray-600">

                        R$ {totalWithPix.toFixed(2).replace('.', ',')} com PIX (-2%)

                      </p>

                    </div>

                  </div>

                )}

                

                {/* Botão de compra */}

                <Button

                  onClick={handleBuyAllProducts}

                  disabled={selectedComplementaryProducts.length === 0}

                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold uppercase py-3 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"

                >

                  COMPRAR OS {selectedComplementaryProducts.length + 1} PRODUTOS

                </Button>

              </div>

            );

          })()}

        </div>



        {/* Coluna Direita: InformaÃ§Ãµes Principais */}

        <div className="space-y-4 sm:space-y-6">

          {/* 1. Nome do Produto (H1) */}

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">

            {product.name}

          </h1>

          

          {/* 2. Marca do Produto */}

          {product.brand && (

            <div className="mb-4 sm:mb-6">

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg">

                <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Marca:</span>

                <span className="text-base sm:text-lg font-bold text-primary-600">{product.brand}</span>

              </div>

            </div>

          )}



          {/* SKU e Marca */}

          <div className="mb-2 space-y-1 text-xs sm:text-sm text-gray-500">

            {product.sku && (

              <p><span className="font-medium">SKU:</span> {product.sku}</p>

            )}

            <p>

              <span className="font-medium">Marca:</span>{' '}

              <span className="text-primary-600 font-medium">Ignite</span>

            </p>

          </div>

          

          {/* 3. Avaliações */}

          <div className="flex items-center space-x-2 mb-4">

            <div className="flex text-amber-400">

              {[...Array(5)].map((_, i) => (

                <Star 

                  key={i} 

                  className={`w-4 h-4 sm:w-5 sm:h-5 ${

                    i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'

                  }`} 

                />

              ))}

            </div>

            <button 

              onClick={scrollToReviews}

              className="text-xs sm:text-sm text-gray-500 hover:text-primary-600 transition-colors underline"

            >

              {product.rating.toFixed(2)} de 5 ({product.reviewsCount} {product.reviewsCount === 1 ? 'avaliação' : 'avaliações'})

            </button>

          </div>



          {/* 4. Preço (DESTAQUE MÃXIMO) */}

          <div className="bg-gray-50 p-4 sm:p-6 rounded-xl mb-6 sm:mb-8 border border-gray-200">

            <div className="flex items-end gap-2 sm:gap-3 mb-2 flex-wrap">

              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">

                R$ {product.price.toFixed(2).replace('.', ',')}

              </span>

              {product.originalPrice && (

                <>

                  <span className="text-lg sm:text-xl md:text-2xl text-gray-400 line-through mb-1">

                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}

                  </span>

                  {savings && (

                    <span className="bg-red-600 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full mb-1">

                      -{savings.percent}%

                    </span>

                  )}

                </>

              )}

            </div>

            {savings && (

              <p className="text-xs sm:text-sm text-gray-600 mb-2">

                Economia de R$ {savings.value.toFixed(2).replace('.', ',')}

              </p>

            )}

            <p className="text-xs sm:text-sm text-primary-600 font-medium flex items-center">

              <CreditCard className="w-4 h-4 mr-1" /> 5% de desconto no PIX

            </p>

          </div>

          



          {/* 5. Variações (Sabores/Cores/Modelos) */}

          {(() => {

            return product.flavors && product.flavors.length > 0 && (() => {

            // Definir quais sabores estão disponíveis (metade disponível, metade indisponível)

            const totalFlavors = product.flavors.length;

            const availableCount = Math.ceil(totalFlavors / 2);

            

            // Criar array com informações de disponibilidade

            const flavorsWithAvailability = product.flavors.map((flavor, index) => ({

              flavor,

              available: index < availableCount // Primeira metade disponível

            }));



            // Separar em disponíveis e indisponíveis

            const available = flavorsWithAvailability.filter(f => f.available);

            const unavailable = flavorsWithAvailability.filter(f => !f.available);



            return (

              <div className="mb-6 sm:mb-8">

                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">

                  Sabores

                </label>

                

                {/* Sabores Disponíveis - Destaque */}

                {available.length > 0 && (

                  <div className="mb-4">

                    <div className="flex items-center gap-2 mb-3">

                      <div className="h-2 w-2 rounded-full bg-green-500"></div>

                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Disponíveis em Estoque</p>

                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">

                      {available.map(({ flavor }) => {

                        const isSelected = selectedFlavor === flavor;

                        return (

                          <button

                            key={flavor}

                            onClick={() => {

                              setSelectedFlavor(flavor);

                              handleFlavorClick(flavor);

                            }}

                            onMouseEnter={() => handleFlavorHover(flavor)}

                            onMouseLeave={() => handleFlavorLeave()}

                            className={`

                              px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all

                              min-h-[44px] flex items-center justify-center text-center shadow-sm

                              ${isSelected

                                ? 'bg-primary-600 text-white border-2 border-primary-600 shadow-md transform scale-105'

                                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 hover:shadow-md'

                              }

                            `}

                          >

                            {flavor}

                          </button>

                        );

                      })}

                    </div>

                  </div>

                )}



                {/* Sabores Indisponíveis - Menos Destaque */}

                {unavailable.length > 0 && (

                  <div className="border-t border-gray-200 pt-4 mt-4">

                    <button

                      onClick={() => setIsOutOfStockExpanded(!isOutOfStockExpanded)}

                      className="flex items-center gap-2 mb-3 w-full text-left hover:opacity-80 transition-opacity"

                    >

                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>

                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide flex-1">Fora de Estoque</p>

                      <ChevronDown 

                        className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${

                          isOutOfStockExpanded ? 'transform rotate-180' : ''

                        }`}

                      />

                    </button>

                    {isOutOfStockExpanded && (

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 opacity-50 animate-fade-in">

                        {unavailable.map(({ flavor }) => (

                          <button

                            key={flavor}

                            disabled

                            className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium

                              bg-gray-50 text-gray-400 border border-dashed border-gray-300 line-through cursor-not-allowed

                              min-h-[44px] flex items-center justify-center text-center"

                          >

                            {flavor}

                          </button>

                        ))}

                      </div>

                    )}

                  </div>

                )}

              </div>

            );

          })();

          })()}



          {/* 5.5. Teor de Nicotina */}

          {product.nicotine && product.nicotine.length > 0 && product.id !== '1' && (

            <div className="mb-6 sm:mb-8">

              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">

                Teor

              </label>

              <div className="flex flex-wrap gap-2 sm:gap-3">

                {product.nicotine.map((nicotine) => {

                  const isSelected = selectedNicotine === nicotine;

                  return (

                    <button

                      key={nicotine}

                      onClick={() => setSelectedNicotine(nicotine)}

                      className={`

                        px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all

                        min-h-[44px] flex items-center justify-center

                        ${isSelected

                          ? 'bg-primary-600 text-white border-2 border-primary-600 shadow-md'

                          : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-500 hover:bg-primary-50'

                        }

                      `}

                    >

                      {nicotine}

                    </button>

                  );

                })}

              </div>

            </div>

          )}



          {/* 6. Quantidade + CTAs */}

          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

              <div className="flex items-center border border-gray-300 rounded-lg bg-white w-full sm:w-auto">

                <button 

                  className="p-3 hover:bg-gray-50 text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors" 

                  onClick={() => setQuantity(Math.max(1, quantity - 1))}

                  aria-label="Diminuir quantidade"

                >

                  <Minus className="w-4 h-4" />

                </button>

                <span className="w-12 text-center font-bold min-h-[44px] flex items-center justify-center" aria-label={`Quantidade: ${quantity}`}>

                  {quantity}

                </span>

                <button 

                  className="p-3 hover:bg-gray-50 text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors" 

                  onClick={() => setQuantity(quantity + 1)}

                  aria-label="Aumentar quantidade"

                >

                  <Plus className="w-4 h-4" />

                </button>

              </div>

              <Button 

                size="lg" 

                className="w-full sm:flex-1 text-base sm:text-lg min-h-[44px] font-bold uppercase shadow-lg hover:shadow-xl transition-shadow" 

                onClick={handleAddToCart}

                aria-label={`Adicionar ${quantity} ${product.name} ao carrinho`}

              >

                Adicionar ao Carrinho

              </Button>

            </div>

            {/* BotÃ£o SecundÃ¡rio */}

            <Button 

              variant="outline"

              size="lg"

              className="w-full text-base sm:text-lg min-h-[44px] font-semibold border-2 border-primary-600 text-primary-600 hover:bg-primary-50"

              onClick={() => {

                handleAddToCart();

                navigateRouter('/carrinho');

              }}

            >

              Ir para o Carrinho

            </Button>

          </div>



          {/* 7. Calculadora de Frete */}

          <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">

            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Calcular Frete</h3>

            <div className="flex gap-2">

              <input

                type="text"

                placeholder="CEP"

                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"

                maxLength={9}

              />

              <Button className="min-h-[44px] px-6">

                Calcular

              </Button>

            </div>

          </div>



          {/* 7.5. Notificação de Reposição de Estoque */}

          {product.flavors && product.flavors.length > 0 && (

            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">

              <h3 className="text-sm sm:text-base font-semibold text-red-600 mb-4">Avise-me quando chegar</h3>



              {/* Seleção de sabores com select customizado */}

              <div className="mb-4 relative" ref={flavorsDropdownRef}>

                <button

                  type="button"

                  onClick={() => setIsFlavorsDropdownOpen(!isFlavorsDropdownOpen)}

                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white text-left flex items-center justify-between"

                >

                  <span className={selectedFlavorsForNotification.length === 0 ? 'text-gray-400' : 'text-gray-700'}>

                    {selectedFlavorsForNotification.length === 0

                      ? 'Selecione os sabores que deseja ser notificado'

                      : `${selectedFlavorsForNotification.length} sabor(es) selecionado(s)`

                    }

                  </span>

                  <ChevronDown 

                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${

                      isFlavorsDropdownOpen ? 'transform rotate-180' : ''

                    }`}

                  />

                </button>

                

                {isFlavorsDropdownOpen && (

                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">

                    <div className="p-2 space-y-1">

                      {product.flavors.map((flavor) => {

                        const isSelected = selectedFlavorsForNotification.includes(flavor);

                        return (

                          <label

                            key={flavor}

                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"

                          >

                            <input

                              type="checkbox"

                              checked={isSelected}

                              onChange={() => toggleFlavorForNotification(flavor)}

                              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"

                            />

                            <span className="text-xs sm:text-sm text-gray-700 flex-1">{flavor}</span>

                          </label>

                        );

                      })}

                    </div>

                  </div>

                )}

              </div>



              {/* Checkbox de autorização */}

              <div className="mb-4 flex items-start gap-2">

                <input

                  type="checkbox"

                  id="privacy-policy-notification"

                  checked={privacyPolicyAccepted}

                  onChange={(e) => setPrivacyPolicyAccepted(e.target.checked)}

                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"

                />

                <label htmlFor="privacy-policy-notification" className="text-xs sm:text-sm text-gray-600 cursor-pointer">

                  Autorizo receber notificações de reposição deste produto

                </label>

              </div>



              {/* Botão de confirmação */}

              <Button

                onClick={handleConfirmNotification}

                disabled={!privacyPolicyAccepted || selectedFlavorsForNotification.length === 0}

                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold uppercase py-3 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"

              >

                AVISAR AO CHEGAR!

              </Button>

            </div>

          )}

        </div>

      </div>



      {/* 8. BLOCO DE INFORMAÃ‡Ã•ES RÃPIDAS */}

      <div className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 mb-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

          {/* Formas de Pagamento */}

          <div className="flex items-start gap-3">

            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 flex-shrink-0 mt-0.5" />

            <div>

              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Formas de Pagamento</h3>

              <p className="text-xs sm:text-sm text-gray-600">

                {product.paymentOptions || 'Em até 12x no cartão de crédito. 5% de desconto no pagamento via PIX.'}

              </p>

            </div>

          </div>



          {/* Avaliações */}

          <div className="flex items-start gap-3">

            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400 flex-shrink-0 mt-0.5" />

            <div>

              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Avaliações</h3>

              <button 

                onClick={scrollToReviews}

                className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 underline"

              >

                Ver todas as avaliações

              </button>

            </div>

          </div>



          {/* Compartilhar */}

          <div className="flex items-start gap-3">

            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 flex-shrink-0 mt-0.5" />

            <div>

              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Compartilhar</h3>

              <div className="flex gap-2">

                <button

                  onClick={() => handleShare('whatsapp')}

                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors"

                  aria-label="Compartilhar no WhatsApp"

                >

                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">

                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .96 4.534.96 10.089c0 1.87.487 3.697 1.411 5.312L0 24l8.554-2.289a11.882 11.882 0 003.496.515h.005c6.554 0 11.89-5.335 11.89-11.89a11.821 11.821 0 00-3.48-8.413Z"/>

                  </svg>

                </button>

                <button

                  onClick={() => handleShare('twitter')}

                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-400 hover:bg-blue-500 text-white flex items-center justify-center transition-colors"

                  aria-label="Compartilhar no Twitter"

                >

                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />

                </button>

                <button

                  onClick={() => handleShare('facebook')}

                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"

                  aria-label="Compartilhar no Facebook"

                >

                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />

                </button>

                <button

                  onClick={() => handleShare('instagram')}

                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white flex items-center justify-center transition-all"

                  aria-label="Compartilhar no Instagram"

                >

                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>





      {/* 9. DESCRIÇÃO */}

      {(() => {

        return product.detailedDescription;

      })() && (

        <section className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 mb-12">

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">

            Descrição

          </h2>

          <div className="text-gray-700 leading-relaxed">

            {product.detailedDescription.split('\n\n').map((paragraph, idx) => {

              const trimmed = paragraph.trim();

              if (!trimmed) return null;

              

              // Ignorar "DESCRIÇÃO" pois já temos o h2

              if (trimmed.toUpperCase() === 'DESCRIÇÃO') {

                return null;

              }

              

              // Detectar títulos: linhas que começam com letra maiúscula, sem pontuação final, 

              // não são listas, e têm características de título

              const isLikelyTitle = (

                trimmed.length < 100 && 

                trimmed.length > 5 &&

                !trimmed.match(/[.!?]$/) &&

                !trimmed.startsWith('•') &&

                !trimmed.startsWith('-') &&

                !trimmed.startsWith('1.') &&

                !trimmed.startsWith('2.') &&

                !trimmed.startsWith('3.') &&

                !trimmed.startsWith('4.') &&

                !trimmed.startsWith('5.') &&

                trimmed.match(/^[A-ZÁÊÔÇ]/) &&

                !trimmed.includes('.') &&

                !trimmed.includes('!') &&

                !trimmed.includes('?')

              );

              

              // Se for título claro, renderizar como h3

              if (isLikelyTitle) {

                return (

                  <h3 key={idx} className="text-lg sm:text-xl font-bold text-gray-900 mb-3 mt-6 first:mt-0">

                    {trimmed}

                  </h3>

                );

              }

              

              // Se tiver dois pontos e for curto, pode ser título com conteúdo

              if (trimmed.includes(':') && trimmed.length < 200) {

                const colonIndex = trimmed.indexOf(':');

                const titlePart = trimmed.substring(0, colonIndex).trim();

                const contentPart = trimmed.substring(colonIndex + 1).trim();

                

                // Se a parte antes dos dois pontos parece um título (curto, sem pontuação)

                if (titlePart.length < 80 && 

                    titlePart.length > 3 && 

                    !titlePart.match(/[.!?]$/) &&

                    contentPart.length > 0) {

                  return (

                    <div key={idx} className="mb-6">

                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 mt-6 first:mt-0">

                        {titlePart}

                      </h3>

                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">

                        {contentPart}

                      </p>

                    </div>

                  );

                }

              }

              

              // Parágrafo normal

              return (

                <p key={idx} className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">

                  {trimmed}

                </p>

              );

            })}

          </div>

        </section>

      )}



      {/* 10. ESPECIFICAÇÕES TÉCNICAS */}

      {product.specifications && Object.keys(product.specifications).length > 0 && (

        <section className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 mb-12">

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">

            Especificações Técnicas

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

            {Object.entries(product.specifications).map(([key, value], idx) => (

              <div 

                key={idx} 

                className={`py-3 sm:py-4 ${idx < Object.keys(product.specifications).length - 2 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors rounded-lg px-2`}

              >

                <div className="grid grid-cols-[40%_60%] gap-4">

                  <span className="font-semibold text-gray-700 text-sm sm:text-base">{key}:</span>

                  <span className="text-gray-500 text-sm sm:text-base">{value}</span>

                </div>

              </div>

            ))}

          </div>

        </section>

      )}



      {/* 11. ITENS INCLUSOS */}

      {product.includedItems && product.includedItems.length > 0 && (

        <section className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 mb-12">

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">

            Itens Inclusos

          </h2>

          <ul className="space-y-3 ml-5">

            {product.includedItems.map((item, idx) => (

              <li key={idx} className="text-sm sm:text-base text-gray-700 leading-relaxed list-disc">

                {item}

              </li>

            ))}

          </ul>

        </section>

      )}



      {/* 12. GARANTIA */}

      {product.warranty && (

        <section className="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 mb-12">

          <div className="flex items-start gap-4">

            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 flex-shrink-0 mt-1" />

            <div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">

                Garantia

              </h2>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">

                {product.warranty}

              </p>

            </div>

          </div>

        </section>

      )}



      {/* 13. PRODUTOS RELACIONADOS */}

      {relatedProducts.length > 0 && (

        <section className="mb-12">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Produtos Relacionados</h2>

            <button

              onClick={() => navigateRouter('/catalogo')}

              className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base flex items-center gap-1"

            >

              Ver todos <ArrowRight className="w-4 h-4" />

            </button>

          </div>

          

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">

            {relatedProducts.slice(0, 4).map((relatedProduct) => (

              <ProductCard

                key={relatedProduct.id}

                product={relatedProduct}

                onClick={() => handleProductClick(relatedProduct.id)}

                onQuickAdd={(p) => {

                  addToCart(p, 1);

                  showSuccess(`${p.name} adicionado ao carrinho!`);

                }}

              />

            ))}

          </div>

        </section>

      )}



      {/* 14. AVALIAÇÕES DOS CLIENTES */}

      <section id="reviews-section" className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10">

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">Avaliações dos Clientes</h2>

        

        {reviews.length === 0 ? (

          <p className="text-gray-500 text-center py-8">Ainda não há avaliações para este produto.</p>

        ) : (

          <div className="space-y-6">

            {reviews.map((review) => (

              <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">

                <div className="flex items-start gap-4">

                  {/* Foto do Cliente */}

                  <div className="flex-shrink-0">

                    {review.customerPhoto ? (

                      <img

                        src={review.customerPhoto}

                        alt={review.customerName}

                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-200"

                      />

                    ) : (

                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">

                        {review.customerName.charAt(0).toUpperCase()}

                      </div>

                    )}

                  </div>

                  

                  <div className="flex-1">

                    {/* Nome e Data */}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">

                      <h3 className="font-bold text-gray-900 text-sm sm:text-base">{review.customerName}</h3>

                      <span className="text-xs sm:text-sm text-gray-500">{formatReviewDate(review.date)}</span>

                    </div>

                    

                    {/* AvaliaÃ§Ã£o de Estrelas */}

                    <div className="flex items-center gap-1 mb-3">

                      {[...Array(5)].map((_, i) => (

                        <Star

                          key={i}

                          className={`w-4 h-4 ${

                            i < review.rating

                              ? 'fill-amber-400 text-amber-400'

                              : 'text-gray-300'

                          }`}

                        />

                      ))}

                      <span className="ml-2 text-xs sm:text-sm text-gray-500">({review.rating}/5)</span>

                    </div>

                    

                    {/* Texto do ComentÃ¡rio */}

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{review.comment}</p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}


        {/* Formulário de Comentário */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Deixe sua avaliação</h3>
          
          <div className="space-y-4">
            {/* Campo Nome */}
            <div>
              <label htmlFor="review-name" className="block text-sm font-medium text-gray-700 mb-2">
                Seu nome
              </label>
              <input
                id="review-name"
                type="text"
                value={newReviewName}
                onChange={(e) => setNewReviewName(e.target.value)}
                placeholder="Digite seu nome"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm sm:text-base"
              />
            </div>

            {/* Campo Avaliação (Estrelas) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sua avaliação
              </label>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => {
                  const rating = i + 1;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewReviewRating(rating)}
                      className="focus:outline-none transition-transform hover:scale-110"
                      aria-label={`Avaliar ${rating} estrelas`}
                    >
                      <Star
                        className={`w-6 h-6 sm:w-7 sm:h-7 ${
                          rating <= newReviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-sm text-gray-600 ml-2">({newReviewRating}/5)</span>
              </div>
            </div>

            {/* Campo Comentário */}
            <div>
              <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
                Seu comentário
              </label>
              <textarea
                id="review-comment"
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="Compartilhe sua experiência com este produto..."
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none text-sm sm:text-base"
              />
            </div>

            {/* Botão Enviar */}
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmittingReview || !newReviewName.trim() || !newReviewComment.trim()}
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
            >
              {isSubmittingReview ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
          </div>
        </div>
      </section>

    </div>

  );

};


// Componente White Club - Gamificação
const WhiteClub = () => {
  const navigateRouter = useNavigateRouter();
  const { showSuccess } = useToast();
  const [userPoints, setUserPoints] = useState(1250);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Cupons disponíveis
  const coupons = [
    {
      id: '1',
      code: 'WHITECLUB5',
      discount: '5%',
      description: 'em sua 1ª compra no White Cloud!',
      category: 'Primeira Compra',
      image: '/images/img_01.png',
      conditions: 'Válido para primeira compra. Desconto não cumulativo.'
    },
    {
      id: '2',
      code: 'PODS12',
      discount: '12%',
      description: 'em Pods selecionados',
      category: 'Pods',
      image: '/images/img_02.png',
      conditions: 'Válido para produtos da categoria Pods. Desconto não cumulativo.'
    },
    {
      id: '3',
      code: 'JUICES15',
      discount: '15%',
      description: 'em Juices Premium',
      category: 'Juices',
      image: '/images/img_03.png',
      conditions: 'Válido para juices premium. Desconto não cumulativo.'
    },
    {
      id: '4',
      code: 'KIT20',
      discount: '20%',
      description: 'em Kits completos',
      category: 'Kits',
      image: '/images/img_04.png',
      conditions: 'Válido para kits completos. Desconto não cumulativo.'
    },
    {
      id: '5',
      code: 'FREESHIP',
      discount: 'FRETE GRÁTIS',
      description: 'em compras acima de R$ 200',
      category: 'Frete',
      image: '/images/img_06.png',
      conditions: 'Válido para compras acima de R$ 200. Válido apenas para região Sudeste.'
    },
    {
      id: '6',
      code: 'APP10',
      discount: '10%',
      description: 'no app White Cloud',
      category: 'App',
      image: '/images/img_01.png',
      conditions: 'Válido apenas para compras realizadas pelo app. Desconto não cumulativo.'
    }
  ];

  // Conquistas do usuário
  const achievements = [
    { id: '1', title: 'Primeira Compra', icon: '🎯', unlocked: true, points: 100 },
    { id: '2', title: 'Cliente Fiel', icon: '⭐', unlocked: true, points: 250 },
    { id: '3', title: 'Colecionador', icon: '🏆', unlocked: false, points: 500 },
    { id: '4', title: 'Influencer', icon: '📱', unlocked: false, points: 300 }
  ];

  // Função para copiar cupom
  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCoupon(code);
      showSuccess(`Cupom ${code} copiado!`);
      setTimeout(() => setCopiedCoupon(null), 2000);
    }).catch(() => {
      showSuccess('Erro ao copiar cupom');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      {/* Hero Banner - Design Melhorado */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-blue-600 overflow-hidden">
        {/* Decorações de fundo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
            {/* Texto */}
            <div className="flex-1 text-center lg:text-left z-10">
              {/* Badge White Club */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-5 py-2.5 mb-6 border border-white/30 shadow-lg">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-black tracking-wider text-white uppercase">WHITE CLUB</span>
              </div>
              
              {/* Título Principal */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-5 leading-tight">
                Garanta o seu
                <br />
                <span className="relative inline-block">
                  <span className="text-orange-400 drop-shadow-lg">Cupom* White Cloud!</span>
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 rounded-full opacity-60"></span>
                </span>
              </h1>
              
              {/* Descrição */}
              <p className="text-lg sm:text-xl lg:text-2xl text-white/95 mb-8 font-medium max-w-2xl mx-auto lg:mx-0">
                Descontos exclusivos e benefícios especiais para membros do White Club
              </p>
              
              {/* Ações */}
              <div className="flex flex-col sm:flex-row items-center gap-4 flex-wrap justify-center lg:justify-start">
                {/* Card de Pontos */}
                <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-4 border border-white/30 shadow-xl hover:bg-white/25 transition-all duration-300">
                  <p className="text-xs sm:text-sm text-white/80 mb-1.5 font-medium uppercase tracking-wide">Seus Pontos</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl sm:text-4xl font-extrabold text-white">{userPoints.toLocaleString('pt-BR')}</p>
                    <span className="text-sm text-white/70">pts</span>
                  </div>
                </div>
                
                {/* Botão CTA */}
                <button
                  onClick={() => navigateRouter('/catalogo')}
                  className="group bg-white hover:bg-gray-50 text-primary-600 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100 min-h-[56px] flex items-center gap-2"
                >
                  <span>Ver Produtos</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Ilustração/Decoração Melhorada */}
            <div className="flex-1 flex items-center justify-center relative w-full lg:w-auto">
              <div className="relative w-full max-w-md lg:max-w-lg">
                {/* Efeito de brilho animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
                
                {/* Card principal */}
                <div className="relative bg-white/20 backdrop-blur-md rounded-3xl p-10 sm:p-12 border-2 border-white/30 shadow-2xl hover:bg-white/25 transition-all duration-300">
                  {/* Ícone grande */}
                  <div className="text-7xl sm:text-8xl text-center mb-6 animate-bounce-slow">🎁</div>
                  
                  {/* Texto */}
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Cupons Exclusivos</h3>
                    <p className="text-sm sm:text-base text-white/80">Aproveite agora!</p>
                  </div>
                  
                  {/* Decoração inferior */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-white/10 rounded-full blur-md"></div>
                </div>
                
                {/* Elementos decorativos flutuantes */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-400/30 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-yellow-400/30 rounded-full blur-xl animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Overlay gradiente inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-50/20 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Seção de Cupons */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Cupons Disponíveis</h2>
          <p className="text-gray-600">Escolha seu cupom e aproveite descontos exclusivos!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Imagem do Cupom */}
              <div className="relative h-32 sm:h-40 bg-gradient-to-br from-primary-100 to-blue-100 overflow-hidden">
                <img
                  src={coupon.image}
                  alt={coupon.category}
                  className="w-full h-full object-cover opacity-60"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {coupon.discount} OFF
                </div>
              </div>

              {/* Conteúdo do Cupom */}
              <div className="p-5 sm:p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">{coupon.category}</p>
                  <p className="text-gray-700 font-medium mb-2">{coupon.description}</p>
                </div>

                {/* Código do Cupom */}
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => handleCopyCoupon(coupon.code)}
                    className={`flex-1 flex items-center justify-between bg-primary-50 hover:bg-primary-100 border-2 ${
                      copiedCoupon === coupon.code
                        ? 'border-green-500 bg-green-50'
                        : 'border-primary-200'
                    } rounded-lg px-4 py-3 transition-all group`}
                  >
                    <span className="font-bold text-primary-700 text-sm sm:text-base">{coupon.code}</span>
                    <div className="flex items-center gap-2">
                      {copiedCoupon === coupon.code ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 text-primary-600 group-hover:scale-110 transition-transform" />
                          <ArrowRight className="w-4 h-4 text-primary-600 transform group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {/* Condições */}
                <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                  Condições
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção de Conquistas Melhorada */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16 bg-white">
        <div className="mb-8 sm:mb-10 text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3">Suas Conquistas</h2>
          <p className="text-base sm:text-lg text-gray-600 font-medium">Complete missões e ganhe pontos!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`group relative bg-gradient-to-br rounded-2xl p-6 sm:p-8 text-center border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                achievement.unlocked
                  ? 'from-primary-50 via-blue-50 to-primary-50 border-primary-300 shadow-lg hover:border-primary-400'
                  : 'from-gray-50 via-gray-100 to-gray-50 border-gray-200 opacity-70 hover:opacity-90'
              }`}
            >
              {/* Badge de desbloqueado */}
              {achievement.unlocked && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                  ✓
                </div>
              )}
              
              {/* Ícone */}
              <div className={`text-5xl sm:text-6xl mb-4 transition-transform duration-300 ${achievement.unlocked ? 'group-hover:scale-110' : 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>
              
              {/* Título */}
              <h3 className={`font-bold mb-2 text-base sm:text-lg transition-colors ${
                achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {achievement.title}
              </h3>
              
              {/* Pontos */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <TrendingUp className={`w-4 h-4 ${achievement.unlocked ? 'text-primary-600' : 'text-gray-400'}`} />
                <p className={`text-sm font-semibold ${achievement.unlocked ? 'text-primary-600' : 'text-gray-500'}`}>
                  {achievement.points} pontos
                </p>
              </div>
              
              {/* Status */}
              {achievement.unlocked ? (
                <div className="inline-flex items-center gap-2 bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md">
                  <CheckCircle className="w-4 h-4" />
                  Desbloqueado!
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-gray-300 text-gray-600 text-xs font-medium px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  Bloqueado
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Seção de Níveis Melhorada */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-blue-600 rounded-3xl p-8 sm:p-10 lg:p-12 text-white overflow-hidden shadow-2xl">
          {/* Decorações de fundo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2">Seu Nível</h2>
                <p className="text-sm sm:text-base text-white/80">Continue acumulando pontos para subir de nível!</p>
              </div>
              <div className="hidden sm:block text-5xl lg:text-6xl opacity-20">
                🏆
              </div>
            </div>
            
            {/* Nível atual */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                  <span className="text-lg sm:text-xl font-bold">Bronze</span>
                </div>
                <div className="flex-1 h-0.5 bg-white/20"></div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-white/70 mb-1">Próximo nível</p>
                  <p className="text-sm sm:text-base font-semibold">Prata</p>
                </div>
              </div>
              
              {/* Barra de progresso melhorada */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2 text-sm sm:text-base">
                  <span className="font-semibold">Progresso</span>
                  <span className="text-white/90">{userPoints.toLocaleString('pt-BR')} / 2.000 pontos</span>
                </div>
                <div className="relative w-full bg-white/20 rounded-full h-5 sm:h-6 overflow-hidden shadow-inner">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${Math.min((userPoints / 2000) * 100, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-progress"></div>
                  </div>
                  {/* Indicador de porcentagem */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-bold text-white drop-shadow-lg">
                      {Math.round((userPoints / 2000) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Informações adicionais */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-xs text-white/70 mb-1">Pontos restantes</p>
                  <p className="text-lg sm:text-xl font-bold">{(2000 - userPoints).toLocaleString('pt-BR')}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-xs text-white/70 mb-1">Benefícios</p>
                  <p className="text-lg sm:text-xl font-bold">Exclusivos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const Favorites = ({ onQuickView, onQuickAdd }: { onQuickView?: (product: Product) => void; onQuickAdd?: (product: Product) => void }) => {

  const { favorites, removeFavorite } = useFavorites();

  const navigateRouter = useNavigateRouter();

  const { showSuccess } = useToast();



  const handleProductClick = (id: string) => {

    navigateRouter(`/produto/${id}`);

  };



  const handleRemoveFavorite = (product: Product) => {

    removeFavorite(product.id);

    showSuccess(`${product.name} removido dos favoritos`);

  };



  if (favorites.length === 0) {

    return (

      <div className="container mx-auto px-4 py-16">

        <div className="text-center max-w-md mx-auto">

          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">

            <Heart className="w-12 h-12 text-gray-400" />

          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">Nenhum favorito ainda</h2>

          <p className="text-gray-500 mb-8">

            Comece a adicionar produtos aos seus favoritos para encontrÃ¡-los facilmente depois!

          </p>

          <Button onClick={() => navigateRouter('/catalogo')}>

            Explorar Produtos

          </Button>

        </div>

      </div>

    );

  }



  return (

    <div className="container mx-auto px-4 py-8">

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">

          Meus Favoritos ({favorites.length})

        </h1>

        <button

          onClick={() => navigateRouter('/catalogo')}

          className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 transition-colors"

        >

          Continuar Comprando

          <ArrowRight className="w-4 h-4" />

        </button>

      </div>



      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">

        {favorites.map(product => (

          <div key={product.id} className="relative">

            <ProductCard 

              product={product} 

              onClick={() => handleProductClick(product.id)}

              onQuickView={onQuickView}

              onQuickAdd={onQuickAdd}

            />

            <button

              onClick={() => handleRemoveFavorite(product)}

              className="absolute top-2 right-2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"

              aria-label={`Remover ${product.name} dos favoritos`}

            >

              <Heart className="w-5 h-5 fill-red-500 text-red-500" />

            </button>

          </div>

        ))}

      </div>

    </div>

  );

};



const Cart = () => {

  const navigateRouter = useNavigateRouter();
    const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();

    const { navigate } = useApp();

    if (cart.length === 0) return <div className="p-8 sm:p-12 text-center text-gray-500">Carrinho Vazio</div>;

    return (

        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">

             <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Seu Carrinho</h1>

             <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">

                <div className="flex-1 space-y-3 sm:space-y-4">

                    {cart.map(item => (

                        <div key={item.id} className="flex gap-3 sm:gap-4 border p-3 sm:p-4 rounded-lg bg-white">

                            <img src={item.images[0]} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0" />

                            <div className="flex-1 min-w-0">

                                <h3 className="font-bold text-sm sm:text-base truncate">{item.name}</h3>

                                <p className="text-sm sm:text-base">R$ {item.price.toFixed(2)}</p>

                                <div className="flex items-center gap-3 sm:gap-4 mt-2">

                                     <div className="flex items-center border rounded">

                                        <button 

                                          className="px-3 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-gray-50 transition-colors" 

                                          onClick={() => updateQuantity(item.id, item.quantity - 1)}

                                          aria-label={`Diminuir quantidade de ${item.name}`}

                                        >

                                          -

                                        </button>

                                        <span className="px-3 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={`Quantidade: ${item.quantity}`}>{item.quantity}</span>

                                        <button 

                                          className="px-3 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-gray-50 transition-colors" 

                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}

                                          aria-label={`Aumentar quantidade de ${item.name}`}

                                        >

                                          +

                                        </button>

                                     </div>

                                     <button 

                                       onClick={() => removeFromCart(item.id)} 

                                       className="text-red-500 p-2 hover:bg-red-50 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"

                                       aria-label={`Remover ${item.name} do carrinho`}

                                     >

                                       <Trash2 className="w-4 h-4" />

                                     </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

                <div className="w-full lg:w-80 bg-gray-50 p-4 sm:p-6 rounded-lg h-fit sticky bottom-0 lg:sticky lg:top-8">

                    <div className="flex justify-between font-bold text-lg sm:text-xl mb-4">

                        <span>Total</span>

                        <span>R$ {cartTotal.toFixed(2)}</span>

                    </div>

                    <Button fullWidth size="lg" onClick={() => navigateRouter('/checkout')} aria-label="Finalizar compra" className="min-h-[44px]">Finalizar Compra</Button>

                </div>

             </div>

        </div>

    );

};



const AccountPage = () => {

  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [isHuman, setIsHuman] = useState(false);

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  

  // Estados do formulário de login

  const [loginData, setLoginData] = useState({

    usernameOrEmail: '',

    password: ''

  });



  // Estados do formulário de cadastro

  const [registerData, setRegisterData] = useState({

    nome: '',

    sobrenome: '',

    cpf: '',

    telefone: '',

    dataNascimento: '',

    email: '',

    senha: ''

  });



  const { showSuccess, showError } = useToast();

  const navigateRouter = useNavigateRouter();



  // Prevenir scroll do body quando modal está aberto

  useEffect(() => {

    if (showForgotPasswordModal) {

      document.body.style.overflow = 'hidden';

    } else {

      document.body.style.overflow = 'unset';

    }

    return () => {

      document.body.style.overflow = 'unset';

    };

  }, [showForgotPasswordModal]);



  // Fechar com ESC

  useEffect(() => {

    const handleEscape = (e: KeyboardEvent) => {

      if (e.key === 'Escape' && showForgotPasswordModal) {

        setShowForgotPasswordModal(false);

        setForgotPasswordEmail('');

      }

    };

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);

  }, [showForgotPasswordModal]);



  const handleLogin = (e: React.FormEvent) => {

    e.preventDefault();

    if (!loginData.usernameOrEmail || !loginData.password) {

      showError('Por favor, preencha todos os campos obrigatórios');

      return;

    }

    // Apenas visual - mostrar mensagem de sucesso

    showSuccess('Login realizado com sucesso!');

    navigateRouter('/');

  };



  const handleRegister = (e: React.FormEvent) => {

    e.preventDefault();

    if (!registerData.nome || !registerData.sobrenome || !registerData.email || !registerData.senha) {

      showError('Por favor, preencha todos os campos obrigatórios');

      return;

    }

    if (!isHuman) {

      showError('Por favor, confirme que você é humano');

      return;

    }

    // Apenas visual - mostrar mensagem de sucesso

    showSuccess('Cadastro realizado com sucesso!');

    navigateRouter('/');

  };



  const formatCPF = (value: string) => {

    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 11) {

      return numbers;

    }

    return numbers.slice(0, 11);

  };



  const formatPhone = (value: string) => {

    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 11) {

      return numbers;

    }

    return numbers.slice(0, 11);

  };



  const formatDate = (value: string) => {

    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 8) {

      if (numbers.length <= 2) return numbers;

      if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;

      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;

    }

    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;

  };



  const handleForgotPassword = (e: React.FormEvent) => {

    e.preventDefault();

    if (!forgotPasswordEmail) {

      showError('Por favor, digite seu nome de usuário ou e-mail');

      return;

    }

    // Apenas visual - mostrar mensagem de sucesso

    showSuccess('Link de redefinição de senha enviado para seu e-mail!');

    setShowForgotPasswordModal(false);

    setForgotPasswordEmail('');

  };



  return (

    <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">

        Minha Conta

      </h1>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">

        {/* Seção de Login */}

        <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm">

          <div className="border-b-2 border-primary-600 mb-6"></div>

          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Entrar</h2>

            

            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">

              <div>

                <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700 mb-2">

                  Nome de usuário ou e-mail <span className="text-red-500">*</span>

                </label>

                <input

                  type="text"

                  id="usernameOrEmail"

                  value={loginData.usernameOrEmail}

                  onChange={(e) => setLoginData({ ...loginData, usernameOrEmail: e.target.value })}

                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"

                  placeholder="Digite seu usuário ou e-mail"

                  required

                />

              </div>



              <div>

                <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-2">

                  Senha <span className="text-red-500">*</span>

                </label>

                <div className="relative">

                  <input

                    type={showLoginPassword ? 'text' : 'password'}

                    id="loginPassword"

                    value={loginData.password}

                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}

                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"

                    placeholder="Digite sua senha"

                    required

                  />

                  <button

                    type="button"

                    onClick={() => setShowLoginPassword(!showLoginPassword)}

                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"

                    aria-label={showLoginPassword ? 'Ocultar senha' : 'Mostrar senha'}

                  >

                    <Eye className={`w-5 h-5 ${showLoginPassword ? 'text-primary-600' : ''}`} />

                  </button>

                </div>

              </div>



              <button

                type="submit"

                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors min-h-[44px]"

              >

                ACESSAR

              </button>



              <div className="flex items-center justify-between pt-2">

                <label className="flex items-center cursor-pointer">

                  <input

                    type="checkbox"

                    checked={rememberMe}

                    onChange={(e) => setRememberMe(e.target.checked)}

                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"

                  />

                  <span className="ml-2 text-sm text-gray-700">Lembre-me</span>

                </label>

              </div>



              <div className="pt-2">

                <button

                  type="button"

                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"

                  onClick={() => setShowForgotPasswordModal(true)}

                >

                  Perdeu sua senha?

                </button>

              </div>

            </form>

          </div>

        </div>



        {/* Seção de Cadastro */}

        <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm">

          <div className="border-b-2 border-primary-600 mb-6"></div>

          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Cadastre-se</h2>

            

            <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">

                    Nome<span className="text-red-500">*</span>

                  </label>

                  <input

                    type="text"

                    id="nome"

                    value={registerData.nome}

                    onChange={(e) => setRegisterData({ ...registerData, nome: e.target.value })}

                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"

                    required

                  />

                </div>



                <div>

                  <label htmlFor="sobrenome" className="block text-sm font-medium text-gray-700 mb-2">

                    Sobrenome<span className="text-red-500">*</span>

                  </label>

                  <input

                    type="text"

                    id="sobrenome"

                    value={registerData.sobrenome}

                    onChange={(e) => setRegisterData({ ...registerData, sobrenome: e.target.value })}

                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"

                    required

                  />

                </div>

              </div>



              <div>

                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">

                  CPF

                </label>

                <input

                  type="text"

                  id="cpf"

                  value={registerData.cpf}

                  onChange={(e) => setRegisterData({ ...registerData, cpf: formatCPF(e.target.value) })}

                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"

                  placeholder="apenas números ou será inválido"

                  maxLength={11}

                />

              </div>



              <div>

                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">

                  Telefone

                </label>

                <input

                  type="text"

                  id="telefone"

                  value={registerData.telefone}

                  onChange={(e) => setRegisterData({ ...registerData, telefone: formatPhone(e.target.value) })}

                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"

                  placeholder="apenas números ou será inválido"

                  maxLength={11}

                />

              </div>



              <div>

                <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700 mb-2">

                  Data Nascimento

                </label>

                <div className="relative">

                  <input

                    type="text"

                    id="dataNascimento"

                    value={registerData.dataNascimento}

                    onChange={(e) => setRegisterData({ ...registerData, dataNascimento: formatDate(e.target.value) })}

                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"

                    placeholder="dd/mm/aaaa"

                    maxLength={10}

                  />

                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

                </div>

              </div>



              <div>

                <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-2">

                  Endereço de e-mail <span className="text-red-500">*</span>

                </label>

                <input

                  type="email"

                  id="registerEmail"

                  value={registerData.email}

                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}

                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"

                  required

                />

              </div>



              <div>

                <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-2">

                  Senha <span className="text-red-500">*</span>

                </label>

                <div className="relative">

                  <input

                    type={showRegisterPassword ? 'text' : 'password'}

                    id="registerPassword"

                    value={registerData.senha}

                    onChange={(e) => setRegisterData({ ...registerData, senha: e.target.value })}

                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"

                    required

                  />

                  <button

                    type="button"

                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}

                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"

                    aria-label={showRegisterPassword ? 'Ocultar senha' : 'Mostrar senha'}

                  >

                    <Eye className={`w-5 h-5 ${showRegisterPassword ? 'text-primary-600' : ''}`} />

                  </button>

                </div>

              </div>



              <div className="flex items-start">

                <input

                  type="checkbox"

                  id="isHuman"

                  checked={isHuman}

                  onChange={(e) => setIsHuman(e.target.checked)}

                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"

                />

                <label htmlFor="isHuman" className="ml-2 text-sm text-gray-700">

                  Sou humano

                </label>

              </div>



              <div className="text-xs text-gray-500 space-y-1 pt-2">

                <p>

                  Seus dados pessoais serão usados para aprimorar a sua experiência em todo este site, para gerenciar o acesso a sua conta e para outros propósitos, como descritos em nossa{' '}

                  <button

                    type="button"

                    className="text-primary-600 hover:underline"

                    onClick={() => showError('Política de privacidade em desenvolvimento')}

                  >

                    política de privacidade

                  </button>

                  .

                </p>

              </div>



              <button

                type="submit"

                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors min-h-[44px] mt-4"

              >

                CADASTRE-SE

              </button>

            </form>

          </div>

        </div>

      </div>



      {/* Modal de Recuperação de Senha */}

      {showForgotPasswordModal && (

        <>

          {/* Backdrop */}

          <div

            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] transition-opacity duration-300"

            onClick={() => setShowForgotPasswordModal(false)}

          />



          {/* Modal */}

          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">

            <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-lg w-full border border-gray-200 animate-fade-in">

              {/* Linha azul no topo */}

              <div className="border-b-2 border-primary-600"></div>

              

              <div className="p-6 sm:p-8">

                {/* Texto explicativo */}

                <p className="text-sm sm:text-base text-gray-700 mb-6 leading-relaxed">

                  Perdeu sua senha? Digite seu nome de usuário ou endereço de e-mail. Você receberá um link por e-mail para criar uma nova senha.

                </p>



                {/* Formulário */}

                <form onSubmit={handleForgotPassword} className="space-y-5">

                  <div>

                    <label htmlFor="forgotPasswordEmail" className="block text-sm font-medium text-gray-700 mb-2">

                      Nome de usuário ou e-mail <span className="text-red-500">*</span>

                    </label>

                    <input

                      type="text"

                      id="forgotPasswordEmail"

                      value={forgotPasswordEmail}

                      onChange={(e) => setForgotPasswordEmail(e.target.value)}

                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"

                      placeholder="Digite seu usuário ou e-mail"

                      required

                    />

                  </div>



                  {/* Botões */}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">

                    <button

                      type="button"

                      onClick={() => {

                        setShowForgotPasswordModal(false);

                        setForgotPasswordEmail('');

                      }}

                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors min-h-[44px]"

                    >

                      Cancelar

                    </button>

                    <button

                      type="submit"

                      className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors min-h-[44px] uppercase"

                    >

                      REDEFINIR SENHA

                    </button>

                  </div>

                </form>

              </div>

            </div>

          </div>

        </>

      )}

    </div>

  );

};



const TrackingPage = () => <div className="p-12 text-center">Rastreamento (Simulado)</div>;



// Chat Widget Flutuante

const ChatWidget = () => {

  const [isOpen, setIsOpen] = useState(false);



  // Prevenir scroll do body quando chat está aberto

  useEffect(() => {

    if (isOpen) {

      document.body.style.overflow = 'hidden';

    } else {

      document.body.style.overflow = 'unset';

    }

    return () => {

      document.body.style.overflow = 'unset';

    };

  }, [isOpen]);



  // Fechar com ESC

  useEffect(() => {

    const handleEscape = (e: KeyboardEvent) => {

      if (e.key === 'Escape' && isOpen) {

        setIsOpen(false);

      }

    };

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);

  }, [isOpen]);



  return (

    <>

      {/* Botão Flutuante */}

      <button

        onClick={() => setIsOpen(true)}

        className="fixed bottom-6 right-6 z-[9996] bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 min-h-[60px] min-w-[60px] flex items-center justify-center group"

        aria-label="Abrir chat de atendimento"

      >

        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />

        {/* Indicador de notificação (opcional) */}

        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>

      </button>



      {/* Modal de Chat */}

      {isOpen && (

        <>

          {/* Backdrop */}

          <div

            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] transition-opacity duration-300"

            onClick={() => setIsOpen(false)}

          />



          {/* Chat Window */}

          <div className="fixed bottom-6 right-6 z-[10001] w-full max-w-md h-[600px] bg-white rounded-xl shadow-2xl flex flex-col animate-fade-in">

            {/* Header do Chat */}

            <div className="bg-primary-600 text-white p-4 rounded-t-xl flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">

                  <MessageCircle className="w-5 h-5" />

                </div>

                <div>

                  <h3 className="font-semibold text-base">Atendimento</h3>

                  <p className="text-xs text-white/80">Normalmente respondemos em alguns minutos</p>

                </div>

              </div>

              <button

                onClick={() => setIsOpen(false)}

                className="p-2 hover:bg-white/20 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"

                aria-label="Fechar chat"

              >

                <X className="w-5 h-5" />

              </button>

            </div>



            {/* Área de Mensagens */}

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">

              {/* Mensagem de boas-vindas */}

              <div className="flex items-start gap-3">

                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">

                  <MessageCircle className="w-4 h-4 text-white" />

                </div>

                <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">

                  <p className="text-sm text-gray-700">

                    Olá! 👋 Como posso ajudá-lo hoje?

                  </p>

                </div>

              </div>



              {/* Mensagem de exemplo do usuário */}

              <div className="flex items-start gap-3 justify-end">

                <div className="bg-primary-600 text-white rounded-lg p-3 shadow-sm max-w-[80%]">

                  <p className="text-sm">

                    Gostaria de saber sobre os produtos disponíveis

                  </p>

                </div>

                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">

                  <User className="w-4 h-4 text-gray-600" />

                </div>

              </div>



              {/* Mensagem de resposta */}

              <div className="flex items-start gap-3">

                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">

                  <MessageCircle className="w-4 h-4 text-white" />

                </div>

                <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">

                  <p className="text-sm text-gray-700">

                    Claro! Temos uma ampla variedade de produtos. Você pode navegar pelo catálogo ou me dizer qual produto específico você está procurando.

                  </p>

                </div>

              </div>

            </div>



            {/* Input de Mensagem */}

            <div className="border-t border-gray-200 p-4 bg-white rounded-b-xl">

              <div className="flex items-center gap-2">

                <input

                  type="text"

                  placeholder="Digite sua mensagem..."

                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px] text-sm"

                />

                <button

                  className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg p-2.5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"

                  aria-label="Enviar mensagem"

                >

                  <ArrowRight className="w-5 h-5" />

                </button>

              </div>

              <p className="text-xs text-gray-500 mt-2 text-center">

                Horário de atendimento: Seg. a Sex. 9h às 18h

              </p>

            </div>

          </div>

        </>

      )}

    </>

  );

};



// --- MAIN APP ---



export default function App() {

  const { navigate, isBannerVisible } = useApp();
  const { toast, showError, showSuccess, closeToast } = useToast();

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { addToCart } = useCart();



  const handleQuickView = (product: Product) => {

    setQuickViewProduct(product);

  };



  const handleQuickAdd = (product: Product) => {

    addToCart(product, 1);

    showSuccess(`${product.name} adicionado ao carrinho!`);

  };


  const navigateRouter = useNavigateRouter();


  const handleViewFullDetails = (product: Product) => {

    navigateRouter(`/produto/${product.id}`);

  };



  return (

    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white w-full overflow-x-hidden" style={{ overflowY: 'visible', overflow: 'visible' }}>
      <AgeVerificationModal />

      <Header />



      <main className={`flex-1 w-full overflow-x-hidden transition-all duration-300 ${isBannerVisible ? 'pt-[147px] sm:pt-[163px] lg:pt-[221px]' : 'pt-[80px] sm:pt-[96px] lg:pt-[154px]'}`}>
        <Routes>

          <Route path="/" element={<Home onQuickView={handleQuickView} onQuickAdd={handleQuickAdd} />} />

          <Route path="/catalogo" element={<Catalog onQuickView={handleQuickView} onQuickAdd={handleQuickAdd} />} />

          <Route path="/produto/:id" element={<ProductDetailWrapper />} />

          <Route path="/carrinho" element={<Cart />} />

          <Route path="/favoritos" element={<Favorites onQuickView={handleQuickView} onQuickAdd={handleQuickAdd} />} />

          <Route path="/checkout" element={<CheckoutPage />} />

          <Route path="/finalizar-pedido" element={<FinalizeOrderPage />} />

          <Route path="/rastreamento" element={<TrackingPage />} />

          <Route path="/conta" element={<AccountPage />} />

          <Route path="/white-club" element={<WhiteClub />} />
          <Route path="*" element={<Home onQuickView={handleQuickView} onQuickAdd={handleQuickAdd} />} />

        </Routes>

      </main>



      {/* Toast Notification */}

      <Toast toast={toast} onClose={closeToast} />



      {/* Quick View Modal */}

      <QuickViewModal

        product={quickViewProduct}

        isOpen={!!quickViewProduct}

        onClose={() => setQuickViewProduct(null)}

        onViewFullDetails={handleViewFullDetails}

      />



      {/* 11. Footer */}

      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">

        <div className="container mx-auto px-4">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

            <div>

              <h4 className="text-white font-bold text-lg mb-6 flex items-center">Atendimento</h4>

              <ul className="space-y-4 text-sm">

                <li className="flex items-center"><Mail className="w-4 h-4 mr-2" /> sac@whitecloudbrasil.com</li>

                <li className="flex items-center"><User className="w-4 h-4 mr-2" /> +595 994 872020</li>

                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Seg. a Sex 9h ás 18h</li>

              </ul>

            </div>

            <div>

              <h4 className="text-white font-bold text-lg mb-6">Institucional</h4>

              <ul className="space-y-3 text-sm">

                <li><button className="hover:text-white transition-colors">Quem Somos</button></li>

                <li><button className="hover:text-white transition-colors">Guia Vape</button></li>

                <li><button className="hover:text-white transition-colors">Política de Envio e Entrega</button></li>

                <li><button className="hover:text-white transition-colors">Garantia & Trocas</button></li>

              </ul>

            </div>

            <div>

              <h4 className="text-white font-bold text-lg mb-6">Central do Cliente</h4>

              <ul className="space-y-3 text-sm">

                <li><button className="hover:text-white transition-colors">Política de Privacidade</button></li>

                <li><button className="hover:text-white transition-colors">Entre em Contato</button></li>

                <li><button className="hover:text-white transition-colors">Minha Conta</button></li>

                <li><button className="hover:text-white transition-colors">Rastrear Pedido</button></li>

              </ul>

            </div>

            <div>

              <h4 className="text-white font-bold text-lg mb-6">Siga-nos</h4>

              <div className="flex space-x-4 mb-8">

                <button className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"><Instagram className="w-5 h-5" /></button>

                <button className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"><Youtube className="w-5 h-5" /></button>

                <button className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"><Twitter className="w-5 h-5" /></button>

              </div>

              <h4 className="text-white font-bold text-lg mb-4">Pagamento</h4>

              <div className="flex flex-wrap gap-2">

                 {/* Visa */}

                 <div className="h-10 w-16 rounded flex items-center justify-center px-1 border border-gray-700/50">

                   <span className="text-[10px] font-bold text-white">VISA</span>

                 </div>

                 {/* Mastercard */}

                 <div className="h-10 w-16 rounded flex items-center justify-center px-1 border border-gray-700/50">

                   <div className="flex items-center gap-0.5">

                     <div className="w-3 h-3 rounded-full bg-red-500"></div>

                     <div className="w-3 h-3 rounded-full bg-orange-500 -ml-1.5"></div>

                   </div>

                 </div>

                 {/* Elo */}

                 <div className="h-10 w-16 rounded flex items-center justify-center px-1 border border-gray-700/50">

                   <span className="text-[9px] font-bold text-white">elo</span>

                 </div>

                 {/* American Express */}

                 <div className="h-10 w-16 rounded flex items-center justify-center px-1 border border-gray-700/50">

                   <span className="text-[7px] font-bold text-white text-center">AMERICAN EXPRESS</span>

                 </div>

                 {/* Hipercard */}

                 <div className="h-10 w-16 rounded flex items-center justify-center px-1 border border-gray-700/50">

                   <span className="text-[8px] font-bold text-white">Hipercard</span>

                 </div>

                 {/* PIX */}

                 <div className="h-10 w-16 rounded flex items-center justify-center px-1 border border-gray-700/50">

                   <span className="text-[9px] font-bold text-white">PIX</span>

                 </div>

                 {/* Boleto */}

                 <div className="h-10 w-16 rounded flex flex-col items-center justify-center px-1 border border-gray-700/50">

                   <div className="w-full h-2 mb-0.5 flex items-center justify-center flex-wrap" style={{ textAlign: 'left', display: 'flex' }}>

                     <svg width="100%" height="100%" viewBox="0 0 60 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">

                       <rect x="2" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="4" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="6" y="0" width="2" height="8" fill="white" opacity="0.9"/>

                       <rect x="9" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="11" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="13" y="0" width="2" height="8" fill="white" opacity="0.9"/>

                       <rect x="16" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="18" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="20" y="0" width="3" height="8" fill="white" opacity="0.9"/>

                       <rect x="24" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="26" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="28" y="0" width="2" height="8" fill="white" opacity="0.9"/>

                       <rect x="31" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="33" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="35" y="0" width="2" height="8" fill="white" opacity="0.9"/>

                       <rect x="38" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="40" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="42" y="0" width="3" height="8" fill="white" opacity="0.9"/>

                       <rect x="46" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="48" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="50" y="0" width="2" height="8" fill="white" opacity="0.9"/>

                       <rect x="53" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="55" y="0" width="1" height="8" fill="white" opacity="0.9"/>

                       <rect x="57" y="0" width="2" height="8" fill="white" opacity="0.9"/>

                     </svg>

                   </div>

                   <span className="text-[7px] font-bold text-white">BOLETO</span>

                 </div>

              </div>

            </div>

          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">

            <p>&copy; 2025 White Cloud Brasil. Todos os direitos reservados.</p>

            <div className="flex items-center space-x-2 mt-4 md:mt-0">

               <ShieldCheck className="w-4 h-4" /> <span>Site Seguro</span>

            </div>

          </div>

        </div>

      </footer>



      {/* Chat Flutuante - Atendimento */}

      <ChatWidget />

    </div>

  );

}
