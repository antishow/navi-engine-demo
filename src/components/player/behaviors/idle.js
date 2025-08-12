import { AnimationClip } from "three";
import gsap from "gsap";

export const PlayerIdle = ({ player, animationMixer }) => {
  const clip = AnimationClip.findByName(player.animations, 'Idle');
  const action = animationMixer.clipAction(clip);

  action.weight = 0;
  action.play();

  action.weightTo = gsap.quickTo(action, 'weight', { duration: 0.25 });

  return {
    onEnter: () => {
      const activeActions = animationMixer._actions.filter(A => A !== action && A.weight);
      activeActions.forEach(activeAction => activeAction.weightTo(0));
      action.weightTo(1);
    },
    tick: () => {
    },
    onExit: () => {
    }
  }
}
