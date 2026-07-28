const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Electronics", icon: "💻" },
    { name: "Cameras", icon: "📷" },
    { name: "Tools", icon: "🛠️" },
    { name: "Sports", icon: "⚽" },
    { name: "Musical Instruments", icon: "🎸" },
    { name: "Books", icon: "📚" },
    { name: "Furniture", icon: "🪑" }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log("✅ Categories seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });