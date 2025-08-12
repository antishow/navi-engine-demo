import { addAction, addSceneAction } from "navi-engine/hooks";

addAction(
  'gameObject.load',
  'gameObject.load/addSpinner',
  (gameObject) => {
    const { userData } = gameObject;
    if (!Object.keys(userData).includes('Spinner')) {
      return;
    }

    const Spinner = JSON.parse(userData.Spinner);

    addSceneAction(
      'gameController.update',
      'gameController.update/doSpinner',
      (delta) => {
        gameObject.rotation.y += delta * Spinner.speed;
      }
    );
  }
);


