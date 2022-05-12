import Phaser from 'phaser';

class ButtonSprite extends Phaser.GameObjects.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    key: string,
    event: () => void,
  ) {
    super(scene, x, y, key);
    this.setOrigin(0.5, 0.5);
    this.setName('Button Sprite');
    this.setInteractive();
    this.on('pointerup', event);
    this.scene.add.existing(this);
  }
}

export default ButtonSprite;
