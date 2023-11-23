# Range Alert Rule: Auth Abuse

## Description

`AuthAbuse` is triggered when too many users send authz grant message to the same grantee is last hour.

## API for creating this rule

```typescript
interface IParameters {}
```

## Sample alert events

> Suspicious repeated use of AuthZ Grant. Address cosmos123... has been granted capabilities 10 times in the last 1 hour

## Severity

- **Medium**

## Development

After setting the env variables, you can run tests using `RULE=authz-abuse npm run test:rule`.

You can execute the runner and parse range blocks using `npm run start:dev`
