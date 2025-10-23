require('dotenv').config({ path: '.env.local' });

console.log('🔍 Environment Variables Check:');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
console.log('NEXTAUTH_URL exists:', !!process.env.NEXTAUTH_URL);

if (process.env.MONGODB_URI) {
  console.log('MONGODB_URI length:', process.env.MONGODB_URI.length);
}

if (process.env.NEXTAUTH_SECRET) {
  console.log('NEXTAUTH_SECRET length:', process.env.NEXTAUTH_SECRET.length);
}

if (process.env.NEXTAUTH_URL) {
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
}
