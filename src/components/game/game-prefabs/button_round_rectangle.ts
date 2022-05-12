import Phaser from 'phaser';
import RoundRectangle from 'phaser3-rex-plugins/plugins/gameobjects/shape/roundrectangle/RoundRectangle';

class ButtonRoundRect extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    buttonWidth: number,
    buttonHeight: number,
    buttonRadius: number,
    buttonColor: number,
    buttonText: string,
    buttonTextStyle: Phaser.Types.GameObjects.Text.TextStyle,
    event: () => void,
  ) {
    super(scene, x, y);
    const buttonShapeGO = new RoundRectangle(
      scene,
      0,
      0,
      buttonWidth,
      buttonHeight,
      buttonRadius,
      buttonColor,
      1,
    );
    buttonShapeGO.setName('Button Shape');
    const buttonTextGO = new Phaser.GameObjects.Text(
      scene,
      0,
      0,
      buttonText,
      buttonTextStyle,
    );
    buttonTextGO.setOrigin(0.5, 0.5);
    buttonTextGO.setName('Button Text');
    const buttonGO = this.add([buttonShapeGO, buttonTextGO]);
    buttonGO.setSize(buttonShapeGO.displayWidth, buttonShapeGO.displayHeight);
    buttonShapeGO.setInteractive();
    this.on('pointerup', event);
    this.scene.add.existing(this);
  }
}

export default ButtonRoundRect;
