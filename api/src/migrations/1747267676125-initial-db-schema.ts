import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1684123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ──────────────── USERS ─────────────────
    await queryRunner.query(`
      CREATE TABLE "user" (
        id SERIAL PRIMARY KEY,
        username VARCHAR(40) NOT NULL,
        firstname VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL,
        lastname VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        whatsappNumber VARCHAR(30) NOT NULL UNIQUE,
        stripe_customer_id VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        deleted_at TIMESTAMP WITH TIME ZONE,
        verified_at TIMESTAMP WITH TIME ZONE
      );
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_USER_USERNAME" ON "user"(username);`,
    );

    // ────────── SUBSCRIPTION_PLANS ────────────
    await queryRunner.query(`
      CREATE TABLE "subscription_plans" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        stripe_product_id VARCHAR(30) NOT NULL,
        stripe_price_id VARCHAR(30) NOT NULL,
        price_cents INT NOT NULL,
        interval VARCHAR(20) NOT NULL,
        currency VARCHAR(5) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_PLAN_NAME" ON "subscription_plans"(name);`,
    );

    // ─────────────── SUBSCRIPTIONS ───────────────
    await queryRunner.query(`
      CREATE TABLE "subscription" (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
        subscription_plan_id INT REFERENCES "subscription_plans"(id) ON DELETE SET NULL,
        stripe_subscription_id VARCHAR(50) NOT NULL,
        stripe_customer_id VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL,
        cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
        current_period_start DATE NOT NULL,
        current_period_end DATE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        canceled_at TIMESTAMP WITH TIME ZONE,
        ended_at TIMESTAMP WITH TIME ZONE,
        metadata JSON
      );
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_SUB_USER" ON "subscription"(user_id);`,
    );

    // ─────────────── CATEGORIES ─────────────────
    await queryRunner.query(`
      CREATE TABLE "category" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        regex JSON NOT NULL,
        user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_CAT_USER" ON "category"(user_id);`,
    );

    // ─────────────── EXPENSES ──────────────────
    await queryRunner.query(`
      CREATE TABLE "expense" (
        id SERIAL PRIMARY KEY,
        category_id INT REFERENCES "category"(id) ON DELETE SET NULL,
        user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
        amount DECIMAL(19,4) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_EXP_USER" ON "expense"(user_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EXP_CAT"  ON "expense"(category_id);`,
    );

    // ─────────────── Seed some data ───────────────
    // 1) Create a user first
    await queryRunner.query(`
    INSERT INTO "user" (username, firstname, lastname, email, password, whatsappNumber)
    VALUES ('rafa', 'Rafael', 'Rodrigues', 'rafael@example.com', '123123', '5551998092594');
  `);

    // 2) Then subscription plans (no FK to user)
    await queryRunner.query(`
    INSERT INTO "subscription_plans"
      (name, stripe_product_id, stripe_price_id, price_cents, interval, currency)
    VALUES
      ('Free',  'prod_free',  'price_free',  0,    'month', 'USD'),
      ('Basic', 'prod_basic', 'price_basic', 500,  'month', 'USD'),
      ('Pro',   'prod_pro',   'price_pro',   2000, 'month', 'USD');
  `);

    // 3) Now categories (user_id=1 is guaranteed to exist)
    await queryRunner.query(`
  INSERT INTO "category" (name, regex, user_id)
  VALUES
    -- Mercado e supermercado
    ('mercado',    '["mercado","supermercado","mercadinho","hortifruti","feira"]'::json, 1),

    -- Transporte
    ('transporte', '["uber","99pop","táxi","taxi","onibus","ônibus","metro","metrô","trem", "transporte"]'::json, 1),

    -- Combustível
    ('combustível','["gasolina","etanol","diesel","posto","combustível","abastecimento"]'::json, 1),

    -- Alimentação fora de casa
    ('refeição',   '["restaurante","lanchonete","delivery","pizzaria","self service","rodízio","por kilo","buffet"]'::json, 1),

    -- Cafés e padarias
    ('cafeteria',  '["café","padaria","coffee shop","starbucks"]'::json, 1),

    -- Lazer e entretenimento
    ('lazer',      '["cinema","teatro","show","bar","balada","viagem","hotel","airbnb"]'::json, 1),

    -- Farmácia e saúde
    ('saúde',      '["farmácia","drogaria","remédio","consulta","exame","hospital","clínica"]'::json, 1),

    -- Moradia e utilidades
    ('moradia',    '["aluguel","condomínio","agua","água","luz","energia","gás","internet","telefone","net"]'::json, 1),

    -- Educação e cursos
    ('educação',   '["curso","faculdade","universidade","livro","workshop","mensalidade"]'::json, 1),

    -- Vestuário e acessórios
    ('vestuário',  '["roupa","calçado","sapato","camisa","calça","loja de roupa","butique"]'::json, 1),

    -- Presentes e doações
    ('presentes',  '["presente","gift","doação","donation","flores","lembrança"]'::json, 1),

    -- Outros
    ('outros',     '["diversos","outros","misc","variado"]'::json, 1);
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "expense";`);
    await queryRunner.query(`DROP TABLE "category";`);
    await queryRunner.query(`DROP TABLE "subscription";`);
    await queryRunner.query(`DROP TABLE "subscription_plans";`);
    await queryRunner.query(`DROP TABLE "user";`);
  }
}
