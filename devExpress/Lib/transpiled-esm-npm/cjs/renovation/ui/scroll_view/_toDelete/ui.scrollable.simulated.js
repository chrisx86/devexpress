"use strict";

exports.SimulatedStrategy = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _class = _interopRequireDefault(require("../../core/class"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SCROLLABLE_SIMULATED = 'dxSimulatedScrollable';
var SCROLLABLE_STRATEGY = 'dxScrollableStrategy';
var SCROLLABLE_SIMULATED_CURSOR = SCROLLABLE_SIMULATED + 'Cursor';
var SCROLLABLE_SIMULATED_KEYBOARD = SCROLLABLE_SIMULATED + 'Keyboard';
var SCROLLABLE_SIMULATED_CLASS = 'dx-scrollable-simulated';
var hoveredScrollable;
var activeScrollable;

var SimulatedStrategy = _class.default.inherit({
  _saveActive: function _saveActive() {
    activeScrollable = this;
  },
  _resetActive: function _resetActive() {
    if (activeScrollable === this) {
      activeScrollable = null;
    }
  },
  handleMove: function handleMove(e) {
    if (this._isLocked()) {
      this._resetActive();

      return;
    }

    this._saveActive();
  },
  handleEnd: function handleEnd(e) {
    this._resetActive();

    this._refreshCursorState(e.originalEvent && e.originalEvent.target);
  },
  handleCancel: function handleCancel(e) {
    this._resetActive();
  },
  handleStop: function handleStop() {
    this._resetActive();
  },
  handleScroll: function handleScroll() {
    this._component._updateRtlConfig();
  },
  _cursorEnterHandler: function _cursorEnterHandler(e) {
    e = e || {};
    e.originalEvent = e.originalEvent || {};

    if (activeScrollable || e.originalEvent._hoverHandled) {
      return;
    }

    if (hoveredScrollable) {
      hoveredScrollable._cursorLeaveHandler();
    }

    hoveredScrollable = this;

    this._eventHandler('cursorEnter');

    e.originalEvent._hoverHandled = true;
  },
  _cursorLeaveHandler: function _cursorLeaveHandler(e) {
    if (hoveredScrollable !== this || activeScrollable === hoveredScrollable) {
      return;
    }

    this._eventHandler('cursorLeave');

    hoveredScrollable = null;

    this._refreshCursorState(e && e.relatedTarget);
  },
  _refreshCursorState: function _refreshCursorState(target) {
    if (!this._isHoverMode() && (!target || activeScrollable)) {
      return;
    }

    var $target = (0, _renderer.default)(target);
    var $scrollable = $target.closest(".".concat(SCROLLABLE_SIMULATED_CLASS, ":not(.dx-state-disabled)"));
    var targetScrollable = $scrollable.length && $scrollable.data(SCROLLABLE_STRATEGY);

    if (hoveredScrollable && hoveredScrollable !== targetScrollable) {
      hoveredScrollable._cursorLeaveHandler();
    }

    if (targetScrollable) {
      targetScrollable._cursorEnterHandler();
    }
  },
  dispose: function dispose() {
    this._resetActive();

    if (hoveredScrollable === this) {
      hoveredScrollable = null;
    }

    this._eventHandler('dispose');

    this._detachEventHandlers();

    this._$element.removeClass(SCROLLABLE_SIMULATED_CLASS);

    this._eventForUserAction = null;
    clearTimeout(this._validateWheelTimer);
    clearTimeout(this._updateHandlerTimeout);
  },
  _detachEventHandlers: function _detachEventHandlers() {
    _events_engine.default.off(this._$element, ".".concat(SCROLLABLE_SIMULATED_CURSOR));

    _events_engine.default.off(this._$container, ".".concat(SCROLLABLE_SIMULATED_KEYBOARD));
  }
});

exports.SimulatedStrategy = SimulatedStrategy;