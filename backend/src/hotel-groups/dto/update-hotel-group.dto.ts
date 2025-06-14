import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelGroupDto } from './create-hotel-group.dto';

export class UpdateHotelGroupDto extends PartialType(CreateHotelGroupDto) {}
