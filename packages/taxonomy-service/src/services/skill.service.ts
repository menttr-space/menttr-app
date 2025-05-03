import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Skill } from "src/entities/skill.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  findAll() {
    return this.skillRepository.find();
  }

  findById(id: string) {
    return this.skillRepository.findBy({ id });
  }

  findByIds(ids: string[]) {
    return this.skillRepository.find({
      where: { id: In(ids) },
    });
  }
}
