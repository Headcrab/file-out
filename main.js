/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => MainPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian6 = require("obsidian");

// src/FileTablePlugin.ts
var import_obsidian5 = require("obsidian");

// src/services/FileService.ts
var import_obsidian = require("obsidian");

// src/services/MetadataService.ts
var MetadataService = class {
  constructor(vault) {
    this.vault = vault;
  }
  async getFileInfo(file) {
    const stat = await this.vault.adapter.stat(file.path);
    if (!stat) {
      throw new Error(`Unable to get stats for file: ${file.path}`);
    }
    return {
      name: file.name,
      extension: file.extension,
      createdAt: new Date(stat.ctime),
      modifiedAt: new Date(stat.mtime),
      size: stat.size,
      path: file.path
    };
  }
};

// src/services/FileService.ts
var FileService = class {
  constructor(vault, app) {
    this.vault = vault;
    this.app = app;
    this.metadataService = new MetadataService(vault);
  }
  async getFilesInFolder(folderPath, extensions) {
    const files = this.vault.getFiles().filter((file) => {
      const isInFolder = file.path.startsWith(folderPath);
      const hasCorrectExtension = extensions.includes(file.extension);
      return isInFolder && hasCorrectExtension;
    });
    const uniqueFiles = /* @__PURE__ */ new Map();
    files.forEach((file) => {
      if (!uniqueFiles.has(file.path)) {
        uniqueFiles.set(file.path, file);
      }
    });
    const fileInfoPromises = Array.from(uniqueFiles.values()).map((file) => this.metadataService.getFileInfo(file));
    return Promise.all(fileInfoPromises);
  }
  openFile(path) {
    const file = this.vault.getAbstractFileByPath(path);
    if (file instanceof import_obsidian.TFile) {
      this.app.workspace.getLeaf(false).openFile(file);
    }
  }
};

// src/services/FolderService.ts
var import_obsidian2 = require("obsidian");
var FolderService = class {
  constructor(vault) {
    this.vault = vault;
  }
  async getFolders(searchTerm) {
    const allFolders = this.getAllFolders();
    return allFolders.filter(
      (folder) => this.folderMatchesSearch(folder.path, folder.name, searchTerm)
    );
  }
  getAllFolders() {
    const folders = [];
    this.traverseFolders(this.vault.getRoot(), folders);
    return folders;
  }
  traverseFolders(folder, result) {
    result.push({ name: folder.name, path: folder.path });
    folder.children.forEach((child) => {
      if (child instanceof import_obsidian2.TFolder) {
        this.traverseFolders(child, result);
      }
    });
  }
  folderMatchesSearch(path, name, searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return path.toLowerCase().includes(lowerSearchTerm) || name.toLowerCase().includes(lowerSearchTerm);
  }
};

