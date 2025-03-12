from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Hash import SHA256
import base64
import os
from dotenv import load_dotenv

load_dotenv()

class AESCipher:
    def __init__(self):
        encryption_key = os.getenv('ENCRYPTION_KEY')
        if not encryption_key:
            raise ValueError("ENCRYPTION_KEY not found in environment variables")
        
        # Create a 32-byte key using SHA256
        self.key = SHA256.new(encryption_key.encode('utf-8')).digest()
        self.block_size = AES.block_size

    def encrypt(self, data: str) -> str:
        try:
            cipher = AES.new(self.key, AES.MODE_ECB)
            padded_data = pad(data.encode('utf-8'), self.block_size)
            encrypted_data = cipher.encrypt(padded_data)
            return base64.b64encode(encrypted_data).decode('utf-8')
        except Exception as e:
            print(f"Encryption error: {str(e)}")
            raise

    def decrypt(self, encrypted_data: str) -> str:
        try:
            cipher = AES.new(self.key, AES.MODE_ECB)
            encrypted_bytes = base64.b64decode(encrypted_data)
            decrypted_data = cipher.decrypt(encrypted_bytes)
            unpadded_data = unpad(decrypted_data, self.block_size)
            return unpadded_data.decode('utf-8')
        except Exception as e:
            print(f"Decryption error: {str(e)}")
            raise
