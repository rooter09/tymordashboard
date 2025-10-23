const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// User Schema (same as in the setup script)
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

async function verifyUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the user
    const user = await User.findOne({ email: 'hsandilya@tymortech.com' });
    
    if (!user) {
      console.log('❌ User not found in database');
      return;
    }

    console.log('\n📋 User Found:');
    console.log('- ID:', user._id);
    console.log('- Name:', user.name);
    console.log('- Email:', user.email);
    console.log('- Role:', user.role);
    console.log('- Is Active:', user.isActive);
    console.log('- Is Protected:', user.isProtected);
    console.log('- Created At:', user.createdAt);
    console.log('- Updated At:', user.updatedAt);

    // Test password
    console.log('\n🔐 Testing Password:');
    const testPassword = 'Harsh@1232@';
    const isPasswordValid = await bcrypt.compare(testPassword, user.password);
    console.log('- Password Match:', isPasswordValid ? '✅ Valid' : '❌ Invalid');

    if (!isPasswordValid) {
      console.log('\n🔄 Updating password...');
      const newHashedPassword = await bcrypt.hash(testPassword, 10);
      user.password = newHashedPassword;
      await user.save();
      console.log('✅ Password updated successfully');
      
      // Test again
      const isPasswordValidAfterUpdate = await bcrypt.compare(testPassword, user.password);
      console.log('- Password Match After Update:', isPasswordValidAfterUpdate ? '✅ Valid' : '❌ Invalid');
    }

    // Check all users in database
    console.log('\n👥 All Users in Database:');
    const allUsers = await User.find({}, 'name email role isActive isProtected');
    allUsers.forEach((u, index) => {
      console.log(`${index + 1}. ${u.name} (${u.email}) - ${u.role} - Active: ${u.isActive} - Protected: ${u.isProtected}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

verifyUser();
