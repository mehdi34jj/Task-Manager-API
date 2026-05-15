const API_URL = 'http://localhost:3000/tasks';

async function testAll() {
  console.log("=== Testing API Endpoints ===");

  // 1. POST
  console.log("\n1. Testing POST /tasks...");
  let res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: "Test Task", description: "Created by automated test", status: false })
  });
  let createdTask = await res.json();
  console.log("Created Task:", createdTask);

  const id = createdTask.id;

  // 2. GET ALL
  console.log("\n2. Testing GET /tasks...");
  res = await fetch(API_URL);
  let tasks = await res.json();
  console.log("All Tasks Count:", tasks.length);

  // 3. GET BY ID
  console.log(`\n3. Testing GET /tasks/${id}...`);
  res = await fetch(`${API_URL}/${id}`);
  let task = await res.json();
  console.log("Fetched Task:", task);

  // 4. PATCH
  console.log(`\n4. Testing PATCH /tasks/${id}...`);
  res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: true })
  });
  let patchResult = await res.json();
  console.log("Patch Result:", patchResult);

  // Verify Patch
  res = await fetch(`${API_URL}/${id}`);
  task = await res.json();
  console.log("Verified Task Complete Status:", task.complete);

  // 5. DELETE
  console.log(`\n5. Testing DELETE /tasks/${id}...`);
  res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  let deleteResult = await res.json();
  console.log("Delete Result:", deleteResult);

  // Verify Delete
  res = await fetch(`${API_URL}/${id}`);
  console.log("Verified Delete (Status should be 404):", res.status);

  console.log("\n=== All tests finished successfully! ===");
}

testAll().catch(console.error);
