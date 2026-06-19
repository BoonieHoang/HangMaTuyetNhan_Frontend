/* =====================================================================
   Smart Calendar — Standalone Widget
   Inject CSS + HTML + Logic into any page via <script> tag.
   Mirrors the inline smart-calendar block from index.html.
===================================================================== */

(function () {
    // ── Inject CSS ─────────────────────────────────────────────────────
    var style = document.createElement('style');
    style.textContent = `
        #sc-container {
            position: fixed;
            bottom: 94px;
            right: 24px;
            z-index: 9998;
        }

        /* Floating Button */
        #sc-toggle {
            width: 54px;
            height: 54px;
            border-radius: 50%;
            background: linear-gradient(135deg, #c49a45, #a67c2e);
            border: none;
            cursor: pointer;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(196, 154, 69, 0.4);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        #sc-toggle:hover {
            transform: scale(1.08);
            box-shadow: 0 6px 28px rgba(196, 154, 69, 0.5);
        }

        /* Sliding Panel */
        #sc-panel {
            display: flex;
            flex-direction: column;
            position: fixed;
            bottom: 140px;
            right: 24px;
            width: 420px;
            height: 560px;
            max-height: calc(100vh - 170px);
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
            border: 1px solid #e5e7eb;
            overflow: hidden;
            transform: scale(0.92) translateY(16px);
            opacity: 0;
            pointer-events: none;
            transition: transform 0.25s cubic-bezier(.34, 1.56, .64, 1), opacity 0.2s ease;
            transform-origin: bottom right;
        }

        #sc-panel.sc-open {
            transform: scale(1) translateY(0);
            opacity: 1;
            pointer-events: all;
        }

        @media (max-width: 460px) {
            #sc-panel {
                width: calc(100vw - 48px);
                right: 24px;
                bottom: 140px;
                max-height: calc(100vh - 170px);
            }
        }

        /* Header */
        #sc-header {
            background: linear-gradient(135deg, #c49a45 0%, #a67c2e 100%);
            color: #fff;
            padding: 14px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
        }

        #sc-title {
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.02em;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .sc-close-btn {
            background: rgba(255, 255, 255, 0.15);
            border: none;
            cursor: pointer;
            border-radius: 6px;
            color: #fff;
            padding: 5px;
            display: flex;
            align-items: center;
            transition: background 0.2s;
        }

        .sc-close-btn:hover {
            background: rgba(255, 255, 255, 0.28);
        }

        /* Body */
        #sc-body {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            background: #faf8f5;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        #sc-body::-webkit-scrollbar { width: 4px; }
        #sc-body::-webkit-scrollbar-thumb { background: #d4b896; border-radius: 4px; }

        #sc-holidays-list {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        /* Monthly Calendar Box */
        .sc-month-box {
            background: #fff;
            border: 1px solid #e8ddd0;
            border-radius: 12px;
            padding: 14px;
            box-shadow: 0 4px 12px rgba(111, 42, 42, 0.03);
            flex-shrink: 0;
        }

        .sc-month-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .sc-month-title {
            font-size: 13.5px;
            font-weight: 700;
            color: #6F2A2A;
            letter-spacing: 0.02em;
        }

        .sc-month-nav {
            width: 26px;
            height: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fdf6ec;
            border: 1px solid #e8ddd0;
            border-radius: 50%;
            color: #6F2A2A;
            cursor: pointer;
            font-size: 14px;
            line-height: 1;
            transition: background 0.2s, border-color 0.2s;
            outline: none;
        }

        .sc-month-nav:hover {
            background: #f5e8d4;
            border-color: #c49a45;
        }

        .sc-month-grid-weekdays {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            text-align: center;
            font-size: 10.5px;
            font-weight: 700;
            color: #9b7553;
            margin-bottom: 8px;
            border-bottom: 1px solid #f3eee8;
            padding-bottom: 4px;
        }

        .sc-month-grid-days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            row-gap: 6px;
            text-align: center;
        }

        .sc-day-cell {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 11.5px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            margin: 0 auto;
            color: #374151;
            position: relative;
        }

        .sc-day-cell:hover:not(.sc-day-empty) {
            background: #fdf6ec;
            color: #6F2A2A;
        }

        .sc-day-empty { pointer-events: none; opacity: 0; }

        .sc-day-today {
            border: 1.5px solid #6F2A2A;
            color: #6F2A2A;
            font-weight: 700;
        }

        .sc-day-holiday {
            background: linear-gradient(135deg, #c49a45, #a67c2e);
            color: #fff !important;
            font-weight: 700;
            box-shadow: 0 2px 8px rgba(196, 154, 69, 0.35);
        }

        /* Section Title */
        .sc-section-title {
            font-size: 11.5px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #6F2A2A;
            margin: 6px 0 2px;
            display: flex;
            align-items: center;
            gap: 6px;
            flex-shrink: 0;
        }

        /* Cards */
        .sc-card {
            background: #fff;
            border: 1px solid #e8ddd0;
            border-radius: 12px;
            padding: 16px;
            position: relative;
            overflow: hidden;
            transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
        }

        .sc-card:hover {
            box-shadow: 0 6px 20px rgba(196, 154, 69, 0.12);
            transform: translateY(-2px);
        }

        .sc-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 3px;
            background: linear-gradient(90deg, #c49a45, #a67c2e);
        }

        .sc-badge {
            align-self: flex-start;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 9px;
            border-radius: 20px;
            margin-bottom: 8px;
        }

        .sc-badge.urgent { background: #fee2e2; color: #991b1b; }
        .sc-badge.soon   { background: #fef3c7; color: #92400e; }
        .sc-badge.later  { background: #f0fdf4; color: #166534; }

        .sc-lunar {
            font-size: 11px;
            color: #c49a45;
            font-weight: 600;
            margin-bottom: 6px;
            letter-spacing: 0.02em;
        }

        .sc-name {
            font-size: 16px;
            font-weight: 700;
            color: #6F2A2A;
            margin-bottom: 6px;
            line-height: 1.3;
        }

        .sc-desc {
            font-size: 12px;
            color: #4b5563;
            line-height: 1.5;
            margin-bottom: 12px;
        }

        .sc-products-label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #9b7553;
            margin-bottom: 6px;
        }

        .sc-product-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 12px;
        }

        .sc-chip {
            background: #fdf6ec;
            border: 1px solid #e8ddd0;
            color: #6F2A2A;
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 20px;
            font-weight: 500;
            text-decoration: none;
            display: inline-block;
            transition: background 0.18s, border-color 0.18s;
        }

        .sc-chip:hover { background: #f5e8d4; border-color: #c49a45; }

        .sc-actions { display: flex; gap: 8px; margin-top: auto; }

        .sc-btn-primary {
            flex: 1;
            text-align: center;
            background: #6F2A2A;
            color: #fff;
            font-size: 11.5px;
            font-weight: 700;
            padding: 7px 10px;
            border-radius: 6px;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: background 0.2s;
        }

        .sc-btn-primary:hover { background: #8B1A1A; }

        .sc-btn-secondary {
            flex: 1;
            text-align: center;
            background: transparent;
            color: #c49a45;
            font-size: 11.5px;
            font-weight: 700;
            padding: 7px 10px;
            border-radius: 6px;
            border: 1.5px solid #c49a45;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
        }

        .sc-btn-secondary:hover { background: #c49a45; color: #fff; }

        @keyframes cardHighlight {
            0%   { border-color: #c49a45; box-shadow: 0 0 16px rgba(196,154,69,0.35); transform: scale(1.015); }
            100% { border-color: #e8ddd0; box-shadow: none; transform: scale(1); }
        }

        .sc-card-highlight { animation: cardHighlight 1.5s ease-out; }
    `;
    document.head.appendChild(style);

    // ── Inject HTML ────────────────────────────────────────────────────
    var wrap = document.createElement('div');
    wrap.id = 'sc-container';
    wrap.innerHTML = `
        <!-- Floating Button -->
        <button id="sc-toggle" title="Lịch Lễ Tâm Linh">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
        </button>

        <!-- Sidebar Panel -->
        <div id="sc-panel">
            <div id="sc-header">
                <div id="sc-title">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span>Smart Calendar</span>
                </div>
                <button class="sc-close-btn" id="sc-close" title="Đóng">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div id="sc-body">
                <!-- Month Calendar Box -->
                <div class="sc-month-box">
                    <div class="sc-month-header">
                        <button id="sc-month-prev" class="sc-month-nav">&larr;</button>
                        <span id="sc-month-title" class="sc-month-title">Tháng --/----</span>
                        <button id="sc-month-next" class="sc-month-nav">&rarr;</button>
                    </div>
                    <div class="sc-month-grid-weekdays">
                        <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div>CN</div>
                    </div>
                    <div id="sc-month-days" class="sc-month-grid-days"></div>
                </div>

                <div class="sc-section-title">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Ngày Lễ Sắp Tới</span>
                </div>
                <div id="sc-holidays-list">
                    <div style="text-align:center;font-size:13px;" id="sc-loading">Đang tải lịch ngày lễ...</div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(wrap);

    // ── Refs ───────────────────────────────────────────────────────────
    var API_BASE = 'https://hangmatuyetnhanbackend-production.up.railway.app/api';
    var toggleBtn    = document.getElementById('sc-toggle');
    var closeBtn     = document.getElementById('sc-close');
    var panel        = document.getElementById('sc-panel');
    var holidaysList = document.getElementById('sc-holidays-list');
    var monthTitle   = document.getElementById('sc-month-title');
    var monthDays    = document.getElementById('sc-month-days');
    var prevBtn      = document.getElementById('sc-month-prev');
    var nextBtn      = document.getElementById('sc-month-next');

    var today        = new Date();
    var currentYear  = today.getFullYear();
    var currentMonth = today.getMonth(); // 0-11
    var fetchedHolidays = [];

    // ── Toggle Open/Close ──────────────────────────────────────────────
    toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        panel.classList.toggle('sc-open');

        // Close chatbot panel if open to avoid overlap
        var cbPanel = document.getElementById('chatbot-panel');
        if (cbPanel && cbPanel.classList.contains('cb-open') && panel.classList.contains('sc-open')) {
            cbPanel.classList.remove('cb-open');
        }
    });

    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        panel.classList.remove('sc-open');
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
        if (panel.classList.contains('sc-open') &&
            !panel.contains(e.target) &&
            e.target !== toggleBtn &&
            !toggleBtn.contains(e.target)) {
            panel.classList.remove('sc-open');
        }
    });

    // ── Month Navigation ───────────────────────────────────────────────
    prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        updateCalendarView();
    });

    nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        updateCalendarView();
    });

    // ── Fetch from backend with LocalStorage Cache ─────────────────────
    var CACHE_KEY = 'sc_holidays_cache_v3';
    var CACHE_TIME_KEY = 'sc_holidays_cache_time_v3';
    var CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

    function fetchHolidays() {
        const getPromise = (typeof ApiClient !== 'undefined')
            ? ApiClient.get('/smart-calendar')
            : fetch(API_BASE + '/smart-calendar', { headers: { 'Accept': 'application/json' } }).then(function(r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.json();
            });

        getPromise
            .then(function (data) {
                fetchedHolidays = (data && data.data) ? data.data : (data || []);
                if (fetchedHolidays.length > 0) {
                    try {
                        localStorage.setItem(CACHE_KEY, JSON.stringify(fetchedHolidays));
                        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
                    } catch (e) {
                        console.warn('Failed to save calendar cache:', e);
                    }
                }
                renderHolidayCards(fetchedHolidays);
                updateCalendarView();
            })
            .catch(function (err) {
                console.warn('Smart Calendar fetch failed:', err);
                holidaysList.innerHTML = '<div style="text-align:center;padding:20px 0;color:#9b7553;font-size:13px;">Không thể tải lịch ngày lễ. Vui lòng thử lại sau.</div>';
            });
    }

    try {
        var cachedData = localStorage.getItem(CACHE_KEY);
        var cachedTime = localStorage.getItem(CACHE_TIME_KEY);

        if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime, 10) < CACHE_DURATION)) {
            fetchedHolidays = JSON.parse(cachedData) || [];
            if (fetchedHolidays.length > 0) {
                renderHolidayCards(fetchedHolidays);
                updateCalendarView();
            } else {
                fetchHolidays();
            }
        } else {
            fetchHolidays();
        }
    } catch (e) {
        fetchHolidays();
    }

    // ── Update Calendar View ───────────────────────────────────────────
    function updateCalendarView() {
        var monthNames = ["01","02","03","04","05","06","07","08","09","10","11","12"];
        monthTitle.textContent = "Tháng " + monthNames[currentMonth] + "/" + currentYear;
        monthDays.innerHTML = '';

        var totalDays    = new Date(currentYear, currentMonth + 1, 0).getDate();
        var firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
        firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

        for (var i = 0; i < firstDayIndex; i++) {
            var emptyCell = document.createElement('div');
            emptyCell.className = 'sc-day-cell sc-day-empty';
            monthDays.appendChild(emptyCell);
        }

        for (var d = 1; d <= totalDays; d++) {
            var cell = document.createElement('div');
            cell.className = 'sc-day-cell';
            cell.textContent = d;

            if (currentYear === today.getFullYear() && currentMonth === today.getMonth() && d === today.getDate()) {
                cell.classList.add('sc-day-today');
            }

            var dateStr = currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
            var holiday = findHolidayByDate(dateStr);

            if (holiday) {
                cell.classList.add('sc-day-holiday');
                cell.title = holiday.name + " (" + (holiday.lunarLabel || '') + ")";
                cell.addEventListener('click', (function (hName, dStr) {
                    return function (e) {
                        e.stopPropagation();
                        var cardEl = document.getElementById('sc-card-' + dStr);
                        if (cardEl) {
                            cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            cardEl.classList.remove('sc-card-highlight');
                            void cardEl.offsetWidth;
                            cardEl.classList.add('sc-card-highlight');
                        }
                    };
                })(holiday.name, dateStr));
            }

            monthDays.appendChild(cell);
        }
    }

    function findHolidayByDate(dateStr) {
        for (var i = 0; i < fetchedHolidays.length; i++) {
            var h = fetchedHolidays[i];
            if (h.nextDate && h.nextDate === dateStr) return h;
        }
        return null;
    }

    // ── Render Holiday Cards ───────────────────────────────────────────
    function renderHolidayCards(holidays) {
        var now = new Date();
        now.setHours(0, 0, 0, 0);

        var upcoming = holidays
            .filter(function (h) {
                if (!h.nextDate) return false;
                var parts = h.nextDate.split('-');
                var hDate = new Date(parts[0], parts[1] - 1, parts[2]);
                return hDate >= now;
            })
            .sort(function (a, b) {
                var ap = a.nextDate.split('-');
                var bp = b.nextDate.split('-');
                var ad = new Date(ap[0], ap[1] - 1, ap[2]);
                var bd = new Date(bp[0], bp[1] - 1, bp[2]);
                return ad - bd;
            })
            .slice(0, 3);

        if (!upcoming.length) {
            holidaysList.innerHTML = '<div style="text-align:center;padding:20px 0;color:#9b7553;font-size:13px;">Không có ngày lễ sắp tới trong danh sách.</div>';
            return;
        }

        holidaysList.innerHTML = '';
        upcoming.forEach(function (h) {
            var parts = h.nextDate.split('-');
            var hDate = new Date(parts[0], parts[1] - 1, parts[2]);
            var diffTime = hDate.getTime() - now.getTime();
            var days = Math.round(diffTime / 86400000);
            var badgeClass = days <= 7 ? 'urgent' : (days <= 30 ? 'soon' : 'later');
            var badgeLabel = days === 0 ? 'Hôm nay' : (days === 1 ? 'Ngày mai' : days + ' ngày nữa');

            var chips = '';
            if (h.products && h.products.length) {
                chips = h.products.map(function (p) {
                    return '<a href="products.html?search=' + encodeURIComponent(p.name) + '" class="sc-chip">' + p.name + '</a>';
                }).join('');
            } else {
                chips = '<span class="sc-chip" style="color:#9b9b9b;border-style:dashed;">Đang cập nhật...</span>';
            }

            var card = document.createElement('div');
            card.className = 'sc-card';
            card.id = 'sc-card-' + h.nextDate;
            card.innerHTML = [
                '<span class="sc-badge ' + badgeClass + '">' + badgeLabel + '</span>',
                '<div class="sc-lunar">' + (h.lunarLabel || '') + '</div>',
                '<div class="sc-name">' + h.name + '</div>',
                '<p class="sc-desc">' + (h.description || '') + '</p>',
                '<div class="sc-products-label">Sản phẩm gợi ý:</div>',
                '<div class="sc-product-chips">' + chips + '</div>',
                '<div class="sc-actions">',
                '  <a href="products.html" class="sc-btn-primary">Xem sản phẩm</a>',
                '  <button class="sc-btn-secondary sc-ask-btn">Hỏi AI</button>',
                '</div>',
            ].join('');

            var aiQuery = 'Tư vấn lễ vật và nghi thức chuẩn bị cho ' + h.name;
            card.querySelector('.sc-ask-btn').addEventListener('click', (function (q) {
                return function (e) {
                    e.stopPropagation();
                    panel.classList.remove('sc-open');

                    if (typeof window.openChatbotWithMessage === 'function') {
                        window.openChatbotWithMessage(q);
                    } else {
                        var cbPanel = document.getElementById('chatbot-panel');
                        var cbInput = document.getElementById('cb-input');
                        if (cbPanel) {
                            cbPanel.classList.add('cb-open');
                            if (cbInput) { cbInput.value = q; cbInput.focus(); }
                        }
                    }
                };
            })(aiQuery));

            holidaysList.appendChild(card);
        });
    }

})();
