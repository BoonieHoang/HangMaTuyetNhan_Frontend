/* =====================================================================
   Smart Calendar AI Chatbot
   - Expand / collapse panel
   - Quick chips (no icons)
   - Product suggestion cards
   - Smooth typing animation
===================================================================== */

(function () {
    // ── Inject CSS ─────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        #chatbot-panel {
            display: flex;
            flex-direction: column;
            position: absolute;
            bottom: 72px;
            right: 0;
            width: 380px;
            height: 520px;
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.18);
            border: 1px solid #e5e7eb;
            overflow: hidden;
            transform: scale(0.92) translateY(16px);
            opacity: 0;
            pointer-events: none;
            transition: transform 0.25s cubic-bezier(.34,1.56,.64,1),
                        opacity 0.2s ease,
                        width 0.3s ease,
                        height 0.3s ease;
            transform-origin: bottom right;
        }
        #chatbot-panel.cb-open {
            transform: scale(1) translateY(0);
            opacity: 1;
            pointer-events: all;
        }
        #chatbot-panel.cb-expanded {
            width: min(680px, calc(100vw - 24px));
            height: min(680px, 85vh);
        }
        @media (max-width: 640px) {
            #chatbot-panel {
                width: calc(100vw - 24px);
                right: 0;
                border-radius: 14px 14px 0 0;
            }
            #chatbot-panel.cb-expanded {
                width: calc(100vw - 24px);
                height: 85vh;
            }
        }

        /* Header */
        #cb-header {
            background: linear-gradient(135deg, #6F2A2A 0%, #8B1A1A 100%);
            color: #fff;
            padding: 14px 16px 10px;
            flex-shrink: 0;
        }
        #cb-header-top { display: flex; align-items: center; justify-content: space-between; }
        #cb-title { font-weight: 700; font-size: 14px; letter-spacing: 0.02em; }
        #cb-header-actions { display: flex; gap: 6px; align-items: center; }
        .cb-icon-btn {
            background: rgba(255,255,255,0.15);
            border: none; cursor: pointer; border-radius: 6px;
            color: #fff; padding: 5px; display: flex; align-items: center;
            transition: background 0.2s;
        }
        .cb-icon-btn:hover { background: rgba(255,255,255,0.28); }
        #cb-date-bar {
            margin-top: 7px;
            font-size: 11px;
            color: rgba(255,255,255,0.78);
            letter-spacing: 0.01em;
        }

        /* Messages */
        #cb-messages {
            flex: 1;
            overflow-y: auto;
            padding: 14px 14px 6px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: #faf8f5;
            scroll-behavior: smooth;
        }
        #cb-messages::-webkit-scrollbar { width: 4px; }
        #cb-messages::-webkit-scrollbar-thumb { background: #d4b896; border-radius: 4px; }

        /* Bubbles */
        .cb-row { display: flex; flex-direction: column; gap: 4px; }
        .cb-row.user { align-items: flex-end; }
        .cb-row.bot  { align-items: flex-start; }
        .cb-bubble {
            max-width: 82%;
            padding: 9px 12px;
            border-radius: 12px;
            font-size: 13px;
            line-height: 1.55;
            animation: cbFadeUp 0.22s ease both;
        }
        .cb-row.user .cb-bubble {
            background: #6F2A2A;
            color: #fff;
            border-bottom-right-radius: 3px;
        }
        .cb-row.bot .cb-bubble {
            background: #fff;
            color: #374151;
            border: 1px solid #e9e1d6;
            border-bottom-left-radius: 3px;
        }
        .cb-bubble p { margin: 0 0 6px; }
        .cb-bubble p:last-child { margin-bottom: 0; }
        .cb-bubble ul { margin: 4px 0; padding-left: 18px; }
        .cb-bubble li { margin-bottom: 3px; }
        .cb-bubble strong { color: #6F2A2A; }
        .cb-bubble a { color: #c49a45; text-decoration: underline; }

        @keyframes cbFadeUp {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* Typing dots */
        .cb-typing { display: flex; gap: 5px; align-items: center; padding: 10px 12px; }
        .cb-dot {
            width: 7px; height: 7px; border-radius: 50%;
            background: #b5957a;
            animation: cbBounce 1.1s infinite ease-in-out;
        }
        .cb-dot:nth-child(2) { animation-delay: 0.18s; }
        .cb-dot:nth-child(3) { animation-delay: 0.36s; }
        @keyframes cbBounce {
            0%, 80%, 100% { transform: translateY(0); }
            40%            { transform: translateY(-7px); }
        }

        /* Quick chips */
        #cb-chips {
            padding: 0 14px 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
            flex-shrink: 0;
            background: #faf8f5;
        }
        .cb-chip {
            border: 1px solid #d9c4a8;
            background: #fff;
            color: #6F2A2A;
            font-size: 11.5px;
            padding: 5px 11px;
            border-radius: 20px;
            cursor: pointer;
            transition: background 0.18s, color 0.18s, border-color 0.18s;
            white-space: nowrap;
            font-weight: 500;
        }
        .cb-chip:hover {
            background: #6F2A2A;
            color: #fff;
            border-color: #6F2A2A;
        }

        /* Product cards */
        .cb-products-wrap {
            margin-top: 8px;
            animation: cbFadeUp 0.28s ease both;
        }
        .cb-products-label {
            font-size: 11px;
            font-weight: 600;
            color: #9b7553;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 7px;
        }
        .cb-products-scroll {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 6px;
        }
        .cb-products-scroll::-webkit-scrollbar { height: 3px; }
        .cb-products-scroll::-webkit-scrollbar-thumb { background: #d4b896; border-radius: 4px; }
        .cb-product-card {
            flex-shrink: 0;
            width: 140px;
            background: #fff;
            border: 1px solid #e9e1d6;
            border-radius: 10px;
            overflow: hidden;
            text-decoration: none;
            color: inherit;
            transition: box-shadow 0.2s, transform 0.2s;
            display: flex;
            flex-direction: column;
        }
        .cb-product-card:hover {
            box-shadow: 0 6px 20px rgba(111,42,42,0.14);
            transform: translateY(-2px);
        }
        .cb-product-card img {
            width: 100%;
            height: 90px;
            object-fit: cover;
            background: #f5f2eb;
        }
        .cb-product-card .cb-card-body {
            padding: 7px 8px 8px;
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        .cb-product-card .cb-card-name {
            font-size: 11.5px;
            font-weight: 600;
            color: #374151;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 5px;
        }
        .cb-product-card .cb-card-price {
            font-size: 11px;
            color: #6F2A2A;
            font-weight: 700;
            margin-top: auto;
        }

        /* Input area */
        #cb-input-area {
            padding: 10px 12px;
            border-top: 1px solid #eee;
            background: #fff;
            flex-shrink: 0;
        }
        #cb-form { display: flex; gap: 8px; align-items: center; }
        #cb-input {
            flex: 1;
            border: 1.5px solid #e0d4c3;
            border-radius: 22px;
            padding: 9px 15px;
            font-size: 13px;
            outline: none;
            transition: border-color 0.2s;
            font-family: inherit;
            background: #faf8f5;
        }
        #cb-input:focus { border-color: #6F2A2A; background: #fff; }
        #cb-send {
            background: #c49a45;
            border: none;
            border-radius: 22px;
            color: #fff;
            font-size: 12px;
            font-weight: 700;
            padding: 9px 18px;
            cursor: pointer;
            transition: background 0.2s;
            white-space: nowrap;
            font-family: inherit;
        }
        #cb-send:hover { background: #a67c2e; }
        #cb-send:disabled { opacity: 0.55; cursor: not-allowed; }

        /* Toggle button */
        #cb-toggle {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            width: 54px;
            height: 54px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6F2A2A, #8B1A1A);
            border: none;
            cursor: pointer;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(111,42,42,0.4);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        #cb-toggle:hover {
            transform: scale(1.08);
            box-shadow: 0 6px 28px rgba(111,42,42,0.5);
        }
        #chatbot-container { position: fixed; bottom: 24px; right: 24px; z-index: 9998; }
    `;
    document.head.appendChild(style);

    // ── Inject HTML ────────────────────────────────────────────────────
    const wrap = document.createElement('div');
    wrap.id = 'chatbot-container';
    wrap.innerHTML = `
        <div id="chatbot-panel" role="dialog" aria-label="Trợ lý Smart Calendar">
            <!-- Header -->
            <div id="cb-header">
                <div id="cb-header-top">
                    <span id="cb-title">Trợ lý tư vấn</span>
                    <div id="cb-header-actions">
                        <button class="cb-icon-btn" id="cb-expand" aria-label="Mở rộng khung chat" title="Mở rộng">
                            <svg id="cb-expand-icon" width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                            </svg>
                        </button>
                        <button class="cb-icon-btn" id="cb-close" aria-label="Đóng trợ lý">
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div id="cb-date-bar"></div>
            </div>

            <!-- Messages -->
            <div id="cb-messages">
                <div class="cb-row bot">
                    <div class="cb-bubble">Xin chào! Tôi là <strong> Trợ lý tư vấn đồ lễ</strong>. Bạn có thể hỏi tôi về ngày lễ âm lịch, nghi thức thờ cúng và sản phẩm phù hợp.</div>
                </div>
            </div>

            <!-- Quick chips -->
            <div id="cb-chips">
                <button class="cb-chip" data-msg="Rằm tháng này cần chuẩn bị gì?">Rằm tháng này</button>
                <button class="cb-chip" data-msg="Mùng Một tới cần mua gì?">Mùng Một tới</button>
                <button class="cb-chip" data-msg="Tháng Cô Hồn cần lễ vật gì?">Tháng Cô Hồn</button>
                <button class="cb-chip" data-msg="Tết Thanh Minh là ngày nào và cần chuẩn bị gì?">Tết Thanh Minh</button>
                <button class="cb-chip" data-msg="Hôm nay có ngày cúng không?">Lịch cúng hôm nay</button>
            </div>

            <!-- Input -->
            <div id="cb-input-area">
                <form id="cb-form">
                    <input type="text" id="cb-input" placeholder="Hỏi về ngày lễ hoặc sản phẩm..." autocomplete="off">
                    <button type="submit" id="cb-send">Gửi</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(wrap);

    // ── Toggle button (outside container for fixed positioning) ────────
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'cb-toggle';
    toggleBtn.setAttribute('aria-label', 'Mở trợ lý tư vấn');
    toggleBtn.innerHTML = `
        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>`;
    document.body.appendChild(toggleBtn);

    // ── Refs ───────────────────────────────────────────────────────────
    const panel = document.getElementById('chatbot-panel');
    const messages = document.getElementById('cb-messages');
    const form = document.getElementById('cb-form');
    const input = document.getElementById('cb-input');
    const sendBtn = document.getElementById('cb-send');
    const closeBtn = document.getElementById('cb-close');
    const expandBtn = document.getElementById('cb-expand');
    const expandIcon = document.getElementById('cb-expand-icon');
    const chipsEl = document.getElementById('cb-chips');
    const dateBar = document.getElementById('cb-date-bar');

    // ── Date bar ───────────────────────────────────────────────────────
    (function renderDateBar() {
        const d = new Date();
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        dateBar.textContent = `${days[d.getDay()]}, ${dd}/${mm}/${yyyy}`;
    })();

    // ── State ──────────────────────────────────────────────────────────
    let isOpen = false;
    let isExpanded = false;
    let history = [];

    // ── Expand SVG icons ───────────────────────────────────────────────
    const svgExpand = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>`;
    const svgCollapse = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9L4 4m0 0l5 0M4 4v5m11-1l5-5m0 0l-5 0m5 0v5M9 15l-5 5m0 0h5m-5 0v-5m11 5l5-5m0 5h-5m5 0v-5"/>`;

    // ── Open / Close ───────────────────────────────────────────────────
    toggleBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        panel.classList.toggle('cb-open', isOpen);
        if (isOpen) setTimeout(() => input.focus(), 300);
    });
    closeBtn.addEventListener('click', () => {
        isOpen = false;
        panel.classList.remove('cb-open');
    });

    // ── Expand / Collapse ──────────────────────────────────────────────
    expandBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        panel.classList.toggle('cb-expanded', isExpanded);
        expandIcon.innerHTML = isExpanded ? svgCollapse : svgExpand;
        expandBtn.title = isExpanded ? 'Thu nhỏ' : 'Mở rộng';
    });

    // ── Quick chips ────────────────────────────────────────────────────
    chipsEl.addEventListener('click', (e) => {
        const chip = e.target.closest('.cb-chip');
        if (!chip) return;
        const msg = chip.dataset.msg;
        // Hide chips after first use
        chipsEl.style.display = 'none';
        sendMessage(msg);
    });

    // ── Form submit ────────────────────────────────────────────────────
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = input.value.trim();
        if (!msg) return;
        // Hide chips on first manual message
        chipsEl.style.display = 'none';
        input.value = '';
        sendMessage(msg);
    });

    // ── Core send function ─────────────────────────────────────────────
    async function sendMessage(msg) {
        appendBubble('user', msg);
        const typingId = showTyping();
        sendBtn.disabled = true;

        try {
            const res = await ApiClient.post('/chatbot', { message: msg, history });
            removeTyping(typingId);

            const text = res.response || '';
            const products = res.suggested_products || [];

            appendBubble('bot', text, products);

            history.push({ role: 'user', content: msg });
            history.push({ role: 'assistant', content: text });
            if (history.length > 20) history = history.slice(-20);
        } catch (err) {
            removeTyping(typingId);
            appendBubble('bot', 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            sendBtn.disabled = false;
        }
    }

    // ── Append bubble ──────────────────────────────────────────────────
    function appendBubble(role, content, products = []) {
        const isUser = role === 'user';
        const row = document.createElement('div');
        row.className = `cb-row ${isUser ? 'user' : 'bot'}`;

        // Parse markdown for bot
        let html = content;
        if (!isUser) {
            if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
                html = marked.parse(content);
            } else {
                html = content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\n/g, '<br>');
            }
        }

        const bubble = document.createElement('div');
        bubble.className = 'cb-bubble';
        bubble.innerHTML = isUser ? escapeHtml(content) : html;
        row.appendChild(bubble);

        // Product cards
        if (!isUser && products.length > 0) {
            row.appendChild(buildProductCards(products));
        }

        messages.appendChild(row);
        messages.scrollTop = messages.scrollHeight;
    }

    // ── Typing indicator ───────────────────────────────────────────────
    function showTyping() {
        const id = 'typing-' + Date.now();
        const row = document.createElement('div');
        row.className = 'cb-row bot';
        row.id = id;
        row.innerHTML = `<div class="cb-bubble"><div class="cb-typing"><span class="cb-dot"></span><span class="cb-dot"></span><span class="cb-dot"></span></div></div>`;
        messages.appendChild(row);
        messages.scrollTop = messages.scrollHeight;
        return id;
    }
    function removeTyping(id) {
        document.getElementById(id)?.remove();
    }

    // ── Product cards ──────────────────────────────────────────────────
    function buildProductCards(products) {
        const wrap = document.createElement('div');
        wrap.className = 'cb-products-wrap';

        const label = document.createElement('div');
        label.className = 'cb-products-label';
        label.textContent = 'Sản phẩm gợi ý:';
        wrap.appendChild(label);

        const scroll = document.createElement('div');
        scroll.className = 'cb-products-scroll';

        products.slice(0, 4).forEach(p => {
            const price = parseInt(p.price).toLocaleString('vi-VN');
            const imgSrc = p.image || 'https://placehold.co/140x90/f5f2eb/9b7553?text=SP';
            const card = document.createElement('a');
            card.className = 'cb-product-card';
            card.href = `product-detail.html?slug=${encodeURIComponent(p.slug)}`;
            card.target = '_blank';
            card.rel = 'noopener';
            card.innerHTML = `
                <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(p.name)}" loading="lazy"
                     onerror="this.src='https://placehold.co/140x90/f5f2eb/9b7553?text=SP'">
                <div class="cb-card-body">
                    <div class="cb-card-name">${escapeHtml(p.name)}</div>
                    <div class="cb-card-price">${price} đ</div>
                </div>`;
            scroll.appendChild(card);
        });

        wrap.appendChild(scroll);
        return wrap;
    }


    // ── Helpers ────────────────────────────────────────────────────────
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ── Global: Smart Calendar integration ────────────────────────────
    window.openChatbotWithMessage = function (msg) {
        isOpen = true;
        panel.classList.add('cb-open');
        chipsEl.style.display = 'none';
        setTimeout(() => sendMessage(msg), 200);
    };

})();

