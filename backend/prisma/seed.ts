import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const products = [
  {
    id: 'archive-001',
    name: 'Military Field Jacket',
    price: 485,
    era: '90s',
    archiveType: 'Outerwear',
    description: 'Authentic vintage military field jacket sourced from European surplus. Heavy cotton canvas construction with original brass hardware. Perfectly worn-in patina.',
    function: 'Layering / Statement',
    quantity: 2,
    soldOut: false,
    image: '/src/assets/product-1.jpg',
    dropDate: '2024-01-15',
    dropName: 'Archive 001',
  },
  {
    id: 'archive-002',
    name: 'Utility Cargo Trousers',
    price: 320,
    era: '90s',
    archiveType: 'Bottoms',
    description: 'Dead stock military surplus cargo trousers. Heavyweight ripstop cotton with reinforced knees. Never worn, original tags intact.',
    function: 'Everyday / Utility',
    quantity: 3,
    soldOut: false,
    image: '/src/assets/product-2.jpg',
    dropDate: '2024-01-15',
    dropName: 'Archive 001',
  },
  {
    id: 'archive-003',
    name: 'Heavyweight Hood',
    price: 225,
    era: '2000s',
    archiveType: 'Tops',
    description: 'Rare dead stock heavyweight hoodie from defunct Japanese streetwear label. 450gsm cotton fleece with hidden pocket details.',
    function: 'Comfort / Layering',
    quantity: 0,
    soldOut: true,
    image: '/src/assets/product-3.jpg',
    dropDate: '2024-01-15',
    dropName: 'Archive 001',
  },
  {
    id: 'archive-004',
    name: 'Selvedge Denim Jacket',
    price: 550,
    era: '80s',
    archiveType: 'Outerwear',
    description: 'Original selvedge denim trucker jacket. Natural indigo fading with decades of honest wear. Each piece tells its own story.',
    function: 'Statement / Layering',
    quantity: 1,
    soldOut: false,
    image: '/src/assets/product-4.jpg',
    dropDate: '2024-02-01',
    dropName: 'Archive 002',
  },
  {
    id: 'archive-005',
    name: 'Distressed Graphic Tee',
    price: 145,
    era: '90s',
    archiveType: 'Tops',
    description: 'Vintage tour tee with natural distressing. Single-stitch construction, paper-thin hand feel. Authenticity guaranteed.',
    function: 'Everyday / Statement',
    quantity: 2,
    soldOut: false,
    image: '/src/assets/product-5.jpg',
    dropDate: '2024-02-01',
    dropName: 'Archive 002',
  },
  {
    id: 'archive-006',
    name: 'Heritage Messenger',
    price: 380,
    era: '80s',
    archiveType: 'Accessories',
    description: 'Full-grain leather messenger bag with brass buckles. Developed natural patina from decades of use. Timeless functionality.',
    function: 'Carry / Everyday',
    quantity: 0,
    soldOut: true,
    image: '/src/assets/product-6.jpg',
    dropDate: '2024-02-01',
    dropName: 'Archive 002',
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing products
  await prisma.product.deleteMany({});
  console.log('✅ Cleared existing products');

  // Create products
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
    console.log(`✅ Created product: ${product.name}`);
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
