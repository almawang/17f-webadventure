/* eslint no-undef: "off", no-unused-vars: "off" */
import io from 'socket.io-client';

const socketserver = 'http://localhost:9090';
const URL = 'http://localhost:9090/api';

export class GameData {
  constructor() {
    this.socket = io(socketserver);
    this.socket.on('connect', () => { console.log('socket.io connected'); });
    this.socket.on('disconnect', () => { console.log('socket.io disconnected'); });
    this.socket.on('reconnect', () => { console.log('socket.io reconnected'); });
    this.socket.on('error', (error) => { console.log(error); });
  }

  onPlayers(callback) {
    this.socket.on('players', callback);
  }
}

export function getHelloMessage() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${URL}/`, true);
  xhr.onreadystatechange = () => { console.log(xhr.response); };
  xhr.send();
}
