import 'navi-engine/game-controller';
import { renderer } from 'navi-engine/renderer';
import { gotoScene } from 'navi-engine/scene-manager';

import './components/player';
import './components/spinner';
import './components/track-target';

import * as Demo from './scenes/demo2.js';

if (import.meta.env.DEV) {
  import('navi-engine/debug');
}

import './style.css';
document.body.appendChild(renderer.domElement);

gotoScene(Demo);