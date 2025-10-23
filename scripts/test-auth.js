const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['super_admin', 'content_admin'], default: 'content_admin' },
  avatar: { type: String },
  isActive: { type: Boolean, default: true },
  isProtected: { type: Boolean, default: false, index: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function testAuth() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Simulate the exact auth process from auth.ts
    const email = 'hsandilya@tymortech.com';
    const password = 'Harsh@1232@';

    console.log(`\n🔍 Looking for user: ${email}`);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', user.name);
    console.log('✅ User is active:', user.isActive);

    if (!user.isActive) {
      console.log('❌ User is not active');
      return;
    }

    console.log('\n🔐 Testing password comparison...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('❌ Password is invalid');
      console.log('🔄 Creating new password hash...');
      const newHash = await bcrypt.hash(password, 10);
      user.password = newHash;
      await user.save();
      console.log('✅ Password updated');
      
      // Test again
      const isPasswordValidAfterUpdate = await bcrypt.compare(password, user.password);
      console.log('✅ Password is now valid:', isPasswordValidAfterUpdate);
    } else {
      console.log('✅ Password is valid');
    }

    // Test the exact return object that NextAuth expects
    const authResult = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };

    console.log('\n📋 Auth Result Object:');
    console.log(JSON.stringify(authResult, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testAuth();
