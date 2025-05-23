// generateHash.js
import bcrypt from 'bcryptjs';

async function generateHash(plainTextPassword) {
  const saltRounds = 10;                  // ค่าความยุ่งยากของ salt
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plainTextPassword, salt);
  console.log('Password:', plainTextPassword);
  console.log('Hash:    ', hash);
  return hash;
}

// ทดลองเรียก
generateHash('mySecretPassword');
