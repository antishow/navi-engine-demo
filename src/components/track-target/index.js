import { addAction, addSceneAction } from "navi-engine/hooks";
import { rootScene } from "navi-engine/scene-manager";
import { Vector3 } from 'three';

addAction(
  'gameObject.ready',
  'gameObject.ready/initTrackTarget',
  (gameObject) => {
    const { userData } = gameObject;
    if (!Object.keys(userData).includes('TrackTarget')) {
      return;
    }

    const TrackTarget = JSON.parse(userData.TrackTarget);
    const target = rootScene.getObjectByName(TrackTarget.target);
    const offset = new Vector3().copy(gameObject.position).sub(target.position);

    addSceneAction(
      'gameController.afterUpdate',
      'gameController.afterUpdate/doTrackTarget',
      () => {
        gameObject.position.copy(target.position).add(offset);
      }
    );
  }
);



