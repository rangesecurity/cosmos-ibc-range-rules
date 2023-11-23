import { Inject, Injectable } from '@nestjs/common';
import {
  IRangeAlertRule,
  IRangeBlock,
  ISubEvent,
  OnBlock,
  fetchBlocksByRange,
} from '@range-security/range-sdk';
import { AppConfigService } from '../../../src/config/app.config.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisKeys } from '../../../src/utils/redis-keys';
import { Cache } from 'cache-manager';

interface IParameters {
  blockWindow: number;
  blockWidth: number;
  thresholdPerc: number;
  channelId: string;
}

const ibcTimeout = 'ibc.core.channel.v1.MsgTimeout';

@Injectable()
export class IbcChannelFailedTxPercService implements OnBlock {
  constructor(
    private config: AppConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }
  callback: (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ) => Promise<ISubEvent[]> = async (block, rule) => {
    const p = rule.parameters as any as IParameters;
    if (Number(block.height) % p.blockWindow !== 0) return [];

    const cacheStorageString =
      (await this.cacheManager.get<string>(
        RedisKeys.getStorageDataByRuleGroupAndRuleId({
          ruleGroupId: rule.ruleGroupId,
          ruleId: rule.id,
        }),
      )) || '{}';
    const cacheStorage = JSON.parse(cacheStorageString);
    const db = cacheStorage['db'] || {};

    const latestHeight = BigInt(block.height);
    const startHeight = (latestHeight - BigInt(p.blockWidth - 1)).toString();
    const endHeight = latestHeight.toString();

    const blocks: IRangeBlock[] = await fetchBlocksByRange({
      token: this.config.app.RANGE_SDK_TOKEN,
      network: block.network,
      startHeight,
      endHeight,
    });

    const allMessages = blocks.flatMap((b) =>
      b.transactions.flatMap((tx) => tx.messages),
    );

    const targetMessages = allMessages.filter((m) => {
      if (m.type === ibcTimeout) {
        return m.data.packet.sourceChannel === p.channelId;
      }

      return false;
    });

    const entries = db[p.channelId] || [];
    const avgTxs = entries.reduce((acc, val) => acc + val, 0) / entries.length;
    entries.push(targetMessages.length);
    db[p.channelId] = entries;

    await this.cacheManager.set(
      RedisKeys.getStorageDataByRuleGroupAndRuleId({
        ruleGroupId: rule.ruleGroupId,
        ruleId: rule.id,
      }),
      JSON.stringify({ db }),
    );

    const diffPercentage = 100 * ((targetMessages.length - avgTxs) / avgTxs);

    if (entries.length === 1) return [];
    if (diffPercentage >= p.thresholdPerc) {
      return [
        {
          details: {
            message: `The amount of failed transactions in ${p.channelId} has exceeded ${p.thresholdPerc}% than the average of ${avgTxs} in the last ${p.blockWidth} blocks.`,
          },
          txHash: '',
          addressesInvolved: [],
          severity: 'low',
          caption: 'IBC Channel Failed Tx Percentage Threshold Reached',
        },
      ];
    }

    return [];
  };
}