// src/ui/FileTable.ts
var import_obsidian3 = require("obsidian");
var FileTable = class extends import_obsidian3.Component {
  constructor(containerEl, onFileOpen) {
    super();
    this.containerEl = containerEl;
    this.onFileOpen = onFileOpen;
    this.files = [];
    this.filteredFiles = [];
    this.groupByFolder = true;
    this.sortColumn = "name";
    this.sortDirection = "asc";
    this.filters = {};
  }
  setFiles(files) {
    console.log("Setting files:", files);
    this.files = files;
    this.applyFiltersAndSort();
    this.render();
  }
  setGroupByFolder(groupByFolder) {
    this.groupByFolder = groupByFolder;
    this.applyFiltersAndSort();
    this.render();
  }
  render() {
    console.log("Rendering table with files:", this.filteredFiles);
    this.containerEl.empty();
    this.containerEl.addClass("file-table-container");
    const table = this.containerEl.createEl("table", { cls: "file-table" });
    this.renderHeader(table);
    this.renderBody(table);
  }
  renderHeader(table) {
    const header = table.createTHead().insertRow();
    const columns = ["name", "extension", "createdAt", "modifiedAt", "size", "path"];
    columns.forEach((column) => {
      const th = header.createEl("th");
      const filterInput = th.createEl("input", {
        type: "text",
        placeholder: `\u0424\u0438\u043B\u044C\u0442\u0440 ${column}`,
        value: this.filters[column] || ""
      });
      filterInput.addEventListener("input", (e) => this.setFilter(column, e.target.value));
      const sortButton = th.createEl("button", { text: column });
      sortButton.addEventListener("click", () => this.sortBy(column));
      if (column === this.sortColumn) {
        sortButton.addClass("sort-indicator");
        if (this.sortDirection === "desc") {
          sortButton.addClass("desc");
        }
      }
    });
  }
  setFilter(column, value) {
    this.filters[column] = value;
    this.applyFiltersAndSort();
    this.render();
  }
  applyFiltersAndSort() {
    this.filteredFiles = this.files.filter(
      (file) => Object.entries(this.filters).every(([column, filterValue]) => {
        if (!filterValue)
          return true;
        const fileValue = file[column];
        return fileValue.toString().toLowerCase().includes(filterValue.toLowerCase());
      })
    );
    this.filteredFiles.sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];
      if (aValue < bValue)
        return this.sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue)
        return this.sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }
  renderBody(table) {
    const body = table.createTBody();
    const groupedFiles = this.groupByFolder ? this.groupFilesByFolder(this.filteredFiles) : { "\u0412\u0441\u0435 \u0444\u0430\u0439\u043B\u044B": this.filteredFiles };
    console.log("Grouped files:", groupedFiles);
    Object.entries(groupedFiles).forEach(([folder, files]) => {
      if (this.groupByFolder || folder === "\u0412\u0441\u0435 \u0444\u0430\u0439\u043B\u044B") {
        const folderRow = body.insertRow();
        folderRow.createEl("td", { attr: { colspan: "6" }, text: folder, cls: "folder-header" });
      }
      files.forEach((file) => {
        const row = body.insertRow();
        Object.values(file).forEach((value) => {
          const cell = row.insertCell();
          cell.textContent = value instanceof Date ? value.toLocaleString() : value.toString();
        });
        row.addEventListener("click", () => this.onFileOpen(file.path));
      });
    });
  }
  getSortedFiles() {
    return [...this.files].sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];
      if (aValue < bValue)
        return this.sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue)
        return this.sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }
  groupFilesByFolder(files) {
    return files.reduce((acc, file) => {
      const folderPath = file.path.split("/").slice(0, -1).join("/");
      const folder = folderPath || "\u041A\u043E\u0440\u043D\u0435\u0432\u0430\u044F \u043F\u0430\u043F\u043A\u0430";
      if (!acc[folder])
        acc[folder] = [];
      acc[folder].push(file);
      return acc;
    }, {});
  }
  sortBy(column) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }
    this.applyFiltersAndSort();
    this.render();
  }
};

