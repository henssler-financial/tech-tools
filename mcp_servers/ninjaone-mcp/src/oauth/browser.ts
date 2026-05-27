// Cross-platform "open URL in default browser".
import { spawn } from "node:child_process";
import { platform } from "node:os";

export function openInBrowser(url: string): void {
  const p = platform();
  let cmd: string;
  let args: string[];
  if (p === "darwin") {
    cmd = "open";
    args = [url];
  } else if (p === "win32") {
    cmd = "cmd";
    // /c start "" "url" — the empty title arg is required when the URL is quoted
    args = ["/c", "start", "", url];
  } else {
    cmd = "xdg-open";
    args = [url];
  }
  const child = spawn(cmd, args, { detached: true, stdio: "ignore" });
  child.unref();
}
