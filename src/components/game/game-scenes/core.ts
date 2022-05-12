import Phaser from 'phaser';
import HTTPRequest from '../game-services/api_services';
import ButtonRoundRect from '../game-prefabs/button_round_rectangle';

class Core extends Phaser.Scene {
    private request = new HTTPRequest(this);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private rewardData: Record<string, any> ={};

    constructor() {
      super('CORE');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    init = (data: Record<string, any>): void => {
      this.rewardData = {
        redeem_id: data.prize_id,
        voucher_code: data.code,
      };
    }

    create = (): void => {
      const background = this.add.sprite(360, 640, 'CORE_BG');
      background.setScale(0.32);
      background.setOrigin(0.5, 0.5);
      const prizePinata = this.add.sprite(360, 550, 'PINATA_PRIZE');
      prizePinata.setOrigin(0.5, 0.5);
      prizePinata.setScale(0.7);
      prizePinata.anims.create({
        key: 'PINATA_PRIZE',
        frames: this.anims.generateFrameNames('PINATA_PRIZE', {
          start: 1,
          end: 15,
        }),
        frameRate: 15,
        repeat: 0,
      });
      prizePinata.anims.play('PINATA_PRIZE');
      prizePinata.on('animationcomplete', () => {
        this.tweenTimeline();
      });
    }

    tweenTimeline = (): void => {
      const backButton = this.createBackButton();
      const rewardPanel = this.createRewardPanel();
      const backCover = this.createBackgroundCover();
      this.tweens.timeline({
        loop: 0,
        tweens: [
          {
            targets: rewardPanel,
            scale: 0.7,
            yoyo: false,
            ease: 'Linear',
            duration: 300,
            onComplete: () => {
              this.createVoucherImage();
            },
          },
          {
            targets: backCover,
            alpha: 0.6,
            yoyo: false,
            ease: 'Linear',
            duration: 1000,
          },
          {
            targets: backButton,
            scale: 1,
            yoyo: false,
            ease: 'Linear',
            duration: 200,
          },
          {
            targets: backButton,
            scale: 0.8,
            yoyo: false,
            ease: 'Linear',
            duration: 300,
            onComplete: () => {
              this.createConfetti();
            },
          },
        ],
      });
    }

    createBackgroundCover = (): Phaser.GameObjects.Rectangle => {
      const cover = this.add.rectangle(360, 640, 720, 1280, 0x000000);
      cover.setAlpha(0);
      cover.setDepth(1);

      return cover;
    }

    createConfetti = (): Phaser.GameObjects.Sprite => {
      const confetti = this.add.sprite(360, 350, 'CONFETTI');
      confetti.setScale(1.5);
      confetti.setDepth(1);
      confetti.anims.create({
        key: 'CONFETTI',
        frames: this.anims.generateFrameNames('CONFETTI', {
          start: 1,
          end: 63,
        }),
        frameRate: 30,
        repeat: -1,
      });
      confetti.anims.play('CONFETTI');

      return confetti;
    }

    createRewardPanel = (): Phaser.GameObjects.Sprite => {
      const panel = this.add.sprite(360, 400, 'REWARD_DIALOG');
      panel.setOrigin(0.5, 0.5);
      panel.setScale(0.1);
      panel.setDepth(2);

      return panel;
    }

    createVoucherImage = (): Phaser.GameObjects.DOMElement => {
      const voucherImage = document.createElement('img');
      voucherImage.src = 'https://picsum.photos/400/150';
      voucherImage.width = 400;
      voucherImage.height = 150;
      const voucherDOM = this.add.dom(
        360,
        610,
        voucherImage,
      );
      voucherDOM.setDepth(3);

      return voucherDOM;
    }

    createBackButton = (): ButtonRoundRect => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const back: any = new ButtonRoundRect(
        this,
        360,
        900,
        500,
        140,
        60,
        0x50CB93,
        'Back to Home',
        {
          font: 'bold 50px FredokaOne',
          color: '#FFFFFF',
          align: 'center',
        },
        async () => {
          await this.request.claimReward(this.rewardData.redeem_id, this.rewardData.voucher_code);
          this.scene.start('HOME');
        },
      );
      back.setScale(0);
      back.setDepth(2);
      back.getByName('Button Shape').setStrokeStyle(8, 0x40A275, 1);
      return back;
    }
}

export default Core;
