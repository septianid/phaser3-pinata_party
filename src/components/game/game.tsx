import { IonPhaser } from '@ion-phaser/react';
import React from 'react';
import Phaser from 'phaser';
import Loading from './game-scenes/loading';
import Home from './game-scenes/home';
import Core from './game-scenes/core';
import './game.css';

interface GameComponentProps {
  initialize?: boolean;
  game?: {
    type: number;
    backgroundColor: number;
    dom: {
      createContainer: boolean
    };
    physics: {
      default: string,
      matter: {
        gravity: {
          x: number,
          y: number
        }
        // debug: {
        //   showBody: boolean,
        //   showStaticBody: boolean,
        // },
        // debugBodyColor: number,
      },
    };
    scale: {
      mode: Phaser.Scale.ScaleModeType,
      autoCenter: Phaser.Scale.CenterType,
      width: number,
      height: number,
    };
    scene: Phaser.Scene[];
    audio: {
      disableWebAudio: boolean
    };
  }
}

const Game: React.FunctionComponent = () => {
  const gameConfig: GameComponentProps = {
    initialize: true,
    game: {
      type: Phaser.CANVAS,
      backgroundColor: 0xEA6928,
      dom: {
        createContainer: true,
      },
      physics: {
        default: 'matter',
        matter: {
          gravity: {
            x: 0,
            y: 1.5,
          },
          // debug: {
          //   showBody: true,
          //   showStaticBody: true,
          // },
          // debugBodyColor: 0x26FF00,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 1280,
      },
      scene: [new Loading(), new Home(), new Core()],
      audio: {
        disableWebAudio: true,
      },
    },
  };
  return (
    <section className="Game-content">
      <IonPhaser game={gameConfig.game} initialize={gameConfig.initialize} />
    </section>
  );
};

export default Game;

// class Game extends React.Component<GameComponentProps, GameComponentState> {
//   constructor(props: GameComponentProps) {
//     super(props);
//     this.state = {
//       initialize: true,
//       game: {
//         type: Phaser.CANVAS,
//         backgroundColor: 0xEA6928,
//         dom: {
//           createContainer: true,
//         },
//         physics: {
//           default: 'matter',
//           matter: {
//             gravity: {
//               x: 0,
//               y: 1.5,
//             },
//             // debug: {
//             //   showBody: true,
//             //   showStaticBody: true,
//             // },
//             // debugBodyColor: 0x26FF00,
//           },
//         },
//         scale: {
//           mode: Phaser.Scale.FIT,
//           autoCenter: Phaser.Scale.CENTER_BOTH,
//           width: 720,
//           height: 1280,
//         },
//         scene: [new Loading(), new Home(), new Core()],
//         audio: {
//           disableWebAudio: true,
//         },
//       },
//     };
//   }

//   render(): React.ReactNode {
//     const { game, initialize } = this.state;
//     return (
//       <div className="Game-content">
//         <IonPhaser game={game} initialize={initialize} />
//       </div>
//     );
//   }
// }
