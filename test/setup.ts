import { rm } from 'fs/promises';
import { join } from 'path';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

let app: INestApplication;
let dataSource: DataSource;

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'db.test.sqlite'));
  } catch (error) {}

  // Crear una nueva instancia de la aplicación antes de cada test
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  await app.init();

  // Obtener la instancia de DataSource para sincronizar la base de datos
  dataSource = app.get(DataSource);
  await dataSource.synchronize(true);
});

global.afterEach(async () => {
  await app.close();
});
