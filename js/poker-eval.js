// js/poker-eval.js
(function() {
  'use strict';

  // Arvostelee pokerikäden ja palauttaa taulukon esim [8, 14] = Kuningasvärisuora
  window.game.getHandRank = function(cards) {
    if (!cards || cards.length === 0) return [-1];
    
    // Muunnetaan ässät arvoon 14
    let mapped = cards.map(c => ({
      r: c.rank === 1 ? 14 : c.rank,
      s: c.suit
    })).sort((a, b) => b.r - a.r);

    // Etsitään väri
    let suits = {};
    mapped.forEach(c => { suits[c.s] = (suits[c.s] || []); suits[c.s].push(c); });
    let flushCards = Object.values(suits).find(arr => arr.length >= 5);

    // Lasketaan esiintyvyydet (Pari, Kolmoset yms)
    let counts = {};
    mapped.forEach(c => { counts[c.r] = (counts[c.r] || 0) + 1; });
    let countArr = Object.keys(counts).map(k => ({r: parseInt(k), count: counts[k]}))
                      .sort((a, b) => b.count - a.count || b.r - a.r);

    // Suoran etsijä
    const findStraight = (arr) => {
      let u = [...new Set(arr.map(c => c.r))].sort((a,b) => b-a);
      if(u.includes(14)) u.push(1); // Ässä on myös 1 suoraa varten
      for(let i=0; i<=u.length-5; i++) {
        if(u[i] - u[i+4] === 4) return u[i];
      }
      return null;
    };

    // 8. Värisuora
    if (flushCards) {
      let sf = findStraight(flushCards);
      if (sf) return [8, sf];
    }
    // 7. Neloset
    if (countArr[0].count === 4) {
      let kicker = mapped.find(c => c.r !== countArr[0].r);
      return [7, countArr[0].r, kicker ? kicker.r : 0];
    }
    // 6. Täyskäsi
    if (countArr[0].count === 3 && countArr.length > 1 && countArr[1].count >= 2) {
      return [6, countArr[0].r, countArr[1].r];
    }
    // 5. Väri
    if (flushCards) {
      return [5, ...flushCards.slice(0,5).map(c => c.r)];
    }
    // 4. Suora
    let st = findStraight(mapped);
    if (st) return [4, st];

    // 3. Kolmoset
    if (countArr[0].count === 3) {
      let kickers = mapped.filter(c => c.r !== countArr[0].r).slice(0,2).map(c => c.r);
      return [3, countArr[0].r, ...kickers];
    }
    // 2. Kaksi Paria
    if (countArr[0].count === 2 && countArr.length > 1 && countArr[1].count === 2) {
      let kickers = mapped.filter(c => c.r !== countArr[0].r && c.r !== countArr[1].r).slice(0,1).map(c => c.r);
      return [2, countArr[0].r, countArr[1].r, ...kickers];
    }
    // 1. Pari
    if (countArr[0].count === 2) {
      let kickers = mapped.filter(c => c.r !== countArr[0].r).slice(0,3).map(c => c.r);
      return [1, countArr[0].r, ...kickers];
    }
    // 0. Hai
    return [0, ...mapped.slice(0,5).map(c => c.r)];
  };

  // Vertailee kahta piste-arrayta
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
