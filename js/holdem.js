// js/holdem.js
(function() {
  'use strict';

  let deck = [];
  let players = [];
  let community = [];
  let winners = [];
  let gameOver = false;
  let currentBestScore = [];

  const communityEl = document.getElementById('community-area');
  const playersEl = document.getElementById('players-grid');
  const nextBtn = document.getElementById('next-round-btn');
  const msgEl = document.getElementById('holdem-msg');
  const expEl = document.getElementById('holdem-explanation');
  
  const cheatSheetBtn = document.getElementById('cheat-sheet-btn');
  const closeCheatBtn = document.getElementById('close-cheat-btn');
  const cheatSheet = document.getElementById('cheat-sheet');

  cheatSheetBtn.addEventListener('click', () => cheatSheet.classList.toggle('open'));
  closeCheatBtn.addEventListener('click', () => cheatSheet.classList.remove('open'));

  function startRound() {
    gameOver = false;
    communityEl.innerHTML = '';
    playersEl.innerHTML = '';
    
    msgEl.textContent = 'Valitse vahvin käsi';
    msgEl.className = '';
    expEl.classList.add('hidden');
    expEl.textContent = '';
    nextBtn.classList.add('hidden');

    deck = window.game.shuffle(window.game.generateDeck());
    
    players = [];
    for(let i=0; i<6; i++) {
      players.push([deck.pop(), deck.pop()]);
    }

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
    
    currentBestScore = bestScore;
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
    
    // Paljastetaan voittavan käden kuvaus
    const handName = window.game.getHandName(currentBestScore);
    expEl.textContent = (winners.length > 1 ? "Jaettu voittokäsi: " : "Voittokäsi: ") + handName;
    expEl.classList.remove('hidden');

    winners.forEach(w => {
      allPlayers[w].classList.add('winner');
    });

    nextBtn.classList.remove('hidden');
  }

  nextBtn.addEventListener('click', startRound);

  startRound();
})();
