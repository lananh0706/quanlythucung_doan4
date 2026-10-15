const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync } = require('child_process');

async function main() {
  console.log('=== STEP 1: Copying images from xampp uploads to project repo ===');
  const xamppUploads = 'C:/xampp1/htdocs/petcare-api/uploads';
  const projectUploads = path.join(__dirname, '../petcare-api/uploads');

  if (!fs.existsSync(projectUploads)) {
    fs.mkdirSync(projectUploads, { recursive: true });
  }

  let copiedCount = 0;
  if (fs.existsSync(xamppUploads)) {
    const files = fs.readdirSync(xamppUploads);
    for (const f of files) {
      const srcFile = path.join(xamppUploads, f);
      const dstFile = path.join(projectUploads, f);
      if (!fs.existsSync(dstFile) || fs.statSync(srcFile).size !== fs.statSync(dstFile).size) {
        fs.copyFileSync(srcFile, dstFile);
        copiedCount++;
      }
    }
    console.log(`Copied/Updated ${copiedCount} files. Total files in project uploads: ${fs.readdirSync(projectUploads).length}`);
  }

  console.log('\n=== STEP 2: Fetching latest products from MySQL API ===');
  const rawData = await new Promise((resolve, reject) => {
    http.get('http://localhost/petcare-api/get_products.php', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });

  const parsed = JSON.parse(rawData);
  const products = parsed.data || [];
  console.log(`Fetched ${products.length} products from backend.`);

  // Print info of products 14, 15, 16
  const sample = products.filter(p => [14, 15, 16].includes(Number(p.id)));
  console.log('\nRecently updated products preview:');
  for (const p of sample) {
    console.log(`- ID ${p.id}: ${p.name}`);
    console.log(`  Main Image: ${p.image}`);
    console.log(`  Gallery:`, p.gallery_images);
    console.log(`  Scents:`, p.scents);
    console.log(`  Weights:`, p.weight_options);
  }

  console.log('\n=== STEP 3: Updating products_backup.json ===');
  const backupPathProject = path.join(__dirname, '../petcare-api/products_backup.json');
  const backupPathXampp = 'C:/xampp1/htdocs/petcare-api/products_backup.json';

  const backupJsonStr = JSON.stringify(products, null, 2);
  fs.writeFileSync(backupPathProject, backupJsonStr, 'utf8');
  try {
    fs.writeFileSync(backupPathXampp, backupJsonStr, 'utf8');
  } catch (e) {
    console.warn('Could not write to xampp backup directly:', e.message);
  }
  console.log(`Saved backup JSON to ${backupPathProject} (${(backupJsonStr.length / 1024).toFixed(1)} KB)`);

  console.log('\n=== STEP 4: Updating src/constants/initial-products-data.ts ===');
  const formattedProducts = products.map(p => {
    let galleryImages = [];
    if (Array.isArray(p.gallery_images)) {
      galleryImages = p.gallery_images;
    } else if (typeof p.gallery_images === 'string' && p.gallery_images.trim()) {
      try {
        galleryImages = JSON.parse(p.gallery_images);
      } catch (e) {
        galleryImages = p.gallery_images.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    if (!Array.isArray(galleryImages) || galleryImages.length === 0) {
      galleryImages = p.image ? [p.image] : [];
    }

    let scents = [];
    if (Array.isArray(p.scents)) {
      scents = p.scents;
    } else if (typeof p.scents === 'string' && p.scents.trim()) {
      try {
        scents = JSON.parse(p.scents);
      } catch (e) {
        scents = p.scents.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    if (!Array.isArray(scents)) scents = [];

    let weightOptions = [];
    if (Array.isArray(p.weight_options)) {
      weightOptions = p.weight_options;
    } else if (typeof p.weight_options === 'string' && p.weight_options.trim()) {
      try {
        weightOptions = JSON.parse(p.weight_options);
      } catch (e) {
        weightOptions = [];
      }
    }
    if (!Array.isArray(weightOptions)) weightOptions = [];

    let tags = [];
    if (Array.isArray(p.tags)) {
      tags = p.tags;
    } else if (typeof p.tags === 'string' && p.tags.trim()) {
      try {
        tags = JSON.parse(p.tags);
      } catch (e) {
        tags = p.tags.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const price = Number(p.price) || 0;
    const originalPrice = Number(p.original_price || p.originalPrice) || price;
    const discountPercent = Number(p.discount_percent || p.discountPercent) || (originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0);
    const discount = p.discount || (discountPercent > 0 ? `-${discountPercent}%` : undefined);

    const item = {
      id: Number(p.id),
      name: p.name || '',
      sku: p.sku || `SP-${p.id}`,
      brand: p.brand || 'PetCare',
      category: p.category_slug || p.category || 'other',
      category_slug: p.category_slug || p.category || 'other',
      price: price,
      originalPrice: originalPrice,
      discountPercent: discountPercent,
      ...(discount ? { discount } : {}),
      stock: Number(p.stock) || 0,
      soldCount: p.sold_count || p.soldCount || '0 đã bán',
      rating: Number(p.rating) || 5.0,
      reviewCount: Number(p.review_count || p.reviewCount) || 0,
      image: p.image || '',
      galleryImages: galleryImages,
      description: p.description || '',
      weightOptions: weightOptions,
      scents: scents,
      proteinSources: p.protein_sources || p.proteinSources || 'Thịt tươi tự nhiên',
      targetPet: p.target_pet || p.targetPet || 'Chó mèo mọi lứa tuổi',
      crudeProtein: p.crude_protein || p.crudeProtein || '>= 30%',
      crudeFat: p.crude_fat || p.crudeFat || '>= 12%',
      crudeFiber: p.crude_fiber || p.crudeFiber || '<= 5%',
      caloriesKcal: p.calories_kcal || p.caloriesKcal || '3850 kcal/kg',
      productType: p.product_type || p.productType || 'food',
      tags: tags
    };

    if (p.badge) {
      item.badge = p.badge;
    }

    return item;
  });

  const tsContent = `// Auto-generated seed file synced with MySQL Database
import type { ProductItem } from '@/context/product-context';

export const INITIAL_PRODUCTS_SEED: ProductItem[] = ${JSON.stringify(formattedProducts, null, 2)};
`;

  const tsFilePath = path.join(__dirname, '../src/constants/initial-products-data.ts');
  fs.writeFileSync(tsFilePath, tsContent, 'utf8');
  console.log(`Saved updated seed file: ${tsFilePath}`);

  console.log('\n=== STEP 5: Exporting MySQL Database Dump ===');
  const dumpSqlPath = path.join(__dirname, '../petcare-api/petcare_db_backup.sql');
  const dumpSqlXampp = 'C:/xampp1/htdocs/petcare-api/petcare_db_backup.sql';
  try {
    const mysqldumpBin = 'C:\\xampp1\\mysql\\bin\\mysqldump.exe';
    if (fs.existsSync(mysqldumpBin)) {
      execSync(`"${mysqldumpBin}" -u root petcare_db > "${dumpSqlPath}"`, { stdio: 'inherit' });
      console.log(`MySQL dump created successfully at ${dumpSqlPath}`);
      if (fs.existsSync(dumpSqlPath)) {
        fs.copyFileSync(dumpSqlPath, dumpSqlXampp);
      }
    } else {
      console.warn('mysqldump binary not found at default path');
    }
  } catch (err) {
    console.error('MySQL dump failed:', err.message);
  }

  console.log('\n=== ALL PERSISTENCE TASKS COMPLETED SUCCESSFULLY! ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
