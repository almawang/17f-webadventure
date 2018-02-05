import $ from 'jquery';

const NYAN_CATS = ['https://i.imgur.com/rZSkKF0.gif', 'https://i.imgur.com/YNcTBuU.gif'];

function PLAYER_DIV(id) {
  return `<div id="${id}" class="playerDiv" style="position: absolute">
            <span class="playerName">${id}</span>
            <img id="${id}-img" class="player-img" src="${NYAN_CATS[1]}"alt="nyan cat"/>
          </div>`;
}

const END_POPUP_DIV = `
<div id="endPopUp">GAME OVER!
<div>---------</div>`;

const blueJeans = {
  name: 'Blue Jeans',
  color: {
    r: 91,
    g: 192,
    b: 235,
  },
};
const gargoyleGas = {
  name: 'Gargoyle Gas',
  color: {
    r: 253,
    g: 231,
    b: 76,
  },
};
const androidGreen = {
  name: 'Android Green',
  color: {
    r: 155,
    g: 197,
    b: 61,
  },
};
const flame = {
  name: 'Flame',
  color: {
    r: 229,
    g: 89,
    b: 15,
  },
};
const princetonOrange = {
  name: 'Princeton Orange',
  color: {
    r: 240,
    g: 121,
    b: 33,
  },
};
const colors = [blueJeans, gargoyleGas, androidGreen, flame, princetonOrange];

class GameView {
  constructor() {
    this.createTree();
    console.log(colors);
  }

  static buildEndPopup(players) {
    players.sort((a, b) => b.highScore - a.highScore);

    let newEndPopupDiv = END_POPUP_DIV;
    newEndPopupDiv += '<div>High Scores</div>';
    players.every((player, index) => {
      const playerText = `<div> ${player.username} : ${player.highScore}</div>`;
      newEndPopupDiv += playerText;
      if (index === 4) {
        return false;
      }
      return true;
    });
    const NEW_END_POPUP = newEndPopupDiv;
    return NEW_END_POPUP;
  }

  static endGame(playerDivId, players) {
    $(`#${playerDivId}`).remove();
    if ($('#endPopUp').length === 0) { $('body').append(this.buildEndPopup(players)); }
  }

  createTree() {
    const textElement = $('#mw-content-text').children()[0];
    const sections = $(textElement).children('p').map((x, item) => {
      const sentenceToWordSpans = sentence => sentence.split(' ').filter(word => word && word !== '').map(word =>
        `<span>${word} </span>`);
      const sentences = $(item).text().match(/[^.!?]+[.!?]*/g) ? $(item).text().match(/[^.!?]+[.!?]*/g) : [];
      const wordSpans = sentences.map(sentenceToWordSpans);
      $(item).html(wordSpans.map(sentence => `<span>${sentence.join('')}</span>`).join(''));
      return [$(item).children().map((index, child) => $(child).children())];
    });
    this.pageTree = sections;
  }

  movePlayer(sectionId, sentenceId, wordId, scrollTo = false, playerDivId) {
    if (this.pageTree && this.pageTree[sectionId] && this.pageTree[sectionId][sentenceId]
      && this.pageTree[sectionId][sentenceId][wordId]) {
      const span = this.pageTree[sectionId][sentenceId][wordId];
      if (scrollTo && !GameView.isScrolledIntoView(span)) {
        GameView.scrollIntoCenterView(span);
      }
      if (playerDivId) {
        this.username = playerDivId;
        let playerDiv = $(`#${playerDivId}`);
        if (!playerDiv.length) {
          $('body').append(PLAYER_DIV(playerDivId));
          playerDiv = $(`#${playerDivId}`);
        }
        playerDiv.css('top', $(span).offset().top);
        playerDiv.css('left', $(span).offset().left);
      }
    }
  }

  // called once to initialize color of user in leaderboard display
  static updateUserDisplay(id, color) {
    const colorString = `rgb(${color.r}, ${color.g}, ${color.b})`;
    const userStatRow = $('#userStatRow');
    userStatRow.html(`${id}: 0`);
    userStatRow.css('backgroundColor', `${colorString}`);
    const userIcon = ('div');
    userIcon.setAttribute('id', 'userIcon');

    userIcon.innerHTML = '';

    $('#leaderboard').append(userIcon);
  }

  static isScrolledIntoView(elem) {
    const $elem = $(elem);
    const $window = $(window);

    const docViewTop = $window.scrollTop();
    const docViewBottom = docViewTop + $window.height();

    const elemTop = $elem.offset().top;
    const elemBottom = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }

  static scrollIntoCenterView(elem) {
    const top = $(elem).offset().top - ($(window).height() / 2);
    $('html, body').animate({
      scrollTop: top,
    }, 700);
  }

  static updateAvatar(id, direction) {
    $(`#${id}-img`).attr('src', NYAN_CATS[direction]);
  }

