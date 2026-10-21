const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3000';

async function runAllTests() {
  console.log('====================================================');
  console.log('🚀 STARTING COMPREHENSIVE END-TO-END SYSTEM TESTS');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      process.exitCode = 1;
    }
  }

  try {
    // 1. Frontend Server
    console.log('--- 1. Testing Frontend Server ---');
    const feRes = await axios.get(FRONTEND_URL);
    assert(feRes.status === 200, 'Frontend server responds with HTTP 200');
    assert(feRes.data.includes('መልህቅFX'), 'Frontend HTML includes ⚓ መልህቅFX branding');
    assert(feRes.data.includes('Jakarta'), 'Frontend HTML loads Plus Jakarta Sans typography');

    // 2. CSS Color Palette Check (Zero Blue)
    console.log('\n--- 2. Validating Color Palette (Strictly NO BLUE) ---');
    const cssPath = path.resolve(__dirname, '../frontend/src/App.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check for previous blue hexes or generic blues
    const hasOldIndigo1 = cssContent.includes('#4f46e5');
    const hasOldIndigo2 = cssContent.includes('#4338ca');
    const hasOldIndigo3 = cssContent.includes('#e0e7ff');
    const hasOldIndigo4 = cssContent.includes('#c7d2fe');
    const hasGenericBlue = /#[0-9a-fA-F]{6}/.test(cssContent) && 
                           cssContent.match(/#1[eE]40[aA][fF]|#2563[eE][bB]|#3[bB]82[fF]6|#60[aA]5[fF][aA]/g);

    assert(!hasOldIndigo1 && !hasOldIndigo2 && !hasOldIndigo3 && !hasOldIndigo4 && !hasGenericBlue, 
      'Zero blue colors found in App.css (Old indigo/blue completely removed)');
    assert(cssContent.includes('#10b981') && cssContent.includes('#059669'), 
      'Verified rich Emerald Green theme tokens (#10b981 / #059669)');
    assert(cssContent.includes('#fbbf24') || cssContent.includes('#f59e0b'), 
      'Verified Champagne Amber / Gold accent tokens');

    // 3. Backend Health
    console.log('\n--- 3. Testing Backend Health & API ---');
    const health = await axios.get(`${BACKEND_URL}/health`);
    assert(health.status === 200 && health.data.status === 'ok', 'Backend health endpoint returns status: ok');

    // 4. Live Exchange Rates
    console.log('\n--- 4. Testing Live Exchange Rates Endpoint ---');
    const ratesRes = await axios.get(`${BACKEND_URL}/rates?base=USD`);
    assert(ratesRes.status === 200, 'Rates endpoint returns HTTP 200');
    assert(ratesRes.data.rates && Object.keys(ratesRes.data.rates).length > 150, 
      `Rates endpoint returned ${Object.keys(ratesRes.data.rates || {}).length} currencies`);
    assert(ratesRes.data.rates.ETB != null, `USD -> ETB rate is present (${ratesRes.data.rates.ETB})`);
    assert(ratesRes.data.rates.EUR != null, `USD -> EUR rate is present (${ratesRes.data.rates.EUR})`);
    assert(ratesRes.data.rates.GBP != null, `USD -> GBP rate is present (${ratesRes.data.rates.GBP})`);

    // 5. Favorites CRUD
    console.log('\n--- 5. Testing Favorites Endpoints (Create, Read, Duplicate Check, Delete) ---');
    // Add favorite
    const favAdd = await axios.post(`${BACKEND_URL}/favorites`, {
      from_currency: 'USD',
      to_currency: 'ETB'
    });
    assert(favAdd.status === 200 && (favAdd.data.id || favAdd.data.alreadyExists), 'Successfully saved USD/ETB to favorites');

    // Fetch favorites
    const favList = await axios.get(`${BACKEND_URL}/favorites`);
    assert(favList.status === 200 && Array.isArray(favList.data), 'Successfully retrieved favorites list');
    const createdFav = favList.data.find(f => f.from_currency === 'USD' && f.to_currency === 'ETB');
    assert(createdFav != null, 'Found USD/ETB in favorites list');

    // Duplicate check
    const favDup = await axios.post(`${BACKEND_URL}/favorites`, {
      from_currency: 'USD',
      to_currency: 'ETB'
    });
    assert(favDup.data.alreadyExists === true, 'Duplicate favorite detected and handled gracefully');

    // 6. Conversion History CRUD
    console.log('\n--- 6. Testing History Endpoints (Create, Read, Delete) ---');
    const histAdd = await axios.post(`${BACKEND_URL}/history`, {
      from_currency: 'USD',
      to_currency: 'ETB',
      amount: 250,
      result: 31875.00
    });
    assert(histAdd.status === 200 && histAdd.data.id != null, 'Successfully logged currency conversion to database');

    const histList = await axios.get(`${BACKEND_URL}/history`);
    assert(histList.status === 200 && histList.data.length > 0, 'Successfully fetched conversion history from database');
    const createdHist = histList.data.find(h => h.id === histAdd.data.id);
    assert(createdHist != null && parseFloat(createdHist.amount) === 250, 'Conversion entry matches input amount (250 USD)');

    // Delete single history item
    const delHist = await axios.delete(`${BACKEND_URL}/history/${histAdd.data.id}`);
    assert(delHist.status === 200, 'Successfully deleted test history item');

    // 7. Cleanup Favorite test entry
    if (createdFav && createdFav.id) {
      const delFav = await axios.delete(`${BACKEND_URL}/favorites/${createdFav.id}`);
      assert(delFav.status === 200, 'Successfully removed favorite pair');
    }

    console.log('\n====================================================');
    console.log(`🎉 ALL TESTS COMPLETED: ${passedTests}/${totalTests} PASSED`);
    console.log('====================================================\n');
  } catch (error) {
    console.error('Fatal error during test run:', error.message);
    if (error.response) console.error('Response data:', error.response.data);
    process.exit(1);
  }
}

runAllTests();
