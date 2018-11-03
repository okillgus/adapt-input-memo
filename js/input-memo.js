define(function(require) {
  //TODO: save, version, upload, test  
  var ComponentView = require('coreViews/componentView');
  var Adapt = require('coreJS/adapt');

  var inputMemo = ComponentView.extend({

      events: {
        "change .memo-text": "triggerSignal",
        "click .saveMemo": "saveMemo",
        "click .resetMemo": "resetMemo",
        "click .clearMemo": "clearMemo"
      },

      preRender: function() {
          // this.checkIfResetOnRevisit();
          var id = "input-memo_"+String(Math.random()).substr(2);
          this.model.set('id', id); // instance id

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
  
        if (topic == param.topic && inputId == param.inputId && id != param.id){ // Changes here or elsewhere?
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
        var data = this.readDB();
        //console.log("importing ..., raw: "+_data);
        data = this.checkData(topic, inputId, message, data);
        //console.log("structured: "+_data);
        var dbName = this.model.get("storageName");        
        this.model.set(dbName, data);
        if (this.model.get('display') == 'one'){         // display one ?
          var tempData = {};
          tempData[inputId] = data[topic][inputId];
          console.log('initOne: ', tempData);
          this.model.set('db', tempData);
        }
        else{
          this.model.set('db', data[_topic]);
        }
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
        var dbName = this.model.get('storageName');
        // console.log(dbName);
        var memoDB = this.model.get(dbName);
        // console.log("postrender", memoDB);
        var topic = this.model.get("topic");
        var inputId = this.model.get("inputId");
        var memoText = memoDB[topic][inputId];
        // view !
        this.updateInput(memoText);
      },

      displayData: function(){
        // Daten in die View laden
        var dbName = this.model.get('storageName');
        // console.log(dbName);
        var memoDB = this.model.get(dbName);
        // console.log("postrender", memoDB);
        // console.log("displaying... ");
        var _topic = this.model.get("topic");
        var _inputId = this.model.get("inputId");

        this.$('#memo-out-'+_topic).html("");    // reset view 
        if (this.model.get('display') == 'one'){ // display one ?
          this.$('#memo-out-'+_topic).append('<div class="header">'+_inputId+'</div><div class="content">'+memoDB[_topic][_inputId]+'</div>');
          }
        else{ // display all ?
          for (var item in memoDB[_topic]){
              var mess = memoDB[_topic][item];
              if (mess != this.model.get('message')){
                this.$('#memo-out-'+_topic).append('<div class="header">'+item+'</div><div class="content">'+memoDB[_topic][item]+'</div>');
                }
            }
          }
        // view !
        
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
        // console.log('updating: ', data);
        var _message = this.model.get('message');

        var _dataObj = this.readDB();
        _dataObj = this.checkData(tp, inp, _message, _dataObj);

        // console.log('current DB: ', _dataObj);

        _dataObj[tp][inp] = data;
        this.model.set(this.model.get('storageName'), _dataObj);
        // console.log('current Data: ', this.model.get(this.model.get('storageName')) );
        
        this.writeDB(_dataObj);
        // console.log("writing DB", localStorage);

      },

      resetData: function(tp, inp){
        var _dataObj = this.model.get(this.model.get('storageName'));
        _dataObj[tp][inp] = this.model.get("message");
        this.model.set(this.model.get('storageName'), _dataObj);
        this.writeDB(_dataObj);            
      },

      clearData: function(tp){
        var _dataObj = this.model.get(this.model.get('storageName'));
        delete _dataObj[tp];
        this.model.set(this.model.get('storageName'), _dataObj);
        this.writeDB(_dataObj);            
      },

      saveMemo: function(){
          var _topic = this.model.get("topic");
          var _inputId = this.model.get("inputId");
          var memoText = this.$('#memo-in-'+_inputId).val();
          this.updateData(_topic, _inputId, memoText);
          //this.triggerSignal();
          // console.log("saved: ", this.model.get(this.model.get('storageName')));
      },

      resetMemo: function(){
        // console.log("reset");
        var _topic = this.model.get("topic");
        var _inputId = this.model.get("inputId");
        this.updateInput(_inputId, this.model.get("message"));
        this.resetData(_topic, _inputId);
        // console.log("reset: ", _topic, _inputId, this.model.get(this.model.get('storageName')));
      },

      clearMemo: function(){
        // console.log("clear");
        this.updateInput(this.model.get("inputId"), this.model.get("message")); // -> Das muss für alle inputs eines topic geschehen
        var _topic = this.model.get("topic");
        this.clearData(_topic);
        // console.log("reset: ", _topic, this.model.get(this.model.get('storageName')));
        },

      updateInput: function(text){
          // console.log("clear");
          var elemId = "#"+this.model.get('id');
          this.$(elemId).val(text);
          },

      updateDisplay: function(text){
            // console.log("clear");
            var _topic = this.model.get("topic");
            this.$('#memo-out-'+_topic).html(text);
            },
                  
    },
  {
      template: 'input-memo'
  });
 
  Adapt.register('input-memo', inputMemo);

  return inputMemo;
});
