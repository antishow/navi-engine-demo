import { gsap } from 'gsap';
import { Vec3 } from 'cannon-es';
import { AnimationClip, Euler, Vector3, Quaternion } from "three";
import { getMovementInput } from "navi-engine/input";
import { mainCamera } from "navi-engine/camera";
import { world } from "navi-engine/world";

export const PlayerPush = ({ player, animationMixer }) => {
  const clip = AnimationClip.findByName(player.animations, 'Pushing');
  const action = animationMixer.clipAction(clip);

  action.weight = 0;
  action.play();

  const DIRECTION_THRESHOLD = 0.9;
  action.weightTo = gsap.quickTo(action, 'weight', { duration: 0.25 });

  const PlayerMovement = JSON.parse(player.userData.PlayerMovement);
  const { body } = player;
  const euler = new Euler();
  const destination = new Vector3();
  const directionBuffer = new Quaternion();
  const lookBuffer = new Quaternion();

  let releaseBuffer = 0;
  const isPushing = () => {
    const { contacts } = world;
    const playerContacts = contacts.filter(C => {
      return (C.bi.gameObject?.name === player.name) || (C.bj.gameObject?.name === player.name);
    });

    const { body } = player;
    const { velocity } = body;
    const playerDirection = new Vec3().copy(velocity);
    playerDirection.normalize();

    return !!playerContacts.find((C) => {
      const dp = playerDirection.dot(C.ni);
      if (C.bj.gameObject === player) {
        return dp < -1 * DIRECTION_THRESHOLD;
      }

      return dp > DIRECTION_THRESHOLD;
    });
  }


  return {
    isPushing,
    get releaseBuffer() {
      return releaseBuffer;
    },
    onEnter: () => {
      releaseBuffer = 0;
      const activeActions = animationMixer._actions.filter(A => A !== action && A.weight);
      activeActions.forEach(activeAction => activeAction.weightTo(0));

      action.weightTo(1);
    },
    tick: () => {
      const input = getMovementInput();
      if (!input.x && !input.z) {
        releaseBuffer++;
        return;
      }

      const azi = euler.setFromQuaternion(mainCamera.quaternion, 'YXZ').y;

      input.applyAxisAngle(player.up, azi);
      input.normalize();
      destination.copy(player.position).add(input);

      /**
         * TODO: There MUST be a better way to implement this. 
         */
      directionBuffer.copy(player.quaternion);
      player.lookAt(destination);
      lookBuffer.copy(player.quaternion);
      player.quaternion.copy(directionBuffer);
      player.quaternion.rotateTowards(lookBuffer, 0.15);

      input.multiplyScalar(PlayerMovement.speed);

      body.velocity.x = input.x;
      body.velocity.z = input.z;

      if (!isPushing()) {
        releaseBuffer++;
      }
    },
    onExit: () => {
    }
  }
}


