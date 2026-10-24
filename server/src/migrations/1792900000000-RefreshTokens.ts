import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefreshTokens1792900000000 implements MigrationInterface {
  name = 'RefreshTokens1792900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "refreshTokenHash"`);
    await queryRunner.query(`CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tokenHash" character varying NOT NULL, "revoked" boolean NOT NULL DEFAULT false, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_refresh_token_id" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_refresh_token_tokenHash" ON "refresh_token" ("tokenHash")`);
    await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_refresh_token_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_refresh_token_user"`);
    await queryRunner.query(`DROP INDEX "IDX_refresh_token_tokenHash"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "refreshTokenHash" character varying`);
  }
}
