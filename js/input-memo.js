define(function(require) {
  //TODO: undo console.log, version, upload, test!  
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
        // console.log('Changed! ', this.model.get('id'));
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
          // console.log('Update? ', param.step);
          // console.log("Update!", this.model.get('id'));
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
        // Datensatz herrichten 
        var topic = this.model.get("topic");
        var inputId = this.model.get("inputId");
        var message = this.model.get("message");
        // this.model.set('resetMessage', message);
        var data = this.readDB();
        //console.log("importing ..., raw: "+_data);
        data = this.checkData(topic, inputId, message, data);
        //console.log("structured: "+_data);
        //var dbName = this.model.get("storageName");        
        //this.model.set(dbName, data);
        console.log("init ... data[topic]?: ", topic, data);
        this.model.set('db', data);
        this.model.set('message', data[topic][inputId]);
      },

      checkData: function(tp, inp, text, data){
          // Datenstruktur überprüfen
          // Problem: Nach ClearData
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
        // Daten in die View laden
        // var dbName = this.model.get('storageName');
        // console.log(dbName);
        var memoDB = this.model.get('db');
        // console.log("postrender", memoDB);
        var topic = this.model.get("topic");
        var inputId = this.model.get("inputId");
        var memoText = memoDB[topic][inputId];
        // view !
        this.updateInput(memoText);
      },

      displayData: function(){
        var memoDB = this.model.get('db');
        console.log(memoDB);
        var topic = this.model.get("topic");
        var viewport = this.$('#memo-out-'+topic);
        console.log(viewport);
        viewport.html("");    // reset view

        for (var item in memoDB[topic]){
          console.log("for ... display: ", item, memoDB[topic], memoDB[topic][item]);
          // var mess = memoDB[topic][item];
          console.log("memoDB[topic][item]:"+memoDB[topic][item]+" != this.model.get('message'):"+this.model.get('message')+" =>",memoDB[topic][item] != this.model.get('message'));
          this.$('#memo-out-'+topic).append('<li><div class="header">'+item+'</div><div class="content">'+memoDB[topic][item]+'</div></li>');
        }
      },

      readDB: function(){
          // Daten aus localStorage holen
        var _data = localStorage.getItem(this.model.get('storageName'));
        // console.log("reading...", _data);
        if (!_data) { return false; }
        return JSON.parse(_data); 
      },

      writeDB: function(data){
          // Daten in localStorage schreiben
        // console.log("writing...", data);
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
          // console.log("saved: ", this.model.get(this.model.get('storageName')));
      },

      resetMemo: function(){
        // console.log("reset");
        var topic = this.model.get("topic");
        var inputId = this.model.get("inputId");
        var message = this.model.get("resetMessage");
        this.updateInput(message);
        // this.resetData(topic, inputId);
        var storedData = this.model.get('db');
        storedData[topic][inputId] = message;
        this.model.set('db', storedData);
        this.writeDB(storedData); 
        this.triggerSignal();
        // console.log("reset: ", topic, _inputId, this.model.get(this.model.get('storageName')));
      },

      clearMemo: function(){
        // console.log("clear");
        this.updateInput(this.model.get("resetMessage")); // -> Das muss für alle inputs eines topic geschehen
        var topic = this.model.get("topic");
        //this.clearData(topic);
        var storedData = this.model.get('db');
        delete storedData[topic];
        this.model.set('db', storedData);
        this.writeDB(storedData);
        this.triggerSignal();
        // console.log("reset: ", topic, this.model.get(this.model.get('storageName')));
        },

      updateInput: function(text){
          // console.log("clear");
          var elemId = "#"+this.model.get('id');
          this.$(elemId).val(text);
          },

      updateDisplay: function(text){
            // console.log("clear");
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
