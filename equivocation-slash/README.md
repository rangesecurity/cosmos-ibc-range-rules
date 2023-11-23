# Range Alert Rule: equivocation-slash

## Description

`EquivocationSlash` is triggered when a consumer chain initiates a double sign slashing request.

## API for creating this rule

```typescript
interface IParameters {}
```

## Sample alert events

> A consumer initiated equivocation slashing request has been initiated for validator cosmos123...`

## Severity

- **High**

## Development

After setting the env variables, you can run tests using `RULE=equivocation-slash npm run test:rule`.

You can execute the runner and parse range blocks using `npm run start:dev`
