/* ==========================================================================
   Çorlu Akıl Oyunları Derneği — Takım Maçı Kâğıdı (arayüz katmanı)
   Hesaplamalar scoring.js, eşleme sync.js içindedir.

   İki mod:
     • BULUT  — oyun koduyla iki ayrı cihaz aynı kâğıda bağlanır (Firestore).
                Karşı odanın satırı, iki oda da kaydetmeden SUNUCUDAN GELMEZ.
     • YEREL  — internetsiz, tek cihaz; odalar "Oda değiştir" ile sırayla girer.
   ========================================================================== */
(function () {
  'use strict';

  const S = window.Scoring;
  const SON_MAC_KEY = 'bricSonMac';
  const ROOM_KEY    = 'bricOda';          // sessionStorage: sekmeye özel oda

  const DIR_ORDER = [['N', 'Kuzey'], ['E', 'Doğu'], ['S', 'Güney'], ['W', 'Batı']];
  const DBL_ORDER = [['normal', '—'], ['doubled', 'Dbl'], ['redoubled', 'RDbl']];
  const ROOM_TR   = { open: 'AÇIK ODA', closed: 'KAPALI ODA' };
  const VULN_TR   = { '-': 'Zon yok', 'NS': 'Zon K‑G', 'EW': 'Zon D‑B', 'ALL': 'Zon her iki taraf' };
  const VULN_SHORT= { '-': '—', 'NS': 'K‑G', 'EW': 'D‑B', 'ALL': 'HEPSİ' };
  const VULN_CYC  = ['-', 'NS', 'EW', 'ALL'];

  const $  = (s) => document.querySelector(s);
  const $$ = (s) => Array.prototype.slice.call(document.querySelectorAll(s));

  /* ------------------------------------------------------------- durum */
  let match = null;            // açık maç
  let room  = null;            // 'open' | 'closed' — bu cihazın/sekmenin odası
  let drafts = [];             // satır satır düzenlenen kopyalar
  let setupRoom = null;        // kurulum ekranında seçilen oda
  let cloudHata = false;

  function blankEntry() {
    return { level: null, strain: null, result: null, doubling: 'normal', direction: null };
  }
  function newMatch(kod, mod, ev, misafir, boardSayisi, openHomeSide) {
    const boards = [];
    for (let i = 1; i <= boardSayisi; i++) {
      boards.push({ no: i, vuln: null, open: null, closed: null, durum: { open: false, closed: false } });
    }
    return {
      version: 4, kod: kod, mod: mod, bitti: false,
      tamam: { open: false, closed: false },
      homeTeam: ev, awayTeam: misafir,
      boardCount: boardSayisi, openHomeSide: openHomeSide,
      createdAt: new Date().toISOString(),
      boards: boards
    };
  }
  function bulut() { return match && match.mod === 'cloud'; }

  /* --------------------------------------------------- yerel önbellek
     Kendi odanızın satırları YALNIZ bu cihazda durur: sunucudan geri
     okunamaz (kural gereği), o yüzden önbellek şart. */
  function cacheKey(kod) { return 'bricYerel_' + (kod || 'LOCAL'); }
  function cacheSave() {
    if (!match) return;
    try {
      localStorage.setItem(cacheKey(match.kod), JSON.stringify(Object.assign({}, match, { sonOda: room })));
      localStorage.setItem(SON_MAC_KEY, match.kod || 'LOCAL');
    } catch (e) { note($('#listMsg'), 'Kayıt yapılamadı (tarayıcı belleği kapalı olabilir).', 'err'); }
  }
  function cacheLoad(kod) {
    try {
      const raw = localStorage.getItem(cacheKey(kod));
      if (!raw) return null;
      const m = JSON.parse(raw);
      return (m && Array.isArray(m.boards)) ? m : null;
    } catch (e) { return null; }
  }
  function sonMacKodu() { try { return localStorage.getItem(SON_MAC_KEY); } catch (e) { return null; } }

  /* ------------------------------------------------------------- yardımcı */
  function note(el, text, kind) {
    if (!el) return;
    el.textContent = text || '';
    el.className = 'msg' + (text ? ' show ' + (kind || 'ok') : '');
    if (text) { clearTimeout(el._t); el._t = setTimeout(function () { note(el, ''); }, 5000); }
  }
  function boardVuln(b) { return b.vuln || S.boardVulnerability(b.no); }
  function vulnFor(b, direction) {
    const v = boardVuln(b);
    if (v === 'ALL') return true;
    if (v === '-') return false;
    const side = S.DIRECTIONS[direction] ? S.DIRECTIONS[direction].side : null;
    return side === v;
  }
  function pasMi(e) { return !!e && S.isPass(e.strain); }
  function isComplete(e) {
    if (pasMi(e)) return true;                 // pas: başka giriş beklemez
    return !!(e && e.level && e.strain && e.direction && e.result !== null && e.result !== undefined);
  }
  /* Renk kutusunda "Pas" seçildiğinde satırın kalan alanları anlamsızlaşır. */
  function pasaCevir(d) {
    d.strain = S.PASS; d.level = null; d.result = 0;
    d.doubling = 'normal'; d.direction = null;
  }
  function sameEntry(a, b) {
    if (!a || !b) return false;
    return a.level === b.level && a.strain === b.strain && Number(a.result) === Number(b.result)
        && (a.doubling || 'normal') === (b.doubling || 'normal') && a.direction === b.direction;
  }
  function otherRoom() { return room === 'open' ? 'closed' : 'open'; }
  function teamName(which) { return which === 'home' ? match.homeTeam : match.awayTeam; }
  function girdiMi(b, oda) { return !!(b[oda] || (b.durum && b.durum[oda])); }
  function benimSayim() {
    return match.boards.filter(function (b) { return !!b[room]; }).length;
  }
  function karsiSayim() {
    return match.boards.filter(function (b) { return girdiMi(b, otherRoom()); }).length;
  }
  function hepsiGirildi() {
    return match.boards.every(function (b) { return isComplete(b.open) && isComplete(b.closed); });
  }

  function rowResult(b) {
    if (!isComplete(b.open) || !isComplete(b.closed)) return null;
    try {
      return S.calculateBoardResult({
        boardNo: b.no,
        openRoom:   Object.assign({}, b.open,   { vulnerable: vulnFor(b, b.open.direction) }),
        closedRoom: Object.assign({}, b.closed, { vulnerable: vulnFor(b, b.closed.direction) }),
        openHomeSide: match.openHomeSide
      });
    } catch (e) { return null; }
  }
  function rawScoreOf(b, entry) {
    if (!isComplete(entry)) return null;
    try {
      return S.calculateBridgeScore({
        level: entry.level, strain: entry.strain, result: Number(entry.result),
        vulnerable: vulnFor(b, entry.direction), doubling: entry.doubling || 'normal'
      });
    } catch (e) { return null; }
  }
  function labelOf(e) { return S.contractLabel(e.level, e.strain, Number(e.result), e.doubling || 'normal'); }
  function sideShort(dir) {
    if (!S.DIRECTIONS[dir]) return '—';        // pas geçilen boardda deklaran yok
    return S.DIRECTIONS[dir].side === 'NS' ? 'K‑G' : 'D‑B';
  }

  /* ====================================================================
     KURULUM EKRANI
     ==================================================================== */
  function initSetup() {
    const sonKod = sonMacKodu();
    const onceki = sonKod ? cacheLoad(sonKod === 'LOCAL' ? null : sonKod) : null;
    if (onceki) {
      $('#resumeBox').hidden = false;
      $('#resumeInfo').textContent = onceki.homeTeam + ' — ' + onceki.awayTeam +
        ' · ' + onceki.boardCount + ' board' + (onceki.kod ? ' · kod ' + onceki.kod : ' · tek cihaz');
      $('#homeInput').value = onceki.homeTeam;
      $('#awayInput').value = onceki.awayTeam;
      $('#boardCount').value = onceki.boardCount;
      setSeg($('#seatSeg'), onceki.openHomeSide);
      if (onceki.sonOda) { setupRoom = onceki.sonOda; isaretleOda(); }
    }

    $('#roomPick').addEventListener('click', function (e) {
      const btn = e.target.closest('.room-card');
      if (!btn) return;
      setupRoom = btn.dataset.room;
      isaretleOda();
      note($('#setupMsg'), '');
    });

    $('#macTabs').addEventListener('click', function (e) {
      const btn = e.target.closest('button');
      if (!btn) return;
      setSeg($('#macTabs'), btn.dataset.v);
      const yeni = btn.dataset.v === 'yeni';
      $('#panelYeni').hidden = !yeni;
      $('#panelKatil').hidden = yeni;
      $('#startBtn').textContent = yeni ? 'MAÇI KUR VE KOD AL' : 'MAÇA KATIL';
      $('#localBtn').hidden = !yeni;
      odaSeciciGoster(yeni);
      note($('#setupMsg'), '');
    });

    $('#kodInput').addEventListener('input', function () {
      this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    });

    $('#seatSeg').addEventListener('click', function (e) {
      const btn = e.target.closest('button');
      if (btn) setSeg($('#seatSeg'), btn.dataset.v);
    });

    $('#countMinus').addEventListener('click', function () { bumpCount(-1); });
    $('#countPlus').addEventListener('click',  function () { bumpCount(+1); });
    $('#countQuick').addEventListener('click', function (e) {
      const btn = e.target.closest('button');
      if (btn) { $('#boardCount').value = btn.dataset.n; markQuick(); }
    });
    $('#boardCount').addEventListener('input', markQuick);
    markQuick();

    $('#startBtn').addEventListener('click', function () {
      if (segValue($('#macTabs')) === 'katil') joinMatch(); else startMatch('cloud');
    });
    $('#localBtn').addEventListener('click', function () { startMatch('local'); });

    $('#resumeBtn').addEventListener('click', function () {
      if (!setupRoom) { note($('#setupMsg'), 'Önce odanızı seçin.', 'err'); return; }
      const m = cacheLoad(sonKod === 'LOCAL' ? null : sonKod);
      if (!m) { note($('#setupMsg'), 'Kayıtlı maç bulunamadı.', 'err'); return; }
      match = m; room = setupRoom;
      sessionStorage.setItem(ROOM_KEY, room);
      openSheet();
    });
    $('#discardBtn').addEventListener('click', function () {
      if (!confirm('Bu cihazdaki kayıt silinsin mi? Girdiğiniz boardlar kaybolur.')) return;
      try {
        localStorage.removeItem(cacheKey(sonKod === 'LOCAL' ? null : sonKod));
        localStorage.removeItem(SON_MAC_KEY);
      } catch (e) {}
      $('#resumeBox').hidden = true;
      note($('#setupMsg'), 'Eski maç silindi.', 'ok');
    });
  }

  /* Koda katılırken oda seçilmez: kuran odanın karşısına kendiliğinden atanır.
     (Eski, kuranOda bilgisi olmayan maçlarda seçici geri açılır.) */
  function odaSeciciGoster(goster) {
    $('#roomPick').hidden = !goster;
    $('#roomPickHint').hidden = !goster;
    $('#roomAuto').hidden = goster;
    $('#roomStepTitle').textContent = goster ? 'Hangi odadasınız?' : 'Odanız otomatik atanır';
  }

  function isaretleOda() {
    $$('#roomPick .room-card').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.room === setupRoom));
    });
  }
  function bumpCount(d) {
    const el = $('#boardCount');
    el.value = Math.min(20, Math.max(8, (Number(el.value) || 16) + d));
    markQuick();
  }
  function markQuick() {
    const n = Number($('#boardCount').value);
    $$('#countQuick button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(Number(b.dataset.n) === n));
    });
  }
  function setSeg(container, value) {
    Array.prototype.forEach.call(container.children, function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.v === String(value)));
    });
  }
  function segValue(container) {
    const on = container.querySelector('[aria-pressed="true"]');
    return on ? on.dataset.v : null;
  }

  function ayarlariOku() {
    const home = ($('#homeInput').value || '').trim() || 'EV SAHİBİ';
    const away = ($('#awayInput').value || '').trim() || 'MİSAFİR';
    const n = Number($('#boardCount').value);
    if (!Number.isInteger(n) || n < 8 || n > 20) return null;
    return { ev: home, misafir: away, boardSayisi: n, openHomeSide: segValue($('#seatSeg')) || 'NS' };
  }

  function startMatch(mod) {
    if (!setupRoom) { note($('#setupMsg'), 'Önce odanızı seçin (Açık Oda / Kapalı Oda).', 'err'); return; }
    const a = ayarlariOku();
    if (!a) { note($('#setupMsg'), 'Board sayısı 8 ile 20 arasında olmalı.', 'err'); return; }

    if (mod === 'local') {
      match = newMatch(null, 'local', a.ev, a.misafir, a.boardSayisi, a.openHomeSide);
      room = setupRoom; sessionStorage.setItem(ROOM_KEY, room);
      cacheSave(); openSheet();
      return;
    }

    if (!Sync.kullanilabilir()) {
      note($('#setupMsg'), 'Bağlantı kurulamadı (' + (Sync.hata() || 'internet yok') +
        '). "İnternetsiz — tek cihazda kullan" ile devam edebilirsiniz.', 'err');
      return;
    }
    a.kuranOda = setupRoom;                 // katılan cihaz karşı odaya atanacak
    const kod = Sync.kodUret();
    $('#startBtn').disabled = true;
    note($('#setupMsg'), 'Maç kuruluyor…', 'ok');
    Sync.macKur(kod, a).then(function () {
      match = newMatch(kod, 'cloud', a.ev, a.misafir, a.boardSayisi, a.openHomeSide);
      room = setupRoom; sessionStorage.setItem(ROOM_KEY, room);
      cacheSave(); openSheet();
      kodGoster(true);
    }).catch(function (e) {
      note($('#setupMsg'), 'Maç kurulamadı: ' + e.message, 'err');
    }).then(function () { $('#startBtn').disabled = false; });
  }

  function joinMatch() {
    const kod = ($('#kodInput').value || '').trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(kod)) { note($('#setupMsg'), 'Oyun kodu 6 haneli olmalı.', 'err'); return; }
    if (!Sync.kullanilabilir()) {
      note($('#setupMsg'), 'Bağlantı kurulamadı (' + (Sync.hata() || 'internet yok') + ').', 'err');
      return;
    }
    $('#startBtn').disabled = true;
    note($('#setupMsg'), 'Maç aranıyor…', 'ok');
    Sync.macGetir(kod).then(function (a) {
      if (!a) { note($('#setupMsg'), 'Bu kodla maç bulunamadı: ' + kod, 'err'); return; }
      const eski = cacheLoad(kod);                       // bu cihaz daha önce girdiyse
      const oda = katilanOda(a, eski);
      if (!oda) {                                        // eski sürümde kurulmuş maç
        odaSeciciGoster(true);
        note($('#setupMsg'), 'Bu maç odasını bildirmiyor (eski sürüm). Lütfen odanızı kendiniz seçip tekrar deneyin.', 'err');
        return;
      }
      match = eski || newMatch(kod, 'cloud', a.ev, a.misafir, a.boardSayisi, a.openHomeSide);
      match.homeTeam = a.ev; match.awayTeam = a.misafir;
      match.openHomeSide = a.openHomeSide;
      uygulaZon(a.zon);
      room = oda; setupRoom = oda; isaretleOda();
      sessionStorage.setItem(ROOM_KEY, room);
      cacheSave(); openSheet();
      kodGoster(false);
      note($('#listMsg'), 'Maça bağlanıldı: ' + kod + ' — siz ' + ROOM_TR[room] + '\u2019sınız' +
        (a.kuranOda ? ' (maçı kuran ' + ROOM_TR[a.kuranOda].toLowerCase() + ').' : '.'), 'ok');
    }).catch(function (e) {
      note($('#setupMsg'), 'Bağlanılamadı: ' + e.message, 'err');
    }).then(function () { $('#startBtn').disabled = false; });
  }

  /* Katılan cihazın odası: kuran oda hangisiyse onun karşısı.
     Aynı cihaz maçı kuran cihazsa (yerelde kaydı var) kendi odasında kalır.
     kuranOda yoksa null döner -> kullanıcı kendisi seçer. */
  function katilanOda(a, eski) {
    const kuran = a && a.kuranOda;
    if (kuran !== 'open' && kuran !== 'closed') return setupRoom || null;
    if (eski && eski.sonOda === kuran) return kuran;    // maçı kuran cihaz geri döndü
    return kuran === 'open' ? 'closed' : 'open';
  }

  function uygulaZon(zon) {
    if (!zon || !match) return;
    Object.keys(zon).forEach(function (no) {
      const b = match.boards[Number(no) - 1];
      if (b) b.vuln = zon[no];
    });
  }

  /* ====================================================================
     MAÇ KÂĞIDI
     ==================================================================== */
  function openSheet() {
    if (!match.tamam) match.tamam = { open: false, closed: false };
    if (typeof match.bitti !== 'boolean') match.bitti = false;
    $('#setupCard').hidden = true;
    $('#sheet').hidden = false;
    drafts = match.boards.map(function (b) {
      return b[room] ? Object.assign({}, b[room]) : blankEntry();
    });
    $('#homeName').textContent = match.homeTeam;
    $('#awayName').textContent = match.awayTeam;
    $('#totalCount').textContent = match.boardCount;
    $('#roomBadge').textContent = ROOM_TR[room];
    $('#roomBadge').className = 'room-badge ' + room;
    $('#mineHead').textContent = ROOM_TR[room] + ' — kontrat (siz)';
    $('#otherHead').textContent = ROOM_TR[otherRoom()];
    $('#switchRoomBtn').hidden = bulut();
    $('#roomHint').textContent = bulut()
      ? 'Skorları ' + ROOM_TR[room].toLowerCase() + ' için giriyorsunuz. Karşı oda kendi cihazından girer.'
      : 'Tek cihaz: odalar sırayla girer ("Oda değiştir").';
    kodGoster(false);
    buildRows();
    refreshAll();
    window.scrollTo(0, 0);
    if (bulut()) baglan();
  }

  function kodGoster(vurgula) {
    const chip = $('#kodChip');
    chip.hidden = !bulut();
    if (!bulut()) { $('#netDot').hidden = true; return; }
    $('#kodVal').textContent = match.kod;
    $('#netDot').hidden = false;
    netDurum(navigator.onLine);
    if (vurgula) {
      chip.classList.add('vurgu');
      note($('#listMsg'), 'Oyun kodu: ' + match.kod + ' — karşı odaya bu kodu söyleyin.', 'ok');
    }
  }
  function netDurum(online) {
    const d = $('#netDot');
    d.className = 'net-dot ' + (cloudHata ? 'err' : (online ? 'on' : 'off'));
    $('#netText').textContent = cloudHata ? 'bağlantı sorunu' : (online ? 'çevrimiçi' : 'çevrimdışı');
  }

  /* ------------------------------------------------- bulut dinleyicisi */
  let tazeleZamani = null;
  function baglan() {
    Sync.dinle(match.kod, match.boardCount, function (ev) {
      if (ev.tur === 'hata') { cloudHata = true; netDurum(navigator.onLine); return; }
      cloudHata = false; netDurum(navigator.onLine);

      if (ev.tur === 'ayar') {
        match.homeTeam = ev.ayar.ev; match.awayTeam = ev.ayar.misafir;
        match.openHomeSide = ev.ayar.openHomeSide;
        uygulaZon(ev.ayar.zon);
        $('#homeName').textContent = match.homeTeam;
        $('#awayName').textContent = match.awayTeam;
        cacheSave(); refreshAll();
        return;
      }
      if (ev.tur === 'tamam') {
        match.tamam = ev.tamam;
        cacheSave(); refreshTotals();
        /* karşı taraf da bitirdiyse kilidi açmayı dene */
        if (!match.bitti && match.tamam.open && match.tamam.closed) Sync.acmayiDene(match.kod);
        return;
      }

      if (ev.tur === 'acildi') {
        acildi(ev.satirlar);
        return;
      }

      if (ev.tur === 'durum') {
        const b = match.boards[ev.no - 1];
        if (!b) return;
        b.durum = ev.durum;
        cacheSave(); refreshRow(ev.no - 1); refreshTotals();
        if (match.bitti) {                       // açıldıktan sonraki düzeltmeler
          clearTimeout(tazeleZamani);
          tazeleZamani = setTimeout(function () {
            Sync.tumSatirlariGetir(match.kod, match.boardCount).then(function (sat) {
              if (sat) acildi(sat, true);
            });
          }, 800);
        }
      }
    });
  }

  /* Kilit açıldı: bütün satırlar sunucudan geldi. */
  function acildi(satirlar, sessiz) {
    satirlar.forEach(function (x) {
      const b = match.boards[x.no - 1];
      if (!b) return;
      if (x.open) b.open = x.open;
      if (x.closed) b.closed = x.closed;
      b.durum = { open: !!x.open, closed: !!x.closed };
    });
    match.bitti = true;
    drafts = match.boards.map(function (b, i) {
      return b[room] ? Object.assign({}, b[room]) : (drafts[i] || blankEntry());
    });
    match.boards.forEach(function (b, i) { doldurSatir(i); });
    cacheSave(); refreshAll();
    if (!sessiz) {
      const tot = S.calculateMatchTotal(match.boards.map(rowResult).filter(Boolean));
      note($('#listMsg'), 'MAÇ BİTTİ — skorlar açıldı. ' + match.homeTeam + ' ' + tot.home +
        ' — ' + tot.away + ' ' + match.awayTeam, 'ok');
      window.scrollTo(0, 0);
    }
  }

  function buildRows() {
    const host = $('#rows');
    host.innerHTML = '';
    match.boards.forEach(function (b, i) { host.appendChild(rowEl(b, i)); });
  }

  function opt(value, label, selected) {
    const o = new Option(label, String(value));
    if (selected) o.selected = true;
    return o;
  }

  function rowEl(b, i) {
    const d = drafts[i];
    const row = document.createElement('div');
    row.className = 'row';
    row.dataset.i = String(i);

    const cBoard = document.createElement('div');
    cBoard.className = 'c-board';
    cBoard.innerHTML =
      '<span class="bno">' + b.no + '</span>' +
      '<button type="button" class="vuln" data-act="vuln" title="Zon durumunu değiştir"></button>';
    row.appendChild(cBoard);

    const cMine = document.createElement('div');
    cMine.className = 'c-mine';

    const selLevel = document.createElement('select');
    selLevel.className = 'f-level'; selLevel.title = 'Kontrat seviyesi';
    selLevel.appendChild(opt('', '—', !d.level));
    [1, 2, 3, 4, 5, 6, 7].forEach(function (n) { selLevel.appendChild(opt(n, n, d.level === n)); });

    const selStrain = document.createElement('select');
    selStrain.className = 'f-strain'; selStrain.title = 'Renk';
    selStrain.appendChild(opt('', '—', !d.strain));
    S.STRAINS.forEach(function (s) { selStrain.appendChild(opt(s, S.STRAIN_SYMBOL[s], d.strain === s)); });
    selStrain.appendChild(opt(S.PASS, 'Pas', d.strain === S.PASS));

    const selResult = document.createElement('select');
    selResult.className = 'f-result'; selResult.title = 'Sonuç';

    const selDbl = document.createElement('select');
    selDbl.className = 'f-dbl'; selDbl.title = 'Kontr';
    DBL_ORDER.forEach(function (p) { selDbl.appendChild(opt(p[0], p[1], (d.doubling || 'normal') === p[0])); });

    const selDir = document.createElement('select');
    selDir.className = 'f-dir'; selDir.title = 'Deklaran yönü';
    selDir.appendChild(opt('', '— yön —', !d.direction));
    DIR_ORDER.forEach(function (p) { selDir.appendChild(opt(p[0], p[1], d.direction === p[0])); });

    /* her alan kendi etiketiyle sarılır (dar ekranda etiket görünür) */
    const alan = function (sel, sinif, etiket) {
      const w = document.createElement('span');
      w.className = 'fld ' + sinif;
      w.dataset.lbl = etiket;
      w.appendChild(sel);
      return w;
    };
    cMine.appendChild(alan(selLevel,  'fld-level',  'Seviye'));
    cMine.appendChild(alan(selStrain, 'fld-strain', 'Renk'));
    cMine.appendChild(alan(selDbl,    'fld-dbl',    'Kontr'));
    cMine.appendChild(alan(selResult, 'fld-result', 'Sonuç'));
    cMine.appendChild(alan(selDir,    'fld-dir',    'Deklaran'));
    row.appendChild(cMine);

    const cScore = document.createElement('div'); cScore.className = 'c-score';
    const cOther = document.createElement('div'); cOther.className = 'c-other';
    const cNet   = document.createElement('div'); cNet.className   = 'c-net';
    const cAct   = document.createElement('div'); cAct.className   = 'c-act';
    cAct.innerHTML = '<button type="button" class="btn save" data-act="save">Kaydet</button>';
    row.appendChild(cScore); row.appendChild(cOther); row.appendChild(cNet); row.appendChild(cAct);

    fillResults(row, i);
    pasKilidi(row, i);              // önbellekten gelen pas satırı da kilitli açılır

    row.addEventListener('change', function (e) {
      const t = e.target;
      if (t.classList.contains('f-level')) {
        drafts[i].level = t.value === '' ? null : Number(t.value);
        fillResults(row, i);
      } else if (t.classList.contains('f-strain')) {
        const oncePas = pasMi(drafts[i]);
        if (t.value === S.PASS) {
          pasaCevir(drafts[i]);
        } else {
          drafts[i].strain = t.value || null;
          if (oncePas) { drafts[i].result = null; drafts[i].doubling = 'normal'; }
        }
        doldurSatir(i);
      } else if (t.classList.contains('f-result')) {
        drafts[i].result = t.value === '' ? null : Number(t.value);
      } else if (t.classList.contains('f-dbl')) {
        drafts[i].doubling = t.value;
      } else if (t.classList.contains('f-dir')) {
        drafts[i].direction = t.value || null;
      } else return;
      refreshRow(i);
    });

    row.addEventListener('click', function (e) {
      const btn = e.target.closest('button[data-act]');
      if (!btn) return;
      if (btn.dataset.act === 'save') saveRow(i);
      if (btn.dataset.act === 'vuln') cycleVuln(i);
    });

    return row;
  }

  /* Sunucudan gelen satırı kutulara bas (kendi odam bu cihazda yoksa). */
  function doldurSatir(i) {
    const row = $('#rows .row[data-i="' + i + '"]');
    if (!row) return;
    const d = drafts[i];
    row.querySelector('.f-level').value = d.level || '';
    fillResults(row, i);
    row.querySelector('.f-strain').value = d.strain || '';
    row.querySelector('.f-dbl').value = d.doubling || 'normal';
    row.querySelector('.f-result').value = (d.result === null || d.result === undefined) ? '' : String(d.result);
    row.querySelector('.f-dir').value = d.direction || '';
    pasKilidi(row, i);
  }

  /* Pas seçiliyken seviye / kontr / deklaran kutuları kapanır (sonuç fillResults'ta). */
  function pasKilidi(row, i) {
    const pas = pasMi(drafts[i]);
    ['.f-level', '.f-dbl', '.f-dir'].forEach(function (sel) {
      const el = row.querySelector(sel);
      el.disabled = pas;
      if (pas) el.value = '';
    });
    row.classList.toggle('pas', pas);
  }

  function fillResults(row, i) {
    const sel = row.querySelector('.f-result');
    const level = drafts[i].level;
    const prev = drafts[i].result;
    sel.innerHTML = '';
    if (pasMi(drafts[i])) {                    // pas: sonuç sorulmaz, skor 0
      sel.appendChild(opt(0, '0', true));
      sel.disabled = true; drafts[i].result = 0;
      return;
    }
    sel.appendChild(opt('', '—', true));
    if (!level) { sel.disabled = true; drafts[i].result = null; return; }
    sel.disabled = false;
    for (let o = S.maxOvertricks(level); o >= 1; o--) sel.appendChild(opt(o, '+' + o));
    sel.appendChild(opt(0, '='));
    for (let u = 1; u <= S.maxUndertricks(level); u++) sel.appendChild(opt(-u, '−' + u));
    const ok = prev !== null && prev !== undefined &&
               prev <= S.maxOvertricks(level) && prev >= -S.maxUndertricks(level);
    if (ok) sel.value = String(prev); else { drafts[i].result = null; sel.value = ''; }
  }

  function cycleVuln(i) {
    const b = match.boards[i];
    b.vuln = VULN_CYC[(VULN_CYC.indexOf(boardVuln(b)) + 1) % VULN_CYC.length];
    cacheSave();
    refreshRow(i); refreshTotals();
    if (bulut()) {
      const zon = {};
      match.boards.forEach(function (x) { if (x.vuln) zon[x.no] = x.vuln; });
      Sync.zonYaz(match.kod, zon);
    }
  }

  function saveRow(i) {
    const b = match.boards[i];
    const d = drafts[i];
    const msg = $('#listMsg');
    if (pasMi(d)) {
      pasaCevir(d);                            // güvenlik: yarım kalan alanları temizle
    } else {
      if (!d.level || !d.strain) { note(msg, 'Board ' + b.no + ': kontrat seviyesi ve renk seçilmeli.', 'err'); return; }
      if (d.result === null || d.result === undefined) { note(msg, 'Board ' + b.no + ': sonuç seçilmeli.', 'err'); return; }
      if (!d.direction) { note(msg, 'Board ' + b.no + ': deklaran yönü seçilmeli.', 'err'); return; }
      try {
        S.calculateBridgeScore({
          level: d.level, strain: d.strain, result: Number(d.result),
          vulnerable: vulnFor(b, d.direction), doubling: d.doubling || 'normal'
        });
      } catch (e) { note(msg, 'Board ' + b.no + ': ' + e.message, 'err'); return; }
    }

    const wasSaved = !!b[room];
    b[room] = Object.assign({}, d, { savedAt: new Date().toISOString() });
    b.durum = b.durum || { open: false, closed: false };
    b.durum[room] = true;
    cacheSave();
    refreshAll();

    if (bulut()) {
      Sync.satirYaz(match.kod, b.no, room, d).catch(function (e) {
        cloudHata = true; netDurum(navigator.onLine);
        note(msg, 'Board ' + b.no + ' bu cihaza yazıldı ama sunucuya gönderilemedi: ' + e.message, 'err');
      });
    }
    const res = rowResult(b);
    if (match.bitti && res) {
      note(msg, 'Board ' + b.no + ' güncellendi — ' + (res.imps === 0 ? 'berabere' :
        res.imps + ' IMP ' + teamName(res.winner)), 'ok');
    } else {
      const kalan = match.boardCount - benimSayim();
      note(msg, 'Board ' + b.no + ' ' + (wasSaved ? 'güncellendi' : 'kaydedildi') + '. ' +
        (kalan > 0 ? kalan + ' board kaldı.' : 'Bütün boardları girdiniz — “maçı bitir” diyebilirsiniz.'), 'ok');
    }
  }

  /* ------------------------------------------------------- yenileme */
  function refreshAll() {
    match.boards.forEach(function (b, i) { refreshRow(i); });
    refreshTotals();
  }

  function refreshRow(i) {
    const b = match.boards[i];
    const row = $('#rows .row[data-i="' + i + '"]');
    if (!row) return;
    const d = drafts[i];
    const mine = b[room];
    const theirs = b[otherRoom()];
    const res = rowResult(b);

    const vb = row.querySelector('.vuln');
    const v = boardVuln(b);
    vb.textContent = VULN_SHORT[v];
    vb.title = VULN_TR[v] + ' — değiştirmek için tıklayın';
    vb.className = 'vuln v-' + v.toLowerCase();

    const cScore = row.querySelector('.c-score');
    const raw = rawScoreOf(b, d);
    if (raw === null) {
      cScore.textContent = '—';
      cScore.className = 'c-score muted';
    } else {
      cScore.textContent = (raw > 0 ? '+' : '') + raw;
      if (pasMi(d)) {
        cScore.className = 'c-score zero';
        cScore.title = 'Dört pas — board oynanmadı, iki taraf da 0';
      } else {
        cScore.className = 'c-score ' + (raw >= 0 ? 'pos' : 'neg');
        cScore.title = sideShort(d.direction) + ' deklaran';
      }
    }

    const cOther = row.querySelector('.c-other');
    if (match.bitti && res && theirs) {
      const tRaw = rawScoreOf(b, theirs);
      cOther.className = 'c-other open';
      cOther.innerHTML = '<span class="lbl">' + labelOf(theirs) + '</span>' +
        (pasMi(theirs) ? '' : '<span class="dir">' + sideShort(theirs.direction) + '</span>') +
        '<span class="sc ' + (pasMi(theirs) ? 'zero' : (tRaw >= 0 ? 'pos' : 'neg')) + '">' +
        (tRaw > 0 ? '+' : '') + tRaw + '</span>';
    } else if (girdiMi(b, otherRoom())) {
      cOther.className = 'c-other locked';
      cOther.innerHTML = '<span class="lock">🔒 girildi</span>';
      cOther.title = 'Karşı oda girdi; siz kaydedince açılacak.';
    } else {
      cOther.className = 'c-other waiting';
      cOther.innerHTML = '<span class="lock">bekleniyor</span>';
      cOther.title = 'Karşı oda henüz kaydetmedi.';
    }

    const cNet = row.querySelector('.c-net');
    if (match.bitti && res) {
      const who = res.winner === 'none' ? 'BERABERE' : teamName(res.winner);
      cNet.className = 'c-net ' + res.winner;
      cNet.innerHTML =
        '<span class="net">' + (res.netScore > 0 ? '+' : '') + res.netScore + '</span>' +
        '<span class="imp">' + res.imps + ' IMP</span>' +
        '<span class="who">' + who + '</span>';
    } else {
      cNet.className = 'c-net muted kilitli';
      cNet.innerHTML = '<span class="net">' + (mine ? '🔒' : '—') + '</span>';
    }

    const btn = row.querySelector('button.save');
    const dirty = !mine || !sameEntry(mine, d);
    btn.textContent = mine ? 'Güncelle' : 'Kaydet';
    btn.className = 'btn save' + (mine ? (dirty ? ' warn' : ' done') : ' primary');
    btn.disabled = !!mine && !dirty;
    row.className = 'row' + ((match.bitti && res) ? ' complete' : (mine ? ' mine-saved' : ''));
  }

  function refreshTotals() {
    const done = match.boards.map(rowResult).filter(Boolean);
    const tot = S.calculateMatchTotal(done);
    const sb = document.querySelector('.scoreboard');

    $('#playedCount').textContent = benimSayim();
    $('#otherProg').textContent = 'Karşı oda: ' + karsiSayim() + '/' + match.boardCount;

    if (!match.bitti) {
      sb.classList.add('kilitli');
      $('#homeTotal').textContent = '—';
      $('#awayTotal').textContent = '—';
      $('#impDiff').textContent = '—';
      $('#leaderText').innerHTML = '<span class="kilit">🔒 Skorlar maç bitince açılır</span>';
      $('#homeTotal').parentElement.classList.remove('leading');
      $('#awayTotal').parentElement.classList.remove('leading');
    } else {
      sb.classList.remove('kilitli');
      $('#homeTotal').textContent = tot.home;
      $('#awayTotal').textContent = tot.away;
      $('#impDiff').textContent = Math.abs(tot.home - tot.away) + ' IMP';
      $('#leaderText').textContent = tot.home === tot.away ? 'Berabere'
        : (tot.home > tot.away ? match.homeTeam + ' önde' : match.awayTeam + ' önde');
      $('#homeTotal').parentElement.classList.toggle('leading', tot.home > tot.away);
      $('#awayTotal').parentElement.classList.toggle('leading', tot.away > tot.home);
    }
    buildPrintTable(done, tot);
    refreshFinish();
  }

  /* ------------------------------------------------- maçı bitir şeridi */
  function refreshFinish() {
    const kart = $('#finishCard');
    const btn = $('#finishBtn');
    const N = match.boardCount;
    const benim = benimSayim(), karsi = karsiSayim();
    const hepsiBenden = benim >= N;

    if (match.bitti) {
      kart.className = 'card finish-card no-print acik';
      $('#fiLock').textContent = '🔓';
      $('#fiTitle').textContent = 'MAÇ BİTTİ — karşılaştırmalı skorlar açık';
      $('#fiSub').textContent = 'Satırları düzeltirseniz sonuç kendiliğinden güncellenir.';
      $('#printBtn').disabled = false; $('#csvBtn').disabled = false;
      return;
    }

    $('#printBtn').disabled = true; $('#csvBtn').disabled = true;
    $('#fiLock').textContent = '🔒';
    $('#fiTitle').textContent = 'Karşılaştırmalı skorlar kapalı';

    if (bulut()) {
      const benBitirdim = !!match.tamam[room];
      btn.disabled = !hepsiBenden || benBitirdim;
      btn.textContent = benBitirdim ? 'BİTİRDİNİZ — KARŞI ODA BEKLENİYOR' : 'KAYDET VE MAÇI BİTİR';
      kart.className = 'card finish-card no-print' + (hepsiBenden && !benBitirdim ? ' hazir' : '');
      $('#fiSub').textContent = benBitirdim
        ? 'Siz bitirdiniz. Karşı oda ' + karsi + '/' + N + ' board girdi' +
          (match.tamam[otherRoom()] ? ' ve bitirdi — açılıyor…' : '; bitirmesi bekleniyor.')
        : (hepsiBenden
            ? 'Bütün boardları girdiniz. “Maçı bitir” deyin; karşı oda da bitirince skorlar açılacak.'
            : 'Siz ' + benim + '/' + N + ' board girdiniz. Hepsi girilince düğme açılacak.');
    } else {
      const hepsi = hepsiGirildi();
      btn.disabled = !hepsi;
      btn.textContent = 'KAYDET VE MAÇI BİTİR';
      kart.className = 'card finish-card no-print' + (hepsi ? ' hazir' : '');
      $('#fiSub').textContent = hepsi
        ? 'Bütün boardlar iki oda için de girildi. Maçı bitirip skorları açabilirsiniz.'
        : 'Tek cihaz: iki odanın da bütün boardları girilmeli (şu an ' +
          match.boards.filter(function (b) { return isComplete(b.open) && isComplete(b.closed); }).length +
          '/' + N + ').';
    }
  }

  function maciBitir() {
    const N = match.boardCount;
    if (!match.bitti && !bulut()) {
      if (!hepsiGirildi()) { note($('#listMsg'), 'Önce bütün boardlar iki oda için de girilmeli.', 'err'); return; }
      match.bitti = true; cacheSave(); refreshAll();
      note($('#listMsg'), 'Maç bitti — skorlar açıldı.', 'ok');
      window.scrollTo(0, 0);
      return;
    }
    if (benimSayim() < N) { note($('#listMsg'), 'Önce bütün boardları girin (' + benimSayim() + '/' + N + ').', 'err'); return; }
    $('#finishBtn').disabled = true;
    Sync.bitirdim(match.kod, room, N).then(function () {
      match.tamam[room] = true; cacheSave(); refreshFinish();
      return Sync.acmayiDene(match.kod);
    }).then(function (acildiMi) {
      note($('#listMsg'), acildiMi
        ? 'Maç bitti — skorlar açılıyor…'
        : 'Bitirdiniz. Karşı oda da bitirince skorlar iki cihazda birden açılacak.', 'ok');
    }).catch(function (e) {
      note($('#listMsg'), 'Bitirilemedi: ' + e.message, 'err');
      refreshFinish();
    });
  }

  /* Yazdırma/CSV metni: "4♥ = (K‑G)" · pas geçilen boardda yalnızca "Pas". */
  function odaYazi(r) {
    if (!r.declarerSide) return r.label;
    return r.label + ' (' + (r.declarerSide === 'NS' ? 'K‑G' : 'D‑B') + ')';
  }

  function buildPrintTable(done, tot) {
    const tb = $('#printRows');
    tb.innerHTML = '';
    match.boards.forEach(function (b) {
      const r = rowResult(b);
      const tr = document.createElement('tr');
      if (!r) {
        tr.innerHTML = '<td>' + b.no + '</td><td></td><td class="num"></td><td></td>' +
                       '<td class="num"></td><td class="num"></td><td class="num"></td><td></td>';
      } else {
        tr.innerHTML =
          '<td>' + b.no + '</td>' +
          '<td>' + odaYazi(r.openRoom) + '</td>' +
          '<td class="num">' + r.openRoom.rawScore + '</td>' +
          '<td>' + odaYazi(r.closedRoom) + '</td>' +
          '<td class="num">' + r.closedRoom.rawScore + '</td>' +
          '<td class="num">' + r.netScore + '</td>' +
          '<td class="num">' + r.imps + '</td>' +
          '<td>' + (r.winner === 'none' ? '—' : teamName(r.winner)) + '</td>';
      }
      tb.appendChild(tr);
    });
    $('#printFoot').innerHTML =
      '<tr><td colspan="6">TOPLAM (' + done.length + ' board)</td>' +
      '<td class="num">' + tot.home + ' — ' + tot.away + '</td>' +
      '<td>' + (tot.home === tot.away ? 'Berabere'
        : (tot.home > tot.away ? match.homeTeam : match.awayTeam)) + '</td></tr>';
  }

  /* ====================================================================
     ARAÇLAR
     ==================================================================== */
  function initSheetTools() {
    $('#switchRoomBtn').addEventListener('click', function () {
      room = otherRoom();
      sessionStorage.setItem(ROOM_KEY, room);
      cacheSave(); openSheet();
      note($('#listMsg'), ROOM_TR[room] + ' girişine geçildi.', 'ok');
    });

    $('#kodChip').addEventListener('click', function () {
      const k = match && match.kod; if (!k) return;
      if (navigator.clipboard) navigator.clipboard.writeText(k).catch(function () {});
      note($('#listMsg'), 'Oyun kodu kopyalandı: ' + k, 'ok');
    });

    $('#finishBtn').addEventListener('click', maciBitir);
    $('#printBtn').addEventListener('click', function () { window.print(); });

    $('#csvBtn').addEventListener('click', function () {
      const rows = [['Board', 'Zon', 'Acik oda', 'Acik skor', 'Kapali oda', 'Kapali skor', 'Net', 'IMP', 'Kazanan']];
      match.boards.forEach(function (b) {
        const r = rowResult(b);
        if (!r) { rows.push([b.no, VULN_SHORT[boardVuln(b)], '', '', '', '', '', '', '']); return; }
        rows.push([b.no, VULN_SHORT[boardVuln(b)],
          r.openRoom.label, r.openRoom.rawScore, r.closedRoom.label, r.closedRoom.rawScore,
          r.netScore, r.imps, r.winner === 'none' ? '' : teamName(r.winner)]);
      });
      const tot = S.calculateMatchTotal(match.boards.map(rowResult).filter(Boolean));
      rows.push([]);
      rows.push(['TOPLAM', '', match.homeTeam, tot.home, match.awayTeam, tot.away, '', '', '']);
      const csv = rows.map(function (r) {
        return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(';');
      }).join('\r\n');
      download('takim-maci.csv', '﻿' + csv, 'text/csv;charset=utf-8');
    });

    $('#jsonBtn').addEventListener('click', function () {
      download('takim-maci' + (match.kod ? '-' + match.kod : '') + '.json',
               JSON.stringify(match, null, 2), 'application/json');
    });
    $('#restoreBtn').addEventListener('click', function () { $('#restoreInput').click(); });
    $('#restoreInput').addEventListener('change', function () {
      const f = this.files && this.files[0];
      if (!f) return;
      const rd = new FileReader();
      rd.onload = function () {
        try {
          const m = JSON.parse(rd.result);
          if (!m || !Array.isArray(m.boards)) throw new Error('Dosya tanınmadı.');
          match = m; cacheSave(); openSheet();
          note($('#listMsg'), 'Maç geri yüklendi.', 'ok');
        } catch (e) { note($('#listMsg'), 'Geri yükleme başarısız: ' + e.message, 'err'); }
      };
      rd.readAsText(f);
      this.value = '';
    });

    $('#newMatchBtn').addEventListener('click', function () {
      if (!confirm('Yeni maç kurulsun mu? Bu cihazdaki kayıt kapanacak.')) return;
      if (bulut()) Sync.dinlemeyiBirak();
      try { localStorage.removeItem(SON_MAC_KEY); } catch (e) {}
      location.reload();
    });

    window.addEventListener('online',  function () { cloudHata = false; netDurum(true); });
    window.addEventListener('offline', function () { netDurum(false); });
  }

  function download(name, text, type) {
    const blob = new Blob([text], { type: type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* Yerel modda: aynı tarayıcının öteki sekmesi kaydettiyse tazele. */
  window.addEventListener('storage', function (e) {
    if (!match || bulut() || !e.key || e.key !== cacheKey(match.kod)) return;
    const m = cacheLoad(match.kod);
    if (!m || m.boards.length !== match.boards.length) return;
    m.boards.forEach(function (nb, i) {
      match.boards[i][otherRoom()] = nb[otherRoom()];
      match.boards[i].durum = nb.durum || match.boards[i].durum;
      match.boards[i].vuln = match.boards[i].vuln || nb.vuln || null;
    });
    refreshAll();
  });

  /* ------------------------------------------------------------- başlat */
  initSetup();
  initSheetTools();

  const savedRoom = sessionStorage.getItem(ROOM_KEY);
  const sonKod = sonMacKodu();
  if (savedRoom && sonKod) {                     // sayfa yenilendi: kaldığı yerden
    const m = cacheLoad(sonKod === 'LOCAL' ? null : sonKod);
    if (m) { match = m; room = savedRoom; openSheet(); }
  }

  window.BricApp = {
    get match() { return match; }, get room() { return room; },
    rowResult: rowResult, refreshAll: refreshAll
  };
})();
