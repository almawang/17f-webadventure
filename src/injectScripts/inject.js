import WikiGame from '../wikiGame';
import Player from '../player';

let wikiGame;
let curPlayer;

const onNewUrl = (newUrl) => {
  const req = {
    message: 'new url',
    payload: {
      newUrl,
    },
  };
  chrome.runtime.sendMessage(req);
};

chrome.runtime.onMessage.addListener((request) => {
  switch (request.message) {
    case 'new game':
      curPlayer = new Player(request.payload.username, { left: 100, top: 100 }, true);
      wikiGame = new WikiGame(onNewUrl, curPlayer);
      wikiGame.updateLeaderboard(request.payload.game);
      break;
    case 'game info':
      wikiGame.updateLeaderboard(request.payload.game);
      break;
    default:
  }
});