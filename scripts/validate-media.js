import { validateAllProductMedia } from '../server/utils/mediaValidator.js';

console.log('====================================================');
console.log('PRIMINA PRODUCT MEDIA INTEGRITY AUDIT');
console.log('====================================================\n');

const result = validateAllProductMedia();

console.log(`Audited: ${result.totalProducts} watch models in catalog`);
console.log(`Overall Status: ${result.valid ? 'PASSED (STRICT COMPLIANCE)' : 'FAILED'}\n`);

if (result.errors.length > 0) {
  console.error('CRITICAL MEDIA ERRORS:');
  result.errors.forEach(err => console.error('  ✕', err));
  console.log('');
} else {
  console.log('✓ All published URLs are scoped to their exact product ID');
  console.log('✓ No duplicate product media files are published');
  console.log('✓ Missing media remains explicitly unavailable (Coming soon)');
}

console.log('\nPRODUCT MEDIA AUDIT MATRIX:');
result.report.forEach(p => {
  const label = key => p.assets[key].path ? (p.assets[key].exists ? `✓ ${key}` : `✗ ${key}`) : `– ${key} (Coming soon)`;
  console.log(`[${p.id}] ${p.name.padEnd(28)} | ${label('front')} | ${label('back')} | ${label('side')} | ${label('top')} | ${label('assemblyVideo')} | ${label('model3d')}`);
});

console.log('\n====================================================');
if (!result.valid) {
  process.exit(1);
} else {
  console.log('ALL PRIMINA PRODUCT MEDIA POLICIES SATISFIED');
  process.exit(0);
}
