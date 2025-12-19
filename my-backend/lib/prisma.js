const { PrismaClient } = require('@prisma/client');

// This creates one single instance of the database connection
const prisma = new PrismaClient();

module.exports = prisma;