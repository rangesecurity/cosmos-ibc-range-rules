import { Injectable } from '@nestjs/common';
import {
  IRangeAlertRule,
  IRangeBlock,
  ISubEvent,
  OnBlock,
  CosmosHub4TrxMsgTypes,
} from '@range-security/range-sdk';

@Injectable()
export class BankMsgUpdateParamsService implements OnBlock {
  callback: (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ) => Promise<ISubEvent[]> = async (block) => {
    const alerts: ISubEvent[] = [];

    for (const trx of block.transactions) {
      for (const msg of trx.messages) {
        if (msg.type === CosmosHub4TrxMsgTypes.CosmosBankV1beta1MsgUpdateParams) {
          alerts.push({
            txHash: msg.tx_hash,
            details: {
              message: `The parameters for the Bank module has been updated by authority address ${msg.data.authority
                }. Current parameters: ${JSON.stringify(msg.data.params)}`,
            },
            addressesInvolved: msg.addresses,
            severity: 'info',
            caption: 'Bank module params updated',
          });
        }
      }
    }

    return alerts;
  };
}
