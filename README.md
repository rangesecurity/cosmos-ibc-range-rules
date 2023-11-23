# Cosmos Hub Range detection rules
This repository contains the public and open-source set of rules built and run by Range for the Cosmos Hub network, IBC and Interchain Security Monitoring. All detector rules are built with the [Range SDK](https://github.com/rangesecurity/range-sdk).

## Rule List
- **auth-msg-update-params:** Rule that triggers if the parameters of the `auth` module are changed
- **authz-abuse:** Rule that may detect phishing attacks by anomalies on the usage of `authz` grant messages
- **bank-msg-update-params:** Rule that triggers if the parameters of the `bank` module are changed
- **blacklisted-address:** Rule that detects involvement of a blacklisted address
- **ccv-timeout:** Rule that triggers if a CCV Timeout event happened
- **channel-closed:** Rule that triggers if a channel close request is initiated
- **consumer-rewards-amount:** Rule that triggers if the consumer rewards amount reaches a threshold
- **consumer-rewards-time:** Rule that triggers if the consumer rewards time reaches a threshold
- **crisis-msg-update-params:** Rule that triggers if the parameters of `crisis` module are changed
- **distribution-msg-community-pool-spend:** Rule that triggers if funds from the community pool are spent
- **distribution-msg-fund-community-pool:** Rule that triggers if the community pool is funded
- **downtime-slash:** Rule that detects if a downtime slash event occurs for a consumer chain
- **equivocation-slash:** Rule that detects if an equivocation slash event occurs for a consumer chain
- **evidence-msg-submit-evidence:** Rule that triggers if an address submits a double signing evidence message
- **gov-msg-submit-proposal:** Rule that triggers if a governance proposal is submitted by an address
- **gov-proposal-submit:** Rule that triggers when an address deposits funds into a governance proposal
- **ibc-addr-txs:** Rule that detects if a specific address performs more than `x` transaction over a time window `t`
- **ibc-channel-avg-pending-tx:** Rule that detects if there are more pending IBC transfers than usual
- **ibc-channel-failed-tx:** Rule that detects if there are more failed IBC transfers than usual
- **ibc-channel-failed-tx-perc:** Rule that triggers if the ratio of failed IBC transfers for a specific channel is higher than usual
- **ibc-channel-flow-quota-x:** Rule that triggers if more than `x` % of a ibc rate limit quota is surpassed
- **ibc-channel-num-txs:** Rule that triggers with there are more IBC transfers in a channel than a threshold
- **ibc-channel-pending-tx:** Rule that triggers if there are more IBC pending txs in a channel than a threshold
- **large-stake:** Rule that triggers when a large amount is staked to a validator
- **large-unstake:** Rule that triggers when a large amount is unstaked from a validator
- **more-than-x-txs-in-last-hour:** Rule that triggers if more than x transactions are done by and address in last hour
- **relayer-low-on-funds:** Rule that detects when the balance of a relayer goes below a certain threshold
- **slashing-msg-unjail:** Rule that triggers when a validator is unjailed
- **slashing-msg-update-params:** Rule that triggers when the parameters of the `slashing` module are updated
- **vsc-matured:** Rule that triggers when the validator set change(VSC) reaches maturity on the consumer chain

- ## License

This project is licensed under the Apache 2.0 License. See the [LICENSE](link) file for details.
