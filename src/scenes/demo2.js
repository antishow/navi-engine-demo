import * as Demo from './demo.js';

import { EffectPass, GlitchEffect, GlitchMode } from "postprocessing";
import { Fog, Vector2, Vector3 } from "three";

import { gotoScene, rootScene } from "navi-engine/scene-manager";
import { mainCamera } from 'navi-engine/camera';
import { composer } from 'navi-engine/renderer';
import { addSceneAction } from 'navi-engine/hooks';

export const prefabs = [
  'monkey',
  'pc'
];

export const url = 'assets/scenes/demo2.glb';
export const name = 'Monkey Temple';


export const onLoad = () => {
  const glitch = new GlitchEffect({ strength: new Vector2(0.3, 0.5), columns: 0.06 });
  glitch.mode = GlitchMode.CONSTANT_MILD;
  composer.addPass(new EffectPass(mainCamera, glitch));
  rootScene.fog = new Fog(0xff0000, 0, 50);

  const triggerCube = rootScene.getObjectByName('TriggerCube');
  triggerCube.body.addEventListener('collide', () => gotoScene(Demo));

  const monkey = rootScene.getObjectByName('Player001');
  const player = rootScene.getObjectByName('Player');
  const monkeyPosition = monkey.position;
  const playerPosition = new Vector3();
  const playerDirection = new Vector3();
  const playerToMonkey = new Vector3();
  monkey.getWorldPosition(monkeyPosition);

  const madnessAura = 8.0;

  addSceneAction(
    'gameController.update',
    'gameController.update/glitchPower',
    () => {
      player.getWorldPosition(playerPosition);
      player.getWorldDirection(playerDirection);
      playerToMonkey.copy(monkeyPosition).sub(playerPosition).normalize();
      const facing = Math.max(0, playerToMonkey.dot(playerDirection));
      const distance = playerPosition.distanceTo(monkeyPosition);
      const power = facing * Math.max(0, madnessAura - distance) / madnessAura;

      glitch.minStrength = 0.3 * power;
      glitch.maxStrength = 0.5 * power;
      glitch.columns = 0.08 * power;
    }
  )
};

