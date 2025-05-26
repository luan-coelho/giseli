document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.querySelector('.carousel');
  const prevButton = document.querySelector('.carousel-button.prev');
  const nextButton = document.querySelector('.carousel-button.next');
  const items = document.querySelectorAll('.carousel-item');
  
  if (!carousel || !prevButton || !nextButton || items.length === 0) return;
  
  // Verifica se está em dispositivo móvel
  const isMobile = window.innerWidth <= 768;
  
  // Atualizar a coleção de itens após duplicação
  const allItems = document.querySelectorAll('.carousel-item');
  
  let currentIndex = 0;
  let carouselInterval;
  
  // Calcula a largura que cada card deve ocupar para exibir 3 cards
  function calculateCardWidth() {
    const windowWidth = window.innerWidth;
    
    if (windowWidth <= 768) {
      return 0;
    } else if (windowWidth <= 992) {
      return allItems[0].offsetWidth + 20;
    } else {
      return allItems[0].offsetWidth + 20;
    }
  }
  
  // Função para iniciar o carrossel automático
  function startAutoCarousel() {
    if (isMobile) return;
    
    carouselInterval = setInterval(() => {
      nextSlide();
    }, 10000);
  }
  
  // Função para parar o carrossel automático
  function stopAutoCarousel() {
    clearInterval(carouselInterval);
  }
  
  // Atualiza a posição do carrossel
  function updateCarouselPosition() {
    // Não atualiza em dispositivos móveis
    if (isMobile) return;
    
    const itemWidth = calculateCardWidth();
    const translateX = -currentIndex * itemWidth;
    carousel.style.transform = `translateX(${translateX}px)`;
    
    // Atualiza visibilidade dos botões
    prevButton.style.opacity = '1'; // Sempre ativo para o efeito de loop
    nextButton.style.opacity = '1'; // Sempre ativo para o efeito de loop
  }
  
  // Função para avançar ao próximo slide
  function nextSlide() {
    // Não avança em dispositivos móveis
    if (isMobile) return;
    
    currentIndex++;
    
    // Se passamos do último card original, resetamos para o primeiro
    if (currentIndex >= items.length) {
      // Aplicar transição para o primeiro card em vez de saltar instantaneamente
      currentIndex = 0;
      
      // Primeiro, finalizamos a animação atual
      carousel.style.transition = 'transform 0.5s ease';
      updateCarouselPosition();
      
      // Aplicamos um efeito de transição para o primeiro slide
      setTimeout(() => {
        // Adicionar uma transição mais suave e longa para o retorno ao início
        carousel.style.transition = 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)';
        updateCarouselPosition();
        
        // Restaurar a transição normal após a conclusão
        setTimeout(() => {
          carousel.style.transition = 'transform 0.5s ease';
        }, 800);
      }, 10);
    } else {
      updateCarouselPosition();
    }
  }
  
  // Função para voltar ao slide anterior
  function prevSlide() {
    // Não volta em dispositivos móveis
    if (isMobile) return;
    
    currentIndex--;
    
    // Se voltamos antes do primeiro card, vamos para o último com transição
    if (currentIndex < 0) {
      currentIndex = items.length - 1;
      
      // Aplicar transição mais suave para o último slide
      carousel.style.transition = 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)';
      updateCarouselPosition();
      
      // Restaurar a transição normal após a conclusão
      setTimeout(() => {
        carousel.style.transition = 'transform 0.5s ease';
      }, 800);
    } else {
      updateCarouselPosition();
    }
  }
  
  // Navegação - apenas em desktop/tablet
  if (!isMobile) {
    prevButton.addEventListener('click', function() {
      stopAutoCarousel();
      prevSlide();
      startAutoCarousel();
    });
    
    nextButton.addEventListener('click', function() {
      stopAutoCarousel();
      nextSlide();
      startAutoCarousel();
    });
    
    // Eventos de touch para tablets
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoCarousel();
    });
    
    carousel.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoCarousel();
    });
    
    function handleSwipe() {
      const touchDiff = touchStartX - touchEndX;
      
      if (touchDiff > 50) { // Swipe esquerda
        nextSlide();
      } else if (touchDiff < -50) { // Swipe direita
        prevSlide();
      }
    }
    
    // Pausar carrossel quando mouse estiver sobre ele
    carousel.addEventListener('mouseenter', stopAutoCarousel);
    carousel.addEventListener('mouseleave', startAutoCarousel);
  }
  
  // Inicializa o carrossel (apenas para desktop/tablet)
  if (!isMobile) {
    updateCarouselPosition();
    startAutoCarousel();
  }
  
  // Redimensionamento da janela
  window.addEventListener('resize', function() {
    const wasMobile = isMobile;
    const nowMobile = window.innerWidth <= 768;
    
    // Se houver mudança entre mobile/desktop, recarregue a página para reconstruir o carrossel
    if (wasMobile !== nowMobile) {
      location.reload();
    } else if (!nowMobile) {
      updateCarouselPosition();
    }
  });
});
