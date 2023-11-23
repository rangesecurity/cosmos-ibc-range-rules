import { Injectable } from '@nestjs/common';
import {
  IRangeAlertRule,
  IRangeBlock,
  ISubEvent,
  OnBlock,
  Cosmoshub4TrxMsg,
} from '@range-security/range-sdk';

interface IParameters {
  addresses: string[];
}

@Injectable()
export class BlacklistedAddressService implements OnBlock {
  callback: (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ) => Promise<ISubEvent[]> = async (block, rule) => {
    const p = rule.parameters as any as IParameters;

    // Extract messages from all transactions
    const allMessages: Cosmoshub4TrxMsg[] = block.transactions.flatMap(
      (tx) => tx.messages,
    );

    const blacklistedAddresses = p?.addresses || [];

    // Filter messages involving any of the blacklisted addresses
    const results: ISubEvent[] = allMessages
      .map((m) => {
        const involvedAddresses = m.addresses.filter((a) =>
          blacklistedAddresses.includes(a),
        );
        if (involvedAddresses.length === 0) {
          return null;
        }

        return {
          details: {
            message: `The blacklisted ${involvedAddresses.length === 1 ? 'address' : 'addresses'
              } ${involvedAddresses.join(
                ', ',
              )} is found to be linked to transaction ${m.tx_hash}`,
          },
          txHash: m.tx_hash,
          addressesInvolved: m.addresses,
          severity: 'high',
          caption: 'Blacklisted address interaction',
        };
      })
      .filter((r) => r !== null);

    return results;
  };
}
