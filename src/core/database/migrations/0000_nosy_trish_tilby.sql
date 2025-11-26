CREATE TABLE "animal" (
	"cod_animal" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"especie" varchar(255) NOT NULL,
	"raca" varchar(255),
	"idade" integer,
	"observacao" text,
	"genero" varchar(1),
	"fk_cod_tutor" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tutor" (
	"cod_tutor" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"telefone" varchar(50),
	"fk_cod_usuario" integer NOT NULL,
	CONSTRAINT "tutor_fk_cod_usuario_unique" UNIQUE("fk_cod_usuario")
);
--> statement-breakpoint
CREATE TABLE "usuario" (
	"cod_usuario" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"senha_hash" text NOT NULL,
	"nivel_acesso" varchar(50) DEFAULT 'tutor' NOT NULL,
	CONSTRAINT "usuario_email_unique" UNIQUE("email")
);
