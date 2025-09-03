import * as Demo2 from './demo2.js'

import { Fog } from "three";
import { world } from 'navi-engine/world';
import { rootScene, gotoScene } from "navi-engine/scene-manager";
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
  
  addSceneAction(
    'MonkeyDoor.open',
    'MonkeyDoor.open/revealControlPanel',
    () => {
      const panelElement = document.createElement('dialog');
      const panelForm = document.createElement('div');
      const inputField = document.createElement('input');
      inputField.setAttribute('readonly', true);

      const text = document.createElement('p');
      text.textContent = 'Oh wow a key code! This is just like one of my Immersive Simulation games! but I don\'t know the code... maybe I should just follow my heart.';
      panelForm.append(text);

      const numberButtons = document.createElement('div');
      Object.assign(numberButtons.style, {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        direction: 'rtl'
      });

      for(let n=9; n>=0; n--) {
        const button = document.createElement('button');
        button.textContent = `${n}`;
        button.onclick = (e) => {
          e.preventDefault();
          inputField.value = `${inputField.value.substring(inputField.value.length - 3)}${n}`;
          return false;
        };
        numberButtons.append(button);
      }
      panelForm.append(numberButtons);

      const submitButton = document.createElement('button');
      submitButton.textContent = 'GO';

      panelForm.append(inputField, submitButton);
      panelElement.append(panelForm);
      document.body.append(panelElement);
      panelElement.showModal();

      submitButton.addEventListener('click', (e) => {
        if (e.target !== submitButton) {
          return false;
        }
        
        if (inputField.value === '0451') {
          console.log('money door open!');
          monkeyDoor.visible = false;
          world.removeBody(monkeyDoor.body);
        }

        panelElement.close();
        document.body.removeChild(panelElement);
      });
    }
  );
};

