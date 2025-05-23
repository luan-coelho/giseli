document.addEventListener('DOMContentLoaded', function() {
  // Elementos de contato
  const emailLink = document.getElementById('email-link');
  const instagramLink = document.getElementById('instagram-link');
  
  // Função para mostrar as informações de contato
  function mostrarInformacoes() {
    // Email - Codificado para evitar crawlers
    const emailParts = ['giseli', '.ia', '@', 'tjto.jus', '.br'];
    const emailCompleto = emailParts.join('');
    
    // Instagram - Codificado para evitar crawlers
    const instaUser = 'giseli.ia';
    const instaUrl = 'https://www.instagram.com/' + instaUser;
    
    // Adicionar as informações ao DOM
    if (emailLink) {
      // Adiciona o endereço de e-mail
      emailLink.href = 'mailto:' + emailCompleto;
      
      // Verifica se o elemento de texto já existe
      const emailTextElement = emailLink.querySelector('.contact-info-text');
      if (!emailTextElement) {
        const spanElement = document.createElement('span');
        spanElement.className = 'contact-info-text';
        spanElement.textContent = emailCompleto;
        emailLink.querySelector('.contact-text').appendChild(spanElement);
      }
      
      // Adicionar funcionalidade de cópia para o email
      emailLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Abrir o cliente de email
        window.location.href = 'mailto:' + emailCompleto;
        
        // Copiar o email para a área de transferência
        navigator.clipboard.writeText(emailCompleto).then(function() {
          // Criar elemento de mensagem de sucesso
          const mensagem = document.createElement('span');
          mensagem.className = 'copy-message';
          mensagem.textContent = 'Email copiado!';
          
          // Remover qualquer mensagem anterior
          const mensagemAnterior = emailLink.querySelector('.copy-message');
          if (mensagemAnterior) {
            mensagemAnterior.remove();
          }
          
          // Adicionar a mensagem ao card
          const contactText = emailLink.querySelector('.contact-text');
          contactText.appendChild(mensagem);
          
          // Remover a mensagem após 3 segundos
          setTimeout(function() {
            mensagem.classList.add('fade-out');
            setTimeout(function() {
              mensagem.remove();
            }, 300);
          }, 3000);
        }).catch(function() {
          console.error('Erro ao copiar o email');
        });
      });
    }
    
    if (instagramLink) {
      // Para evitar conflitos com o script.js, armazenamos a URL como um atributo personalizado
      instagramLink.setAttribute('data-instagram-url', instaUrl);
      instagramLink.target = '_blank';
      instagramLink.rel = 'noopener noreferrer';
      
      // Verifica se o elemento de texto já existe
      const instaTextElement = instagramLink.querySelector('.contact-info-text');
      if (!instaTextElement) {
        const spanElement = document.createElement('span');
        spanElement.className = 'contact-info-text';
        spanElement.textContent = '@' + instaUser;
        instagramLink.querySelector('.contact-text').appendChild(spanElement);
      }
      
      // Adicionar evento de clique para abrir o Instagram em uma nova janela
      instagramLink.addEventListener('click', function(e) {
        e.preventDefault();
        const url = this.getAttribute('data-instagram-url');
        window.open(url, '_blank');
      });
    }
    
    // Adicionar estilo CSS para a mensagem de cópia e responsividade
    const estiloCSS = document.createElement('style');
    estiloCSS.textContent = `
      .copy-message {
        display: block;
        margin-top: 8px;
        font-size: 0.85rem;
        color: var(--accent);
        font-weight: 500;
        animation: fadeIn 0.3s ease forwards;
      }
      
      .copy-message.fade-out {
        animation: fadeOut 0.3s ease forwards;
      }
      
      @keyframes fadeOut {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-5px);
        }
      }
      
      /* Estilos responsivos para dispositivos móveis */
      @media (max-width: 768px) {
        .contact-item {
          flex-direction: column;
          text-align: center;
          padding: 1.5rem;
        }
        
        .contact-icon {
          margin-right: 0;
          margin-bottom: 1rem;
        }
        
        .contact-text {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .contact-text h3 {
          margin-bottom: 0.5rem;
        }
        
        .contact-info-text {
          text-align: center;
        }
      }
    `;
    document.head.appendChild(estiloCSS);
  }
  
  // Aguarda um breve momento após o carregamento da página para mostrar as informações
  // Isso ajuda a evitar crawlers automatizados
  setTimeout(mostrarInformacoes, 500);
});
