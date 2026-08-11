import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create categories
  const mealsCategory = await prisma.category.upsert({
    where: { name: 'Comidas' },
    update: {},
    create: {
      name: 'Comidas',
    },
  });

  const drinksCategory = await prisma.category.upsert({
    where: { name: 'Bebidas' },
    update: {},
    create: {
      name: 'Bebidas',
    },
  });

  const dessertsCategory = await prisma.category.upsert({
    where: { name: 'Postres' },
    update: {},
    create: {
      name: 'Postres',
    },
  });

  // Create products
  await prisma.product.create({
    data: {
      name: 'Hamburguesa Raptor',
      description: 'Doble carne, queso, tocino, y salsa secreta.',
      price: 85.0,
      prepTime: 15,
      categoryId: mealsCategory.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Tacos de Asada (Orden)',
      description: 'Orden de 5 tacos de carne asada con todo.',
      price: 60.0,
      prepTime: 10,
      categoryId: mealsCategory.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Refresco Cola 600ml',
      description: 'Refresco bien frío.',
      price: 25.0,
      prepTime: 2,
      categoryId: drinksCategory.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Agua de Horchata',
      description: 'Agua fresca de horchata natural.',
      price: 20.0,
      prepTime: 2,
      categoryId: drinksCategory.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Pastel de Chocolate',
      description: 'Rebanada de pastel de chocolate amargo.',
      price: 45.0,
      prepTime: 5,
      categoryId: dessertsCategory.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
