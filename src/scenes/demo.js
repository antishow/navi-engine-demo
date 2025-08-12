import * as Demo2 from './demo2.js'

import { Fog } from "three";
import { rootScene, gotoScene } from "navi-engine/scene-manager";
import { world } from 'navi-engine/world';
import { addSceneAction } from 'navi-engine/hooks';

export const prefabs = [
  'bill',
  'pc'
];

export const url = 'assets/scenes/demo.glb';
export const name = 'Demo Scene';

export const onLoad = () => {
  rootScene.fog = new Fog(0x000000, 0, 50);

  const triggerCube = rootScene.getObjectByName('TriggerCube');
  triggerCube.body.addEventListener('collide', () => gotoScene(Demo2));

  const monkeyDoor = rootScene.getObjectByName('MonkeyDoor');
  addSceneAction('MonkeyDoor.open', 'MonkeyDoor.open/boop', () => {
    monkeyDoor.visible = false;
    world.removeBody(monkeyDoor.body);
  });
};
