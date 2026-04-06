import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prevent multiple Prisma Client instances during hot reload in development.
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }),
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
		errorFormat: "pretty",
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

// Run a non-blocking connection check in development for fast feedback.
async function testConnection() {
	try {
		await prisma.$connect();
		console.log("Database connected successfully");
	} catch (error) {
		console.error("Database connection failed:", error);
		console.error(
			"Make sure your database is running and DATABASE_URL is correct"
		);
		console.error("Current DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
	}
}

if (process.env.NODE_ENV === "development") {
	testConnection();
}

export default prisma;
