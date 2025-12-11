import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
	POSTGRES_URL: z.string().url(),
	POSTGRES_URL_NON_POOLING: z.string().url().optional(),
	POSTGRES_PRISMA_URL: z.string().url().optional(),
	REDIS_HOST: z.string().default("localhost"),
	REDIS_PORT: z.coerce.number().default(6379),
	REDIS_PASSWORD: z.string().optional(),
	REDIS_URL: z.string().optional(),
	JWT_SECRET: z.string().min(32),
	JWT_EXPIRES_IN: z.string().default("7d"),
	PORT: z.coerce.number().default(5000),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	CORS_ORIGIN: z.string().url().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
	env = envSchema.parse(process.env);
} catch (error) {
	// Use console.error here since logger depends on env being valid
	if (error instanceof z.ZodError) {
		console.error("❌ Invalid environment variables:");
		error.errors.forEach((err) => {
			console.error(`  - ${err.path.join(".")}: ${err.message}`);
		});
		process.exit(1);
	}
	throw error;
}

export default env;
