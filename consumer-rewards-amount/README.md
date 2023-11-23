# Range Alert Rule: Consumer Rewards Amount

## Description

`ConsumerRewardsAmount` is triggered when the reward distributed to a consumer crosses a certain threshold.

Since their are multiple denoms present in the reward, you can set the `denom` as a parameter.
The other parameter is the `threshold`, which is the reward amount threshold.

## API for creating this rule

```typescript
interface IParameters {
  threshold: number;
  denom: string;
}
```

## Sample alert events

> Consumer rewards amount is 0 untrn which is higher than 1000000

## Severity

- **Medium**

## Development

After setting the env variables, you can run tests using `RULE=consumer-rewards-amount npm run test:rule`.

You can execute the runner and parse range blocks using `npm run start:dev`
