import { useBlocker } from "react-router-dom";

export function useNavigationGuard(shouldBlock: boolean) {
  useBlocker(() => {
    if (shouldBlock) {
      return !window.confirm(
      "  You have unsaved changes. Are you sure you want to leave this page?"
      );
    }
    return false;
  });
}
