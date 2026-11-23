/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
/**
 * Safe Database User Cleanup Script
 * Cleans up temporary test accounts while protecting essential master,
 * personal, and production accounts.
 */
const { MongoClient, ObjectId } = require("mongodb");

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://personalshahil69_db_user:i9LAtPvFATtZqlQo@general-use.zavzn5v.mongodb.net/pizzahub?retryWrites=true&w=majority&appName=general-use";
const dbName = process.env.MONGODB_DB_NAME || "pizzahub";

// Whitelist: NEVER DELETE THESE ACCOUNTS
const PRESERVED_EMAILS = new Set([
  "admin@pizzahub.local",
  "admin@pizzahub.com",
  "vendor@pizzahub.local",
  "vendor@pizzahub.com",
  "customer@pizzahub.com",
  "personalshahil69@gmail.com",
  "sahil.social69@gmail.com",
  "luca.customer@example.com",
  "mario.vendor@example.com",
  "marcofoodie@test.com",
  "john@yomail.com",
]);

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    const users = await db.collection("users").find({}).toArray();
    console.log(`Total users currently in database: ${users.length}`);

    const toDelete = users.filter((u) => !PRESERVED_EMAILS.has(u.email));
    const toKeep = users.filter((u) => PRESERVED_EMAILS.has(u.email));

    console.log(`\nPreserving ${toKeep.length} essential accounts:`);
    toKeep.forEach((u) =>
      console.log(`  ✓ [${u.role.toUpperCase()}] ${u.name || "N/A"} (${u.email})`)
    );

    console.log(`\nIdentified ${toDelete.length} test/junk accounts to delete:`);
    toDelete.forEach((u) =>
      console.log(`  ✗ [${u.role.toUpperCase()}] ${u.name || "N/A"} (${u.email})`)
    );

    if (dryRun) {
      console.log("\n[DRY RUN] No records were modified.");
      return;
    }

    const deleteIds = toDelete.map((u) => u._id);
    const deleteIdStrings = deleteIds.map((id) => id.toString());

    // 1. Delete users
    const userResult = await db.collection("users").deleteMany({
      _id: { $in: deleteIds },
    });

    // 2. Delete corresponding accounts in better-auth
    const accountResult = await db.collection("accounts").deleteMany({
      userId: { $in: [...deleteIds, ...deleteIdStrings] },
    });

    // 3. Delete corresponding sessions
    const sessionResult = await db.collection("sessions").deleteMany({
      userId: { $in: [...deleteIds, ...deleteIdStrings] },
    });

    console.log(`\n=== CLEANUP COMPLETED ===`);
    console.log(`Users deleted: ${userResult.deletedCount}`);
    console.log(`Auth credentials deleted: ${accountResult.deletedCount}`);
    console.log(`Active sessions purged: ${sessionResult.deletedCount}`);
  } catch (err) {
    console.error("Cleanup error:", err);
  } finally {
    await client.close();
  }
}

run();
