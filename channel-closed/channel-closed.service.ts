import { Injectable } from '@nestjs/common';
import {
  IRangeAlertRule,
  IRangeBlock,
  ISubEvent,
  OnBlock,
  Cosmoshub4TrxMsg,
  CosmosHub4TrxMsgTypes,
  Cosmoshub4TrxMsgIbcCoreChannelV1MsgChannelCloseInit,
} from '@range-security/range-sdk';

@Injectable()
export class ChannelClosedService implements OnBlock {
  callback: (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ) => Promise<ISubEvent[]> = async (block) => {
    const allMessages: Cosmoshub4TrxMsg[] = block.transactions.flatMap(
      (tx) => tx.messages,
    );
    const targetMessages = allMessages.filter((m) => {
      return m.type === CosmosHub4TrxMsgTypes.IbcCoreChannelV1MsgChannelCloseInit;
    }) as Cosmoshub4TrxMsgIbcCoreChannelV1MsgChannelCloseInit[];

    const results: ISubEvent[] = targetMessages.map((m) => ({
      details: {
        message: `The channel ${m.data.channel_id} has been closed`,
      },
      txHash: m.tx_hash,
      addressesInvolved: m.addresses,
      severity: 'medium',
      caption: 'A channel has been closed',
    }));

    return results;
  };
}
