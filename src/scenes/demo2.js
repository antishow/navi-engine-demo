import * as Demo from './demo.js';

import { EffectPass, GlitchEffect } from "postprocessing";
import { Fog } from "three";

import { gotoScene, rootScene } from "navi-engine/scene-manager";
import { mainCamera } from 'navi-engine/camera';
import { composer } from 'navi-engine/renderer';

export const prefabs = [
  'monkey',
  'pc'
];

export const url = 'assets/scenes/demo2.glb';
export const name = 'Monkey Temple';

export const onLoad = () => {
  composer.addPass(new EffectPass(mainCamera, new GlitchEffect()));
  rootScene.fog = new Fog(0xff0000, 0, 50);

  const triggerCube = rootScene.getObjectByName('TriggerCube');
  triggerCube.body.addEventListener('collide', () => gotoScene(Demo));
};

