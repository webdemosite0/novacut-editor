const { app, BrowserWindow, shell, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1600,
    height: 980,
    minWidth: 1180,
    minHeight: 720,
    backgroundColor: "#090b0f",
    title: "NovaCut",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  const editorPath = path.join(__dirname, "..", "out", "editor", "index.html");
  win.loadFile(editorPath);
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
}

ipcMain.handle("novacut:get-path", (_event, key) => {
  const allowed = new Set(["documents","videos","downloads","userData"]);
  return allowed.has(key) ? app.getPath(key) : null;
});

ipcMain.handle("novacut:save-project", async (_event, name, contents) => {
  const safe = String(name || "Untitled").replace(/[^a-z0-9-_ ]/gi, "_");
  const dir = path.join(app.getPath("documents"), "NovaCut Projects");
  fs.mkdirSync(dir, { recursive: true });
  const target = path.join(dir, safe + ".novacut");
  fs.writeFileSync(target, String(contents), "utf8");
  return target;
});

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
