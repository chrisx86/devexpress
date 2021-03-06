import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["defaultPageIndex", "hasKnownLastPage", "isLargeDisplayMode", "maxPagesCount", "pageCount", "pageIndex", "pageIndexChange", "pagesCountText", "showNavigationButtons", "totalCount"];
import { createFragment, createComponentVNode } from "inferno";
import { Fragment } from "inferno";
import { BaseInfernoComponent } from "@devextreme/vdom";
import { LightButton } from "../common/light_button";
import { PagesLarge } from "./large";
import { PagesSmall } from "./small";
import { PagerProps } from "../common/pager_props";
import { ConfigContext } from "../../../common/config_context";
var PAGER_NAVIGATE_BUTTON = "dx-navigate-button";
var PAGER_PREV_BUTTON_CLASS = "dx-prev-button";
var PAGER_NEXT_BUTTON_CLASS = "dx-next-button";
export var PAGER_BUTTON_DISABLE_CLASS = "dx-button-disable";
var nextButtonClassName = "".concat(PAGER_NAVIGATE_BUTTON, " ").concat(PAGER_NEXT_BUTTON_CLASS);
var prevButtonClassName = "".concat(PAGER_NAVIGATE_BUTTON, " ").concat(PAGER_PREV_BUTTON_CLASS);
var nextButtonDisabledClassName = "".concat(PAGER_BUTTON_DISABLE_CLASS, " ").concat(PAGER_NAVIGATE_BUTTON, " ").concat(PAGER_NEXT_BUTTON_CLASS);
var prevButtonDisabledClassName = "".concat(PAGER_BUTTON_DISABLE_CLASS, " ").concat(PAGER_NAVIGATE_BUTTON, " ").concat(PAGER_PREV_BUTTON_CLASS);
export var viewFunction = _ref => {
  var {
    navigateToNextPage,
    navigateToPrevPage,
    nextClassName,
    pageIndexChange,
    prevClassName,
    props: {
      isLargeDisplayMode,
      maxPagesCount,
      pageCount,
      pageIndex,
      pagesCountText
    },
    renderNextButton,
    renderPrevButton
  } = _ref;
  return createFragment([renderPrevButton && createComponentVNode(2, LightButton, {
    "className": prevClassName,
    "label": "Previous page",
    "onClick": navigateToPrevPage
  }), isLargeDisplayMode && createComponentVNode(2, PagesLarge, {
    "maxPagesCount": maxPagesCount,
    "pageCount": pageCount,
    "pageIndex": pageIndex,
    "pageIndexChange": pageIndexChange
  }), !isLargeDisplayMode && createComponentVNode(2, PagesSmall, {
    "pageCount": pageCount,
    "pageIndex": pageIndex,
    "pageIndexChange": pageIndexChange,
    "pagesCountText": pagesCountText
  }), renderNextButton && createComponentVNode(2, LightButton, {
    "className": nextClassName,
    "label": "Next page",
    "onClick": navigateToNextPage
  })], 0);
};

function getIncrement(direction) {
  return direction === "next" ? +1 : -1;
}

