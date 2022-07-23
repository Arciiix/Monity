// Since there's no usePrompt hook in the react-router-dom v6, I had to create my own version of it (as everyone using v6)

import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function useBlocker(blocker: (tx: any) => void, isBlocking: boolean) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!isBlocking) return;

    const unblock = (navigator as any).block((tx: any) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, isBlocking]);
}

export default function useBlockingPrompt(
  isBlocking: boolean,
  ask: () => Promise<boolean>
) {
  const blocker = async (tx: any) => {
    const answer = await ask();
    if (answer) tx.retry();
  };

  useBlocker(blocker, isBlocking);
}
