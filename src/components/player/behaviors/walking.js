import { AnimationClip, Euler, Vector3, Quaternion } from "three";
import { getMovementInput } from "navi-engine/input";
import { mainCamera } from "navi-engine/camera";
import { gsap } from "gsap";

export const PlayerWalk = ({ player, animationMixer }) => {
  const clip = AnimationClip.findByName(player.animations, 'Walk');
  const action = animationMixer.clipAction(clip);

  action.weight = 0;
  action.play();

  const duration = 0.25;
  action.weightTo = gsap.quickTo(action, 'weight', { duration });

  const PlayerMovement = JSON.parse(player.userData.PlayerMovement);
  const { body } = player;
  const euler = new Euler();
  const destination = new Vector3();
  const directionBuffer = new Quaternion();
  const lookBuffer = new Quaternion();

  return {
    onEnter: () => {
      const activeActions = animationMixer._actions.filter(A => A !== action && A.weight);
      activeActions.forEach(activeAction => activeAction.weightTo(0));

      action.weightTo(1);
    },
    tick: (delta) => {
      const input = getMovementInput();
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
      player.quaternion.rotateTowards(lookBuffer, 12.5 * delta);

      input.multiplyScalar(PlayerMovement.speed);

      body.velocity.x = input.x;
      body.velocity.z = input.z;
    },
    onExit: () => {
    }
  }
}

