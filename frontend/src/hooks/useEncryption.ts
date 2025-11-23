"use client";

import nacl from "tweetnacl";
import util from "tweetnacl-util";

export function useEncryption() {
  
  function generateIdentityKeyPair() {
    const kp = nacl.box.keyPair();
    return {
      publicKey: util.encodeBase64(kp.publicKey),
      secretKey: util.encodeBase64(kp.secretKey),
      rawPublic: kp.publicKey,
      rawSecret: kp.secretKey,
    };
  }

 
  function generateEphemeral() {
    const kp = nacl.box.keyPair();
    return {
      publicKey: util.encodeBase64(kp.publicKey),
      secretKey: util.encodeBase64(kp.secretKey),
      rawPublic: kp.publicKey,
      rawSecret: kp.secretKey,
    };
  }

 
  function encryptMessagePlaintext(plain: string, recipientPubRaw: Uint8Array, senderSecretRaw: Uint8Array) {
    const nonce = nacl.randomBytes(24);
    const txt = util.decodeUTF8(plain);
    const cipher = nacl.box(txt, nonce, recipientPubRaw, senderSecretRaw);
    return {
      ciphertext: util.encodeBase64(cipher),
      nonce: util.encodeBase64(nonce),
    };
  }

  
  function decryptMessage(cipherBase64: string, nonceBase64: string, senderEphemeralPubRaw: Uint8Array, mySecretRaw: Uint8Array) {
    const cipher = util.decodeBase64(cipherBase64);
    const nonce = util.decodeBase64(nonceBase64);
    const plain = nacl.box.open(cipher, nonce, senderEphemeralPubRaw, mySecretRaw);
    if (!plain) return null;
    return util.encodeUTF8(plain);
  }

  return {
    generateIdentityKeyPair,
    generateEphemeral,
    encryptMessagePlaintext,
    decryptMessage,
  };
}
