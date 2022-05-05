import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "@prisma/client";
import { authenticator } from "otplib";
import { PrismaService } from "src/prisma/prisma.service";
import { TwoFaDto } from "./dto/twoFa.dto";
import { toFileStream } from "qrcode";

@Injectable()
export class TwoFaService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private logger: Logger
  ) {}

  async get2FAInfoOrGenerate(user: User): Promise<TwoFaDto> {
    if (user.twoFaSecret) {
      return {
        secret: user.twoFaSecret,
        otpauthUrl: authenticator.keyuri(
          user.login,
          "Monity",
          user.twoFaSecret
        ),
      };
    } else {
      return await this.generate2FASecret(user);
    }
  }

  async generate2FASecret(user: User): Promise<TwoFaDto> {
    const secret = await authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(user.login, "Monity", secret);

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        twoFaSecret: secret,
      },
    });

    return { secret, otpauthUrl };
  }

  async validate2FACode(user: User, code: string): Promise<boolean> {
    return authenticator.verify({
      token: code,
      secret: user.twoFaSecret,
    });
  }
  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }
}
