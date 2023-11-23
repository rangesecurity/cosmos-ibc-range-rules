import { TestingModule } from '@nestjs/testing';
import { IRangeAlertRule, TestRangeSDK } from '@range-security/range-sdk';
import { ProcessorsService } from '../processors.service';
import { RANGE_SDK_PROVIDER } from '../../range-sdk.provider';
import { TestProcessorServiceProvider } from '../../../test/alert-rules-utils/test-processor-service-provider';

describe('ProcessorsService::BlacklistedAddressService', () => {
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

  it('should generate an alert for transactions involving blacklisted addresses', async () => {
    const blockInfo = { network: 'cosmoshub-4', height: '10500000' };
    const mockRule: IRangeAlertRule = {
      ruleType: 'BlacklistedAddressInteractions',
      id: '123',
      ruleGroupId: '123',
      createdAt: new Date(),
      parameters: {
        addresses: ['cosmos1237p3rv44pz3pqneefrurmly73rfjdvncaery5'],
      },
    };

    const result = await testRangeSDK.assertRule(blockInfo, mockRule);

    const expectedAlerts = [
      {
        addressesInvolved: ['cosmos1237p3rv44pz3pqneefrurmly73rfjdvncaery5'],
        details: {
          message:
            'The blacklisted address osmo1237p3rv44pz3pqneefrurmly73rfjdvncaery5 is found to be linked to transaction 43d0ea500f53f86bafb6ad073601a0443c6d203ceff002c13e9cdbf95b791d9b',
        },
        severity: 'high',
        txHash:
          '43d0ea500f53f86bafb6ad073601a0443c6d203ceff002c13e9cdbf95b791d9b',
        caption: 'Blacklisted address interaction',
      },
    ];

    expect(result).toHaveLength(1);
    expect(result).toEqual(expectedAlerts);
  });

  it('should not generate any alerts for transactions not involving blacklisted addresses', async () => {
    const blockInfo = { network: 'cosmoshub-4', height: '10500001' };
    const mockRule: IRangeAlertRule = {
      ruleType: 'BlacklistedAddressInteractions',
      id: '123',
      ruleGroupId: '123',
      createdAt: new Date(),
      parameters: {
        addresses: ['cosmos1237p3rv44pz3pqneefrurmly73rfjdvncaery5'],
      },
    };

    const result = await testRangeSDK.assertRule(blockInfo, mockRule);

    expect(result).toHaveLength(0);
  });
});
