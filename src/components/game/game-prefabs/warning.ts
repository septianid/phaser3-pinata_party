import Phaser from 'phaser';
import ButtonSprite from './button_sprite';

class WarningModal extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    warningText: string,
    warningTextStyle: Phaser.Types.GameObjects.Text.TextStyle,
    scale: number,
    isInteractable: boolean,
  ) {
    super(scene, x, y);
    const warningModalGO = new Phaser.GameObjects.Sprite(scene, 0, 0, 'WARNING_BOX');
    warningModalGO.setName('Warning Modal Image');
    const warningTextGO = new Phaser.GameObjects.Text(scene, 0, -50, warningText, warningTextStyle);
    warningTextGO.setOrigin(0.5);
    warningTextGO.setName('Warning Modal Text');
    if (isInteractable === true) {
      const warningButtonGO = new ButtonSprite(scene, 0, 200, 'OK_BUTTON', () => {
        this.destroy();
      });
      this.add([warningModalGO, warningTextGO, warningButtonGO]);
    } else if (isInteractable === false) {
      this.add([warningModalGO, warningTextGO]);
    }
    this.setScale(scale);
    this.scene.add.existing(this);
  }
}

export default WarningModal;
