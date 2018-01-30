import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Player from './player';

import App from './components/app';

// const UP = 0;
// const RIGHT = 1;
// const DOWN = 2;
// const LEFT = 3;

class WikiGame {
  constructor(curPlayer = new Player('curPlayer', { left: 100, top: 100 }, true)) {
    this.curPlayer = curPlayer;
    this.playerID = 1;
    this.players = [];
    this.keysPressed = {
      x: {
        left: false,
        right: false,
      },
      y: {
        up: false,
        down: false,
      },
    };
    this.leaderboard = {
      time: 1234,
      curPlayer: {
        name: 'Alma',
        avatarRight: this.curPlayer.getAvatarRight(),
      },
      players: [
        { name: 'Barry', numClicks: 0 },
        { name: 'Alma', numClicks: 0 },
      ],
    };

    this.renderGame = this.renderGame.bind(this);
    this.setupToc = this.setupToc.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    this.renderGame();

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('message received!!!!!!');
        
        this.leaderboard.players = request.players;
        console.log('printing new leaderboard scores');
        console.log(request.players[0]);
        console.log(this.leaderboard);

        ReactDOM.render(<App leaderboard={this.leaderboard} />, document.getElementById('wa-main'));
    });

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.updateInterval = window.setInterval(this.updateGame, 10);
  }

  renderGame() {
    $('body').append('<div id=wa-main />');

    ReactDOM.render(<App leaderboard={this.leaderboard} />, document.getElementById('wa-main'));
    this.setupToc();
    const curPosition = this.curPlayer.getPosition();
    this.curPlayer.insertPlayer(curPosition.x, curPosition.y);
  }

  setupToc() {
    const toc = $('#toc').detach();
    $(toc).attr('id', 'wa-toc');
    $('body').append(toc);
    $(toc).find('a').each((i, link) => {
      $(link).click(() => {
        const id = $(link).attr('href');
        const { left, top } = $(document.getElementById(id.substring(1))).offset();
        // Issue with jquery on id's with special characters; i.e. (, ), -
        this.curPlayer.movePlayer(left, top);
      });
    });
  }

  updateGame() {
    const newLoc = this.curPlayer.getPosition();
    if (this.keysPressed.x.left && !this.keysPressed.x.right) {
      newLoc.x -= 5;
      this.curPlayer.updateDirRight(false);
    } else if (!this.keysPressed.x.left && this.keysPressed.x.right) {
      newLoc.x += 5;
      this.curPlayer.updateDirRight(true);
    }
    if (this.keysPressed.y.up && !this.keysPressed.y.down) {
      newLoc.y -= 5;
    } else if (!this.keysPressed.y.up && this.keysPressed.y.down) {
      newLoc.y += 5;
    }
    this.curPlayer.movePlayer(newLoc.x, newLoc.y);

    /// update locations of other players
  }

  openLink() {
    const link = this.curPlayer.getLink();
    if (link !== null) {
      // window.open(`https://en.wikipedia.org${link}`, '_self');
      const redirectLink = `https://en.wikipedia.org${link}`;
      this.leaderboard.url = redirectLink;

      // get current player from players in this.leaderboard
      var currrPlayer = $.grep(this.leaderboard.players, (player) => {
        return player.name == this.leaderboard.curPlayer.name;
      });
      currrPlayer[0].numClicks++;

      chrome.runtime.sendMessage(this.leaderboard, (response) => {
        console.log(response);
      });
    }
  }

  onKeyDown(evt) {
    switch (evt.keyCode) {
      case 65: this.keysPressed.x.left = true; break;
      case 68: this.keysPressed.x.right = true; break;
      case 87: this.keysPressed.y.up = true; break;
      case 83: this.keysPressed.y.down = true; break;
      case 76: // click link with L
        this.openLink();
        break;
      default:
        break;
    }
  }

  onKeyUp(evt) {
    switch (evt.keyCode) {
      case 65: this.keysPressed.x.left = false; break;
      case 68: this.keysPressed.x.right = false; break;
      case 87: this.keysPressed.y.up = false; break;
      case 83: this.keysPressed.y.down = false; break;
      default:
        break;
    }
  }
}

export default WikiGame;
