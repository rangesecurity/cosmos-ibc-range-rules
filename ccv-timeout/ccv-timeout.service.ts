import { Injectable } from '@nestjs/common';
import {
  IRangeAlertRule,
  IRangeBlock,
  ISubEvent,
  OnBlock,
} from '@range-security/range-sdk';

interface BlockEvent {
  type: string;
  attributes: { key: string; value: string }[];
}

interface BlockEvents {
  end_block: BlockEvent[];
  begin_block: BlockEvent[];
}

@Injectable()
export class CcvTimeoutService implements OnBlock {
  private readonly eventTypeToFilter = 'timeout';

  callback: (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ) => Promise<ISubEvent[]> = async (block) => {
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

    const subEvents: ISubEvent[] = targetEvents.map((e) => {
      return {
        details: {
          message: `A consumer chain has been removed from interchain security.`,
        },
        txHash: '',
        addressesInvolved: [],
        severity: 'high',
        caption: 'CCV Consumer Chain Timeout',
      };
    });

    return subEvents;
  };
}
