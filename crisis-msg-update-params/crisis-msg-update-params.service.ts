import { Injectable } from '@nestjs/common';
import {
  IRangeAlertRule,
  IRangeBlock,
  ISubEvent,
  OnBlock,
  CosmosHub4TrxMsgTypes,
} from '@range-security/range-sdk';

@Injectable()
export class CrisisMsgUpdateParamsService implements OnBlock {
  callback: (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ) => Promise<ISubEvent[]> = async (block) => {
    const alerts: ISubEvent[] = [];

    for (const trx of block.transactions) {
      for (const msg of trx.messages) {
        if (
          msg.type === CosmosHub4TrxMsgTypes.CosmosCrisisV1beta1MsgUpdateParams
        ) {
          alerts.push({
            txHash: msg.tx_hash,
            details: {
              message: `Crisis module parameters have been updated by ${msg.data.authority}`,
            },
            addressesInvolved: msg.addresses,
            severity: 'info',
            caption: 'Crisis module params updated',
          });
        }
      }
    }

    return alerts;
  };
}
