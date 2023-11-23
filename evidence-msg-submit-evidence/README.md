# Range Alert Rule: Evidence Msg Submit Evidence

## Description

`CosmosEvidenceV1beta1MsgSubmitEvidence` is triggered when an address submits a double signing evidence message.

## API for creating this rule

```typescript
interface IParameters {}
```

## Sample alert events

> Double-signing evidence have been submitted by cosmos123... Evidence: {...}

## Severity

- **Info**

## Development

After setting the env variables, you can run tests using `RULE=evidence-msg-submit-evidence npm run test:rule`.

You can execute the runner and parse range blocks using `npm run start:dev`
