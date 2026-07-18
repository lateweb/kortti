// js/selection.js
(function() {
  'use strict';

  window.game.selectPyramidCard = function(idx) {
    if (window.game.gameOver || window.game.isAnimating || window.game.pyramid[idx].removed || !window.game.isExposed(idx)) return;

    if (window.game.wasteSelected) {
      if (window.game.waste && window.game.pyramid[idx].rank + window.game.waste.rank === 13) {
        window.game.pairWasteWithPyramid(idx);
        return; 
      } else {
        window.game.clearAllHighlights(); 
      }
    }

    if (window.game.selectedIndex === idx) {
      window.game.clearAllHighlights();
      return;
    }

    if (window.game.selectedIndex !== null) {
      if (window.game.possibleMatchIndices.includes(idx)) {
        window.game.removePair(window.game.selectedIndex, idx);
        window.game.selectedIndex = null;
        window.game.possibleMatchIndices = [];
        window.game.clearAllHighlights();
        return;
      } else {
        window.game.selectedIndex = null;
        window.game.possibleMatchIndices = [];
        window.game.clearAllHighlights();
      }
    }

    // KUNINGAS-LOGIIKKA: Kuningas (13) poistetaan aina välittömästi yhdellä klikkauksella!
    if (window.game.pyramid[idx].rank === 13) {
      window.game.removeKing(idx);
      return;
    }

    const target = 13 - window.game.pyramid[idx].rank;
    const exposed = window.game.getExposed();
    const matches = exposed.filter(i => i !== idx && window.game.pyramid[i].rank === target);

    if (window.game.settings.clickBoth) {
      window.game.clearAllHighlights();
      window.game.selectedIndex = idx;
      window.game.possibleMatchIndices = matches;
      window.game.pyramid[idx].el.classList.add('selected');
      return;
    }

    if (matches.length === 1) {
      window.game.removePair(idx, matches[0]);
      window.game.clearAllHighlights();
    } else if (matches.length > 1) {
      window.game.selectedIndex = idx;
      window.game.possibleMatchIndices = matches;
      window.game.highlightSelection(idx, matches);
    } else {
      if (window.game.waste !== null && window.game.waste.rank === target) {
        window.game.pairWasteWithPyramid(idx);
      }
    }
  };
})();
