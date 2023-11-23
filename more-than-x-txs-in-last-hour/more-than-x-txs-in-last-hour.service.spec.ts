import { TestingModule } from '@nestjs/testing';
import { IRangeAlertRule, TestRangeSDK } from '@range-security/range-sdk';
import { ProcessorsService } from '../processors.service';
import { RANGE_SDK_PROVIDER } from '../../range-sdk.provider';
import { TestProcessorServiceProvider } from '../../../test/alert-rules-utils/test-processor-service-provider';

describe('ProcessorsService::MoreThanXTxsInLastHourService', () => {
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

  it('should generate an alert for txs with more than x txs in last hour', async () => {
    const blockInfo = { network: 'cosmoshub-4', height: '10500010' };
    const mockRule: IRangeAlertRule = {
      ruleType: 'MoreThanXTxsInLastHour',
      id: '123',
      createdAt: new Date(),
      parameters: {
        address: 'cosmos1237p3rv44pz3pqneefrurmly73rfjdvncaery5',
      },
      ruleGroupId: '123',
    };

    const result = await testRangeSDK.assertRule(blockInfo, mockRule);

    const expectedAlerts = [
      {
        addressesInvolved: ['cosmos1237p3rv44pz3pqneefrurmly73rfjdvncaery5'],
        details: {
          message: 'More than 1 transactions detected by osmo1237p3rv44pz3pqneefrurmly73rfjdvncaery5 in last hour.',
        },
        txHash: '',
        severity: 'low',
        caption: 'Transaction threshold reached by an address',
      },
    ];

    expect(result).toHaveLength(1);
    expect(result).toEqual(expectedAlerts);
  });

  it('should not generate any alerts for txs with no txs in last hour', async () => {
    const blockInfo = { network: 'cosmoshub-4', height: '10500020' };
    const mockRule: IRangeAlertRule = {
      ruleType: 'MoreThanXTxsInLastHour',
      id: '123',
      createdAt: new Date(),
      parameters: {
        targetAddress: 'cosmos125630xvkt5w8kcmawrrpmwlg6yzy3f9mpcghaa',
      },
      ruleGroupId: '123',
    };

    const result = await testRangeSDK.assertRule(blockInfo, mockRule);

    expect(result).toHaveLength(0);
  });
});
