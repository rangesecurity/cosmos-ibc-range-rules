import { Injectable } from '@nestjs/common';
import {
  IRangeAlertRule,
  IRangeBlock,
  ISubEvent,
  OnBlock,
} from '@range-security/range-sdk';

interface IParameters {
  threshold: number;
  denom: string;
}

interface BlockEvent {
  type: string;
  attributes: { key: string; value: string }[];
}

interface BlockEvents {
  end_block: BlockEvent[];
  begin_block: BlockEvent[];
}

@Injectable()
export class ConsumerRewardsAmountService implements OnBlock {
  private readonly eventTypeToFilter = 'fee_distribution';
  private readonly eventAttributeKeyToFilter = 'provider_amount';

  callback: (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ) => Promise<ISubEvent[]> = async (block, rule) => {
    const p: IParameters = rule.parameters as any;

    const targetEvents: BlockEvent[] = [];
    if (block.block_events) {
      const events = block.block_events as unknown as BlockEvents;

      for (const e of events.begin_block) {
        if (e.type === this.eventTypeToFilter) {
          targetEvents.push(e);
        }
      }

      for (const e of events.end_block) {
        if (e.type === this.eventTypeToFilter) {
          targetEvents.push(e);
        }
      }
    }

    const alerts: ISubEvent[] = [];
    for (const e of targetEvents) {
      const valObj = e.attributes.find(
        (b) => b.key === this.eventAttributeKeyToFilter,
      );
      const amounts = valObj.value.split(',').map((e) => {
        return this.extractNumbersAndDenoms(e);
      });
      const rewardAmountStr = amounts.find((e) => e.denom === p.denom)?.amount;
      const rewardAmount =
        typeof rewardAmountStr === 'string' ? parseFloat(rewardAmountStr) : 0;

      if (rewardAmount >= p.threshold) {
        alerts.push({
          details: {
            message: `Consumer rewards amount is ${rewardAmount} ${p.denom} which is higher than ${p.threshold}`,
          },
          txHash: '',
          addressesInvolved: [],
          severity: 'medium',
          caption: 'Consumer rewards amount anomaly',
        });
      }
    }

    return alerts;
  };

  extractNumbersAndDenoms = (input: string) => {
    const index = input.search(/[a-zA-Z]/);

    if (index !== -1) {
      const amount = input.substring(0, index);
      const denom = input.substring(index);

      return { amount, denom };
    }

    return null;
  };
}
