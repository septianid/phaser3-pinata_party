import Phaser from 'phaser';
import moment from 'moment-timezone';
import RoundRectangle from 'phaser3-rex-plugins/plugins/gameobjects/shape/roundrectangle/RoundRectangle';
import HTTPRequest from '../game-services/api_services';
import InstructionModal from '../game-prefabs/instruction';
import Progress from '../game-prefabs/progress';
import ButtonSprite from '../game-prefabs/button_sprite';
import ButtonRoundRect from '../game-prefabs/button_round_rectangle';

class Home extends Phaser.Scene {
    private title!: Phaser.GameObjects.Sprite

    private progress = 0;

    private energy = 0;

    private request = new HTTPRequest(this);

    private mainButtons: Array<Phaser.GameObjects.Container | Phaser.GameObjects.Sprite> = [];

    constructor() {
      super('HOME');
    }

    async create(): Promise<void> {
      this.add.sprite(360, 640, 'HOME_BG').setScale(0.32);
      this.title = this.add.sprite(360, 250, 'TITLE');
      const pinataData = await this.request.getCurrentPinataData();
      if (pinataData.success === true) {
        this.title.destroy();
        if (pinataData.redeemLogData.voucher_code !== null) {
          this.changeGameScene(pinataData.redeemLogData.redeem_log_id, pinataData.redeemLogData.voucher_code);
        } else {
          this.showMainContent(pinataData.redeemLogData);
        }
      } else if (pinataData.success === false) {
        const visitCount = this.countGameVisit();
        if (visitCount < 1) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const instruction = new InstructionModal(this, 360, 640);
        }
        this.createPinataTypeButton(360, 490, 1, 'SMALLP');
        this.createPinataTypeButton(190, 750, 2, 'MEDIUMP');
        this.createPinataTypeButton(530, 750, 3, 'LARGEP');
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async showMainContent(data: Record<string, any>): Promise<void> {
      if (localStorage.getItem('bonus_status') === null) {
        localStorage.setItem('bonus_status', 'false');
      }
      this.progress = data.progress;
      const lastActionData = await this.request.getCurrentPinataLastAction();
      const timerBox = this.createTimerBox();
      const timer = this.timerEnergyRechargeToFull();
      const progressBar = this.createHitpointProgressBar(data.progress, data.pinata_type_id);
      const mainPinata = this.createTargetPinata();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const commonButton: any = this.createFreeButton(data, progressBar, timerBox, timer, mainPinata);
      const bonusButton = this.createBonusButton(data, progressBar, mainPinata);
      // eslint-disable-next-line max-len
      const paidButton = (lastActionData.data.premiumLogData.length === 0) ? this.createPaidButton(data, progressBar, 1, mainPinata) : this.createPaidButton(data, progressBar, lastActionData.data.premiumLogData[0].total_count, mainPinata);
      this.mainButtons.push(commonButton, bonusButton, paidButton);
      this.timerShowBonusButton(bonusButton);
      timer.callback = () => {
        if (lastActionData.data.adsLogData.length === 0) {
          timerBox.setVisible(false);
          this.energy = 100;
          commonButton.getByName('Button Text').setText(this.energy);
          timer.paused = true;
        } else {
          this.checkIsEnergyFull(
            this.setFullTime(lastActionData.data.adsLogData[0].time),
            timer,
            timerBox,
            commonButton,
          );
        }
      };
    }

    createFreeButton = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: Record<string, any>,
      progressBar: Phaser.GameObjects.Container,
      timerBox: Phaser.GameObjects.Container,
      timer: Phaser.Time.TimerEvent,
      targetPinata: Phaser.GameObjects.Group,
    ): Phaser.GameObjects.Container => {
      const tick = timer;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const commonActionButton: any = new ButtonRoundRect(
        this,
        530,
        1020,
        180,
        90,
        40,
        0xEA6928,
        this.energy.toString(),
        {
          font: 'bold 36px FredokaOne',
          color: '#FFFFFF',
          align: 'center',
        },
        async () => {
          const newValue = this.setPinataProgress(
            this.progress - this.energy,
            this.setTotalPinataHitpoint(data.pinata_type_id),
          );
          this.setPinataHitEffect(targetPinata);
          await this.request.submitUserAction(data.redeem_log_id, 1, this.energy);
          progressBar.setDisplaySize(newValue, 50);
          this.setPinataState(data.pinata_type_id, targetPinata);
          this.progress -= this.energy;
          const energyDecreaseTimer = this.time.addEvent({
            delay: 5,
            loop: true,
            callback: async () => {
              if (this.energy > 0) {
                this.energy -= 1;
              } else {
                this.energy = 0;
                energyDecreaseTimer.remove();
                const newTime = moment().tz('Asia/Jakarta');
                tick.callback = () => this.checkIsEnergyFull(
                  this.setFullTime(newTime),
                  timer,
                  timerBox,
                  commonActionButton,
                );
                tick.paused = false;
              }
              commonActionButton.getByName('Button Text').setText(this.energy);
            },
          });
          if (this.progress <= 0) {
            const result = await this.request.generateReward(data.redeem_log_id);
            this.changeGameScene(data.redeem_log_id, result.data.voucher_code);
          }
        },
      );
      commonActionButton.getByName('Button Shape').setStrokeStyle(8, 0xFFFFFF, 1);

      return commonActionButton;
    }

