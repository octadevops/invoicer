from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64
import os
from dotenv import load_dotenv

load_dotenv()

class AESCipher:
    def __init__(self):
        key = os.getenv('ENCRYPTION_KEY', '')
        # Use the raw key without padding
        self.key = key.encode('utf-8')
        self.block_size = AES.block_size

    def encrypt(self, data: str) -> str:
        try:
            cipher = AES.new(self.key, AES.MODE_ECB)
            # Ensure data is padded to block size
            padded_data = pad(data.encode('utf-8'), self.block_size)
            encrypted_data = cipher.encrypt(padded_data)
            # Convert to base64 for transmission
            return base64.b64encode(encrypted_data).decode('utf-8')
        except Exception as e:
            print(f"Encryption error: {str(e)}")
            raise

    def decrypt(self, encrypted_data: str) -> str:
        try:
            print(f"Key being used: {self.key}")
            print(f"Attempting to decrypt: {encrypted_data}")
            
            # Convert from base64
            encrypted_bytes = base64.b64decode(encrypted_data)
            cipher = AES.new(self.key, AES.MODE_ECB)
            decrypted_data = cipher.decrypt(encrypted_bytes)
            
            # Remove padding
            unpadded_data = unpad(decrypted_data, self.block_size)
            result = unpadded_data.decode('utf-8')
            
            print(f"Decrypted result: {result}")
            return result
        except Exception as e:
            print(f"Decryption error detail: {str(e)}")
            raise
