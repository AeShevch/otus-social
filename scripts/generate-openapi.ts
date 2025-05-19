import { writeFileSync } from 'fs';
import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@otus-social/app.module';

async function generateOpenApi() {
  try {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .setTitle('Social Network API')
      .setDescription('API Documentation for Social Network')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const outputPath = join(process.cwd(), 'openapi.json');

    writeFileSync(outputPath, JSON.stringify(document, null, 2));
    console.log(`OpenAPI specification successfully generated: ${outputPath}`);

    await app.close();
  } catch (error) {
    console.error('Error generating OpenAPI specification:', error);
    process.exit(1);
  }
}

void generateOpenApi();
