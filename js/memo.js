define(function(require) {

  var ComponentView = require('coreViews/componentView');
  var Adapt = require('coreJS/adapt');

  var Memo = ComponentView.extend({

      preRender: function() {
          // this.checkIfResetOnRevisit();
      },

      postRender: function() {
          this.setReadyStatus();

          // this.setupInview();
      }
  },
  {
      template: 'memo'
  });

  Adapt.register('memo', Memo);

  return Memo;
});
