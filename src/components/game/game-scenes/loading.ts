import Phaser from 'phaser';
import HOME_BG from '../game-assets/images/HOME_BG.jpg';
import OK_BUTTON from '../game-assets/images/OK.png';
import CLOSE_BUTTON from '../game-assets/images/CLOSE.png';
import NEXT_BUTTON from '../game-assets/images/NEXT.png';
import PREV_BUTTON from '../game-assets/images/PREV.png';
import LOGO from '../game-assets/images/LOGO.png';
import PINATA from '../game-assets/images/PINATA.png';
import CANDY from '../game-assets/images/CANDY.png';
import CORE_BG from '../game-assets/images/CORE_BG.jpg';
import SMALLP from '../game-assets/images/SMALL_PINATA.png';
import MEDIUMP from '../game-assets/images/MEDIUM_PINATA.png';
import LARGEP from '../game-assets/images/LARGE_PINATA.png';
import HOOK from '../game-assets/images/HOOK.png';
import COUPON from '../game-assets/images/COUPON.png';
import ROPE from '../game-assets/images/ROPE.png';
import HP_ICON from '../game-assets/images/POWER.png';
import REWARD_DIALOG from '../game-assets/images/REWARD_DIALOG.png';
import HIT from '../game-assets/images/HIT.png';
import CONFETTI from '../game-assets/images/CONFETTI.png';
import PINATA_HIT from '../game-assets/images/PINATA_HIT.png';
import PINATA_FRACTURED from '../game-assets/images/PINATA_FRACTURED.png';
import PINATA_OPEN from '../game-assets/images/PINATA_OPEN.png';
import PINATA_PRIZE from '../game-assets/images/PINATA_PRIZE.png';
import WARNING_BOX from '../game-assets/images/WARNING_BOX.png';
import VIDEO1 from '../game-assets/videos/VIDEO1.mp4';
import VIDEO2 from '../game-assets/videos/VIDEO2.mp4';
import VIDEO3 from '../game-assets/videos/VIDEO3.mp4';
import INSTRUCTION_PANEL from '../game-assets/images/INSTRUCTION_PANEL.png';
import INSTRUCTION_TEXT1 from '../game-assets/images/INSTRUCTION_TEXT1.png';
import INSTRUCTION_TEXT2 from '../game-assets/images/INSTRUCTION_TEXT2.png';
import INSTRUCTION_TEXT3 from '../game-assets/images/INSTRUCTION_TEXT3.png';
import INSTRUCTION_TEXT4 from '../game-assets/images/INSTRUCTION_TEXT4.png';
import INSTRUCTION_TEXT5 from '../game-assets/images/INSTRUCTION_TEXT5.png';
import INSTRUCTION_TEXT6 from '../game-assets/images/INSTRUCTION_TEXT6.png';
import INSTRUCTION_IMAGE1 from '../game-assets/images/INSTRUCTION_IMAGE1.png';
import INSTRUCTION_IMAGE2 from '../game-assets/images/INSTRUCTION_IMAGE2.png';
import INSTRUCTION_IMAGE3 from '../game-assets/images/INSTRUCTION_IMAGE3.png';
import INSTRUCTION_IMAGE4 from '../game-assets/images/INSTRUCTION_IMAGE4.png';
import INSTRUCTION_IMAGE5 from '../game-assets/images/INSTRUCTION_IMAGE5.png';
import INSTRUCTION_IMAGE6 from '../game-assets/images/INSTRUCTION_IMAGE6.png';
import Progress from '../game-prefabs/progress';
import WarningModal from '../game-prefabs/warning';

export default class Loading extends Phaser.Scene {
  private assetErrorCount: number;

  constructor() {
    super({
      key: 'LOADING',
      pack: {
        files: [
          { type: 'image', key: 'HOME_BG', url: HOME_BG },
          { type: 'image', key: 'TITLE', url: LOGO },
        ],
      },
    });
    this.assetErrorCount = 0;
  }

