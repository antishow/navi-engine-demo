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

let panelWindow = null;

export const onLoad = () => {
  rootScene.fog = new Fog(0x000000, 0, 50);

  const triggerCube = rootScene.getObjectByName('TriggerCube');
  triggerCube.body.addEventListener('collide', () => gotoScene(Demo2));

  const monkeyDoor = rootScene.getObjectByName('MonkeyDoor');
  
  addSceneAction(
    'MonkeyDoor.open',
    'MonkeyDoor.open/revealControlPanel',
    () => {
      if (panelWindow) {
        panelWindow.focus();
        return;
      }

      panelWindow = window.open('', '', 'width=320,height=240');
      panelWindow.addEventListener('beforeunload', () => panelWindow = null, { once: true });
      window.addEventListener('beforeunload', () => panelWindow.close());

      const panelTitle = panelWindow.document.createElement('title');
      panelTitle.textContent = 'A Mysterious Control Panel';
      panelWindow.document.head.append(panelTitle);

      const panelForm = panelWindow.document.createElement('form');
      const inputField = panelWindow.document.createElement('input');
      inputField.setAttribute('readonly', true);

      const text = panelWindow.document.createElement('p');
      text.textContent = 'Oh wow a key code! This is just like one of my Immersive Simulation games! but I don\'t know the code... maybe I should just follow my heart.';
      panelForm.append(text);

      const numberButtons = panelWindow.document.createElement('div');
      Object.assign(numberButtons.style, {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        direction: 'rtl'
      });
      for(let n=9; n>=0; n--) {
        const button = panelWindow.document.createElement('button');
        button.textContent = `${n}`;
        button.onclick = (e) => {
          e.preventDefault();
          inputField.value = `${inputField.value.substring(inputField.value.length - 3)}${n}`;
          return false;
        };
        numberButtons.append(button);
      }
      panelForm.append(numberButtons);

      const submitButton = panelWindow.document.createElement('input');
      submitButton.setAttribute('type', 'submit');
      submitButton.setAttribute('value', 'GO');
      panelForm.append(inputField, submitButton);
      panelWindow.document.body.append(panelForm);

      panelForm.addEventListener('submit', (e) => {
        if (e.submitter !== submitButton) {
          e.preventDefault();
          return;
        }
        
        if (inputField.value === '0451') {
          monkeyDoor.visible = false;
          world.removeBody(monkeyDoor.body);
          panelWindow.close();
        }

        e.preventDefault();
      });
    }
  );
};

