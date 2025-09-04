import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User, UserRole } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly jwtService: JwtService,
    ) {}

    async registerUser(userDto:RegisterUserDto){
        try {
            const {email, password} = userDto;
            const existingUser = await this.userRepository.findOne({ where: { email } });
            if (existingUser) {
                throw new BadRequestException('User already exists');
            }
            const saltOrRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltOrRounds);
            // const newUser = await this.userRepository.create({ email, password: hashedPassword, role: UserRole.USER });
            return await this.userRepository.save({ email, password: hashedPassword, role: UserRole.USER });
            
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    async loginUser(userDto:RegisterUserDto){
        try {
            const {email, password} = userDto;
            const user = await this.userRepository.findOne({ where: { email } });
            if (!user) {
                throw new BadRequestException('Invalid credentials');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new BadRequestException('Invalid credentials');
            }
            const payload = { email: user.email, sub: user.id, role: user.role };
            const token = await this.jwtService.signAsync(payload);
            return { access_token: token };
            
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
            
        }
    }
}
