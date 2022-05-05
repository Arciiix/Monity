import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "@prisma/client";
import { authenticator } from "otplib";
import { PrismaService } from "src/prisma/prisma.service";
import { TwoFaDto, TwoFaStatus } from "./dto/twoFa.dto";
import { toFileStream } from "qrcode";
import { Timestamp } from "src/global.dto";
import { Response } from "express";
import * as crypto from "crypto";

@Injectable()
export class TwoFaService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private logger: Logger
  ) {}

  get2FAStatus(user: User): TwoFaStatus {
    return {
      isEnabled: !!user.twoFaSecret,
      data: !!user.twoFaSecret && {
        secret: user.twoFaSecret,
        otpauthUrl: authenticator.keyuri(
          user.email,
          "Monity",
          user.twoFaSecret
        ),
        recoveryCode: user.twoFaRecoveryCode,
      },
    };
  }

  async toggle2FA(
    user: User,
    isTurnedOn: boolean,
    code?: string
  ): Promise<(TwoFaDto & Timestamp) | Timestamp> {
    if (!isTurnedOn || isTurnedOn.toString() === "false") {
      if (!!user.twoFaSecret) {
        if (code) {
          const isValid = this.validate2FACode(user, code);
          if (!isValid) {
            throw new ForbiddenException("Invalid 2FA code");
          }
        } else {
          throw new ForbiddenException("Missing 2FA code");
        }

        await this.prismaService.user.update({
          where: {
            id: user.id,
          },
          data: {
            twoFaSecret: null,
          },
        });
      }

      return { timestamp: new Date() };
    } else {
      const data = await this.get2FAInfoOrGenerate(user);

      return { ...data, ...{ timestamp: new Date() } };
    }
  }

  async get2FAInfoOrGenerate(user: User): Promise<TwoFaDto> {
    if (user.twoFaSecret) {
      return {
        secret: user.twoFaSecret,
        otpauthUrl: authenticator.keyuri(
          user.login,
          "Monity",
          user.twoFaSecret
        ),
        recoveryCode: user.twoFaRecoveryCode,
      };
    } else {
      return await this.generate2FASecret(user);
    }
  }

  async generate2FASecret(user: User): Promise<TwoFaDto> {
    const secret = await authenticator.generateSecret();

    const recoveryCode = crypto.randomBytes(16).toString("hex");

    const otpauthUrl = authenticator.keyuri(user.login, "Monity", secret);

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        twoFaSecret: secret,
        twoFaRecoveryCode: recoveryCode,
      },
    });

    return { secret, otpauthUrl, recoveryCode };
  }

  async validate2FACode(user: User, code: string): Promise<boolean> {
    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFaSecret,
    });

    if (!isValid) {
      return code === user.twoFaRecoveryCode;
    } else {
      return isValid;
    }
  }
  async pipeQrCodeStream(stream: Response, login: string, secret: string) {
    const otpauthUrl = authenticator.keyuri(login, "Monity", secret);

    return toFileStream(stream, otpauthUrl);
  }
}
