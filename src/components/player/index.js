import gsap from 'gsap';
import { Raycaster, AnimationMixer, Vector3 } from 'three';
import StateMachine from 'navi-engine/state-machine';

import { addAction, addSceneAction } from "navi-engine/hooks";
import { getMovementInput, framePress } from "navi-engine/input";
import { rootScene } from "navi-engine/scene-manager";
import { world } from "navi-engine/world";

import { PlayerIdle } from "./behaviors/idle";
import { PlayerWalk } from "./behaviors/walking";
import { PlayerPush } from "./behaviors/pushing";
import { PlayerTouch } from "./behaviors/touch";
import { PlayerSwing } from "./behaviors/swing";
import { PlayerLocked } from "./behaviors/locked";

let animationMixer = {};
const GROUNDED_THRESHOLD = 0.9;
const stateMachine = new StateMachine();

const getTouchTarget = (gameObject) => {
  const { body } = gameObject;
  const { velocity } = body;
  const touchDirection = new Vector3();
  const touchRaycaster = new Raycaster();

  touchRaycaster.far = 1;
  touchDirection.copy(velocity);
  touchDirection.normalize();

  gameObject.getWorldDirection(touchDirection);
  touchDirection.normalize();
  touchRaycaster.set(gameObject.position, touchDirection);
  const inRange = touchRaycaster.intersectObject(rootScene);

  gameObject.touchTarget = inRange.find((O) => O.object.userData.OnTouch);
  return !!gameObject.touchTarget;
};

const isGrounded = (player, world) => {
  const { contacts } = world;

  const playerContacts = contacts.filter(C => {
    return (C.bi.gameObject === player) || (C.bj.gameObject === player);
  });

  return !!playerContacts.find((C) => {
    const dp = player.up.dot(C.ni);
    return dp > GROUNDED_THRESHOLD;
  });
}

addAction(
  'gameObject.load',
  'gameObject.load/initializeAnimator',
  (gameObject) => {
    const { animations } = gameObject;
    if (animations.length === 0) {
      return;
    }

    const [gltf] = gameObject.children;
    const mesh = gltf.children[0];

    animationMixer = new AnimationMixer(mesh);

    addSceneAction(
      'gameController.update',
      'gameController.update/doAnimator',
      (delta) => animationMixer.update(delta)
    );
  }
);

addAction(
  'gameObject.load',
  'gameObject.load/addPlayerMovement',
  (player) => {
    const { userData } = player;
    if (!Object.keys(userData).includes('PlayerMovement')) {
      return;
    }

    addAction(
      'debug.timelineTest',
      'debug.timelineTest/playerTimeline',
      () => {
        player.isLocked = true;
        console.log(animationMixer._actions);
        animationMixer._actions.forEach(action => {
          console.log(`${action._clip.name} :: ${Number(action._clip.name == 'Idle')}`);
          action.weight = Number(action._clip.name == 'Idle')
        });
        gsap.to(player.rotation, {
          y: '+=18.846',
          duration: 5,
          onComplete: () => player.isLocked = false
        });
      }
    );

    const playerIdle = PlayerIdle({ player, animationMixer });
    const playerWalk = PlayerWalk({ player, animationMixer });
    const playerPush = PlayerPush({ player, animationMixer });
    const playerTouch = PlayerTouch({ player, animationMixer });
    const playerSwing = PlayerSwing({ player, animationMixer });
    const playerLocked = PlayerLocked({ player, animationMixer });

    const touchedSomething = () => (framePress.has('Space') && getTouchTarget(player));
    const touchedNothing = () => (framePress.has('Space') && !getTouchTarget(player));

    stateMachine.addTransition(playerIdle, playerWalk, () => getMovementInput().lengthSq() !== 0);
    stateMachine.addTransition(playerIdle, playerTouch, touchedSomething);
    stateMachine.addTransition(playerIdle, playerSwing, touchedNothing);

    stateMachine.addTransition(playerWalk, playerIdle, () => getMovementInput().lengthSq() === 0);
    stateMachine.addTransition(playerWalk, playerTouch, touchedSomething);
    stateMachine.addTransition(playerWalk, playerSwing, touchedNothing);
    stateMachine.addTransition(playerWalk, playerPush, () => playerPush.isPushing(player));

    stateMachine.addTransition(playerPush, playerIdle, () => playerPush.releaseBuffer >= 4);
    stateMachine.addTransition(playerTouch, playerIdle, () => player.finishedTouching);
    stateMachine.addTransition(playerSwing, playerIdle, () => player.finishedSwing);

    stateMachine.addAnyTransition(playerLocked, () => player.isLocked);
    stateMachine.addTransition(playerLocked, playerIdle, () => !player.isLocked);

    stateMachine.setState(playerIdle);

    addSceneAction(
      'gameController.beforeUpdate',
      'gameController.beforeUpdate/playerMovement',
      (delta) => stateMachine.tick(delta)
    );
  }
);
