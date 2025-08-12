import { doAction } from "navi-engine/hooks";
import { gsap } from "gsap";
import { AnimationClip } from "three";

export const PlayerTouch = ({ player, animationMixer }) => {
  const clip = AnimationClip.findByName(player.animations, 'Touch');
  const action = animationMixer.clipAction(clip);

  action.weight = 0;
  action.play();

  action.weightTo = gsap.quickTo(action, 'weight', { duration: 0.25 });
  const finishTouching = () => player.finishedTouching = true;

  return {
    onEnter: () => {
      delete player.finishedTouching;
      const activeActions = animationMixer._actions.filter(A => A !== action && A.weight);
      activeActions.forEach(activeAction => activeAction.weightTo(0));

      action.weightTo(1);

      animationMixer.setTime(0);
      animationMixer.addEventListener('loop', finishTouching, { once: true });
    },
    tick: () => { },
    onExit: () => {
      animationMixer.removeEventListener('loop', finishTouching);

      const action = player.touchTarget.object.userData.OnTouch;
      if (action) {
        doAction(action);
      }
    }
  }
}


