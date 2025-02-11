// lib/fish.js
import FallingObject from './falling_object.js';

export default class Fish extends FallingObject {
  constructor(options = {}) {
    options.good = false;
    options.src = "assets/fish.png";
    super(options);
  }
}