  preload(): void {
    this.add.sprite(360, 640, 'HOME_BG').setScale(0.32);
    this.add.sprite(360, 270, 'TITLE').setScale(0.8);
    this.load.image('OK_BUTTON', OK_BUTTON);
    this.load.image('CLOSE_BUTTON', CLOSE_BUTTON);
    this.load.image('NEXT', NEXT_BUTTON);
    this.load.image('PREV', PREV_BUTTON);
    this.load.image('PINATA', PINATA);
    this.load.image('CANDY', CANDY);
    this.load.image('CORE_BG', CORE_BG);
    this.load.image('SMALLP', SMALLP);
    this.load.image('MEDIUMP', MEDIUMP);
    this.load.image('LARGEP', LARGEP);
    this.load.image('HOOK', HOOK);
    this.load.image('COUPON', COUPON);
    this.load.image('ROPE', ROPE);
    this.load.image('HP_ICON', HP_ICON);
    this.load.image('REWARD_DIALOG', REWARD_DIALOG);
    this.load.image('WARNING_BOX', WARNING_BOX);
    this.load.image('INSTRUCTION_PANEL', INSTRUCTION_PANEL);
    this.load.image('INSTRUCTION_TEXT1', INSTRUCTION_TEXT1);
    this.load.image('INSTRUCTION_TEXT2', INSTRUCTION_TEXT2);
    this.load.image('INSTRUCTION_TEXT3', INSTRUCTION_TEXT3);
    this.load.image('INSTRUCTION_TEXT4', INSTRUCTION_TEXT4);
    this.load.image('INSTRUCTION_TEXT5', INSTRUCTION_TEXT5);
    this.load.image('INSTRUCTION_TEXT6', INSTRUCTION_TEXT6);
    this.load.image('INSTRUCTION_IMAGE3', INSTRUCTION_IMAGE3);
    this.load.image('INSTRUCTION_IMAGE4', INSTRUCTION_IMAGE4);
    this.load.image('INSTRUCTION_IMAGE5', INSTRUCTION_IMAGE5);
    this.load.image('INSTRUCTION_IMAGE6', INSTRUCTION_IMAGE6);
    this.load.video('VIDEO1', VIDEO1, 'loadeddata', false, true);
    this.load.video('VIDEO2', VIDEO2, 'loadeddata', false, true);
    this.load.video('VIDEO3', VIDEO3, 'loadeddata', false, true);
    this.load.spritesheet('INSTRUCTION_IMAGE1', INSTRUCTION_IMAGE1, {
      frameWidth: 540,
      frameHeight: 540,
    });
    this.load.spritesheet('INSTRUCTION_IMAGE2', INSTRUCTION_IMAGE2, {
      frameWidth: 540,
      frameHeight: 540,
    });
    this.load.spritesheet('CONFETTI', CONFETTI, {
      frameWidth: 512,
      frameHeight: 512,
    });
    this.load.spritesheet('PINATA_HIT', PINATA_HIT, {
      frameWidth: 276,
      frameHeight: 274,
    });
    this.load.spritesheet('PINATA_FRACTURED', PINATA_FRACTURED, {
      frameWidth: 276,
      frameHeight: 270,
    });
    this.load.spritesheet('PINATA_OPEN', PINATA_OPEN, {
      frameWidth: 384,
      frameHeight: 384,
    });
    this.load.spritesheet('PINATA_PRIZE', PINATA_PRIZE, {
      frameWidth: 1017,
      frameHeight: 1080,
    });
    this.load.spritesheet('HIT', HIT, {
      frameWidth: 1013,
      frameHeight: 1080,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const progress: any = new Progress(this, 360, 640, 350, 70, 20, 0xD6E557, 0x8CC63E);
    const fullBar = 335;
    progress.getByName('Progress Bar').x = -160;
    progress.getByName('Progress Bar').setDisplaySize(fullBar, 50);
    this.load.on('progress', (value: number) => {
      progress.getByName('Progress Bar').width = fullBar * value;
    });
    this.load.once('loaderror', () => {
      this.assetErrorCount += 1;
      // console.log('ERROR');
    });
    this.load.once('complete', () => {
      if (this.assetErrorCount > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const warning = new WarningModal(this, 360, 640, '', {
          font: 'bold 65px FredokaOne',
          color: '#008686',
          align: 'center',
        }, 0.6, false);
      } else {
        this.scene.start('HOME');
      }
      // this.isComplete = true;
    });
  }
}
