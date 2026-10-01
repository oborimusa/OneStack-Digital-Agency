
    /* ─── HEADER / NAV ─── */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const servicesDropdown = document.getElementById('servicesDropdown');
    const servicesBtn = servicesDropdown.querySelector('button');

    hamburger.addEventListener('click', function() {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      const icon = hamburger.querySelector('i');
      icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    });

    servicesBtn.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const isOpen = servicesDropdown.classList.toggle('open');
        servicesBtn.setAttribute('aria-expanded', isOpen);
      }
    });

    document.querySelectorAll('header nav a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        servicesDropdown.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelector('i').className = 'fas fa-bars';
      });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        servicesDropdown.classList.remove('open');
        servicesBtn.setAttribute('aria-expanded', 'false');
      }
    });

    /* ─── CHAT WIDGET ─── */
    const chatPanel   = document.getElementById('chatPanel');
    const chatToggle  = document.getElementById('chatToggle');
    const chatBack    = document.getElementById('chatBack');
    const chatBadge   = document.getElementById('chatBadge');
    const chatBody    = document.getElementById('chatBody');
    const chatInput   = document.getElementById('chatInput');
    const chatQuickRow = document.getElementById('chatQuickRow');
    const userMsg1    = document.getElementById('userMsg1');
    const agentReply1 = document.getElementById('agentReply1');

    let chatOpen = false;

    function openChat() {
      chatOpen = true;
      chatPanel.classList.add('open');
      chatToggle.classList.add('active');
      chatToggle.setAttribute('aria-expanded', 'true');
      chatBadge.style.opacity = '0';
      setTimeout(() => chatBadge.style.display = 'none', 200);
      setTimeout(() => chatInput.focus(), 300);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function closeChat() {
      chatOpen = false;
      chatPanel.classList.remove('open');
      chatToggle.classList.remove('active');
      chatToggle.setAttribute('aria-expanded', 'false');
    }

    chatToggle.addEventListener('click', () => {
      chatOpen ? closeChat() : openChat();
    });

    chatBack.addEventListener('click', closeChat);

    setTimeout(() => {
      if (!sessionStorage.getItem('chatSeen')) {
        openChat();
        sessionStorage.setItem('chatSeen', '1');
      }
    }, 2000);

    document.querySelectorAll('.chat-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.reply;
        chatQuickRow.style.display = 'none';

        userMsg1.style.display = 'flex';
        userMsg1.querySelector('.chat-msg-bubble').textContent = text;
        chatBody.scrollTop = chatBody.scrollHeight;

        setTimeout(() => {
          agentReply1.style.display = 'flex';

          const followUp = document.createElement('div');
          followUp.className = 'chat-quick-row';
          followUp.innerHTML = `
            <button class="chat-quick-btn" data-reply="Real Estate">Real Estate</button>
            <button class="chat-quick-btn" data-reply="Hotels">Hotels</button>
            <button class="chat-quick-btn" data-reply="Restaurants">Restaurants</button>
          `;
          chatBody.appendChild(followUp);

          followUp.querySelectorAll('.chat-quick-btn').forEach(b => {
            b.addEventListener('click', () => {
              followUp.style.display = 'none';
              sendUserMessage(b.dataset.reply);
            });
          });

          chatBody.scrollTop = chatBody.scrollHeight;
        }, 800);
      });
    });

    function sendUserMessage(text) {
      if (!text.trim()) return;

      const msg = document.createElement('div');
      msg.className = 'chat-msg user';
      msg.innerHTML = `<div class="chat-msg-bubble">${escapeHtml(text)}</div>`;
      chatBody.appendChild(msg);

      chatBody.scrollTop = chatBody.scrollHeight;

      setTimeout(() => {
        const reply = document.createElement('div');
        reply.className = 'chat-msg agent';
        reply.innerHTML = `
          <div class="chat-msg-avatar"><i class="fas fa-user-tie"></i></div>
          <div class="chat-msg-bubble">
            Got it — one moment while I connect you to the right person. 
            In the meantime, feel free to <a href="https://wa.me/2348039661354" target="_blank" style="color:#0a0a0a; text-decoration:underline;">chat us on WhatsApp</a>.
          </div>
        `;
        chatBody.appendChild(reply);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 900);
    }

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && chatInput.value.trim()) {
        sendUserMessage(chatInput.value.trim());
        chatInput.value = '';
      }
    });

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  


// Main HTML file
fetch('discover-how.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('discover-how-container').innerHTML = html;

  });

  fetch("https://your-server.com/apply", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData)
})
.then(res => res.json())
.then(data => alert("Application submitted successfully!"))
.catch(err => alert("There was an error. Please try again."));



