import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@prisma/client";
import { createHash } from "crypto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateAvatarReturnDto } from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async changeAvatarURI(userId: string): Promise<UpdateAvatarReturnDto> {
    //Check if the user exists
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const newUri = this.generateAvatarURI();
    const updatedUser = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarURI: newUri,
      },
    });

    return {
      avatarURI: updatedUser.avatarURI,
    };
  }

  generateAvatarURI(): string {
    //Using Gravatar as the main source and DiceBear as falback
    return `https://avatars.dicebear.com/api/gridy/${new Date().getTime()}.svg`;
  }
}