export var PageIndexSelectorProps = {
  isLargeDisplayMode: true
};
var PageIndexSelectorPropsType = {
  maxPagesCount: PagerProps.maxPagesCount,
  pageCount: PagerProps.pageCount,
  hasKnownLastPage: PagerProps.hasKnownLastPage,
  showNavigationButtons: PagerProps.showNavigationButtons,
  totalCount: PagerProps.totalCount,
  isLargeDisplayMode: PageIndexSelectorProps.isLargeDisplayMode,
  defaultPageIndex: PagerProps.pageIndex
};
export class PageIndexSelector extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this._currentState = null;
    this.state = {
      pageIndex: this.props.pageIndex !== undefined ? this.props.pageIndex : this.props.defaultPageIndex
    };
    this.getNextDirection = this.getNextDirection.bind(this);
    this.getPrevDirection = this.getPrevDirection.bind(this);
    this.canNavigateToPage = this.canNavigateToPage.bind(this);
    this.getNextPageIndex = this.getNextPageIndex.bind(this);
    this.canNavigateTo = this.canNavigateTo.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);
    this.pageIndexChange = this.pageIndexChange.bind(this);
    this.navigateToNextPage = this.navigateToNextPage.bind(this);
    this.navigateToPrevPage = this.navigateToPrevPage.bind(this);
  }

  get config() {
    if ("ConfigContext" in this.context) {
      return this.context.ConfigContext;
    }

    return ConfigContext;
  }

  get __state_pageIndex() {
    var state = this._currentState || this.state;
    return this.props.pageIndex !== undefined ? this.props.pageIndex : state.pageIndex;
  }

  set_pageIndex(value) {
    this.setState(state => {
      var _this$props$pageIndex, _this$props;

      this._currentState = state;
      var newValue = value();
      (_this$props$pageIndex = (_this$props = this.props).pageIndexChange) === null || _this$props$pageIndex === void 0 ? void 0 : _this$props$pageIndex.call(_this$props, newValue);
      this._currentState = null;
      return {
        pageIndex: newValue
      };
    });
  }

  getNextDirection() {
    var _this$config;

    return !((_this$config = this.config) !== null && _this$config !== void 0 && _this$config.rtlEnabled) ? "next" : "prev";
  }

  getPrevDirection() {
    var _this$config2;

    return !((_this$config2 = this.config) !== null && _this$config2 !== void 0 && _this$config2.rtlEnabled) ? "prev" : "next";
  }

  canNavigateToPage(pageIndex) {
    if (!this.props.hasKnownLastPage) {
      return pageIndex >= 0;
    }

    return pageIndex >= 0 && pageIndex <= this.props.pageCount - 1;
  }

  getNextPageIndex(direction) {
    return this.__state_pageIndex + getIncrement(direction);
  }

  canNavigateTo(direction) {
    return this.canNavigateToPage(this.getNextPageIndex(direction));
  }

  navigateToPage(direction) {
    this.pageIndexChange(this.getNextPageIndex(direction));
  }

  get renderPrevButton() {
    var {
      isLargeDisplayMode,
      showNavigationButtons
    } = this.props;
    return !isLargeDisplayMode || showNavigationButtons;
  }

  get renderNextButton() {
    return this.renderPrevButton || !this.props.hasKnownLastPage;
  }

  get nextClassName() {
    var direction = this.getNextDirection();
    var canNavigate = this.canNavigateTo(direction);
    return canNavigate ? nextButtonClassName : nextButtonDisabledClassName;
  }

  get prevClassName() {
    var direction = this.getPrevDirection();
    var canNavigate = this.canNavigateTo(direction);
    return canNavigate ? prevButtonClassName : prevButtonDisabledClassName;
  }

  pageIndexChange(pageIndex) {
    if (this.canNavigateToPage(pageIndex)) {
      this.set_pageIndex(() => pageIndex);
    }
  }

  navigateToNextPage() {
    this.navigateToPage(this.getNextDirection());
  }

  navigateToPrevPage() {
    this.navigateToPage(this.getPrevDirection());
  }

  get restAttributes() {
    var _this$props$pageIndex2 = _extends({}, this.props, {
      pageIndex: this.__state_pageIndex
    }),
        restProps = _objectWithoutPropertiesLoose(_this$props$pageIndex2, _excluded);

    return restProps;
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        pageIndex: this.__state_pageIndex
      }),
      config: this.config,
      renderPrevButton: this.renderPrevButton,
      renderNextButton: this.renderNextButton,
      nextClassName: this.nextClassName,
      prevClassName: this.prevClassName,
      pageIndexChange: this.pageIndexChange,
      navigateToNextPage: this.navigateToNextPage,
      navigateToPrevPage: this.navigateToPrevPage,
      restAttributes: this.restAttributes
    });
  }

}
PageIndexSelector.defaultProps = _extends({}, PageIndexSelectorPropsType);