  getMoves(sectionId, sentenceId, wordId) {
    return [this.getUp(sectionId, sentenceId, wordId),
      this.getRight(sectionId, sentenceId, wordId),
      this.getDown(sectionId, sentenceId, wordId),
      this.getLeft(sectionId, sentenceId, wordId)];
  }

  parseBackward(startLoc, condition) {
    for (let i = startLoc.sectionId; i >= 0; i -= 1) {
      const section = this.pageTree[i];
      for (let j = i === startLoc.sectionId ? startLoc.sentenceId : section.length - 1;
        j >= 0; j -= 1) {
        const sentence = section[j];
        for (let k = j === startLoc.sentenceId ? startLoc.wordId : sentence.length - 1;
          k >= 0; k -= 1) {
          const loc = { sectionId: i, sentenceId: j, wordId: k };
          if (condition(loc)) { return [i, j, k]; }
        }
      }
    }
    return null;
  }

  parseForward(startLoc, condition) {
    for (let i = startLoc.sectionId; i < this.pageTree.length; i += 1) {
      const section = this.pageTree[i];
      for (let j = i === startLoc.sectionId ? startLoc.sentenceId : 0; j < section.length; j += 1) {
        const sentence = section[j];
        for (let k = j === startLoc.sentenceId ? startLoc.wordId : 0; k < sentence.length; k += 1) {
          const loc = { sectionId: i, sentenceId: j, wordId: k };
          if (condition(loc)) { return [i, j, k]; }
        }
      }
    }
    return null;
  }

  getUp(sectionId, sentenceId, wordId) {
    const selectedWord = $(this.pageTree[sectionId][sentenceId][wordId]);
    const offsets = selectedWord.offset();
    const selectedMiddle = offsets.left + (selectedWord.width() / 2);
    const startLoc = { sectionId, sentenceId, wordId };
    const condition = (loc) => {
      const word = $(this.pageTree[loc.sectionId][loc.sentenceId][loc.wordId]);
      const wordOffsets = word.offset();
      return wordOffsets && wordOffsets.top < offsets.top &&
        GameView.isBounded(word, wordOffsets, selectedMiddle);
    };
    return this.parseBackward(startLoc, condition);
  }

  getRight(sectionId, sentenceId, wordId) {
    const startLoc = { sectionId, sentenceId, wordId };
    const condition = loc =>
      !(sectionId === loc.sectionId && sentenceId === loc.sentenceId && wordId === loc.wordId);
    return this.parseForward(startLoc, condition);
  }

  getDown(sectionId, sentenceId, wordId) {
    const selectedWord = $(this.pageTree[sectionId][sentenceId][wordId]);
    const offsets = selectedWord.offset();
    const selectedMiddle = offsets.left + (selectedWord.width() / 2);
    const startLoc = { sectionId, sentenceId, wordId };
    const condition = (loc) => {
      const word = $(this.pageTree[loc.sectionId][loc.sentenceId][loc.wordId]);
      const wordOffsets = word.offset();
      return wordOffsets.top > offsets.top &&
        GameView.isBounded(word, wordOffsets, selectedMiddle);
    };
    return this.parseForward(startLoc, condition);
  }

  getLeft(sectionId, sentenceId, wordId) {
    const startLoc = { sectionId, sentenceId, wordId };
    const condition = loc =>
      !(sectionId === loc.sectionId && sentenceId === loc.sentenceId && wordId === loc.wordId);
    return this.parseBackward(startLoc, condition);
  }

  static isBounded(word, wordOffsets, selectedMiddle) {
    const rightEdge = wordOffsets.left + word.width();
    return wordOffsets.left <= selectedMiddle && rightEdge >= selectedMiddle;
  }

  isEmptyLoc(loc) {
    const word = $(this.pageTree[loc[0]][loc[1]][loc[2]]);
    return (word.css('background-color') === 'rgba(0, 0, 0, 0)');
  }

  randomLoc() {
    let randSect = Math.floor(Math.random() * this.pageTree.length);
    let count = 0;
    while (this.pageTree[randSect].length < 1 && count < 100) {
      randSect = Math.floor(Math.random() * this.pageTree.length);
      count += 1;
    }
    let randSentence = Math.floor(Math.random() * this.pageTree[randSect].length);
    count = 0;
    while (this.pageTree[randSect][randSentence].length < 1 && count < 100) {
      randSentence = Math.floor(Math.random() * this.pageTree[randSect].length);
      count += 1;
    }
    let randWord = Math.floor(Math.random() * this.pageTree[randSect][randSentence].length);
    count = 0;
    while (this.isEmptyLoc([randSect, randSentence, randWord]) && count < 100) {
      randWord = Math.floor(Math.random() * this.pageTree[randSect][randSentence].length);
      count += 1;
    }
    return [randSect, randSentence, randWord];
  }
}

export default GameView;