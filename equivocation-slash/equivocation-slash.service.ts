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
export class EquivocationSlashService implements OnBlock {
  private readonly eventTypeToFilter = 'consumer_slash_request';
  private readonly eventAttributeKeyForInfractionTypeDowntime =
    'infraction_type';
  private readonly eventAttributeValueForInfractionTypeDoubleSignValue =
    'INFRACTION_TYPE_DOUBLE_SIGN';
  private readonly eventAttributeKeyForValidatorAddress = 'validator_address';

  callback: (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ) => Promise<ISubEvent[]> = async (block) => {
    const targetEvents: BlockEvent[] = [];
    if (block.block_events) {
      const events = block.block_events as unknown as BlockEvents;

      for (const e of events.begin_block) {
        if (e.type === this.eventTypeToFilter) {
          const attVal = this.extractAttribute(
            e.attributes,
            this.eventAttributeKeyForInfractionTypeDowntime,
          );
          if (
            attVal === this.eventAttributeValueForInfractionTypeDoubleSignValue
          ) {
            targetEvents.push(e);
          }
        }
      }

      for (const e of events.end_block) {
        if (e.type === this.eventTypeToFilter) {
          const attVal = this.extractAttribute(
            e.attributes,
            this.eventAttributeKeyForInfractionTypeDowntime,
          );
          if (
            attVal === this.eventAttributeValueForInfractionTypeDoubleSignValue
          ) {
            targetEvents.push(e);
          }
        }
      }
    }

    const subEvents: ISubEvent[] = targetEvents.map((e) => {
      const valObj = e.attributes.find(
        (b) => b.key === this.eventAttributeKeyForValidatorAddress,
      );
      const validator = valObj.value || '';
      return {
        details: {
          message: `A consumer initiated equivocation slashing request has been initiated for validator ${validator}.`,
        },
        txHash: '',
        addressesInvolved: [],
        severity: 'high',
        caption: 'Consumer chain Equivocation slash request',
      };
    });

    return subEvents;
  };

  extractAttribute = (attributes: any, key: string) => {
    return attributes.find((b) => b.key === key)?.value;
  };
}
