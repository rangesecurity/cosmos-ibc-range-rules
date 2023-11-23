import { Injectable } from '@nestjs/common';
import {
  IRangeAlertRule,
  IRangeBlock,
  ISubEvent,
  OnBlock,
  Cosmoshub4TrxMsg,
  CosmosHub4TrxMsgTypes,
  Cosmoshub4TrxMsgCosmosGovV1beta1MsgDeposit,
} from '@range-security/range-sdk';

@Injectable()
export class GovProposalDepositService implements OnBlock {
  callback: (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ) => Promise<ISubEvent[]> = async (block) => {
    const allMessages: Cosmoshub4TrxMsg[] = block.transactions.flatMap(
      (tx) => tx.messages,
    );
    const targetMessages = allMessages.filter((m) => {
      return m.type === CosmosHub4TrxMsgTypes.CosmosGovV1beta1MsgDeposit;
    }) as Cosmoshub4TrxMsgCosmosGovV1beta1MsgDeposit[];

    const results: ISubEvent[] = targetMessages.map((m) => {
      const { data } = m;
      return {
        details: {
          message: `Funds ${JSON.stringify(
            data.amount,
          )} have been deposited into governance proposal ${data.proposalId
            } by depositor ${data.depositor}`,
        },
        txHash: m.tx_hash,
        addressesInvolved: m.addresses,
        severity: 'info',
        caption: 'Deposit into a gov proposal',
      };
    });

    return results;
  };
}
