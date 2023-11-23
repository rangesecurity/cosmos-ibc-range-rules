import { TestingModule } from '@nestjs/testing';
import { IRangeAlertRule, IRangeBlock, NetworkEnum, TestRangeSDK } from '@range-security/range-sdk';
import { ProcessorsService } from '../processors.service';
import { RANGE_SDK_PROVIDER } from '../../range-sdk.provider';
import { TestProcessorServiceProvider } from '../../../test/alert-rules-utils/test-processor-service-provider';

describe('ProcessorsService::VscMaturedService', () => {
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

  it('should generate an alert for transactions for vsc-matured', async () => {
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
            type: 'vsc_matured',
            index: 2,
            attributes: [
              { key: 'module', value: 'ccvconsumer' },
              { key: 'chain_id', value: 'stride-1' },
              { key: 'consumer_height', value: '6250850' },
              { key: 'valset_update_id', value: '3111187' },
              {
                key: 'timestamp',
                value: '2023-11-09 06:48:50.950116266 +0000 UTC',
              },
            ],
          },
        ],
        end_block: [],
      },
    };

    const mockRule: IRangeAlertRule = {
      ruleType: 'VscMatured',
      id: '123',
      createdAt: new Date(),
      parameters: {},
    };

    const result = await testRangeSDK.assertRuleWithBlock(block, mockRule);

    const expectedAlerts = [
      {
        addressesInvolved: [],
        details: {
          message: 'The validator change set has reached maturity.',
        },
        txHash: '',
        severity: 'info',
        caption: 'Validator set change matured',
      },
    ];

    expect(result).toHaveLength(1);
    expect(result).toEqual(expectedAlerts);
  });

  it('should not generate any alerts for transactions not involving vsc-matured', async () => {
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
      ruleType: 'VscMatured',
      id: '123',
      createdAt: new Date(),
      parameters: {},
    };

    const result = await testRangeSDK.assertRuleWithBlock(block, mockRule);

    expect(result).toHaveLength(0);
  });
});
