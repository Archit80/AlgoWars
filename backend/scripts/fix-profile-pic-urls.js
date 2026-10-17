import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const OLD_HOST = 'encujaqfrdkhzkpryemp.supabase.co';
const NEW_HOST = 'gzdgrttwwoejsexoxyzu.supabase.co';

// The old bucket path duplicated the bucket name: /PFPs/PFPs/filename
// The new correct path is: /PFPs/filename
const OLD_PATH_PREFIX = '/storage/v1/object/public/PFPs/PFPs/';
const NEW_PATH_PREFIX = '/storage/v1/object/public/PFPs/';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Find all users with a profilePic pointing to the old host
  const usersWithOldPic = await prisma.user.findMany({
    where: {
      profilePic: {
        contains: OLD_HOST,
      },
    },
    select: { id: true, username: true, profilePic: true },
  });

  if (usersWithOldPic.length === 0) {
    console.log('✅ No users found with old Supabase URLs. Nothing to update.');
    return;
  }

  console.log(`Found ${usersWithOldPic.length} user(s) with outdated profilePic URLs:\n`);

  for (const user of usersWithOldPic) {
    let newUrl = user.profilePic;

    // Fix the host
    newUrl = newUrl.replace(OLD_HOST, NEW_HOST);

    // Fix the doubled PFPs/PFPs/ path if present
    newUrl = newUrl.replace(
      '/storage/v1/object/public/PFPs/PFPs/',
      '/storage/v1/object/public/PFPs/'
    );

    console.log(`  [${user.username}]`);
    console.log(`    OLD: ${user.profilePic}`);
    console.log(`    NEW: ${newUrl}\n`);

    await prisma.user.update({
      where: { id: user.id },
      data: { profilePic: newUrl },
    });
  }

  console.log(`✅ Successfully updated ${usersWithOldPic.length} profilePic URL(s).`);
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
