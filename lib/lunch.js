// lib/lunch.js
import FallingObject from './falling_object.js';

export default class Lunch extends FallingObject {
  constructor(options = {}) {
    options.good = true;
    options.src = "assets/lunch.png";
    options.xp = 2; // Average XP
    super(options);
  }
}
