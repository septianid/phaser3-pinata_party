import Phaser from 'phaser';
import RoundRectangle from 'phaser3-rex-plugins/plugins/gameobjects/shape/roundrectangle/RoundRectangle';

class Progress extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    boxWidth: number,
    boxHeight: number,
    boxRadius: number,
    boxColor: number,
    barColor: number,
  ) {
    super(scene, x, y);
    const progressBoxGO = new RoundRectangle(scene, 0, 0, boxWidth, boxHeight, boxRadius, boxColor, 1);
    progressBoxGO.setName('Progress Box');
    const progressBarGO = new RoundRectangle(scene, 0, 0, boxWidth, boxHeight, boxRadius, barColor, 1);
    progressBarGO.setOrigin(0, 0.5);
    progressBarGO.setName('Progress Bar');
    this.add([progressBoxGO, progressBarGO]);
    this.scene.add.existing(this);
  }
}

export default Progress;
