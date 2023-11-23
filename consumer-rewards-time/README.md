# Range Alert Rule: Consumer Rewards Time

## Description

`ConsumerRewardsTime` is triggered when the reward distributed time for consumer crosses a certain threshold.

The only parameter here is the `threshold`, which is the reward duration threshold.

## API for creating this rule

```typescript
interface IParameters {
  threshold: number;
}
```

## Sample alert events

> Consumer rewards duration for next block is 1500 which is higher than 100

## Severity

- **Low**

## Development

After setting the env variables, you can run tests using `RULE=consumer-rewards-time npm run test:rule`.

You can execute the runner and parse range blocks using `npm run start:dev`
