/* ==========================================================================
   Bric takim maci - saf hesaplama katmani (DOM yok, node'da da calisir)
   ========================================================================== */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    const data = require('./bridge-data.js');
    const imp = require('./imp-scale.js');
    module.exports = factory(data.CONTRACT_SCORES, data.UNDERTRICK_SCORES, imp.calculateIMP);
  } else {
    root.Scoring = factory(CONTRACT_SCORES, UNDERTRICK_SCORES, calculateIMP);
  }
}(typeof self !== 'undefined' ? self : this, function (CONTRACT_SCORES, UNDERTRICK_SCORES, calculateIMP) {

  const STRAINS = ['C', 'D', 'H', 'S', 'NT'];
  const STRAIN_SYMBOL = { C: '♣', D: '♦', H: '♥', S: '♠', NT: 'NT' };
  const DIRECTIONS = {
    N: { code: 'N', label: 'Kuzey', short: 'K', side: 'NS' },
    E: { code: 'E', label: 'Doğu', short: 'D', side: 'EW' },
    S: { code: 'S', label: 'Güney', short: 'G', side: 'NS' },
    W: { code: 'W', label: 'Batı', short: 'B', side: 'EW' }
  };
  const DOUBLING = { normal: 'Normal', doubled: 'Dbl', redoubled: 'RDbl' };

  /* Standart 16'lik board zon dongusu (1. board zon yok). */
  const VULN_CYCLE = ['-', 'NS', 'EW', 'ALL', 'NS', 'EW', 'ALL', '-',
                      'EW', 'ALL', '-', 'NS', 'ALL', '-', 'NS', 'EW'];

  function boardVulnerability(boardNo) {
    const n = Number(boardNo);
    if (!Number.isFinite(n) || n < 1) return '-';
    return VULN_CYCLE[(Math.floor(n) - 1) % 16];
  }

  /* Board numarasindan, deklaranin yonune gore zon durumu. */
  function isVulnerableFor(boardNo, direction) {
    const v = boardVulnerability(boardNo);
    if (v === 'ALL') return true;
    if (v === '-') return false;
    const side = DIRECTIONS[direction] ? DIRECTIONS[direction].side : null;
    return side === v;
  }

  /* Bir kontratta izin verilen en fazla overtrick / batak sayisi. */
  function maxOvertricks(level) { return 7 - Number(level); }
  function maxUndertricks(level) { return 6 + Number(level); }

  function contractLabel(level, strain, result, doubling) {
    const d = doubling === 'doubled' ? ' Dbl' : (doubling === 'redoubled' ? ' RDbl' : '');
    const r = result === 0 ? '=' : (result > 0 ? '+' + result : String(result));
    return `${level}${STRAIN_SYMBOL[strain] || strain}${d} ${r}`;
  }

  /* ------------------------------------------------------------------------
     1) calculateBridgeScore - Excel veri tabanindan deklaran tarafin skoru
        Pozitif: kontrat yapildi, deklaran tarafin puani
        Negatif: kontrat battı, deklaran tarafin kaybi
     ---------------------------------------------------------------------- */
  function calculateBridgeScore({ level, strain, result, vulnerable, doubling }) {
    const lvl = Number(level);
    const res = Number(result);
    const dbl = doubling || 'normal';

    if (!Number.isInteger(lvl) || lvl < 1 || lvl > 7) {
      throw new Error('Kontrat seviyesi 1-7 arasında olmalı.');
    }
    if (STRAINS.indexOf(strain) === -1) {
      throw new Error('Geçersiz renk: ' + strain);
    }
    if (!Number.isInteger(res)) {
      throw new Error('Sonuç seçilmedi.');
    }
    if (!DOUBLING[dbl]) {
      throw new Error('Geçersiz kontr durumu: ' + dbl);
    }
    const zone = vulnerable ? 'vul' : 'nonVul';

    if (res >= 0) {
      if (res > maxOvertricks(lvl)) {
        throw new Error(`${lvl} seviyesinde en fazla +${maxOvertricks(lvl)} yapılabilir.`);
      }
      const row = CONTRACT_SCORES[`${lvl}${strain}_${res}`];
      if (!row) {
        throw new Error('Bu kontrat/sonuç kombinasyonu veri tabanında bulunamadı.');
      }
      const v = row[zone][dbl];
      if (v === undefined || v === null) {
        throw new Error('Bu kontrat/sonuç kombinasyonu veri tabanında bulunamadı.');
      }
      return v;
    }

    if (-res > maxUndertricks(lvl)) {
      throw new Error(`${lvl} seviyesinde en fazla ${maxUndertricks(lvl)} batılır.`);
    }
    const under = UNDERTRICK_SCORES[String(res)];
    if (!under) {
      throw new Error('Bu kontrat/sonuç kombinasyonu veri tabanında bulunamadı.');
    }
    const p = under[zone][dbl];
    if (p === undefined || p === null) {
      throw new Error('Bu kontrat/sonuç kombinasyonu veri tabanında bulunamadı.');
    }
    return -p;   // ceza deklaran tarafin aleyhinedir
  }

  /* ------------------------------------------------------------------------
     2) calculateTeamPerspective
        Takim macinda ayni takim iki odada ters yonlerde oturur.
        openHomeSide: acik odada EV SAHIBI'nin oturdugu taraf ('NS' | 'EW')
        Kapali odada ev sahibi otomatik olarak diger taraftadir.
     ---------------------------------------------------------------------- */
  function homeSideInRoom(room, openHomeSide) {
    const open = openHomeSide === 'EW' ? 'EW' : 'NS';
    if (room === 'open') return open;
    return open === 'NS' ? 'EW' : 'NS';
  }

  function calculateTeamPerspective({ room, direction, rawScore, openHomeSide }) {
    const dir = DIRECTIONS[direction];
    if (!dir) throw new Error('Yön seçilmeden hesaplama yapılamaz.');
    const homeSide = homeSideInRoom(room, openHomeSide);
    const declarerIsHome = dir.side === homeSide;
    return {
      declarerSide: dir.side,
      declarerTeam: declarerIsHome ? 'home' : 'away',
      homeScore: declarerIsHome ? rawScore : -rawScore
    };
  }

  /* ------------------------------------------------------------------------
     3) calculateBoardResult
        Iki odanin ev sahibi perspektifindeki skorlari toplanir; bu, ayni
        board icin "acik oda KG skoru - kapali oda KG skoru" ile ozdestir.
     ---------------------------------------------------------------------- */
  function roomResult(room, entry, openHomeSide, boardNo) {
    const vulnerable = (entry.vulnerable === undefined || entry.vulnerable === null)
      ? isVulnerableFor(boardNo, entry.direction)
      : !!entry.vulnerable;

    const rawScore = calculateBridgeScore({
      level: entry.level, strain: entry.strain, result: entry.result,
      vulnerable, doubling: entry.doubling
    });
    const persp = calculateTeamPerspective({
      room, direction: entry.direction, rawScore, openHomeSide
    });
    return {
      room,
      level: Number(entry.level),
      strain: entry.strain,
      result: Number(entry.result),
      doubling: entry.doubling || 'normal',
      direction: entry.direction,
      vulnerable,
      contract: `${entry.level}${entry.strain}`,
      label: contractLabel(entry.level, entry.strain, Number(entry.result), entry.doubling),
      rawScore,
      declarerSide: persp.declarerSide,
      declarerTeam: persp.declarerTeam,
      teamScore: persp.homeScore   // EV SAHIBI perspektifi
    };
  }

  function calculateBoardResult({ boardNo, openRoom, closedRoom, openHomeSide }) {
    const open = roomResult('open', openRoom, openHomeSide, boardNo);
    const closed = roomResult('closed', closedRoom, openHomeSide, boardNo);

    const net = open.teamScore + closed.teamScore;   // ev sahibi lehine net
    const imps = calculateIMP(net);
    const winner = imps === 0 ? 'none' : (net > 0 ? 'home' : 'away');

    return {
      boardNo: Number(boardNo),
      openHomeSide: openHomeSide === 'EW' ? 'EW' : 'NS',
      openRoom: open,
      closedRoom: closed,
      netScore: net,
      difference: Math.abs(net),
      imps,
      winner,
      homeImp: winner === 'home' ? imps : 0,
      awayImp: winner === 'away' ? imps : 0
    };
  }

  /* ------------------------------------------------------------------------
     4) calculateMatchTotal
     ---------------------------------------------------------------------- */
  function calculateMatchTotal(boards) {
    return (boards || []).reduce(function (acc, b) {
      acc.home += b.homeImp || 0;
      acc.away += b.awayImp || 0;
      return acc;
    }, { home: 0, away: 0 });
  }

  return {
    STRAINS, STRAIN_SYMBOL, DIRECTIONS, DOUBLING, VULN_CYCLE,
    boardVulnerability, isVulnerableFor, maxOvertricks, maxUndertricks,
    contractLabel, homeSideInRoom,
    calculateBridgeScore, calculateTeamPerspective,
    calculateBoardResult, calculateMatchTotal, calculateIMP
  };
}));
