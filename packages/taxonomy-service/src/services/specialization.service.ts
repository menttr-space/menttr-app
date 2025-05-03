import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Specialization } from "src/entities/specialization.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class SpecializationService {
  constructor(
    @InjectRepository(Specialization)
    private readonly specializationRepository: Repository<Specialization>,
  ) {}

  findAll() {
    return this.specializationRepository.find();
  }

  findById(id: string) {
    return this.specializationRepository.findBy({ id });
  }

  findByIds(ids: string[]) {
    return this.specializationRepository.find({
      where: { id: In(ids) },
    });
  }
}
