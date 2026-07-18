// js/holdem.js
(function() {
  'use strict';

  let deck = [];
  let players = [];
  let community = [];
  let winners = [];
  let gameOver = false;

  const communityEl = document.getElementById('community-area');
  const playersEl = document.getElementById('players-grid');
  const nextBtn = document.getElementById('next-round-btn');
  const msgEl = document.getElementById('holdem-msg');

  function startRound() {
    gameOver = false;
    communityEl.innerHTML = '';
    playersEl.innerHTML = '';
    
    msgEl.textContent = 'Valitse vahvin käsi';
    msgEl.className = '';
    nextBtn.classList.add('hidden');

    deck = window.game.shuffle(window.game.generateDeck());
    
    players = [];
    for(let i=0; i<6; i++) {
      players.push([deck.pop(), deck.pop()]);
    }

    // Valitaan pöytäkorttien määrä: 0, 3, 4 tai 5
    const commCountOpts = [0, 3, 4, 5];
    const commCount = commCountOpts[Math.floor(Math.random() * commCountOpts.length)];
    community = [];
    for(let i=0; i<commCount; i++) {
      community.push(deck.pop());
    }

    evaluate();
    render();
  }

  function evaluate() {
    let bestScore = [-1];
    winners = [];

    players.forEach((hand, idx) => {
      const fullHand = [...hand, ...community];
      const score = window.game.getHandRank(fullHand);
      const comp = window.game.compareHands(score, bestScore);
      
      if(comp > 0) {
        bestScore = score;
        winners = [idx];
      } else if (comp === 0) {
        winners.push(idx);
      }
    });
  }

  function render() {
    community.forEach(c => {
      const wrap = window.game.createCardElement(c, true);
      communityEl.appendChild(wrap);
    });

    players.forEach((hand, idx) => {
      const pDiv = document.createElement('div');
      pDiv.className = 'holdem-player';
      pDiv.dataset.index = idx;
      
      const cardsDiv = document.createElement('div');
      cardsDiv.className = 'holdem-cards';
      
      hand.forEach(c => {
        const wrap = window.game.createCardElement(c, true);
        cardsDiv.appendChild(wrap);
      });
      pDiv.appendChild(cardsDiv);

      pDiv.addEventListener('click', () => handlePlayerClick(idx, pDiv));
      playersEl.appendChild(pDiv);
    });
  }

  function handlePlayerClick(idx, el) {
    if(gameOver) return;
    gameOver = true;
    
    const allPlayers = document.querySelectorAll('.holdem-player');
    
    if(winners.includes(idx)) {
      el.classList.add('correct');
      msgEl.textContent = 'Oikein! Valitsit voittajan.';
      msgEl.className = 'msg-correct';
    } else {
      el.classList.add('wrong');
      msgEl.textContent = 'Väärin! Oikea voittaja on korostettu.';
      msgEl.className = 'msg-wrong';
    }

    winners.forEach(w => {
      allPlayers[w].classList.add('winner');
    });

    nextBtn.classList.remove('hidden');
  }

  nextBtn.addEventListener('click', startRound);

  // Käynnistetään peli
  startRound();
})();
