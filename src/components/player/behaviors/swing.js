import { gsap } from "gsap";
import { AnimationClip } from "three";

export const PlayerSwing = ({ player, animationMixer }) => {
  const clip = AnimationClip.findByName(player.animations, 'Swing');
  const action = animationMixer.clipAction(clip);

  action.weight = 0;
  action.play();

  action.weightTo = gsap.quickTo(action, 'weight', { duration: 0.25 });
  const finish = () => player.finishedSwing = true;

  return {
    onEnter: () => {
      delete player.finishedSwing;

      const activeActions = animationMixer._actions.filter(A => A !== action && A.weight);
      activeActions.forEach(activeAction => activeAction.weightTo(0));

      action.weightTo(1);

      animationMixer.setTime(0);
      animationMixer.addEventListener('loop', finish, { once: true });
    },
    tick: () => { },
    onExit: () => {
      animationMixer.removeEventListener('loop', finish);
    }
  }
}



