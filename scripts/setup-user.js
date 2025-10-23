const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// User Schema (simplified version)
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

async function setupUser() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'hsandilya@tymortech.com' });
    
    if (existingUser) {
      console.log('⚠️  User already exists:', existingUser.email);
      console.log('Updating user details...');
      
      // Update password and other details
      const hashedPassword = await bcrypt.hash('Harsh@1232@', 10);
      existingUser.password = hashedPassword;
      existingUser.isActive = true;
      existingUser.isProtected = true;
      existingUser.role = 'super_admin';
      existingUser.name = 'Harsh Sandiya';
      await existingUser.save();
      
      console.log('✅ User updated successfully');
    } else {
      // Create new user
      console.log('Creating new user...');
      const hashedPassword = await bcrypt.hash('Harsh@1232@', 10);
      
      const user = new User({
        name: 'Harsh Sandiya',
        email: 'hsandilya@tymortech.com',
        password: hashedPassword,
        role: 'super_admin',
        isActive: true,
        isProtected: true
      });

      await user.save();
      console.log('✅ User created successfully');
    }

    console.log('\n📋 User Details:');
    console.log('- Email: hsandilya@tymortech.com');
    console.log('- Password: Harsh@1232@');
    console.log('- Role: Super Admin');
    console.log('- Protected: Yes');
    console.log('- Active: Yes');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.error('Duplicate email error - user might already exist');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

setupUser();
