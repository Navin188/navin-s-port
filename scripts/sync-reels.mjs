import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Read .env
const envPath = path.resolve('.env');
let supabaseUrl = '';
let supabaseKey = '';
let serviceRoleKey = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
  const keyMatch = envContent.match(/VITE_SUPABASE_PUBLISHABLE_KEY=(.*)/);
  const serviceMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

  if (urlMatch) supabaseUrl = urlMatch[1].trim();
  if (keyMatch) supabaseKey = keyMatch[1].trim();
  if (serviceMatch) serviceRoleKey = serviceMatch[1].trim();
}

const activeKey = serviceRoleKey || supabaseKey;

console.log('--- SUPABASE REELS SYNC & UPLOAD ---');
console.log('Supabase URL:', supabaseUrl);
console.log('Key type in use:', serviceRoleKey ? 'Service Role Key (Full Admin)' : 'Publishable/Anon Key');

if (!supabaseUrl || !activeKey) {
  console.error('Missing Supabase credentials in .env!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, activeKey);

const REEL_METADATA = {
  'corporateand-fun': [
    {
      asset_key: 'corporate-01',
      title: 'Standup Chronicles: The Sync',
      description: 'When a 15-minute morning check-in transforms into an impromptu deep-dive architectural debate.',
      filename: 'corporate-01.mp4',
      sort_order: 1,
    },
    {
      asset_key: 'corporate-02',
      title: 'Fueling The Sprint',
      description: 'The sacred routine: converting hot espresso into pixel-perfect frontend micro-interactions.',
      filename: 'corporate-02.mp4',
      sort_order: 2,
    },
    {
      asset_key: 'corporate-03',
      title: 'Shipping on Friday 5 PM',
      description: 'That adrenaline spike when production deployment passes all green without a hitch.',
      filename: 'corporate-03.mp4',
      sort_order: 3,
    },
    {
      asset_key: 'corporate-04',
      title: 'Design Critique Vibes',
      description: 'Collaborative brainstorms where daring UI ideas turn into tested design system components.',
      filename: 'corporate-04.mp4',
      sort_order: 4,
    },
    {
      asset_key: 'corporate-05',
      title: 'Off-Clock Shenanigans',
      description: 'The lighthearted side between code reviews — keeping the energy vibrant and the spirits high.',
      filename: 'corporate-05.mp4',
      sort_order: 5,
    },
  ],
  'poetryand-feeling': [
    {
      asset_key: 'poetry-02',
      title: 'Echoes of the Night',
      description: 'Late night musings under distant city lights when solitary thoughts shape into gentle verses.',
      filename: 'poetry-02.mp4',
      sort_order: 1,
    },
    {
      asset_key: 'poetry-03',
      title: 'A Letter to Tomorrow',
      description: 'Verses on hope, inner resilience, and finding quiet harmony amid the relentless digital noise.',
      filename: 'poetry-03.mp4',
      sort_order: 2,
    },
    {
      asset_key: 'poetry-01',
      title: 'Whispers of the Monsoon',
      description: 'Reflections on quiet rainfall, nostalgia, and the unspoken words lingering between pauses.',
      filename: 'poetry-01.mp4',
      sort_order: 3,
    },
    {
      asset_key: 'poetry-04',
      title: 'Shades of Silence',
      description: 'A heartfelt recital exploring the profound comfort discovered in tranquil, peaceful stillness.',
      filename: 'poetry-04.mp4',
      sort_order: 4,
    },
    {
      asset_key: 'poetry-05',
      title: 'The Soul of Words',
      description: 'Unfiltered emotional expression woven through rhythm, cadence, and heartfelt vulnerability.',
      filename: 'poetry-05.mp4',
      sort_order: 5,
    },
  ],
};

async function sync() {
  const BUCKET_NAME = 'portfolio-reels';

  // 1. Check or create bucket
  console.log(`\n1. Checking Storage Bucket "${BUCKET_NAME}"...`);
  try {
    const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
    if (bErr) {
      console.warn('  ⚠️ Cannot list buckets with current key:', bErr.message);
    } else {
      const exists = buckets?.some(b => b.name === BUCKET_NAME);
      if (!exists) {
        console.log(`  Creating bucket "${BUCKET_NAME}"...`);
        const { error: cErr } = await supabase.storage.createBucket(BUCKET_NAME, { public: true });
        if (cErr) console.warn('  ⚠️ Bucket creation note:', cErr.message);
        else console.log('  ✅ Bucket created successfully.');
      } else {
        console.log(`  ✅ Bucket "${BUCKET_NAME}" exists.`);
      }
    }
  } catch (err) {
    console.warn('  ⚠️ Storage check exception:', err.message);
  }

  // 2. Upload video files to Storage
  console.log(`\n2. Uploading optimized reels to Storage...`);
  const outBase = path.resolve('public/optimized-reels');

  for (const [category, items] of Object.entries(REEL_METADATA)) {
    for (const item of items) {
      const localFilePath = path.join(outBase, category, item.filename);
      const storagePath = `${category}/${item.filename}`;
      const thumbPath = `thumbnails/${category}/${path.parse(item.filename).name}.jpg`;
      const localThumbPath = path.join(outBase, 'thumbnails', category, `${path.parse(item.filename).name}.jpg`);

      if (!fs.existsSync(localFilePath)) {
        console.warn(`  ⚠️ Local file missing: ${localFilePath}`);
        continue;
      }

      const fileBuffer = fs.readFileSync(localFilePath);
      console.log(`  Uploading [${category}] ${item.filename} (${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB)...`);

      const { error: upErr } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
          contentType: 'video/mp4',
          upsert: true,
        });

      if (upErr) {
        console.warn(`  ⚠️ Upload warning for ${storagePath}:`, upErr.message);
      } else {
        console.log(`  ✅ Uploaded ${storagePath}`);
      }

      // Upload thumbnail if exists
      if (fs.existsSync(localThumbPath)) {
        const thumbBuf = fs.readFileSync(localThumbPath);
        await supabase.storage.from(BUCKET_NAME).upload(thumbPath, thumbBuf, {
          contentType: 'image/jpeg',
          upsert: true,
        });
      }
    }
  }

  // 3. Upsert Records to Supabase Database (portfolio_reels)
  console.log(`\n3. Synchronizing records with "portfolio_reels" database table...`);

  for (const [category, items] of Object.entries(REEL_METADATA)) {
    for (const item of items) {
      const storagePath = `${category}/${item.filename}`;
      const thumbPath = `thumbnails/${category}/${path.parse(item.filename).name}.jpg`;

      // Get public URL
      const { data: videoUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
      const { data: thumbUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(thumbPath);

      const payload = {
        asset_key: item.asset_key,
        title: item.title,
        description: item.description,
        category: category,
        video_path: videoUrlData?.publicUrl || storagePath,
        thumbnail_path: thumbUrlData?.publicUrl || thumbPath,
        sort_order: item.sort_order,
        is_published: true,
      };

      const { data, error } = await supabase
        .from('portfolio_reels')
        .upsert(payload, { onConflict: 'asset_key' })
        .select();

      if (error) {
        console.error(`  ❌ Database upsert error for [${item.asset_key}]:`, error.message);
      } else {
        console.log(`  ✅ Synced [${item.asset_key}] -> ${item.title}`);
      }
    }
  }

  console.log('\n--- SYNC COMPLETE ---');
}

sync().catch(err => {
  console.error('Fatal sync error:', err);
});
