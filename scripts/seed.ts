const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: "Розробка програмного забезпечення" },
                { name: "Розробка веб-додатків" },
                { name: "Мобільна розробка" },
                { name: "Розробка ігор" },
                { name: "Наука про дані" },
                { name: "Машинне навчання" },
                { name: "Кібербезпека" },
                { name: "DevOps" },
                { name: "Архітектура програмного забезпечення" }
            ]
        });
        console.log("Successfully created categories.");
    } catch (e) {
        console.error("Error seeding the database categories", e);
    } finally {
        await database.$disconnect();
    }
}

main();