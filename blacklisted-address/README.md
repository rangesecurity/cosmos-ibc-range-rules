# Range Alert Rule: Blacklisted Address

## Description

`BlacklistedAddressInteractions` is triggered when a transaction is found to be associated with any of the blacklisted address defined inside the rule parameter field `addresses`.

## API for creating this rule

```typescript
interface IParameters {
  addresses: string[];
}
```

## Sample alert events

> The blacklisted address cosmos1237p3rv44pz3pqneefrurmly73rfjdvncaery5 is found to be linked to transaction 43d0ea500f53f86bafb6ad073601a0443c6d203ceff002c13e9cdbf95b791d9b

## Severity

- **High**

## Development

After setting the env variables, you can run tests using `RULE=blacklisted-address npm run test:rule`.

You can execute the runner and parse range blocks using `npm run start:dev`
