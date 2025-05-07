import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@otus-social/database/database.service';
import { UserModel } from '@otus-social/users/models/user.model';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async findById(id: number): Promise<UserModel | null> {
    const result = await this.databaseService.getPool().query(
      'SELECT id, username, email, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return UserModel.fromDatabase(result.rows[0]);
  }

  public async findByUsername(username: string): Promise<UserModel | null> {
    const result = await this.databaseService.getPool().query(
      'SELECT id, username, email, password, created_at, updated_at FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return UserModel.fromDatabase(result.rows[0]);
  }

  public async findByEmail(email: string): Promise<UserModel | null> {
    const result = await this.databaseService.getPool().query(
      'SELECT id, username, email, password, created_at, updated_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return UserModel.fromDatabase(result.rows[0]);
  }

  public async create(username: string, email: string, hashedPassword: string): Promise<UserModel> {
    const result = await this.databaseService.getPool().query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at, updated_at',
      [username, email, hashedPassword]
    );

    return UserModel.fromDatabase(result.rows[0]);
  }
} 