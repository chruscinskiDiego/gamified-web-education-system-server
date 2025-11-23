import { Body, Controller, HttpCode, HttpStatus, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() loginDTO: LoginDTO) {

        return this.authService.login(loginDTO);

    }

}