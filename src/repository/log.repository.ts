import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Log } from "src/modules/logs/domain/entities/log.entity";


@Injectable()
export class LogRepository {
  constructor(
    @InjectRepository(Log)
    private readonly repo: Repository<Log>,
  ) { }
  
  saveLog(log: Partial<Log>) {
    return this.repo.save(log);
  }
}
