# Range Alert Rule: Ccv Timeout

## Description

`CcvTimeout` is triggered when a ccv timeout event is emitted and the consumer chain is removed from interchain security.

## API for creating this rule

```typescript
interface IParameters {}
```

## Sample alert events

> A consumer chain has been removed from interchain security.

## Severity

- **High**

## Development

After setting the env variables, you can run tests using `RULE=ccv-timeout npm run test:rule`.

You can execute the runner and parse range blocks using `npm run start:dev`
