// control

define(["coreJS/adapt", "coreViews/componentView"], function(Adapt, ComponentView) {
  var MemoView = ComponentView.extend({
        initialize: function(){},
        preRender:  function(){},
        postRender: function(){},
        preRemove:  function(){}
  });

    Adapt.register("memo", MemoView);
    return MemoView;
});
