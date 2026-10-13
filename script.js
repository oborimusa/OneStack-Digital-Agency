/* ============================================================
   CHAT WIDGET — Toggle, quick replies, input, attach, image, emoji
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Element refs ---------- */
  const widget      = document.getElementById('chatWidget');
  const toggle      = document.getElementById('chatToggle');
  const badge       = document.getElementById('chatBadge');
  const input       = document.getElementById('chatInput');
  const chatBody    = document.getElementById('chatBody');   // renamed from `body`
  const quickRow    = document.getElementById('chatQuickRow');
  const btnAttach   = document.getElementById('btnAttach');
  const btnImage    = document.getElementById('btnImage');
  const btnEmoji    = document.getElementById('btnEmoji');
  const fileInput   = document.getElementById('chatFileInput');
  const imageInput  = document.getElementById('chatImageInput');
  const emojiPicker = document.getElementById('emojiPicker');

  if (!widget || !toggle) return;

  const WHATSAPP_URL = 'https://wa.me/2348039661354';

  /* ---------- Helpers ---------- */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function anchorPoint() {
    return chatBody ? chatBody.querySelector('.chat-quick-row') : null;
  }

  function addUserMessage(html) {
    if (!chatBody) return;
    const msg = document.createElement('div');
    msg.className = 'chat-msg user dynamic';   // ← added 'dynamic'
    msg.innerHTML = `<div class="chat-msg-bubble">${html}</div>`;
    const anchor = anchorPoint();
    anchor ? chatBody.insertBefore(msg, anchor) : chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addAgentReply(text, delay = 800) {
    if (!chatBody) return;
    setTimeout(() => {
      const reply = document.createElement('div');
      reply.className = 'chat-msg agent';
      reply.innerHTML = `
        <div class="chat-msg-avatar"><i class="fas fa-user-tie"></i></div>
        <div class="chat-msg-bubble">${text}</div>
      `;
      const anchor = anchorPoint();
      anchor ? chatBody.insertBefore(reply, anchor) : chatBody.appendChild(reply);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, delay);
  }

  /* ---------- Toggle open/close ---------- */
  toggle.addEventListener('click', () => {
    const isOpen = widget.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    if (isOpen && badge) badge.style.display = 'none';
  });


    /* ---------- Chat header: back + menu ---------- */
  const chatBack          = document.getElementById('chatBack');
  const chatMenuBtn       = document.getElementById('chatMenu');
  const chatMenuDropdown  = document.getElementById('chatMenuDropdown');

  /* --- Back button: closes the panel --- */
  if (chatBack) {
    chatBack.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Close dropdown if open
      if (chatMenuDropdown) chatMenuDropdown.classList.remove('open');

      // Close the whole widget
      widget.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* --- Menu button: toggle dropdown --- */
  if (chatMenuBtn && chatMenuDropdown) {
    chatMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const willOpen = !chatMenuDropdown.classList.contains('open');

      chatMenuDropdown.classList.toggle('open', willOpen);
      chatMenuBtn.classList.toggle('active', willOpen);
      chatMenuBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    /* --- Menu items: actions --- */
    chatMenuDropdown.querySelectorAll('.chat-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const action = item.dataset.action;

        // Close dropdown after action
        chatMenuDropdown.classList.remove('open');
        chatMenuBtn.classList.remove('active');
        chatMenuBtn.setAttribute('aria-expanded', 'false');

        switch (action) {
        case 'new':
    // 1. Remove ALL dynamically-added messages (files, images, typed text)
    if (chatBody) {
      chatBody.querySelectorAll('.chat-msg.dynamic').forEach(m => m.remove());
    }

    // 2. Hide the pre-baked user/reply pair
    const u1 = document.getElementById('userMsg1');
    const a1 = document.getElementById('agentReply1');
    if (u1) {
      u1.style.display = 'none';
      // Also reset its text back to default
    const b = u1.querySelector('.chat-msg-bubble');
    if (b) b.textContent = 'I have a question';
    }
    if (a1) a1.style.display = 'none';

    // 3. Show the greeting again (in case it was hidden)
    const greeting = chatBody ? chatBody.querySelector('.chat-msg.agent:not(#agentReply1)') : null;
    if (greeting) greeting.style.display = 'flex';

    // 4. Re-show quick reply buttons
    if (quickRow) {
      quickRow.style.display = 'flex';
      quickRow.querySelectorAll('.chat-quick-btn').forEach(b => {
        b.style.display = '';
        b.disabled = false;
      });
    }

  // 5. Clear input
  if (input) input.value = '';

  // 6. Hide emoji picker
  if (emojiPicker) emojiPicker.style.display = 'none';

  // 7. Reset badge
  if (badge) badge.style.display = 'none';

  // 8. Scroll to top
  if (chatBody) chatBody.scrollTop = 0;
  break;

          case 'whatsapp':
            window.open(WHATSAPP_URL, '_blank', 'noopener');
            break;

          case 'call':
            window.location.href = 'tel:+2348039661354';
            break;

          case 'email':
            window.location.href = 'mailto:info@onestackda.com';
            break;

          case 'end':
            widget.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            break;
        }
      });
    });

    /* --- Close dropdown when clicking outside --- */
    document.addEventListener('click', (e) => {
      if (!chatMenuDropdown.classList.contains('open')) return;
      if (!e.target.closest('#chatMenuDropdown') && !e.target.closest('#chatMenu')) {
        chatMenuDropdown.classList.remove('open');
        chatMenuBtn.classList.remove('active');
        chatMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    /* --- Close dropdown with Escape key --- */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && chatMenuDropdown.classList.contains('open')) {
        chatMenuDropdown.classList.remove('open');
        chatMenuBtn.classList.remove('active');
        chatMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Quick reply buttons ---------- */
  if (quickRow) {
    quickRow.querySelectorAll('.chat-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const reply = btn.dataset.reply || btn.textContent.trim();
        const userMsg = document.getElementById('userMsg1');
        const agentReply = document.getElementById('agentReply1');

        if (userMsg) {
          userMsg.querySelector('.chat-msg-bubble').textContent = reply;
          userMsg.style.display = 'flex';
        }
        if (agentReply) agentReply.style.display = 'flex';
        quickRow.style.display = 'none';
        if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
      });
    });
  }

  /* ---------- Text input — Enter to send ---------- */
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && input.value.trim()) {
        e.preventDefault();
        addUserMessage(escapeHtml(input.value));
        input.value = '';
        addAgentReply(
          'Thanks! Mary will reply shortly. For a faster response, ' +
          `<a href="${WHATSAPP_URL}" target="_blank" rel="noopener" style="color:#f5a623;">chat on WhatsApp</a>.`
        );
      }
    });
  }

  /* ---------- 📎 Attach file ---------- */
  if (btnAttach) {
    btnAttach.addEventListener('click', (e) => {
      e.preventDefault();
      if (fileInput) {
        fileInput.click();
      } else {
        // Fallback: no file input → send to WhatsApp
        addUserMessage('📎 I want to send a file');
        addAgentReply(
          'Please send your file directly on ' +
          `<a href="${WHATSAPP_URL}" target="_blank" rel="noopener" style="color:#f5a623;">WhatsApp</a>.`
        );
      }
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      addUserMessage(
        `📎 <strong>${escapeHtml(file.name)}</strong> ` +
        `<span class="chat-file-name">(${(file.size / 1024).toFixed(1)} KB)</span>`
      );
      addAgentReply(
        'Got your file! For fast processing, send it directly on ' +
        `<a href="${WHATSAPP_URL}" target="_blank" rel="noopener" style="color:#f5a623;">WhatsApp</a>.`
      );
      fileInput.value = '';
    });
  }

  /* ---------- 📷 Image ---------- */
  if (btnImage) {
    btnImage.addEventListener('click', (e) => {
      e.preventDefault();
      if (imageInput) {
        imageInput.click();
      } else {
        addUserMessage('📷 I want to send an image');
        addAgentReply(
          'Send your image directly on ' +
          `<a href="${WHATSAPP_URL}" target="_blank" rel="noopener" style="color:#f5a623;">WhatsApp</a>.`
        );
      }
    });
  }

  if (imageInput) {
    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        addUserMessage(`<img src="${evt.target.result}" alt="upload" class="chat-file-preview" />`);
        addAgentReply(
          'Nice shot! Send it to our team instantly on ' +
          `<a href="${WHATSAPP_URL}" target="_blank" rel="noopener" style="color:#f5a623;">WhatsApp</a>.`
        );
      };
      reader.readAsDataURL(file);
      imageInput.value = '';
    });
  }

  /* ---------- 😊 Emoji picker ---------- */
  if (btnEmoji && emojiPicker) {
    btnEmoji.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isHidden = emojiPicker.style.display === 'none' || !emojiPicker.style.display;
      emojiPicker.style.display = isHidden ? 'grid' : 'none';
    });

    // Emoji option clicks — add emoji to input
    emojiPicker.querySelectorAll('.emoji-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!input) return;
        input.value += btn.textContent;
        input.focus();
      });
    });

    // Close picker on outside click — use .closest() for reliability
    document.addEventListener('click', (e) => {
      if (emojiPicker.style.display === 'none') return;
      if (!e.target.closest('#emojiPicker') && !e.target.closest('#btnEmoji')) {
        emojiPicker.style.display = 'none';
      }
    });
  }

  /* ---------- Close chat when clicking outside ---------- */
  document.addEventListener('click', e => {
    if (
      widget.classList.contains('open') &&
      !e.target.closest('#chatWidget')
    ) {
      widget.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();