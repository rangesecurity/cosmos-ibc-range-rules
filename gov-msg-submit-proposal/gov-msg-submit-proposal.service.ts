import { Injectable } from '@nestjs/common';
import {
  IRangeAlertRule,
  IRangeBlock,
  ISubEvent,
  OnBlock,
  CosmosHub4TrxMsgTypes,
  Cosmoshub4TrxMsgCosmosGovV1beta1MsgSubmitProposal,
} from '@range-security/range-sdk';

@Injectable()
export class GovMsgSubmitProposalService implements OnBlock {
  private readonly GovProposalOptions = {
    Inst: '/cosmwasm.wasm.v1.InstantiateContractProposal',
    Store: '/cosmwasm.wasm.v1.StoreCodeProposal',
    Execute: '/cosmwasm.wasm.v1.ExecuteContractProposal',
  };

  callback: (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ) => Promise<ISubEvent[]> = async (block) => {
    const alerts: ISubEvent[] = [];

    for (const trx of block.transactions) {
      for (const msg of trx.messages) {
        if (
          msg.type === CosmosHub4TrxMsgTypes.CosmosGovV1beta1MsgSubmitProposal
        ) {
          const initialDeposit = JSON.stringify(msg.data.initial_deposit);
          const content = JSON.stringify(msg.data.content);

          alerts.push({
            txHash: msg.tx_hash,
            details: {
              message: this.getSubMessageType({ msg, initialDeposit, content }),
            },
            addressesInvolved: msg.addresses,
            severity: 'info',
            caption: 'Gov proposal submitted',
          });
        }
      }
    }

    return alerts;
  };

  getSubMessageType(input: {
    msg: Cosmoshub4TrxMsgCosmosGovV1beta1MsgSubmitProposal;
    initialDeposit: string;
    content: string;
  }) {
    const { msg, initialDeposit, content } = input;
    const { proposer } = msg.data;

    switch (msg.data.content['@type']) {
      case this.GovProposalOptions.Inst:
        return `Governance proposal for Instantiate Contract has been submitted by proposer ${proposer} with an initial deposit of ${initialDeposit}. Proposal contents: ${content}`;
      case this.GovProposalOptions.Store:
        return `Governance proposal for Store Contract has been submitted by proposer ${proposer} with an initial deposit of ${initialDeposit}. Proposal contents: ${content}`;
      case this.GovProposalOptions.Execute:
        return `Governance proposal for Execute contract has been submitted by proposer ${proposer} with an initial deposit of ${initialDeposit}. Proposal contents: ${content}`;

      default:
        return `Governance proposal has been submitted by proposer ${proposer} with an initial deposit of ${initialDeposit}. Proposal contents: ${content}`;
    }
  }
}
