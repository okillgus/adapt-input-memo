// control

define(["coreJS/adapt", "coreViews/componentView"], function(Adapt, ComponentView) {
  var MemoView = ComponentView.extend({
        initialize: function(){
          // ???
        },
        preRender:  function(){
          // Daten aus DB: topic, inputId
          // Objekt konstruieren
          // memoText belegen 
        },
        postRender: function(){
          // css? 
          this.setReadyStatus();
        },
        preRemove:  function(){
          // Daten sichern ?
        }
  },
    {
        template: 'memo'
    });

    Adapt.register("memo", MemoView);
    return MemoView;
});
