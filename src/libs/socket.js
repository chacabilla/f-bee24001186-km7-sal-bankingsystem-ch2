import { io } from '../../index.js';

export class Notification {
  static push(event, message) {
    if (io) {
      io.emit(event, { message });
    } else {
      console.error('Socket.IO not initialized');
    }
  }
}
