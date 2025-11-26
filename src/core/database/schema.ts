import { pgTable, serial, text, varchar, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- USUARIO (Login) ---
export const usuarios = pgTable('usuario', {
  codUsuario: serial('cod_usuario').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  senhaHash: text('senha_hash').notNull(),
  nivelAcesso: varchar('nivel_acesso', { length: 50 }).default('tutor').notNull(),
});

export const usuarioRelations = relations(usuarios, ({ one }) => ({
  tutor: one(tutores, {
    fields: [usuarios.codUsuario],
    references: [tutores.fkCodUsuario],
  }),
}));

// --- TUTOR (Dados Pessoais) ---
export const tutores = pgTable('tutor', {
  codTutor: serial('cod_tutor').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  telefone: varchar('telefone', { length: 50 }),
  fkCodUsuario: integer('fk_cod_usuario').unique().notNull(),
});

export const tutorRelations = relations(tutores, ({ one, many }) => ({
  usuario: one(usuarios, {
    fields: [tutores.fkCodUsuario],
    references: [usuarios.codUsuario],
  }),
  animais: many(animais),
}));

// --- ANIMAL ---
export const animais = pgTable('animal', {
  codAnimal: serial('cod_animal').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  especie: varchar('especie', { length: 255 }).notNull(),
  raca: varchar('raca', { length: 255 }),
  idade: integer('idade'),
  observacao: text('observacao'),
  genero: varchar('genero', { length: 1 }), // 'M' ou 'F'
  fkCodTutor: integer('fk_cod_tutor').notNull(),
});

export const animalRelations = relations(animais, ({ one }) => ({
  tutor: one(tutores, {
    fields: [animais.fkCodTutor],
    references: [tutores.codTutor],
  }),
}));

export type TUsuario = typeof usuarios.$inferSelect;
export type TTutor = typeof tutores.$inferSelect;
export type TAnimal = typeof animais.$inferSelect;