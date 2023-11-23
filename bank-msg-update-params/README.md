# Range Alert Rule: Bank Msg Update Params

## Description

`CosmosBankV1beta1MsgUpdateParams` is triggered when the parameters of bank module are updated by associated authority.

## API for creating this rule

```typescript
interface IParameters {}
```

## Sample alert events

> The parameters for the Bank module has been updated by authority address {...}. Current parameters: {...}

## Severity

- **Info**

## Development

After setting the env variables, you can run tests using `RULE=bank-msg-update-params npm run test:rule`.

You can execute the runner and parse range blocks using `npm run start:dev`
