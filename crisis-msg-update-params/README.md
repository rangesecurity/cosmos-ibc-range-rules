# Range Alert Rule: Crisis Msg Update Params

## Description

`CosmosCrisisV1beta1MsgUpdateParams` is triggered when the parameters of crisis module are updated by associated authority.

## API for creating this rule

```typescript
interface IParameters {}
```

## Sample alert events

> Crisis module parameters have been updated by cosmos123...

## Severity

- **Info**

## Development

After setting the env variables, you can run tests using `RULE=crisis-msg-update-params npm run test:rule`.

You can execute the runner and parse range blocks using `npm run start:dev`
