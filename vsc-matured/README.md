# Range Alert Rule: VSC Matured

## Description

`VscMatured` is triggered when the validator set change(VSC) reaches maturity on the consumer chain.

## API for creating this rule

```typescript
interface IParameters {}
```

## Sample alert events

> The validator change set has reached maturity.

## Severity

- **Info**

## Development

After setting the env variables, you can run tests using `RULE=vsc-matured npm run test:rule`.

You can execute the runner and parse range blocks using `npm run start:dev`