// src/ui/SettingsTab.ts
var import_obsidian4 = require("obsidian");
var SettingsTab = class extends import_obsidian4.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian4.Setting(containerEl).setName("\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u044F \u0444\u0430\u0439\u043B\u043E\u0432").setDesc("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u044F \u0444\u0430\u0439\u043B\u043E\u0432 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: pdf,cdr,eps)").addText((text) => text.setPlaceholder("pdf,cdr,eps").setValue(this.plugin.settings.fileExtensions.join(",")).onChange(async (value) => {
      this.plugin.settings.fileExtensions = value.split(",").map((ext) => ext.trim());
      await this.plugin.saveSettings();
    }));
    new import_obsidian4.Setting(containerEl).setName("\u0413\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E \u043F\u0430\u043F\u043A\u0430\u043C").setDesc("\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u043A\u0443 \u0444\u0430\u0439\u043B\u043E\u0432 \u043F\u043E \u043F\u0430\u043F\u043A\u0430\u043C").addToggle((toggle) => toggle.setValue(this.plugin.settings.groupByFolder).onChange(async (value) => {
      this.plugin.settings.groupByFolder = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian4.Setting(containerEl).setName("\u041C\u0435\u0441\u0442\u043E \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u044F").setDesc("\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435, \u0433\u0434\u0435 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0442\u044C \u0442\u0430\u0431\u043B\u0438\u0446\u0443 \u0444\u0430\u0439\u043B\u043E\u0432").addDropdown((dropdown) => dropdown.addOption("left", "\u0421\u043B\u0435\u0432\u0430").addOption("right", "\u0421\u043F\u0440\u0430\u0432\u0430").addOption("main", "\u0412 \u0433\u043B\u0430\u0432\u043D\u043E\u043C \u043E\u043A\u043D\u0435").setValue(this.plugin.settings.openLocation).onChange(async (value) => {
      this.plugin.settings.openLocation = value;
      await this.plugin.saveSettings();
    }));
  }
};

// src/FileTablePlugin.ts
var DEFAULT_SETTINGS = {
  fileExtensions: ["pdf", "cdr", "eps", "png", "jpg", "doc", "docx"],
  groupByFolder: true,
  openLocation: "right"
};
var FileTablePlugin = class extends import_obsidian5.Plugin {
  async onload() {
    await this.loadSettings();
    this.fileService = new FileService(this.app.vault, this.app);
    this.folderService = new FolderService(this.app.vault);
    this.addSettingTab(new SettingsTab(this.app, this));
    this.registerView(FILE_TABLE_VIEW_TYPE, (leaf) => {
      this.fileTableView = new FileTableView(leaf, this);
      return this.fileTableView;
    });
    this.addRibbonIcon("table", "Open File Table", () => {
      this.activateView();
    });
    this.app.workspace.onLayoutReady(() => {
      this.activateView();
    });
    this.registerEvent(this.app.vault.on("create", () => this.updateFileTable()));
    this.registerEvent(this.app.vault.on("delete", () => this.updateFileTable()));
    this.registerEvent(this.app.vault.on("rename", () => this.updateFileTable()));
    this.registerEvent(this.app.vault.on("modify", () => this.updateFileTable()));
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
    this.updateFileTable();
  }
  async updateFileTable() {
    if (this.fileTableView) {
      const files = await this.getFilesInFolder("", this.settings.fileExtensions);
      this.fileTableView.updateFileTable(files, this.settings.groupByFolder);
    }
  }
  async activateView() {
    const { workspace } = this.app;
    let leaf = null;
    const leaves = workspace.getLeavesOfType(FILE_TABLE_VIEW_TYPE);
    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getLeaf(false);
      await leaf.setViewState({ type: FILE_TABLE_VIEW_TYPE, active: true });
    }
    workspace.revealLeaf(leaf);
  }
  // Публичные методы для доступа к функциональности fileService
  async getFilesInFolder(folderPath, extensions) {
    return this.fileService.getFilesInFolder(folderPath, extensions);
  }
  openFile(path) {
    this.fileService.openFile(path);
  }
};
var FILE_TABLE_VIEW_TYPE = "file-table-view";
var FileTableView = class extends import_obsidian5.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return FILE_TABLE_VIEW_TYPE;
  }
  getDisplayText() {
    return "File Table";
  }
  async onOpen() {
    this.fileTable = new FileTable(this.containerEl, (path) => this.plugin.openFile(path));
    await this.updateFileTable();
  }
  async onClose() {
  }
  async updateFileTable(files, groupByFolder) {
    if (!files) {
      files = await this.plugin.getFilesInFolder("", this.plugin.settings.fileExtensions);
    }
    if (groupByFolder === void 0) {
      groupByFolder = this.plugin.settings.groupByFolder;
    }
    this.fileTable.setFiles(files);
    this.fileTable.setGroupByFolder(groupByFolder);
  }
};

// src/main.ts
var MainPlugin = class extends import_obsidian6.Plugin {
  async onload() {
    this.fileTablePlugin = new FileTablePlugin(this.app, this.manifest);
    await this.fileTablePlugin.onload();
  }
  async onunload() {
    await this.fileTablePlugin.onunload();
  }
};