    createBonusButton = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: Record<string, any>,
      progressBar: Phaser.GameObjects.Container,
      targetPinata: Phaser.GameObjects.Group,
    ): ButtonSprite => {
      const bonusActionButton = new ButtonSprite(
        this,
        360,
        900,
        'CANDY',
        async () => {
          const newValue = this.setPinataProgress(
            this.progress - 100,
            this.setTotalPinataHitpoint(data.pinata_type_id),
          );
          await this.request.submitUserAction(data.redeem_log_id, 2, 100);
          progressBar.setDisplaySize(newValue, 50);
          this.setPinataHitEffect(targetPinata);
          this.progress -= 100;
          this.setPinataState(data.pinata_type_id, targetPinata);
          localStorage.setItem('bonus_status', 'true');
          bonusActionButton.setVisible(false);
          if (this.progress <= 0) {
            const result = await this.request.generateReward(data.redeem_log_id);
            this.changeGameScene(data.redeem_log_id, result.data.voucher_code);
          }
        },
      );
      bonusActionButton.setScale(0.8);
      bonusActionButton.setVisible(false);
      return bonusActionButton;
    }

    createPaidButton = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: Record<string, any>,
      progressBar: Phaser.GameObjects.Container,
      usageCount: number,
      targetPinata: Phaser.GameObjects.Group,
    ): ButtonRoundRect => {
      let pay = usageCount;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const premiumActionButton: any = new ButtonRoundRect(
        this,
        200,
        1020,
        180,
        90,
        40,
        0xEA6928,
        (250 * pay).toString(),
        {
          font: 'bold 36px FredokaOne',
          color: '#FFFFFF',
          align: 'center',
        },
        async () => {
          this.setPinataHitEffect(targetPinata);
          // this.createAdsVideo();
          const newValue = this.setPinataProgress(
            this.progress - (250 * pay),
            this.setTotalPinataHitpoint(data.pinata_type_id),
          );
          this.request.submitUserAction(data.redeem_log_id, 3, (250 * pay));
          progressBar.setDisplaySize(newValue, 50);
          this.progress -= (250 * pay);
          this.setPinataState(data.pinata_type_id, targetPinata);
          premiumActionButton.getByName('Button Text').setText(250 * (pay + 1));
          pay += 1;
          if (this.progress <= 0) {
            const result = await this.request.generateReward(data.redeem_log_id);
            this.changeGameScene(data.redeem_log_id, result.data.voucher_code);
          }
        },
      );
      premiumActionButton.getByName('Button Shape').setStrokeStyle(8, 0xFFFFFF, 1);

      return premiumActionButton;
    }

    createHitpointProgressBar = (
      initialHP: number,
      pinataType: number,
    ): Progress => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hitpointProgress: any = new Progress(this, 420, 100, 500, 70, 35, 0x03DDDD, 0xFBD35B);
      hitpointProgress.getByName('Progress Box').setStrokeStyle(5, 0x048686);
      hitpointProgress.getByName('Progress Bar').setDisplaySize(
        this.setPinataProgress(initialHP, this.setTotalPinataHitpoint(pinataType)),
        50,
      );
      hitpointProgress.getByName('Progress Bar').radius = 25;
      hitpointProgress.getByName('Progress Bar').x = -230;
      this.add.sprite(100, 100, 'HP_ICON').setScale(0.1);

      return hitpointProgress;
    }

    createTargetPinata = (): Phaser.GameObjects.Group => {
      const ropeLength = 10;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hook: any = this.matter.add.sprite(360, 255, 'HOOK', 0, {
        isStatic: true,
      });
      hook.setScale(0.1);
      hook.setFixedRotation();
      let ropeYPosition = 300;
      let previousRopeSegment = hook;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pinata: any = this.matter.add.sprite(360, ropeYPosition, 'PINATA_HIT', 0, {
        mass: 0.1,
        render: {
          sprite: {
            xOffset: 0.01,
            yOffset: 0.5,
          },
        },
      });
      pinata.setBody({
        type: 'rectangle',
        width: 20,
        height: 20,
      });
      pinata.setScale(1.8);
      pinata.setFixedRotation();
      const targetPinata = new Phaser.GameObjects.Group(this, [hook]);
      for (let ropeSegment = 0; ropeSegment <= ropeLength; ropeSegment += 1) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let rope: any;
        if (ropeSegment !== ropeLength) {
          rope = this.matter.add.image(360, ropeYPosition, 'ROPE', 0, {
            mass: 0.1,
          });
          rope.setBody({
            type: 'rectangle',
          });
          rope.setScale(0.1);
          rope.setFixedRotation();
          targetPinata.add(rope);
          if (ropeSegment === 0) {
            this.matter.add.joint(previousRopeSegment, rope, 35, 1);
          } else {
            this.matter.add.joint(previousRopeSegment, rope, 25, 1);
          }
        } else {
          this.matter.add.joint(previousRopeSegment, pinata, 40, 1);
          targetPinata.add(pinata);
        }
        previousRopeSegment = rope;
        ropeYPosition += 14;
      }

      return targetPinata;
    }

    createTimerBox = (): Phaser.GameObjects.Container => {
      const timerBoxShape = new RoundRectangle(this, 0, 0, 95, 35, 8, 0xF5B492);
      timerBoxShape.setStrokeStyle(5, 0xFFFFFF, 1);
      const timerBoxText = new Phaser.GameObjects.Text(this, 0, 0, '', {
        font: 'bold 50px FredokaOne',
        color: '#FFFFFF',
        align: 'center',
      });
      timerBoxText.setName('Box Text');
      timerBoxText.setScale(0.5);
      timerBoxText.setDepth(1);
      const timerBox = this.add.container(530, 975, [timerBoxShape, timerBoxText]);
      timerBox.setVisible(false);
      return timerBox;
    }

    createPinataTypeButton = (
      x: number,
      y: number,
      type: number,
      texture: string,
    ): ButtonSprite => {
      const pinataButton = new ButtonSprite(
        this,
        x,
        y,
        texture,
        async () => {
          const result = await this.request.submitUserPinata(type);
          if (result.response.data.code === 200) {
            this.title.setVisible(false);
            this.showMainContent(result.data);
          }
        },
      );
      pinataButton.setScale(0.7);
      pinataButton.setDepth(2);

      return pinataButton;
    }

    createAnimation = (
      posX: number,
      posY: number,
      totalFrame: number,
      repeatCount: number,
      key: string,
      scale: number,
      depth: number,
      isInteractable: boolean,
    ): Phaser.GameObjects.Sprite => {
      const customAnimation = this.add.sprite(
        posX,
        posY,
        key,
      );
      customAnimation.setDepth(depth);
      customAnimation.setScale(scale);
      customAnimation.setVisible(true);
      this.anims.create({
        key,
        frames: this.anims.generateFrameNames(key, {
          start: 0,
          end: totalFrame,
        }),
        frameRate: 60,
        repeat: repeatCount,
      });
      if (isInteractable === false) {
        customAnimation.anims.play(key);
      } else {
        customAnimation.setVisible(false);
      }
      return customAnimation;
    }

    setPinataHitEffect = (
      pinata: Phaser.GameObjects.Group,
    ): void => {
      const hitEffect = this.createAnimation(pinata.getLast().x, 500, 5, 0, 'HIT', 0.5, 2, true);
      const thrustPower = [-0.01, 0.01];
      const iteration = Phaser.Math.Between(0, 1);
      pinata.getLast().thrust(thrustPower[iteration]);
      hitEffect.setVisible(true);
      hitEffect.anims.play('HIT');
      hitEffect.once('animationcomplete', () => {
        hitEffect.destroy();
      });
    }

    setFullTime = (
      currentTime: moment.Moment,
    ): moment.Moment => {
      const oneEnergyPointTimeNeeded = 1; // IN MINUTE
      const fullTime = moment(currentTime).add(100 * oneEnergyPointTimeNeeded, 'minutes');

      return fullTime;
    }

    setTotalPinataHitpoint = (
      type: number,
    ): number => {
      let total = 0;
      if (type === 1) {
        total = 11250;
      } else if (type === 2) {
        total = 22800;
      } else {
        total = 39500;
      }
      return total;
    }

    setPinataProgress = (
      current: number,
      total: number,
    ): number => {
      const currentProgress = (current / total) * 460;
      return currentProgress;
    }

    setPinataState = (
      data: number,
      targetPinata: Phaser.GameObjects.Group,
    ): void => {
      if (this.progress < ((75 / 100) * this.setTotalPinataHitpoint(data))) {
        targetPinata.getLast().setTexture('PINATA_FRACTURED', 0);
        targetPinata.getLast().setScale(1.36, 1.39);
        targetPinata.getLast().setOrigin(0.55, 0.52);
        targetPinata.getLast().setFixedRotation();
      }
      if (this.progress < ((50 / 100) * this.setTotalPinataHitpoint(data))) {
        targetPinata.getLast().setTexture('PINATA_FRACTURED', 1);
        targetPinata.getLast().setScale(1.36, 1.5);
        targetPinata.getLast().setOrigin(0.55, 0.55);
        targetPinata.getLast().setFixedRotation();
      }
      if (this.progress < ((25 / 100) * this.setTotalPinataHitpoint(data))) {
        targetPinata.getLast().setScale(1.36, 1.61);
        targetPinata.getLast().setOrigin(0.52, 0.58);
        targetPinata.getLast().setFixedRotation();
      }
    }

    setButtonActive = (): void => {
      this.mainButtons.map((button) => {
        button.setInteractive();
        button.setVisible(true);
        return button;
      });
    }

    setButtonNotActive = (): void => {
      this.mainButtons.map((button) => {
        button.disableInteractive();
        button.setVisible(false);
        return button;
      });
    }

    checkIsEnergyFull = (
      time: moment.Moment,
      timerTick: Phaser.Time.TimerEvent,
      timerBox: Phaser.GameObjects.Container,
      freeButton: Phaser.GameObjects.Container,
    ): void => {
      const timer = timerTick;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const box: any = timerBox;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const button: any = freeButton;
      const nowTime = moment().tz('Asia/Jakarta');
      if (moment(nowTime, 'DD/MM/YYYY HH:mm:ss').isAfter(moment(time, 'DD/MM/YYYY HH:mm:ss'))) {
        box.setVisible(false);
        this.energy = 100;
        button.getByName('Button Text').setText(this.energy);
        timer.paused = true;
      } else {
        // this.changeButtonColor(button);
        box.setVisible(true);
        box.setDepth(1);
        const timeLeft = moment(time, 'DD/MM/YYYY HH:mm:ss').diff(moment(nowTime, 'DD/MM/YYYY HH:mm:ss'));
        const energyByTime = 100 - Math.ceil(moment.duration(timeLeft).asMinutes());
        this.energy = energyByTime;
        button.getByName('Button Text').setText(energyByTime);
        box.getByName('Box Text').setText(moment.utc(timeLeft).format('00:ss'));
      }
    }

    changeGameScene = (
      redeem: number,
      vcode: string,
    ): void => {
      this.cameras.main.fadeOut(1000, 255, 255, 255);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.time.delayedCall(500, () => {
            this.scene.start('CORE', {
              prize_id: redeem,
              code: vcode,
            });
          });
        },
      );
    }

    countGameVisit = (): number => {
      let visit = Number(localStorage.getItem('visit_count'));
      visit += 1;
      localStorage.setItem('visit_count', visit.toString());

      return visit;
    }

    timerEnergyRechargeToFull = (): Phaser.Time.TimerEvent => {
      const energyRechargeTimer = this.time.addEvent({
        delay: 1000,
        loop: true,
      });

      return energyRechargeTimer;
    }

    timerShowBonusButton = (
      bonusButton: Phaser.GameObjects.Sprite,
    ): void => {
      let currentTime = null;
      this.time.addEvent({
        delay: 1000,
        loop: true,
        callback: () => {
          currentTime = moment().tz('Asia/Jakarta');
          const bottomInterval = moment().set('minute', 0).set('second', 0).tz('Asia/Jakarta');
          const topInterval = moment().set('minute', 10).set('second', 0).tz('Asia/Jakarta');
          if (moment(currentTime, 'DD/MM/YYYY HH:mm:ss').isBetween(bottomInterval, topInterval)) {
            if (localStorage.getItem('bonus_status') === 'false') {
              bonusButton.setVisible(true);
            } else {
              bonusButton.setVisible(false);
            }
          } else {
            localStorage.setItem('bonus_status', 'false');
            bonusButton.setVisible(false);
          }
        },
      });
    }
}

export default Home;
