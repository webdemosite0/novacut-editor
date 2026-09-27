const { app, BrowserWindow, shell, ipcMain, protocol } = require("electron");
const path = require("path");
const fs = require("fs");

let win;

protocol.registerSchemesAsPrivileged([
  {
    scheme: "novacut",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true
    }
  }
]);

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ({
    ".html":"text/html; charset=utf-8",
    ".js":"text/javascript; charset=utf-8",
    ".mjs":"text/javascript; charset=utf-8",
    ".css":"text/css; charset=utf-8",
    ".json":"application/json; charset=utf-8",
    ".svg":"image/svg+xml",
    ".png":"image/png",
    ".jpg":"image/jpeg",
    ".jpeg":"image/jpeg",
    ".webp":"image/webp",
    ".ico":"image/x-icon",
    ".woff":"font/woff",
    ".woff2":"font/woff2",
    ".ttf":"font/ttf",
    ".map":"application/json"
  })[ext] || "application/octet-stream";
}

async function serveDesktopAsset(request) {
  try {
    const root = path.resolve(__dirname, "..", "out");
    const url = new URL(request.url);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === "/" || pathname.endsWith("/")) pathname += "index.html";

    const target = path.resolve(root, "." + pathname);
    if (!target.startsWith(root)) return new Response("Forbidden", { status: 403 });

    const data = await fs.promises.readFile(target);
    return new Response(data, {
      status: 200,
      headers: {
        "content-type": contentType(target),
        "cache-control": "no-cache"
      }
    });
  } catch (error) {
    return new Response("Not found", { status: 404 });
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1600,
    height: 980,
    minWidth: 1180,
    minHeight: 720,
    backgroundColor: "#090b0f",
    title: "NovaCut",
    autoHideMenuBar: true,
    show: false,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.once("ready-to-show", () => {
    win.show();
    win.focus();
  });

  win.loadURL("novacut://app/editor/");

  win.webContents.on("did-fail-load", (_event, code, description, url) => {
    console.error("NovaCut failed to load:", { code, description, url });
  });

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

app.whenReady().then(async () => {
  protocol.handle("novacut", serveDesktopAsset);
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
