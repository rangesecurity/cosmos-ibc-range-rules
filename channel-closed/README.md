# Range Alert Rule: Channel Closed

## Description

`ChannelClosed` is triggered when an ibc channel is closed.

## API for creating this rule

```typescript
interface IParameters {}
```

## Sample alert events

> The channel channel-0 has been closed

## Severity

- **Medium**

## Development

After setting the env variables, you can run tests using `RULE=channel-closed npm run test:rule`.

You can execute the runner and parse range blocks using `npm run start:dev`
