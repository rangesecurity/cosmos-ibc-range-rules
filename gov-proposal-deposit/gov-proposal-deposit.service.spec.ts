import { TestingModule } from '@nestjs/testing';
import { IRangeAlertRule, TestRangeSDK } from '@range-security/range-sdk';
import { ProcessorsService } from '../processors.service';
import { RANGE_SDK_PROVIDER } from '../../range-sdk.provider';
import { TestProcessorServiceProvider } from '../../../test/alert-rules-utils/test-processor-service-provider';

describe('ProcessorsService::GovProposalDepositService', () => {
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

  it('should generate an alert for transactions for gov proposal deposits', async () => {
    const blockInfo = { network: 'cosmoshub-4', height: '11745608' };
    const mockRule: IRangeAlertRule = {
      ruleType: 'CosmosGovV1beta1MsgDeposit',
      id: '123',
      createdAt: new Date(),
      parameters: null,
    };

    const result = await testRangeSDK.assertRule(blockInfo, mockRule);

    const expectedAlerts = [
      {
        details: {
          message:
            'Funds [{"denom":"uosmo","amount":"1200000000"}] have been deposited into governance proposal 649 by depositor osmo1j7a92q7vwausmen8edef6xa8g5mvagklyv6xrl',
        },
        txHash:
          '296326448c0aafdaadc2a3f03cac31ac588ff3feaa350eaa45985b6911b04f82',
        addressesInvolved: ['cosmos1j7a92q7vwausmen8edef6xa8g5mvagklyv6xrl'],
      },
    ];
    expect(result).toHaveLength(1);
    expect(result).toEqual(expectedAlerts);
  });

  it('should not generate any alerts for transactions not involving gov proposal deposits', async () => {
    const blockInfo = { network: 'cosmoshub-4', height: '11745609' };
    const mockRule: IRangeAlertRule = {
      ruleType: 'CosmosGovV1beta1MsgDeposit',
      id: '123',
      createdAt: new Date(),
      parameters: null,
    };

    const result = await testRangeSDK.assertRule(blockInfo, mockRule);
    expect(result).toHaveLength(0);
  });
});
