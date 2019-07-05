/// <reference types="node" />
declare module 'stellar-hd-wallet' {
  import { Keypair } from 'stellar-base';
  export type SupportedLanguages =
    | 'EN'
    | 'JA'
    | 'chinese_simplified'
    | 'chinese_traditional'
    | 'english'
    | 'french'
    | 'italian'
    | 'japanese'
    | 'spanish';
  export class StellarHDWallet {
    static fromMnemonic(
      mnemonic: string,
      password?: string,
      language?: SupportedLanguages,
    ): StellarHDWallet;
    static fromSeed(seed: string | Buffer): StellarHDWallet;
    static generateMnemonic({
      entropyBits,
      language,
      rngFn,
    }?: {
      entropyBits?: number;
      language?: SupportedLanguages;
      rngFn?: (size: number) => Buffer;
    }): string;
    static validateMnemonic(
      mnemonic: string,
      language?: SupportedLanguages,
    ): boolean;
    private seedHex;
    constructor(seedHex: string);
    derive(path: string): Buffer;
    getKeypair(index: number): Keypair;
    getPublicKey(index: number): string;
    getSecret(index: number): string;
  }
  export default StellarHDWallet;
  //# sourceMappingURL=stellar-hd-wallet.d.ts.map
}
