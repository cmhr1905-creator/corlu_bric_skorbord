/* ==========================================================================
   Eşleme katmanı — Firestore (oyun kodu) + çevrimdışı yedek
   Gizlilik kuralı sunucuda: karşı odanın satırı yazılmadan hiçbir satır
   okunamaz (firestore.rules). Burada yalnızca okuma/yazma çağrıları var.
   ========================================================================== */
(function () {
  'use strict';

  const ALFABE = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // I, O, 0, 1 yok (karışmasın)
  let db = null, baslatildi = false, kurulumHatasi = null;
  let unsubDurum = null, unsubMac = null;
  const imzalar = {};                                   // board -> son durum imzası

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

  /* İki oda da yazmışsa satırları getirir; yazmamışsa kural gereği reddedilir. */
  function satirlariGetir(kod, no) {
    const d = baslat(); if (!d) return Promise.resolve(null);
    const base = macYolu(kod) + '/satir/' + bid(no) + '_';
    return Promise.all([d.doc(base + 'open').get(), d.doc(base + 'closed').get()])
      .then(function (s) {
        return { open: iceri(s[0].exists ? s[0].data() : null),
                 closed: iceri(s[1].exists ? s[1].data() : null) };
      })
      .catch(function () { return null; });      // izin yok = henüz açılmamış
  }

  /* ------------------------------------------------------------- dinle
     cb({ tur: 'durum', no, durum })            -> kim girdi (skor yok)
     cb({ tur: 'satir', no, open, closed })     -> iki oda da girdi, açıldı
     cb({ tur: 'ayar', ayar })                  -> zon/ayar değişti
     cb({ tur: 'hata', mesaj })
     ------------------------------------------------------------------ */
  function dinle(kod, cb) {
    const d = baslat(); if (!d) { cb({ tur: 'hata', mesaj: kurulumHatasi }); return; }
    dinlemeyiBirak();

    unsubMac = d.doc(macYolu(kod)).onSnapshot(function (s) {
      if (s.exists) cb({ tur: 'ayar', ayar: s.data() });
    }, function (e) { cb({ tur: 'hata', mesaj: e.message }); });

    unsubDurum = d.collection(macYolu(kod) + '/durum').onSnapshot(function (snap) {
      snap.docChanges().forEach(function (ch) {
        const no = Number(ch.doc.id.replace('b', ''));
        const v = ch.doc.data() || {};
        cb({ tur: 'durum', no: no, durum: { open: !!v.open, closed: !!v.closed } });

        const im = [!!v.open, !!v.closed,
                    v.openZaman && v.openZaman.seconds, v.closedZaman && v.closedZaman.seconds].join('|');
        if (!v.open || !v.closed) { imzalar[no] = im; return; }
        if (imzalar[no] === im) return;
        imzalar[no] = im;
        satirlariGetir(kod, no).then(function (r) {
          if (r && r.open && r.closed) cb({ tur: 'satir', no: no, open: r.open, closed: r.closed });
        });
      });
    }, function (e) { cb({ tur: 'hata', mesaj: e.message }); });
  }

  function dinlemeyiBirak() {
    if (unsubDurum) { unsubDurum(); unsubDurum = null; }
    if (unsubMac) { unsubMac(); unsubMac = null; }
    Object.keys(imzalar).forEach(function (k) { delete imzalar[k]; });
  }

  window.Sync = {
    kodUret: kodUret,
    macKur: macKur,
    macGetir: macGetir,
    zonYaz: zonYaz,
    satirYaz: satirYaz,
    satirlariGetir: satirlariGetir,
    dinle: dinle,
    dinlemeyiBirak: dinlemeyiBirak,
    kullanilabilir: function () { return !!baslat(); },
    hata: function () { return kurulumHatasi; }
  };
})();
