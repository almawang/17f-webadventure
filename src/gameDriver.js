import GameView from './gameView';
// import GameData from './gameData';

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;


class GameDriver {
  constructor() {
    this.nextMove = RIGHT;
    this.gameView = new GameView();
    this.curLocation = [0, 0, 0];

    this.startGame = this.startGame.bind(this);
    this.makeMove = this.makeMove.bind(this);
    this.moveSelection = this.moveSelection.bind(this);
  }


  startGame() {
    this.gameView.highlightChar(this.curLocation[0], this.curLocation[1], this.curLocation[2]);
    setInterval(this.makeMove, 250);
  }

  makeMove() {
    const loc = this.curLocation;
    const moves = this.gameView.getMoves(loc[0], loc[1], loc[2]);
    if (moves[this.nextMove]) {
      const nextLoc = moves[this.nextMove];
      this.gameView.highlightChar(nextLoc[0], nextLoc[1], nextLoc[2]);
      this.curLocation = nextLoc;
    } else {
      console.log('badmove');
      // moves.forEach((nextLoc) => {
      //   if (nextLoc) {
      //     this.gameView.highlightChar(nextLoc[0], nextLoc[1], nextLoc[2]);
      //     this.curLocation = nextLoc;
      //   }
      // });
    }
  }

  moveSelection(evt) {
    switch (evt.keyCode) {
      case 65:
        this.nextMove = LEFT;
        break;
      case 68:
        this.nextMove = RIGHT;
        break;
      case 87:
        this.nextMove = UP;
        break;
      case 83:
        this.nextMove = DOWN;
        break;
      default:
        this.nextMove = this.nextMove;
    }
  }
}

export default GameDriver;
