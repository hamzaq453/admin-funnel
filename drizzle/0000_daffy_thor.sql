CREATE TABLE IF NOT EXISTS "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_importance" varchar(50) NOT NULL,
	"customer_experience" varchar(50) NOT NULL,
	"contact_time" varchar(50) NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"address" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'New' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
