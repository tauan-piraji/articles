import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1732414140000  implements MigrationInterface {
  name = 'CreateInitialTables1732414140000';

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // --------------------------
    // USERS
    // --------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_set_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
    `);

    // --------------------------
    // PERMISSIONS
    // --------------------------
    await queryRunner.query(`
      CREATE TABLE permissions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        rule VARCHAR(50) NOT NULL,
        module VARCHAR(50)  NOT NULL,

        can_read BOOLEAN NOT NULL DEFAULT true,
        can_create BOOLEAN NOT NULL DEFAULT false,
        can_edit BOOLEAN NOT NULL DEFAULT false,
        can_delete BOOLEAN NOT NULL DEFAULT false,

        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // --------------------------
    // ARTICLES
    // --------------------------
    await queryRunner.query(`
      CREATE TABLE articles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        users_id UUID NOT NULL REFERENCES users(id),

        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        tags TEXT[],

        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // --------------------------
    // LOGS (NOVA TABELA)
    // --------------------------

    // Enum para status do log
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'log_status') THEN
          CREATE TYPE log_status AS ENUM ('RUNNING', 'FINISHED', 'ERROR');
        END IF;
      END$$;
    `);

    await queryRunner.query(`
      CREATE TABLE logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        status log_status NOT NULL,
        payload JSONB,
        
        start_time TIMESTAMP NOT NULL DEFAULT NOW(),
        end_time TIMESTAMP,
        
        error_msg TEXT,

        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // --------------------------
    // SEED PERMISSIONS
    // --------------------------
    await queryRunner.query(`

      INSERT INTO permissions (rule, module, can_read, can_create, can_edit, can_delete)
      VALUES
        ('ADMIN', 'users', true,  true, true, true),
        ('ADMIN', 'articles', true,  true, true, true),
        ('AUTHOR', 'users', false, false, false, false),
        ('AUTHOR', 'articles', true, true, true, true),
        ('USER', 'users', false, false, false, false),
        ('USER', 'articles', true, false, false, false);
    `);

    // --------------------------
    // SEED USERS
    // --------------------------

    // ...existing code...
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    // ...existing code...

    const hash = `crypt('123456', gen_salt('bf'))`;

    await queryRunner.query(`
      INSERT INTO users (name, email, password_hash, role) VALUES
        ('Admin User 1',   'admin1@example.com',  ${hash}, 0),
        ('Admin User 2',   'admin2@example.com',  ${hash}, 0),

        ('Regular User 1', 'user1@example.com',   ${hash}, 1),
        ('Regular User 2', 'user2@example.com',   ${hash}, 1),

        ('Author User 1',  'author1@example.com', ${hash}, 2),
        ('Author User 2',  'author2@example.com', ${hash}, 2)
      ON CONFLICT (email) DO NOTHING;
    `);

    // --------------------------
    // SEED ARTICLES
    // --------------------------
    const authors = await queryRunner.query(`
      SELECT id FROM users WHERE email IN ('author1@example.com', 'author2@example.com');
    `);

    const author1 = authors[0]?.id;
    const author2 = authors[1]?.id;

    if (author1 && author2) {
      await queryRunner.query(`
        INSERT INTO articles (users_id, title, content)
        VALUES
          ('${author1}', 'First Article',  'Content of the first article.'),
          ('${author1}', 'Second Article', 'Content of the second article.'),
          ('${author2}', 'Third Article',  'Content of the third article.')
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`DROP TABLE IF EXISTS logs`);
    await queryRunner.query(`DROP TYPE IF EXISTS log_status`);

    await queryRunner.query(`DROP TABLE IF EXISTS articles`);
    await queryRunner.query(`DROP TABLE IF EXISTS permissions`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_set_updated_at ON users`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_updated_at`);

    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}
