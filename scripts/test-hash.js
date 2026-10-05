import bcrypt from 'bcryptjs';

const hash = '$2b$10$OVPGm/h2vVRBW2pzp7aCcep0PvQwqPsxRa6jUZCLy0vPHPX.zc2Oy';
const candidates = ['demo123', 'password', 'password123', 'mani123', '123456', '12345678', 'admin', 'admin123', 'kasanimanikanta2005', 'hdtpmuvruvnuuyix', '1qJ6p4EVbT3kBdBo'];

async function testPasswords() {
  for (const p of candidates) {
    if (await bcrypt.compare(p, hash)) {
      console.log('MATCH FOUND:', p);
      return;
    }
  }
  console.log('No match found in candidates list');
}

testPasswords();
