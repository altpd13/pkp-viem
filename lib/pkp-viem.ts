import { PKPBase } from "@lit-protocol/pkp-base";
import { PKPBaseProp } from "@lit-protocol/types";
import {
  SignableMessage,
  isBytes,
  toBytes,
  LocalAccount,
  signatureToHex,
  Hash,
  hashMessage,
  TypedDataDefinition,
  TypedData,
  hashTypedData,
  TransactionSerializable,
  keccak256,
  Signature,
  serializeTransaction,
  Hex,
  Address,
  TransactionSerialized,
} from "viem";
import { SignTransactionReturnType } from "viem/_types/accounts/utils/signTransaction";
import { IsNarrowable } from "viem/_types/types/utils";
import {
  GetTransactionType,
  SerializeTransactionFn,
  publicKeyToAddress,
  toHex,
} from "viem/utils";

export class PKPViemAccount extends PKPBase implements LocalAccount {
  readonly publicKey!: Hex;
  readonly source = "custom";
  readonly type = "local";
  readonly address!: Address;

  defaultSigName: string = "pkp-viem-sign";

  constructor(prop: PKPBaseProp) {
    super(prop);
    this.publicKey = toHex(this.uncompressedPubKeyBuffer);
    this.address = publicKeyToAddress(this.publicKey);
  }

  async getAddress(): Promise<Address> {
    return this.address;
  }

  async signMessage({ message }: { message: SignableMessage }): Promise<Hash> {
    const signature = await this.sign(hashMessage(message));
    return signatureToHex(signature);
  }

  async signTypedData<
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | 'EIP712Domain'
  >(typedData: TypedDataDefinition<typedData, primaryType>): Promise<Hash> {
    const signauture = await this.sign(hashTypedData(typedData));
    return signatureToHex(signauture);
  }

  async signTransaction<
    TTransactionSerializable extends TransactionSerializable
  >(
    transaction: TTransactionSerializable,
    args?: {
      serializer?: SerializeTransactionFn<TTransactionSerializable>;
    }
  ): Promise<
    IsNarrowable<
      TransactionSerialized<GetTransactionType<TTransactionSerializable>>,
      Hash
    > extends true
      ? TransactionSerialized<GetTransactionType<TTransactionSerializable>>
      : Hash
  > {
    if (args === undefined || args.serializer === undefined) {
      const signature = await this.sign(
        keccak256(serializeTransaction(transaction))
      );
      return serializeTransaction(transaction, signature);
    } else {
      const signature = await this.sign(
        keccak256(args.serializer(transaction))
      );
      return args.serializer(
        transaction,
        signature
      ) as SignTransactionReturnType<TTransactionSerializable>;
    }
  }

  async sign(msgHash: `0x${string}` | Uint8Array): Promise<Signature> {
    if (!this.litNodeClientReady) {
      await this.init();
    }

    if (isBytes(msgHash)) {
      if (this.useAction) {
        const litSignature = await this.runLitAction(msgHash, "pkp-viem-sign");
        const signature: Signature = {
          r: `0x${litSignature.r}` as Hex,
          s: `0x${litSignature.s}` as Hex,
          v: BigInt(27 + litSignature.recid),
        };
        return signature;
      } else {
        const litSignature = await this.runSign(msgHash);
        const signature: Signature = {
          r: `0x${litSignature.r}` as Hex,
          s: `0x${litSignature.s}` as Hex,
          v: BigInt(27 + litSignature.recid),
        };
        return signature;
      }
    } else {
      const msgHashUint8Array: Uint8Array = toBytes(msgHash);
      if (this.useAction) {
        const litSignature = await this.runLitAction(
          msgHashUint8Array,
          "pkp-viem-sign"
        );
        const signature: Signature = {
          r: `0x${litSignature.r}` as Hex,
          s: `0x${litSignature.s}` as Hex,
          v: BigInt(27 + litSignature.recid),
        };
        return signature;
      } else {
        const litSignature = await this.runSign(msgHashUint8Array);
        const signature: Signature = {
          r: `0x${litSignature.r}` as Hex,
          s: `0x${litSignature.s}` as Hex,
          v: BigInt(27 + litSignature.recid),
        };
        return signature;
      }
    }
  }
}
