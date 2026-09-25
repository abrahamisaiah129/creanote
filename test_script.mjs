// test_script.mjs
import { exec } from 'child_process';
import crypto from 'crypto';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('Starting Next.js Server on port 3001...');
  const server = exec('npx next dev -p 3001');
  
  await wait(12000);

  const BASE_URL = 'http://localhost:3001';
  let cookie = '';
  
  try {
    console.log('\n--- 1. Testing Authentication ---');
    // Test Invalid Login
    let res = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'wrong', password: 'password' })
    });
    if (res.status !== 401) throw new Error('Auth bypass vulnerability: Allowed invalid login');
    console.log('✅ Invalid login rejected (401)');

    // Test Valid Login
    res = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'creanote2026!' })
    });
    if (!res.ok) throw new Error('Failed to login with valid credentials');
    
    // Extract cookie
    const setCookie = res.headers.get('set-cookie');
    if (!setCookie) throw new Error('No cookie returned on successful login');
    cookie = setCookie.split(';')[0];
    console.log('✅ Valid login accepted and cookie generated');


    console.log('\n--- 2. Testing Post CRUD Operations ---');
    const uniqueHeadline = `E2E_Test_Post_${crypto.randomBytes(4).toString('hex')}`;
    
    // Create Post
    console.log('Creating post:', uniqueHeadline);
    let postRes = await fetch(`${BASE_URL}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify({
        date: 'Oct 24',
        headline: uniqueHeadline,
        sub: 'A test post for E2E validation',
        content: 'This is the body of the test post',
        category: 'DEV NOTE'
      })
    });
    
    if (!postRes.ok) throw new Error(`Failed to create post: ${await postRes.text()}`);
    let postData = await postRes.json();
    console.log('✅ Post Created successfully with ID:', postData._id || postData.id);

    // Read Post
    console.log('Fetching all posts to verify creation...');
    let getRes = await fetch(`${BASE_URL}/api/posts`);
    let posts = await getRes.json();
    let found = (Array.isArray(posts) ? posts : posts.data).find(p => p.headline === uniqueHeadline);
    if (!found) throw new Error('Created post was not found in the fetch results');
    const postId = found._id || found.id;
    console.log('✅ Post successfully verified in database read');

    // Update Post
    console.log('Updating post...');
    let updateRes = await fetch(`${BASE_URL}/api/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify({
        sub: 'Updated test sub'
      })
    });
    if (!updateRes.ok) throw new Error('Failed to update post');
    console.log('✅ Post successfully updated');

    // Delete Post
    console.log('Deleting post...');
    let deleteRes = await fetch(`${BASE_URL}/api/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Cookie': cookie }
    });
    if (!deleteRes.ok) throw new Error('Failed to delete post');
    console.log('✅ Post successfully deleted');


    console.log('\n--- 3. Testing Quotes CRUD Operations ---');
    const uniqueQuote = `E2E_Quote_${crypto.randomBytes(4).toString('hex')}`;
    
    // Create Quote
    console.log('Creating quote:', uniqueQuote);
    let quoteRes = await fetch(`${BASE_URL}/api/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify({
        boldText: uniqueQuote,
        name: 'Tester',
        role: 'SDET'
      })
    });
    if (!quoteRes.ok) throw new Error(`Failed to create quote`);
    let quoteData = await quoteRes.json();
    console.log('✅ Quote Created successfully with ID:', quoteData._id || quoteData.id);
    const quoteId = quoteData._id || quoteData.id;

    // Delete Quote
    console.log('Deleting quote...');
    let delQuoteRes = await fetch(`${BASE_URL}/api/quotes/${quoteId}`, {
      method: 'DELETE',
      headers: { 'Cookie': cookie }
    });
    if (!delQuoteRes.ok) throw new Error('Failed to delete quote');
    console.log('✅ Quote successfully deleted');


    console.log('\n🎉 All Manual Backend API Tests Passed Successfully!');

  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED:', err.message);
  } finally {
    // Cleanup
    server.kill();
    process.exit(0);
  }
}

runTests();
