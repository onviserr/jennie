// lib/can.js
import FallingObject from './falling_object.js';

export default class Can extends FallingObject {
  constructor(options = {}) {
    options.good = true;
    options.src = "assets/can.png";
    options.xp = 1; // Least XP
    super(options);
  }
}
