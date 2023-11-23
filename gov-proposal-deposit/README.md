# Range Alert Rule: Gov Proposal Deposit

## Description

`CosmosGovV1beta1MsgDeposit` is triggered when an address deposits funds into a governance proposal.

## API for creating this rule

```typescript
interface IParameters {}
```

## Sample alert events

> Funds 100 OSMO have been deposited into governance proposal 97 by depositor cosmos123...

## Severity

- **Info**

## Development

After setting the env variables, you can run tests using `RULE=gov-proposal-deposit npm run test:rule`.

You can execute the runner and parse range blocks using `npm run start:dev`
