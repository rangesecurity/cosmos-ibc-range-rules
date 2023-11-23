# Range Alert Rule: Downtime Slash

## Description

`DowntimeSlash` is triggered when a consumer chain initiates downtime slashing request.

## API for creating this rule

```typescript
interface IParameters {}
```

## Sample alert events

> A consumer initiated downtime slashing request has been initiated for validator cosmos123...

## Severity

- **Medium**

## Development

After setting the env variables, you can run tests using `RULE=downtime-slash npm run test:rule`.

You can execute the runner and parse range blocks using `npm run start:dev`
