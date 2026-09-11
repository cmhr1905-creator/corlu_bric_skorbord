/* ==========================================================================
   Eşleme katmanı — Firestore (oyun kodu) + çevrimdışı yedek
   Gizlilik kuralı sunucuda: karşı odanın satırı yazılmadan hiçbir satır
   okunamaz (firestore.rules). Burada yalnızca okuma/yazma çağrıları var.
   ========================================================================== */
(function () {
  'use strict';

  const ALFABE = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // I, O, 0, 1 yok (karışmasın)
  let db = null, baslatildi = false, kurulumHatasi = null;
  let unsubDurum = null, unsubMac = null, unsubTamam = null, unsubKilit = null;
  let acildiBildirildi = false;

  function bid(no) { return 'b' + String(no).padStart(2, '0'); }
  function macYolu(kod) { return 'maclar/' + kod; }

  /* Firestore alan adları TR, uygulama içi alanlar EN — iki yönlü çeviri. */
  function disari(e) {
    return {
      seviye: Number(e.level), renk: e.strain, sonuc: Number(e.result),
      kontr: e.doubling || 'normal', yon: e.direction
    };
  }
  function iceri(d) {
    if (!d) return null;
    return {
      level: d.seviye, strain: d.renk, result: d.sonuc,
      doubling: d.kontr || 'normal', direction: d.yon
    };
  }

  function baslat() {
    if (baslatildi) return db;
    baslatildi = true;
    try {
      if (typeof firebase === 'undefined') { kurulumHatasi = 'Firebase yüklenemedi (internet yok?)'; return null; }
      if (!window.FIREBASE_CONFIG) { kurulumHatasi = 'Firebase yapılandırması eksik'; return null; }
      firebase.initializeApp(window.FIREBASE_CONFIG);
      db = firebase.firestore();
      db.enablePersistence({ synchronizeTabs: true }).catch(function () { /* çoklu sekme: sorun değil */ });
    } catch (e) {
      kurulumHatasi = e.message; db = null;
    }
    return db;
  }

  function kodUret() {
    let k = '';
    const rnd = (window.crypto && crypto.getRandomValues)
      ? Array.from(crypto.getRandomValues(new Uint32Array(6)))
      : [0,0,0,0,0,0].map(function () { return Math.floor(Math.random() * 4294967296); });
    rnd.forEach(function (n) { k += ALFABE[n % ALFABE.length]; });
    return k;
  }

  /* ---------------------------------------------------------------- maç */
  function macKur(kod, ayar) {
    const d = baslat(); if (!d) return Promise.reject(new Error(kurulumHatasi));
    return d.doc(macYolu(kod)).set({
      ev: ayar.ev, misafir: ayar.misafir,
      boardSayisi: ayar.boardSayisi, openHomeSide: ayar.openHomeSide,
      zon: {},
      olusturuldu: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function () { return kod; });
  }

  function macGetir(kod) {
    const d = baslat(); if (!d) return Promise.reject(new Error(kurulumHatasi));
    return d.doc(macYolu(kod)).get({ source: 'server' })
      .catch(function () { return d.doc(macYolu(kod)).get(); })   // çevrimdışı: önbellek
      .then(function (s) { return s.exists ? s.data() : null; });
  }

  function zonYaz(kod, zonMap) {
    const d = baslat(); if (!d) return Promise.resolve();
    return d.doc(macYolu(kod)).update({ zon: zonMap }).catch(function () {});
  }

  /* -------------------------------------------------------------- satır */
  function satirYaz(kod, no, oda, entry) {
    const d = baslat(); if (!d) return Promise.reject(new Error(kurulumHatasi));
    const ts = firebase.firestore.FieldValue.serverTimestamp();
    const satir = Object.assign(disari(entry), { zaman: ts });
    const durum = {};
    durum[oda] = true;
    durum[oda + 'Zaman'] = ts;

    const batch = d.batch();
    batch.set(d.doc(macYolu(kod) + '/satir/' + bid(no) + '_' + oda), satir);
    batch.set(d.doc(macYolu(kod) + '/durum/' + bid(no)), durum, { merge: true });
    return batch.commit();
  }

  /* Maç açıldıysa (kilit/acik) bütün satırları getirir; açılmadıysa
     kural gereği reddedilir ve null döner. */
  function tumSatirlariGetir(kod, boardSayisi) {
    const d = baslat(); if (!d) return Promise.resolve(null);
    const isler = [];
    for (let n = 1; n <= boardSayisi; n++) {
      const base = macYolu(kod) + '/satir/' + bid(n) + '_';
      isler.push(Promise.all([d.doc(base + 'open').get(), d.doc(base + 'closed').get()])
        .then(function (r) {
          return { no: n,
                   open: iceri(r[0].exists ? r[0].data() : null),
                   closed: iceri(r[1].exists ? r[1].data() : null) };
        }));
    }
    return Promise.all(isler).catch(function () { return null; });   // izin yok = kilitli
  }

  /* "Bu oda bütün boardları girdi ve maçı bitirdi." */
  function bitirdim(kod, oda, sayi) {
    const d = baslat(); if (!d) return Promise.reject(new Error(kurulumHatasi));
    return d.doc(macYolu(kod) + '/tamam/' + oda).set({
      sayi: Number(sayi),
      zaman: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  /* Kilidi açmayı dener; iki oda da bitirmediyse kural reddeder (false). */
  function acmayiDene(kod) {
    const d = baslat(); if (!d) return Promise.resolve(false);
    return d.doc(macYolu(kod) + '/kilit/acik').set({
      zaman: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function () { return true; }).catch(function () { return false; });
  }

  /* ------------------------------------------------------------- dinle
     cb({ tur: 'durum',  no, durum })              -> kim hangi board'u girdi (skor yok)
     cb({ tur: 'tamam',  tamam: {open, closed} })  -> kim maçı bitirdi
     cb({ tur: 'acildi', satirlar })               -> kilit açıldı, bütün skorlar
     cb({ tur: 'ayar',   ayar })                   -> zon/ayar değişti
     cb({ tur: 'hata',   mesaj })
     ------------------------------------------------------------------ */
  function dinle(kod, boardSayisi, cb) {
    const d = baslat(); if (!d) { cb({ tur: 'hata', mesaj: kurulumHatasi }); return; }
    dinlemeyiBirak();

    unsubMac = d.doc(macYolu(kod)).onSnapshot(function (s) {
      if (s.exists) cb({ tur: 'ayar', ayar: s.data() });
    }, function (e) { cb({ tur: 'hata', mesaj: e.message }); });

    unsubDurum = d.collection(macYolu(kod) + '/durum').onSnapshot(function (snap) {
      snap.docChanges().forEach(function (ch) {
        const v = ch.doc.data() || {};
        cb({ tur: 'durum', no: Number(ch.doc.id.replace('b', '')),
             durum: { open: !!v.open, closed: !!v.closed } });
      });
    }, function (e) { cb({ tur: 'hata', mesaj: e.message }); });

    unsubTamam = d.collection(macYolu(kod) + '/tamam').onSnapshot(function (snap) {
      const t = { open: false, closed: false };
      snap.forEach(function (doc) { t[doc.id] = true; });
      cb({ tur: 'tamam', tamam: t });
    }, function () {});

    unsubKilit = d.doc(macYolu(kod) + '/kilit/acik').onSnapshot(function (s) {
      if (!s.exists || acildiBildirildi) return;
      acildiBildirildi = true;
      tumSatirlariGetir(kod, boardSayisi).then(function (satirlar) {
        if (satirlar) cb({ tur: 'acildi', satirlar: satirlar });
        else acildiBildirildi = false;              // kural henüz yaymadıysa yeniden denenir
      });
    }, function () {});
  }

  function dinlemeyiBirak() {
    [unsubDurum, unsubMac, unsubTamam, unsubKilit].forEach(function (u) { if (u) u(); });
    unsubDurum = unsubMac = unsubTamam = unsubKilit = null;
    acildiBildirildi = false;
  }

  window.Sync = {
    kodUret: kodUret,
    macKur: macKur,
    macGetir: macGetir,
    zonYaz: zonYaz,
    satirYaz: satirYaz,
    tumSatirlariGetir: tumSatirlariGetir,
    bitirdim: bitirdim,
    acmayiDene: acmayiDene,
    dinle: dinle,
    dinlemeyiBirak: dinlemeyiBirak,
    kullanilabilir: function () { return !!baslat(); },
    hata: function () { return kurulumHatasi; }
  };
})();
