# Range Alert Rule: Gov Msg Submit Proposal

## Description

`CosmosGovV1beta1MsgSubmitProposal` is triggered when a governance proposal is submitted by an address.

## API for creating this rule

```typescript
interface IParameters {}
```

## Sample alert events

> Governance proposal has been submitted by proposer cosmos123... with an initial deposit of 100 OSMO. Proposal contents: {...}

## Severity

- **Info**

## Development

After setting the env variables, you can run tests using `RULE=gov-msg-submit-proposal npm run test:rule`.

You can execute the runner and parse range blocks using `npm run start:dev`
