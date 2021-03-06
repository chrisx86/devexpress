import Quill from 'devextreme-quill';
import EmptyModule from './empty';
var BaseModule = EmptyModule;

if (Quill) {
  var BaseQuillModule = Quill.import('core/module');
  BaseModule = class BaseHtmlEditorModule extends BaseQuillModule {
    constructor(quill, options) {
      super(quill, options);
      this.editorInstance = options.editorInstance;
    }

    saveValueChangeEvent(event) {
      this.editorInstance._saveValueChangeEvent(event);
    }

    addCleanCallback(callback) {
      this.editorInstance.addCleanCallback(callback);
    }

  };
}

export default BaseModule;