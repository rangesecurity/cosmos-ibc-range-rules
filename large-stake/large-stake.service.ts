import { Injectable } from '@nestjs/common';
import {
  IRangeAlertRule,
  IRangeBlock,
  Cosmoshub4TrxMsg,
  ISubEvent,
  OnBlock,
  CosmosHub4TrxMsgTypes,
  Cosmoshub4TrxMsgCosmosStakingV1beta1MsgDelegate,
} from '@range-security/range-sdk';

const INFO_THRESHOLD = 1_000_000_000_000;
const HIGH_THRESHOLD = 5_000_000_000_000;

@Injectable()
export class LargeStakeService implements OnBlock {
  callback: (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ) => Promise<ISubEvent[]> = async (block) => {
    const allMessages: Cosmoshub4TrxMsg[] = block.transactions.flatMap(
      (tx) => tx.messages,
    );

    const delegateHighMessages: Cosmoshub4TrxMsgCosmosStakingV1beta1MsgDelegate[] =
      [];
    const delegateInfoMessages: Cosmoshub4TrxMsgCosmosStakingV1beta1MsgDelegate[] =
      [];
    allMessages.forEach((m: Cosmoshub4TrxMsg) => {
      if (m.type === CosmosHub4TrxMsgTypes.CosmosStakingV1beta1MsgDelegate) {
        const { data } = m;
        const amount = BigInt(data.amount.amount);
        if (amount >= HIGH_THRESHOLD) {
          delegateHighMessages.push(m);
        } else if (amount >= INFO_THRESHOLD) {
          delegateInfoMessages.push(m);
        }
      }
    });

    const results = [
      ...delegateHighMessages.map((m) => ({
        details: {
          message: `A huge amount delegate action of ${JSON.stringify(
            m.data.amount.amount,
          )} has been performed by ${m.data.delegatorAddress}`,
        },
        txHash: m.tx_hash,
        addressesInvolved: m.addresses,
        severity: 'high',
        caption: 'Sensitive stake event',
      })),
      ...delegateInfoMessages.map((m) => ({
        details: {
          message: `A high amount delegate action of ${JSON.stringify(
            m.data.amount.amount,
          )} has been performed by ${m.data.delegatorAddress}`,
        },
        txHash: m.tx_hash,
        addressesInvolved: m.addresses,
        severity: 'info',
        caption: 'Sensitive stake event',
      })),
    ];

    return results;
  };
}
