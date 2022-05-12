import Phaser from 'phaser';
import ButtonSprite from './button_sprite';

class InstructionModal extends Phaser.GameObjects.Group {
    private contentData = [
      {
        contentType: 'Animation',
        contentTextureKey: 'INSTRUCTION_IMAGE1',
        totalAnimationFrame: 119,
        textTextureKey: 'INSTRUCTION_TEXT1',
        contentSize: 1.4,
        contentPositionX: 360,
        contentPositionY: 610,
        textPositionX: 360,
        textPositionY: 1000,
      },
      {
        contentType: 'Animation',
        contentTextureKey: 'INSTRUCTION_IMAGE2',
        totalAnimationFrame: 111,
        textTextureKey: 'INSTRUCTION_TEXT2',
        contentSize: 1.4,
        contentPositionX: 360,
        contentPositionY: 610,
        textPositionX: 360,
        textPositionY: 1000,
      },
      {
        contentType: 'Image',
        contentTextureKey: 'INSTRUCTION_IMAGE3',
        textTextureKey: 'INSTRUCTION_TEXT3',
        contentSize: 0.4,
        contentPositionX: 360,
        contentPositionY: 610,
        textPositionX: 360,
        textPositionY: 950,
      },
      {
        contentType: 'Image',
        contentTextureKey: 'INSTRUCTION_IMAGE4',
        textTextureKey: 'INSTRUCTION_TEXT4',
        contentSize: 0.4,
        contentPositionX: 360,
        contentPositionY: 610,
        textPositionX: 360,
        textPositionY: 950,
      },
      {
        contentType: 'Image',
        contentTextureKey: 'INSTRUCTION_IMAGE5',
        textTextureKey: 'INSTRUCTION_TEXT5',
        contentSize: 0.4,
        contentPositionX: 360,
        contentPositionY: 610,
        textPositionX: 360,
        textPositionY: 950,
      },
      {
        contentType: 'Image',
        contentTextureKey: 'INSTRUCTION_IMAGE6',
        textTextureKey: 'INSTRUCTION_TEXT6',
        contentSize: 0.4,
        contentPositionX: 360,
        contentPositionY: 610,
        textPositionX: 360,
        textPositionY: 950,
      },
    ];

    content = new Phaser.GameObjects.Sprite(this.scene, 0, 0, '').setOrigin(0.5, 0.5);

    contentText = new Phaser.GameObjects.Sprite(this.scene, 0, 0, '').setOrigin(0.5, 0.5).setScale(0.5);

    private prevButton: ButtonSprite;

    private nextButton: ButtonSprite;

    private closeButton: ButtonSprite;

    private currentIndex: number;

    constructor(
      scene: Phaser.Scene,
      x: number,
      y: number,
    ) {
      super(scene);
      this.currentIndex = 0;
      const totalPage = this.contentData.length - 1;
      const instructionModalGO = new Phaser.GameObjects.Sprite(scene, x, y, 'INSTRUCTION_PANEL');
      instructionModalGO.setDepth(2);
      instructionModalGO.setOrigin(0.5, 0.5);
      this.setInstructionContent(this.currentIndex);
      this.prevButton = this.createPreviousButton(scene, totalPage);
      this.nextButton = this.createNextButton(scene, totalPage);
      this.closeButton = this.createCloseButton(scene);
      this.addMultiple(
        // eslint-disable-next-line max-len
        [instructionModalGO, this.prevButton, this.nextButton, this.content, this.contentText, this.closeButton],
        true,
      );
    }

    createNextButton = (
      scene: Phaser.Scene,
      total: number,
    ): ButtonSprite => {
      const next = new ButtonSprite(scene, 570, 640, 'NEXT', () => {
        this.currentIndex += 1;
        if (this.currentIndex >= total) {
          this.currentIndex = total;
          this.nextButton.setVisible(false);
          this.prevButton.setVisible(true);
          this.setInstructionContent(this.currentIndex);
        } else if (this.currentIndex > 0 && this.currentIndex < total) {
          this.nextButton.setVisible(true);
          this.prevButton.setVisible(true);
          this.setInstructionContent(this.currentIndex);
        } else {
          this.setInstructionContent(this.currentIndex);
        }
        this.setInstructionContent(this.currentIndex);
      });
      next.setDepth(3);
      next.setScale(0.4);
      return next;
    }

    createPreviousButton = (
      scene: Phaser.Scene,
      total: number,
    ): ButtonSprite => {
      const prev = new ButtonSprite(scene, 145, 640, 'PREV', () => {
        this.currentIndex -= 1;
        if (this.currentIndex <= 0) {
          this.currentIndex = 0;
          this.nextButton.setVisible(true);
          this.prevButton.setVisible(false);
          this.setInstructionContent(this.currentIndex);
        } else if (this.currentIndex > 0 && this.currentIndex < total) {
          this.nextButton.setVisible(true);
          this.prevButton.setVisible(true);
          this.setInstructionContent(this.currentIndex);
        } else {
          this.setInstructionContent(this.currentIndex);
        }
      });
      prev.setDepth(3);
      prev.setScale(0.4);
      prev.setVisible(false);
      return prev;
    }

    createCloseButton = (
      scene: Phaser.Scene,
    ): ButtonSprite => {
      const close = new ButtonSprite(scene, 650, 200, 'CLOSE_BUTTON', () => {
        this.destroy(true);
      });
      close.setScale(0.08);
      close.setDepth(3);
      return close;
    }

    setInstructionContent(contentIndex: number): void {
      if (this.contentData[contentIndex].contentType === 'Animation') {
        this.content.setTexture(this.contentData[contentIndex].contentTextureKey);
        this.content.setX(this.contentData[contentIndex].contentPositionX);
        this.content.setY(this.contentData[contentIndex].contentPositionY);
        this.content.setScale(this.contentData[contentIndex].contentSize);
        this.content.setDepth(2);
        this.content.anims.create({
          key: this.contentData[contentIndex].contentTextureKey,
          frames: this.scene.anims.generateFrameNames(this.contentData[contentIndex].contentTextureKey, {
            start: 0,
            end: this.contentData[contentIndex].totalAnimationFrame,
          }),
          frameRate: 60,
          repeat: -1,
        });
        this.content.play(this.contentData[contentIndex].contentTextureKey);
      } else if (this.contentData[contentIndex].contentType === 'Image') {
        this.content.stop();
        this.content.setTexture(this.contentData[contentIndex].contentTextureKey);
        this.content.setX(this.contentData[contentIndex].contentPositionX);
        this.content.setY(this.contentData[contentIndex].contentPositionY);
        this.content.setScale(this.contentData[contentIndex].contentSize);
        this.content.setDepth(2);
      }

      this.contentText.setTexture(this.contentData[contentIndex].textTextureKey);
      this.contentText.setX(this.contentData[contentIndex].textPositionX);
      this.contentText.setY(this.contentData[contentIndex].textPositionY);
      this.contentText.setDepth(2);
    }
}

export default InstructionModal;
