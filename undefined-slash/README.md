# Range Alert Rule: undefined-slash

## Description

`undefined-slash` is triggered when a consumer chain initiates undefined slashing request.

## API for creating this rule

```typescript
interface IParameters {}
```

## Sample alert events

> A consumer initiated undefined slashing request has been initiated for validator osmo123...

## Severity

- **High**

## Development

After setting the env variables, you can run tests using `RULE=undefined-slash npm run test:rule`.

You can execute the runner and parse range blocks using `npm run start:dev`
