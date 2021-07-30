import User from "../models/UserModel";
import Account from "../models/AccountModel";

interface ISimplifiedAccount {
  id: string;
  name: string;
  color?: string;
  value: number;
}

async function getAllAccounts(
  userId: string
): Promise<{
  error: boolean;
  errorCode?: string;
  data?: ISimplifiedAccount[];
}> {
  if (!userId) return { error: true, errorCode: "MISSING_USERID" };

  let user: any = await User.findOne({
    where: {
      id: userId,
    },
    include: Account,
  });

  if (!user) {
    return { error: true, errorCode: "WRONG_USERID" };
  }

  let accounts = user?.Accounts?.map(({ id, name, color, value }) => {
    return { id, name, color, value };
  });

  return { error: false, data: accounts || null };
}

export { getAllAccounts };
