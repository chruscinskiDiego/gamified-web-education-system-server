import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";
//import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
//import { DOC_AUTH_DESCRIPTION, DOC_AUTH_SUMMARY, DOC_AUTH_TAG } from "src/doc/swagger-consts";
//import { AuthGuard } from "@nestjs/passport";


//@ApiTags(DOC_AUTH_TAG)
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    //@ApiBody({ description: DOC_AUTH_DESCRIPTION, type: LoginDTO })
    //@ApiOperation({ summary: DOC_AUTH_SUMMARY })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() loginDTO: LoginDTO) {

        //return this.authService.login(loginDTO);

        return "login successful";

    }

}