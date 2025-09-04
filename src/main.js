import 'navi-engine/game-controller';
import { renderer } from 'navi-engine/renderer';
import { gotoScene } from 'navi-engine/scene-manager';
import { addAction } from 'navi-engine/hooks';

import './components/player';
import './components/spinner';
import './components/track-target';

import * as Demo from './scenes/demo.js';

if (import.meta.env.DEV) {
  import('navi-engine/debug');
}

import './style.css';
document.body.appendChild(renderer.domElement);

import { gsap } from 'gsap';

addAction(
  'gltf.ready',
  'gltf.ready/titleCard',
  (gltf) => {
    if (!gltf.scene) {
      return;
    }

    document.querySelectorAll('.title-card').forEach(t => t.parentElement.removeChild(t));

    const sceneName = gltf.scene.name || 'Untitled';
    const titleCard = document.createElement('div');
    titleCard.classList.add('title-card');
    titleCard.textContent = sceneName;
    document.body.append(titleCard);

    gsap.fromTo(titleCard, { opacity: 1.0 }, { 
      opacity: 0,
      duration: 2.0,
      delay: 4.0,
      onComplete: () => titleCard.remove(),
    });
  }
);

gotoScene(Demo);