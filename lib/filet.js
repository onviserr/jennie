// lib/filet.js
import FallingObject from './falling_object.js';

export default class Filet extends FallingObject {
  constructor(options = {}) {
    options.good = true;
    options.src = "assets/filet.png";
    options.xp = 3; // Maximum XP
    super(options);
  }
}
