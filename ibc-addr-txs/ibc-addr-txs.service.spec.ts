import { TestingModule } from '@nestjs/testing';
import { IRangeAlertRule, TestRangeSDK } from '@range-security/range-sdk';
import { ProcessorsService } from '../processors.service';
import { RANGE_SDK_PROVIDER } from '../../range-sdk.provider';
import { TestProcessorServiceProvider } from '../../../test/alert-rules-utils/test-processor-service-provider';

describe('ProcessorsService::IbcAddrTxsService', () => {
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

  it('should generate an alert for transactions for ibc-addr-txs', async () => {
    const blockInfo = { network: 'cosmoshub-4', height: '10500100' };
    const mockRule: IRangeAlertRule = {
      ruleType: 'IBCAddrTxs',
      id: '123',
      ruleGroupId: '123',
      createdAt: new Date(),
      parameters: {
        address: 'cosmos1y8ppdhgdy4gzxjd2rrxfm5wa607fzpu3hu6yr0',
        threshold: 1,
        blockWidth: 100,
        blockWindow: 100,
      },
    };

    const result = await testRangeSDK.assertRule(blockInfo, mockRule);
    const expectedAlerts = [
      {
        addressesInvolved: ['cosmos1y8ppdhgdy4gzxjd2rrxfm5wa607fzpu3hu6yr0'],
        caption: 'IBC Transaction threshold reached by an address',
        details: {
          message:
            'More than 1 transactions detected for address osmo1y8ppdhgdy4gzxjd2rrxfm5wa607fzpu3hu6yr0 in last 100 blocks.',
        },
        severity: 'medium',
        txHash: '',
      },
    ];
    expect(result).toHaveLength(1);
    expect(result).toEqual(expectedAlerts);
  });

  it('should not generate any alerts for transactions not involving ibc-addr-txs', async () => {
    const blockInfo = { network: 'cosmoshub-4', height: '10500100' };
    const mockRule: IRangeAlertRule = {
      ruleType: 'IBCAddrTxs',
      id: '123',
      ruleGroupId: '123',
      createdAt: new Date(),
      parameters: {
        address: 'cosmos1y8ppdhgdy4gzxjd2rrxfm5wa607fzpu3hu6yr0',
        threshold: 10,
        blockWidth: 100,
        blockWindow: 100,
      },
    };

    const result = await testRangeSDK.assertRule(blockInfo, mockRule);
    expect(result).toHaveLength(0);
  });
});
