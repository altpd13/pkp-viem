# pkp-viem

Run `yarn` first

## Running unit tests

Create config.json file on root directory.

```
{
  "PRIVATE_KEY": "<your private key. If there is a leading 0x, delete it>",
  "CONTROLLER_AUTHSIG": {
    "sig": "",
    "derivedVia": "",
    "signedMessage": "",
    "address": ""
  },
  "PKP_PUBKEY": "<your pubkey>"
}
```

Run `yarn start <test-case>` or `yar dev <test-case>` to execute the test.

```
/**
 * Test cases:
 * 1 = create a PKP Viem Account
 * 2 = create a PKP Viem Account and sign message
 * 3 = create a PKP Viem Account and sign Typed Data
 * 4 = create a PKP Viem Wallet Client and send a transaction
 * 5 = create a PKP Viem Account and send raw transaction
 */
```
