import { TestingModule } from '@nestjs/testing';
import {
  IRangeAlertRule,
  IRangeBlock,
  NetworkEnum,
  TestRangeSDK,
} from '@range-security/range-sdk';
import { ProcessorsService } from '../processors.service';
import { RANGE_SDK_PROVIDER } from '../../range-sdk.provider';
import { TestProcessorServiceProvider } from '../../../test/alert-rules-utils/test-processor-service-provider';

describe('ProcessorsService::ConsumerRewardsAmountService', () => {
  let service: ProcessorsService;
  let testRangeSDK: TestRangeSDK;

  beforeAll(async () => {
    const module: TestingModule = await TestProcessorServiceProvider();
    service = module.get<ProcessorsService>(ProcessorsService);
    testRangeSDK = module.get(RANGE_SDK_PROVIDER);
    testRangeSDK.init({
      onBlock: { callback: service.getProcessorCallback().callback },
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(testRangeSDK).toBeDefined();
    expect(testRangeSDK.assertRule).toBeDefined();
    expect(testRangeSDK.assertRuleWithBlock).toBeDefined();
    expect(testRangeSDK.init).toBeDefined();
    expect(testRangeSDK.gracefulCleanup).toBeDefined();
  });

  it('should generate an alert for transactions for consumer-rewards-amount', async () => {
    const block: IRangeBlock = {
      hash: '',
      height: '0',
      transactions: [],
      network: NetworkEnum.CosmosHub4,
      timestamp: '',
      block_events: {
        begin_block: [
          {
            network_id: 'neutron-1',
            block_number: 4289735,
            event_type: 'BEGIN_BLOCK',
            type: 'fee_distribution',
            index: 2,
            attributes: [
              { key: 'module', value: 'ccvconsumer' },
              { key: 'current_distribution_height', value: '4021500' },
              { key: 'next_distribution_height', value: '4023000' },
              { key: 'distribution_fraction', value: '0.75' },
              { key: 'total', value: '' },
              {
                key: 'provider_amount',
                value:
                  '23705ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9,1489277untrn',
              },
            ],
          },
        ],
        end_block: [],
      },
    };

    const mockRule: IRangeAlertRule = {
      ruleType: 'ConsumerRewardsAmount',
      id: '123',
      createdAt: new Date(),
      parameters: {
        threshold: 1000000,
        denom: 'untrn',
      },
    };

    const result = await testRangeSDK.assertRuleWithBlock(block, mockRule);

    const expectedAlerts = [
      {
        addressesInvolved: [],
        details: {
          message:
            'Consumer rewards amount is 1489277 untrn which is higher than 1000000',
        },
        txHash: '',
        severity: 'medium',
        caption: 'Consumer rewards amount anomaly',
      },
    ];

    expect(result).toHaveLength(1);
    expect(result).toEqual(expectedAlerts);
  });

  it('should not generate any alerts for transactions not involving consumer-rewards-amount', async () => {
    const block: IRangeBlock = {
      hash: '',
      height: '0',
      transactions: [],
      network: NetworkEnum.CosmosHub4,
      timestamp: '',
      block_events: {
        begin_block: [
          {
            network_id: 'neutron-1',
            block_number: 4289735,
            event_type: 'BEGIN_BLOCK',
            type: 'consumer_slash_request',
            index: 2,
            attributes: [
              { key: 'module', value: 'ccvconsumer' },
              {
                key: 'validator_address',
                value: 'neutronvalcons12ys9vkd8zl0lh9hq2nut6yggwv8p0t48uugx9x',
              },
              { key: 'valset_update_id', value: '3279440' },
              { key: 'infraction_type', value: 'INFRACTION_TYPE_UNSPECIFIED' },
            ],
          },
        ],
        end_block: [],
      },
    };

    const mockRule: IRangeAlertRule = {
      ruleType: 'ConsumerRewardsAmount',
      id: '123',
      createdAt: new Date(),
      parameters: {
        threshold: 1000000,
        denom: 'untrn',
      },
    };

    const result = await testRangeSDK.assertRuleWithBlock(block, mockRule);
    expect(result).toHaveLength(0);
  });
});
