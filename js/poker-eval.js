// js/poker-eval.js
(function() {
  'use strict';

  // Korttien ja yhdistelmien nimeämiset selitystä varten
  const RANK_NAMES = [
    "Hai", "Pari", "Kaksi paria", "Kolmoset", "Suora",
    "Väri", "Täyskäsi", "Neloset", "Värisuora"
  ];

  const CARD_NAMES = {
    14: 'Ässä', 13: 'Kuningas', 12: 'Rouva', 11: 'Jätkä', 10: 'Kymppi',
    9: 'Ysi', 8: 'Kasi', 7: 'Seiska', 6: 'Kutonen', 5: 'Vitonen',
    4: 'Nelonen', 3: 'Kolmonen', 2: 'Kakkonen'
  };

  const CARD_NAMES_PLURAL = {
    14: 'Ässät', 13: 'Kuninkaat', 12: 'Rouvat', 11: 'Jätkät', 10: 'Kympit',
    9: 'Ysit', 8: 'Kasit', 7: 'Seiskat', 6: 'Kutoset', 5: 'Vitoset',
    4: 'Neloset', 3: 'Kolmoset', 2: 'Kakkoset'
  };

  window.game.getHandName = function(score) {
    if (!score || score[0] === -1) return "Tuntematon";
    const type = score[0];
    const p = score[1]; // Ensisijainen kortti (esim. minkä kolmoset)
    const s = score[2]; // Toissijainen kortti (esim. täyskäden pari)
    
    switch(type) {
      case 8: return p === 14 ? "Kuningasvärisuora" : `Värisuora (korkein ${CARD_NAMES[p]})`;
      case 7: return `Neloset (${CARD_NAMES_PLURAL[p]})`;
      case 6: return `Täyskäsi (${CARD_NAMES_PLURAL[p]} ja ${CARD_NAMES_PLURAL[s]})`;
      case 5: return `Väri (korkein ${CARD_NAMES[p]})`;
      case 4: return `Suora (korkein ${CARD_NAMES[p]})`;
      case 3: return `Kolmoset (${CARD_NAMES_PLURAL[p]})`;
      case 2: return `Kaksi paria (${CARD_NAMES_PLURAL[p]} ja ${CARD_NAMES_PLURAL[s]})`;
      case 1: return `Pari (${CARD_NAMES_PLURAL[p]})`;
      case 0: return `Hai (${CARD_NAMES[p]})`;
    }
    return "";
  };

  window.game.getHandRank = function(cards) {
    if (!cards || cards.length === 0) return [-1];
    
    let mapped = cards.map(c => ({
      r: c.rank === 1 ? 14 : c.rank,
      s: c.suit
    })).sort((a, b) => b.r - a.r);

    let suits = {};
    mapped.forEach(c => { suits[c.s] = (suits[c.s] || []); suits[c.s].push(c); });
    let flushCards = Object.values(suits).find(arr => arr.length >= 5);

    let counts = {};
    mapped.forEach(c => { counts[c.r] = (counts[c.r] || 0) + 1; });
    let countArr = Object.keys(counts).map(k => ({r: parseInt(k), count: counts[k]}))
                      .sort((a, b) => b.count - a.count || b.r - a.r);

    const findStraight = (arr) => {
      let u = [...new Set(arr.map(c => c.r))].sort((a,b) => b-a);
      if(u.includes(14)) u.push(1); 
      for(let i=0; i<=u.length-5; i++) {
        if(u[i] - u[i+4] === 4) return u[i];
      }
      return null;
    };

    if (flushCards) {
      let sf = findStraight(flushCards);
      if (sf) return [8, sf];
    }
    if (countArr[0].count === 4) {
      let kicker = mapped.find(c => c.r !== countArr[0].r);
      return [7, countArr[0].r, kicker ? kicker.r : 0];
    }
    if (countArr[0].count === 3 && countArr.length > 1 && countArr[1].count >= 2) {
      return [6, countArr[0].r, countArr[1].r];
    }
    if (flushCards) {
      return [5, ...flushCards.slice(0,5).map(c => c.r)];
    }
    let st = findStraight(mapped);
    if (st) return [4, st];

    if (countArr[0].count === 3) {
      let kickers = mapped.filter(c => c.r !== countArr[0].r).slice(0,2).map(c => c.r);
      return [3, countArr[0].r, ...kickers];
    }
    if (countArr[0].count === 2 && countArr.length > 1 && countArr[1].count === 2) {
      let kickers = mapped.filter(c => c.r !== countArr[0].r && c.r !== countArr[1].r).slice(0,1).map(c => c.r);
      return [2, countArr[0].r, countArr[1].r, ...kickers];
    }
    if (countArr[0].count === 2) {
      let kickers = mapped.filter(c => c.r !== countArr[0].r).slice(0,3).map(c => c.r);
      return [1, countArr[0].r, ...kickers];
    }
    return [0, ...mapped.slice(0,5).map(c => c.r)];
  };

  window.game.compareHands = function(a, b) {
    for(let i=0; i<Math.max(a.length, b.length); i++){
      let va = a[i] || 0;
      let vb = b[i] || 0;
      if(va > vb) return 1;
      if(vb > va) return -1;
    }
    return 0;
  };
})();
