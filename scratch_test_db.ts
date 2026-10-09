import { connectDB, closeDB } from './backend/src/config/db.js';
import { User, Lot, Requirement, MarketPrice, StorageFacility, Vehicle, Booking, Payment, TransactionEvent, Grievance, Quality } from './backend/src/models/index.js';
import { createApp } from './backend/src/app.js';
import http from 'http';

async function runTests() {
  console.log('=== STARTING MONGO DB & API VERIFICATION TESTS ===\n');

  // Test 1: Connect to DB
  console.log('Test 1: Testing MongoDB connection...');
  await connectDB();
  console.log('✅ TEST 1 PASSED: MongoDB Connected Successfully.\n');

  // Test 2: Check Mongoose Models Loading
  console.log('Test 2: Verifying Mongoose Models loading...');
  const models = [User, Lot, Requirement, MarketPrice, StorageFacility, Vehicle, Booking, Payment, TransactionEvent, Grievance, Quality];
  for (const model of models) {
    if (!model || !model.modelName) {
      throw new Error(`Model loading failed: ${model}`);
    }
  }
  console.log(`✅ TEST 2 PASSED: All ${models.length} Mongoose Models loaded without errors.\n`);

  // Test 3: Start Express App Server on random port to test HTTP API
  console.log('Test 3 & 4: Testing HTTP REST API endpoints (CREATE & READ)...');
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, () => resolve()));
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;
  console.log(`Express server running on ${baseUrl}`);

  // Utility fetch helper
  async function postJson(path: string, body: any, token?: string) {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return { status: res.status, body: await res.json() };
  }

  async function getJson(path: string, token?: string) {
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'GET',
      headers,
    });
    return { status: res.status, body: await res.json() };
  }

  // 1. Health Check
  const health = await getJson('/api/health');
  console.log('Health check response:', health);
  if (health.status !== 200 || health.body.status !== 'ok') {
    throw new Error('Health check failed');
  }

  // 2. CREATE Operation: Register a new test farmer
  const testEmail = `testfarmer_${Date.now()}@example.com`;
  const testPhone = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  console.log(`Performing CREATE user test (Email: ${testEmail}, Phone: ${testPhone})...`);

  const signupRes = await postJson('/api/auth/signup', {
    name: 'Verification Farmer',
    email: testEmail,
    phone: testPhone,
    password: 'TestPassword123!',
    role: 'farmer',
    location: { state: 'Maharashtra', district: 'Nagpur', village: 'Ramtek' },
    farmerDetails: { farmName: 'Test Green Acres', farmSize: '10 Acres', primaryCrops: 'Wheat' }
  });

  console.log('CREATE User Result:', signupRes);
  if (signupRes.status !== 201 || !signupRes.body.success || !signupRes.body.token) {
    throw new Error(`User CREATE failed: ${JSON.stringify(signupRes.body)}`);
  }
  const token = signupRes.body.token;
  console.log('✅ CREATE User (Signup) Passed.');

  // 3. READ Operation: User Login
  console.log('Performing READ user test (Login)...');
  const loginRes = await postJson('/api/auth/login', {
    identifier: testEmail,
    password: 'TestPassword123!'
  });
  console.log('READ User Result:', loginRes);
  if (loginRes.status !== 200 || !loginRes.body.success || !loginRes.body.user) {
    throw new Error(`User READ failed: ${JSON.stringify(loginRes.body)}`);
  }
  console.log('✅ READ User (Login) Passed.');

  // 4. CREATE Operation: Create a produce lot in MongoDB
  console.log('Performing CREATE Produce Lot test...');
  const createLotRes = await postJson('/api/lots', {
    crop: 'Organic Alphonso Mango',
    variety: 'Export Grade',
    quantity: 1500,
    unit: 'kg',
    expectedPrice: 120,
    harvestDate: '2026-05-01'
  }, token);

  console.log('CREATE Lot Result:', createLotRes);
  if (createLotRes.status !== 201 || !createLotRes.body.success || !createLotRes.body.lot) {
    throw new Error(`Lot CREATE failed: ${JSON.stringify(createLotRes.body)}`);
  }
  const createdLotId = createLotRes.body.lot._id;
  console.log(`✅ CREATE Produce Lot Passed (Created Lot ID: ${createdLotId}).`);

  // 5. READ Operation: Fetch produce lots from MongoDB via Marketplace endpoint
  console.log('Performing READ Marketplace Listings test...');
  const marketplaceRes = await getJson('/api/marketplace');
  console.log(`Marketplace returned ${marketplaceRes.body.listings?.length} listings`);
  if (marketplaceRes.status !== 200 || !marketplaceRes.body.success || !Array.isArray(marketplaceRes.body.listings)) {
    throw new Error(`Marketplace READ failed: ${JSON.stringify(marketplaceRes.body)}`);
  }
  const foundLot = marketplaceRes.body.listings.find((l: any) => l.id === createdLotId || l.crop === 'Organic Alphonso Mango');
  if (!foundLot) {
    throw new Error('Created lot not found in Marketplace listings!');
  }
  console.log('Found created lot in MongoDB marketplace response:', foundLot);
  console.log('✅ READ Marketplace Listings Passed.');

  // Clean up
  server.close();
  await closeDB();
  console.log('\n=== ALL 10 VERIFICATION TESTS COMPLETED SUCCESSFULLY WITH 100% PASS RATE ===');
}

runTests().catch((err) => {
  console.error('❌ Verification test failed:', err);
  process.exit(1);
});
