// Simple test script to verify backend connection
// Run this with: node test-backend-connection.js

const API_BASE_URL = 'http://localhost:3000/api';

async function testBackendConnection() {
  console.log('🔍 Testing backend connection...');
  console.log(`📡 API URL: ${API_BASE_URL}`);
  
  try {
    // Test basic connectivity
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test',
        password: 'test'
      })
    });
    
    const data = await response.json();
    
    if (response.status === 401) {
      console.log('✅ Backend is running and responding!');
      console.log('📝 Expected 401 (Invalid credentials) - this is correct for test credentials');
      console.log(`📄 Response: ${data.message}`);
    } else if (response.status === 400) {
      console.log('✅ Backend is running and responding!');
      console.log('📝 Validation error - this means the API is working');
      console.log(`📄 Response: ${data.message}`);
    } else {
      console.log('⚠️  Unexpected response:', response.status, data);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend is not running or not accessible');
      console.log('💡 Make sure to start the backend server with: npm run dev');
      console.log('💡 Check that the backend is running on port 3000');
    } else {
      console.log('❌ Connection error:', error.message);
    }
  }
}

// Test registration endpoint
async function testRegistrationEndpoint() {
  console.log('\n🔍 Testing registration endpoint...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/adult`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'patient_adult',
        username: 'testuser',
        phone: '0999999999',
        nationality: 'malawian',
        nationalId: '123456789',
        password: 'testpass123'
      })
    });
    
    const data = await response.json();
    
    if (response.status === 201) {
      console.log('✅ Registration endpoint is working!');
      console.log(`📄 Response: ${data.message}`);
    } else if (response.status === 409) {
      console.log('✅ Registration endpoint is working!');
      console.log('📝 User already exists - this is expected for repeated tests');
      console.log(`📄 Response: ${data.message}`);
    } else {
      console.log('⚠️  Unexpected response:', response.status, data);
    }
    
  } catch (error) {
    console.log('❌ Registration test error:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting backend connection tests...\n');
  
  await testBackendConnection();
  await testRegistrationEndpoint();
  
  console.log('\n✨ Tests completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Make sure your backend is running on http://localhost:3000');
  console.log('2. Start the frontend with: npm run dev');
  console.log('3. Try registering a new user');
  console.log('4. Try logging in with the registered user');
}

runTests();
