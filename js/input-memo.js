define(function(require) {
    
  var ComponentView = require('coreViews/componentView');
  var Adapt = require('coreJS/adapt');

  var inputMemo = ComponentView.extend({

      events: {
        "click .saveMemo":  "saveMemo",
        "click .resetMemo": "resetMemo",
        "click .clearMemo": "clearMemo"
      },

      preRender: function() {
          // this.checkIfResetOnRevisit();
          this.initData();
      },

      postRender: function() {
        //console.log('modus: ');
        //console.log(this.model.get('modus'));
        //console.log( typeof this.model.get('modus') );
        if (! this.model.get('modus')){
          this.importData();
        }
        else{
          this.displayData();
        }
          this.setReadyStatus();
      },

      initData: function(){
        // Datensatz herrichten 
        var _topic = this.model.get("topic");
        var _inputId = this.model.get("inputId");
        var _message = this.model.get("message");
        var _dbName = this.model.get("storageName");
        var _data = this.readDB();
        //console.log("importing ..., raw: "+_data);
        _data = this.checkData(_topic, _inputId, _message, _data);
        //console.log("structured: "+_data);
        this.model.set(_dbName,_data);
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
        var _topic = this.model.get("topic");
        var _inputId = this.model.get("inputId");
        var memoText = memoDB[_topic][_inputId];
        // view !
        this.updateInput(_inputId, memoText);
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

        if (this.model.get('display') == 'one'){         // display one ?
          this.$('#memo-out-'+_topic).append('<li>'+memoDB[_topic][_inputId]+'</li>');
          }
        else{ // display all ?
          for (item in memoDB[_topic]){
              var mess = memoDB[_topic][item];
              if (mess != this.model.get('message')){
                this.$('#memo-out-'+_topic).append('<li>'+memoDB[_topic][item]+'</li>');
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

      updateInput: function(elemId, text){
          // console.log("clear");
          this.$('#memo-in-'+elemId).val(text);
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
