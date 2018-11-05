define(function(require) {
 
  var ComponentView = require('coreViews/componentView');
  var Adapt = require('coreJS/adapt');

  var inputMemo = ComponentView.extend({

      events: {
        "change .memo-text": "saveMemo",
        "click .resetMemo": "resetMemo",
        "click .clearMemo": "clearMemo"
      },

      preRender: function() {
          // this.checkIfResetOnRevisit();
          var id = "input-memo_"+String(Math.random()).substr(2);
          this.model.set('id', id); // instance id
          var message = this.model.get("message");
          this.model.set('resetMessage', message);

          this.initData();
          this.listenTo(Adapt, {
            "input-memo:saved": this.notify
            });
      },

      postRender: function() {
        if (this.model.get('modus')){
          this.displayData();
        }
        this.setReadyStatus();
      },

      triggerSignal: function(){
         Adapt.trigger("input-memo:saved", {
          "topic": this.model.get('topic'), 
          "inputId": this.model.get('inputId'),
          "id": this.model.get('id')
          });
      },

      notify: function(param){
        // @param := model.id
        var topic = this.model.get('topic');
        var inputId = this.model.get('inputId');
        var id = this.model.get('id');
        if (topic == param.topic && ( inputId == param.inputId || this.model.get('modus') ) && id != param.id){ // Changes here or elsewhere?
          this.update();
        }
      },

      update: function(){
        this.initData();
        if (this.model.get('modus')){
          this.displayData();
        }
        else{
          this.importData();
        }
      },
  
      initData: function(){
        var topic = this.model.get("topic");
        var inputId = this.model.get("inputId");
        var message = this.model.get("message");
        var data = this.readDB();
        data = this.checkData(topic, inputId, message, data);
        console.log("init ... data[topic]?: ", topic, data);
        this.model.set('db', data);
        this.model.set('message', data[topic][inputId]);
      },

      checkData: function(tp, inp, text, data){
        var obj = {};
        obj[inp] = text;

        if (!data){
            data = {};
            data[tp] = obj;
            return data;
        }
        else if(!data.hasOwnProperty(tp) ){
            data[tp] = obj;
            return data;
        }
        else{
            return data;
        }
      },

      importData: function(){
        var memoDB = this.model.get('db');
        var topic = this.model.get("topic");
        var inputId = this.model.get("inputId");
        var memoText = memoDB[topic][inputId];
        this.updateInput(memoText);
      },

      displayData: function(){
        var memoDB = this.model.get('db');
        var topic = this.model.get("topic");
        var viewport = this.$('#memo-out-'+topic);
        viewport.html("");    // reset view

        for (var item in memoDB[topic]){
          this.$('#memo-out-'+topic).append('<li><div class="header">'+item+'</div><div class="content">'+memoDB[topic][item]+'</div></li>');
        }
      },

      readDB: function(){
        var _data = localStorage.getItem(this.model.get('storageName'));
        if (!_data) { return false; }
        return JSON.parse(_data); 
      },

      writeDB: function(data){
        var _data = JSON.stringify(data);
        localStorage.setItem(this.model.get('storageName'), _data);
      },

      updateData: function(tp, inp, data){
        console.log('updateData: ', tp, inp, data);
        var message = this.model.get('message');

        var storedData = this.readDB();
        storedData = this.checkData(tp, inp, message, storedData);

        console.log('current DB: ', storedData);

        storedData[tp][inp] = data;
        this.model.set('db', storedData);
        console.log('current Data: ', this.model.get('db') );
        
        this.writeDB(storedData);
        console.log("writing DB", localStorage);

      },

      saveMemo: function(){
          var topic = this.model.get("topic");
          var inputId = this.model.get("inputId");
          var elemId = '#'+this.model.get('id');
          var memoText = this.$(elemId).val();
          this.updateData(topic, inputId, memoText);
          this.triggerSignal();
      },

      resetMemo: function(){
        var topic = this.model.get("topic");
        var inputId = this.model.get("inputId");
        var message = this.model.get("resetMessage");
        this.updateInput(message);
        var storedData = this.model.get('db');
        storedData[topic][inputId] = message;
        this.model.set('db', storedData);
        this.writeDB(storedData); 
        this.triggerSignal();
      },

      clearMemo: function(){
        this.updateInput(this.model.get("resetMessage"));
        var topic = this.model.get("topic");
        var storedData = this.model.get('db');
        delete storedData[topic];
        this.model.set('db', storedData);
        this.writeDB(storedData);
        this.triggerSignal();
        },

      updateInput: function(text){
          var elemId = "#"+this.model.get('id');
          this.$(elemId).val(text);
          },

      updateDisplay: function(text){
            var topic = this.model.get("topic");
            this.$('#memo-out-'+topic).html(text);
            },
                  
    },
  {
      template: 'input-memo'
  });
 
  Adapt.register('input-memo', inputMemo);

  return inputMemo;
});
