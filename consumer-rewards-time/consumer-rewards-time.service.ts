import { Injectable } from '@nestjs/common';
import {
  IRangeAlertRule,
  IRangeBlock,
  ISubEvent,
  OnBlock,
} from '@range-security/range-sdk';

interface IParameters {
  threshold: number;
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
export class ConsumerRewardsTimeService implements OnBlock {
  private readonly eventTypeToFilter = 'fee_distribution';
  private readonly eventAttributeKeyForCurrentDistributionHeight =
    'current_distribution_height';
  private readonly eventAttributeKeyForNextDistributionHeight =
    'next_distribution_height';

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
      const current_distribution_height = this.extractAttribute(
        e.attributes,
        this.eventAttributeKeyForCurrentDistributionHeight,
      );
      const next_distribution_height = this.extractAttribute(
        e.attributes,
        this.eventAttributeKeyForNextDistributionHeight,
      );

      const blockDiff =
        Number(next_distribution_height) - Number(current_distribution_height);

      if (blockDiff >= p.threshold) {
        alerts.push({
          details: {
            message: `Consumer rewards duration for next block is ${blockDiff} which is higher than ${p.threshold}`,
          },
          txHash: '',
          addressesInvolved: [],
          severity: 'low',
          caption: 'Consumer chain rewards time anomaly',
        });
      }
    }

    return alerts;
  };

  extractAttribute = (attributes: any, key: string) => {
    return attributes.find((b) => b.key === key)?.value;
  };
}
