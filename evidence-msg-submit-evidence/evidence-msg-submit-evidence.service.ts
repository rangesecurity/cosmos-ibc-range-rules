import { Injectable } from '@nestjs/common';
import {
  IRangeAlertRule,
  IRangeBlock,
  ISubEvent,
  OnBlock,
  CosmosHub4TrxMsgTypes,
} from '@range-security/range-sdk';

@Injectable()
export class EvidenceMsgSubmitEvidenceService implements OnBlock {
  callback: (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ) => Promise<ISubEvent[]> = async (block) => {
    const alerts: ISubEvent[] = [];

    for (const trx of block.transactions) {
      for (const msg of trx.messages) {
        if (
          msg.type ===
          CosmosHub4TrxMsgTypes.CosmosEvidenceV1beta1MsgSubmitEvidence
        ) {
          alerts.push({
            txHash: msg.tx_hash,
            details: {
              message: `Double-signing evidence have been submitted by ${msg.data.submitter
                }. Evidence: ${JSON.stringify(msg.data.evidence)}`,
            },
            addressesInvolved: msg.addresses,
            severity: 'info',
            caption: 'Double-signing evidence submitted',
          });
        }
      }
    }

    return alerts;
  };
}
