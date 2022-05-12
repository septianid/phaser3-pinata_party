/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { Axios, AxiosResponse } from 'axios';
import Phaser from 'phaser';
import WarningModal from '../game-prefabs/warning';

class HTTPRequest extends Axios {
    private authToken: string | null;

    private apiUrl: string | undefined;

    private gameScene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
      super();
      this.gameScene = scene;
      this.authToken = new URLSearchParams(window.location.search).get('id');
      this.apiUrl = process.env.REACT_APP_API_URL;
    }

    async submitUserPinata(type: number): Promise<Record<string, any>> {
      try {
        const response = await axios({
          method: 'POST',
          url: `${this.apiUrl}/api/v1.0/core/redeem/start-pinata`,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${this.authToken}`,
          },
          params: {
            platform_token: 'c9a68aab8f51e8b24a80beb8fe88cb760b0bc32d',
          },
          data: {
            pinata_type_id: type,
          },
        });
        return response.data.response;
      } catch (error: any) {
        this.checkErrorType(error);
        return error;
      }
    }

    async submitUserAction(
      redeemLogId: number,
      actionType: number,
      damagePoint: number,
    ): Promise<Record<string, any>> {
      try {
        const response = await axios({
          method: 'POST',
          url: `${this.apiUrl}/api/v1.0/core/action/insert-action`,
          params: {
            platform_token: 'c9a68aab8f51e8b24a80beb8fe88cb760b0bc32d',
          },
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${this.authToken}`,
          },
          data: {
            redeem_log_id: redeemLogId.toString(),
            action_type_id: actionType.toString(),
            damage: damagePoint,
            ad_id: 1,
          },
        });
        return response.data.response;
      } catch (error: any) {
        this.checkErrorType(error);
        return error;
      }
    }

    async getCurrentPinataLastAction(): Promise<Record<string, any>> {
      try {
        const response = await axios({
          method: 'GET',
          url: `${this.apiUrl}/api/v1.0/core/action/user-last-action`,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${this.authToken}`,
          },
          params: {
            platform_token: 'c9a68aab8f51e8b24a80beb8fe88cb760b0bc32d',
          },
        });
        return response.data.response;
      } catch (error: any) {
        this.checkErrorType(error);
        return error;
      }
    }

    async getCurrentPinataData(): Promise<Record<string, any>> {
      try {
        const response = await axios({
          method: 'GET',
          url: `${this.apiUrl}/api/v1.0/core/redeem/user-active-pinata`,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${this.authToken}`,
          },
          params: {
            platform_token: 'c9a68aab8f51e8b24a80beb8fe88cb760b0bc32d',
          },
        });
        return response.data.response;
      } catch (error: any) {
        this.checkErrorType(error);
        return error;
      }
    }

    async generateReward(redeem: number): Promise<Record<string, any>> {
      try {
        const response = await axios({
          method: 'POST',
          url: `${this.apiUrl}/api/v1.0/core/redeem/generate-reward`,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${this.authToken}`,
          },
          params: {
            platform_token: 'c9a68aab8f51e8b24a80beb8fe88cb760b0bc32d',
          },
          data: {
            redeem_log_id: redeem,
          },
        });
        return response.data.response;
      } catch (error: any) {
        return error;
      }
    }

    async claimReward(redeem: number, code: string): Promise<AxiosResponse> {
      return axios({
        method: 'POST',
        url: `${this.apiUrl}/api/v1.0/core/redeem/user-claim-reward`,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${this.authToken}`,
        },
        params: {
          platform_token: 'c9a68aab8f51e8b24a80beb8fe88cb760b0bc32d',
        },
        data: {
          redeem_log_id: redeem,
          voucher_code: code,
        },
      });
    }

    async dropReward(redeem: number): Promise<AxiosResponse> {
      return axios({
        method: 'POST',
        url: `${this.apiUrl}/api/v1.0/core/redeem/user-drop-reward`,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${this.authToken}`,
        },
        params: {
          platform_token: 'c9a68aab8f51e8b24a80beb8fe88cb760b0bc32d',
        },
        data: {
          redeem_log_id: redeem,
        },
      });
    }

    checkErrorType(error: Record<string, any>): Phaser.GameObjects.Container | undefined {
      let warning;
      if (error.response.data.code === 400) {
        if (error.response.data.error.message === 'Insufficient user poin for Pinata type') {
        //   this.showWarningMessage('Poin kamu tidak cukup :(', true);
          warning = new WarningModal(
            this.gameScene,
            360,
            640,
            'Poin kamu tidak cukup :(',
            {
              font: 'bold 40px FredokaOne',
              color: '#FFFFFF',
              align: 'center',
            },
            0.5,
            true,
          );
        }
      } else if (error.response.data.code === 401) {
        if (error.response.data.error.message === 'Authorization failed') {
        //   this.showWarningMessage('Autentikasi Gagal', false);
          warning = new WarningModal(
            this.gameScene,
            360,
            640,
            'Autentikasi gagal',
            {
              font: 'bold 45px FredokaOne',
              color: '#FFFFFF',
              align: 'center',
            },
            0.5,
            false,
          );
        }
      }

      return warning;
    }
}

export default HTTPRequest;
