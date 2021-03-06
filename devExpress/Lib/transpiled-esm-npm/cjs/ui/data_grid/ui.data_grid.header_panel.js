"use strict";

exports.HeaderPanel = void 0;

var _uiData_grid = _interopRequireDefault(require("./ui.data_grid.core"));

var _uiGrid_core = require("../grid_core/ui.grid_core.header_panel");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HeaderPanel = _uiGrid_core.headerPanelModule.views.headerPanel;
exports.HeaderPanel = HeaderPanel;

_uiData_grid.default.registerModule('headerPanel', _uiGrid_core.headerPanelModule);