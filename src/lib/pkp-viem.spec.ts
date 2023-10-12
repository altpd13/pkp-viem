import * as LITCONFIG from 'lit.config.json';

jest.useRealTimers();

describe('PKPViemAccount', () => {
  it('should create Account', async () => {
    const log = jest.spyOn(global.console, 'log');
    const { PKPViemAccount } = await import('./pkp-viem');
    console.log('aaa');
    const account = new PKPViemAccount({
      controllerAuthSig: LITCONFIG.CONTROLLER_AUTHSIG,
      pkpPubKey: LITCONFIG.PKP_PUBKEY,
    });
    const address = account.address;
    console.log(address);
    log.mockRestore();
    expect(address).toEqual(LITCONFIG.PKP_ETH_ADDRESS);
  });
});
