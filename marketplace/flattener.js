//Define the teal global namespace
window.teal = window.teal || {};
teal.ignore_keys = {};
teal.replace_keys = {};
teal.prefix = "";

//In cases of a nested object, what should join the parent key and child key
teal.nested_delimiter = "_";

//Ignore keys in the data layer that start with the following text.
//Expecting an object of strings
/*
teal.ignore_keys = {
  "user" : 1,
  "util" : 1
};
*/

//Specify a prefix for data layer elements being sent to the utag_data object.
//Instead of utag_data.productID, it could be utag_data.dl_productID
// teal.prefix = "dl_";

//Keys to be removed from the new flattened key name
//For a flattened key, you have digitalData.page.pageInfo.pageName and you want digitalData.page.pi.pageName
/* teal.replace_keys = {
    "pageInfo":"pi"
  };
*/

//For a flattened key, you have digitalData.page.pageInfo.pageName and you want digitalData.page.pageName
/* teal.replace_keys = {
    "pageInfo":""
  };
*/

//For a flattened key, you have digitalData.page.pageInfo.pageName and you want digitalData.pageName
/* teal.replace_keys = {
    "page":"",
    "pageInfo":""
  };
*/

/*****************DO NOT MODIFY BELOW***********************/

teal.flattener_version = 1.3;

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
// Add the Object.keys method for older versions of IE
Object.keys||(Object.keys=function(){"use strict";var a=Object.prototype.hasOwnProperty,b=!{toString:null}.propertyIsEnumerable("toString"),c=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],d=c.length;return function(e){if("object"!=typeof e&&("function"!=typeof e||null===e))throw new TypeError("Object.keys called on non-object");var g,h,f=[];for(g in e)a.call(e,g)&&f.push(g);if(b)for(h=0;h<d;h++)a.call(e,c[h])&&f.push(c[h]);return f}}());

teal.ignoreKey = function(key,re){
  var should_ignore_key = 0;
  //Build a new array to avoid running through Object.keys multiple times
  if(typeof teal.ignore_keys_list === 'undefined'){
    teal.ignore_keys_list = Object.keys(teal.ignore_keys);
    teal.ignore_keys_list.forEach(function(name){
      //Store a copy of the regex in the object
      teal.ignore_keys[name] = new RegExp("^"+name);
      if(key.match(teal.ignore_keys[name])){
        should_ignore_key = 1;
      }
    });
  }else{
    //Loop through the ignore_keys object to see if we should ignore this key
    teal.ignore_keys_list.forEach(function(name){
      if(key.match(teal.ignore_keys[name])){
        should_ignore_key = 1;
      }
    });
  }
  return should_ignore_key;
}

teal.getKeyName = function(key,re){
  //Create a new object to store regexs or use existing one
  teal.replace_keys_regex = teal.replace_keys_regex || {};
  //Build a new array to avoid running through Object.keys multiple times
  if(typeof teal.replace_keys_list === 'undefined'){
    teal.replace_keys_list = Object.keys(teal.replace_keys);
    teal.replace_keys_list.forEach(function(name){
      //Store a copy of the regex in the teal.replace_keys_regex object so that the regexs are only built once
      teal.replace_keys_regex[name] = new RegExp("[" + teal.nested_delimiter + "]?" + name + "[" + teal.nested_delimiter + "]", "g");
      key = teal.keyReplace(key,name,teal.replace_keys_regex[name]);
    });
  }else{
    //Loop through the replace_keys object to see what we should be replacing
    teal.replace_keys_list.forEach(function(name){
      key = teal.keyReplace(key,name,teal.replace_keys_regex[name]);
    });
  }
  return key;
}

teal.keyReplace = function(key,name,re){
  //Check to see if we are replacing the key name with a new value or if we are removing the key altogether
  if(teal.replace_keys[name] === ''){
    //The key needs to be removed completely
    key = key.replace(re,teal.nested_delimiter);
    //Check to see if the key starts with the nested delimiter and if so, remove it
    if(key.indexOf(teal.nested_delimiter) === 0){
      var cleanRegEx = new RegExp("^[" + teal.nested_delimiter + "]");
      key = key.replace(cleanRegEx,'');
    }
  }else{
    //Replace the key name
    key = key.replace(re,teal.nested_delimiter+teal.replace_keys[name]+teal.nested_delimiter);
  }
  return key;
}

teal.mapArr = function(parent){
    var arr_map = {};
    for (var child in parent){
        if (teal.typeOf(parent[child]) == "object"){                                
            var sub_map = teal.mapObj(parent[child]);
                for (var sub in sub_map){
                    if (teal.typeOf(arr_map[sub]) == "undefined"){
                        arr_map[sub] = sub_map[sub];
                    }
                }
            }
        if (teal.typeOf(parent[child]) == "array"){parent_map[child] = [] }
    }
    return arr_map
}

teal.mapObj = function(parent){
    var obj_map = {}
    for (var child in parent){
        if (teal.typeOf(parent[child]) == "string"){ obj_map[child] = "" }
        if (teal.typeOf(parent[child]) == "array"){
            obj_map[child] = [];
            obj_map[child][0] = teal.mapArr(parent[child]);
        }
    }
    return obj_map;
}
        
teal.processDataObject = function(obj, new_obj, parent_key, create_array, parent_map) {
    if (typeof parent_key === "undefined") {
        parent_key = "";
    } else {
        teal.nested_delimiter_regex = teal.nested_delimiter_regex || new RegExp("[" + teal.nested_delimiter + "]$");
        if (!parent_key.match(teal.nested_delimiter_regex)) {
            parent_key += "" + teal.nested_delimiter;
        }
    }
    if (parent_map){
        var path = parent_key.split(teal.nested_delimiter);
        var map = parent_map;
        if (path.length > 2){
            path.pop(); path.shift();                    
            for (var x in path){
                    map = map[path[x]];
                    if (teal.typeOf(map)=="array"){ map = map[0];}
            }
        }
    } 
    var objKeys = map || parent_map || obj;
    Object.keys(objKeys).forEach(function(key) {
        var nested_key_name = parent_key + key;
        var new_key_name = teal.getKeyName((teal.prefix + parent_key + key).replace(/\s/g, ''));
        var key_type = teal.typeOf(obj[key]);
        map = map || {};
        if (new_key_name.indexOf(teal.nested_delimiter) > -1 && (key_type == "null" || key_type == "undefined")) {
            if (typeof (map[key]) == "string") {
                obj[key] = "";
            } else if (teal.typeOf (map[key]) == "array") {
                obj[key] = map[key];
            } else if (typeof (map[key]) == "object") {
                obj[key] = map[key];
            }
            key_type = teal.typeOf(obj[key]);
        } else if (key_type == "object" && key_type !== null) {
            for (var x in map[key]) {
                if ((typeof (obj[key][x]) == "null" || typeof (obj[key][x]) == "undefined")) {
                    obj[key][x] = map[key][x];
                }
            }
        }
        if (new_key_name.indexOf(teal.nested_delimiter) > -1 && (key_type == "null" || key_type == "undefined")) {
            obj[key] = "";
            key_type = teal.typeOf(obj[key]);
        }
        if (key_type !== 'undefined' && key_type != null) {
            if (key_type.match(/boolean|string|number|date/) && !teal.ignoreKey(key)) {
                if (teal.typeOf(obj[key]) === 'date') {
                    obj[key] = obj[key].toISOString();
                }
                if (create_array) {
                    if (teal.typeOf(new_obj[new_key_name]) !== "array") {
                        new_obj[new_key_name] = [];
                    }
                    new_obj[new_key_name].push("" + obj[key]);
                } else {
                    new_obj[new_key_name] = "" + obj[key];
                }
            } else if (key_type === 'object' && !teal.ignoreKey(key)) {
                if ((new_key_name.indexOf(teal.nested_delimiter) > -1 && obj[key].length > 1) || parent_map) {
                    teal.processDataObject(obj[key], new_obj, nested_key_name, create_array, map[key]);
                } else {
                    teal.processDataObject(obj[key], new_obj, nested_key_name, create_array);
                }
            } else if (key_type === 'array') {
                teal.processDataArray(obj[key], new_obj, nested_key_name, parent_map);
            }
        }
    });
}
teal.processDataArray = function(obj, new_obj, parent_key, parent_map) {
    var objLength = obj.length;
    if (parent_key.indexOf(teal.nested_delimiter) == -1){
            var parent_map = teal.mapArr(obj);
    }

    if (typeof parent_key === "undefined") {
        parent_key = "";
    } else if (objLength > 0 && teal.typeOf(obj[0]).match(/boolean|string|number|date/)) {} else {
        parent_key += "" + teal.nested_delimiter;
    }
    var new_key_name = teal.getKeyName((teal.prefix + parent_key).replace(/\s/g, ''));
    for (var n = 0; n < objLength; n++) {
        var key_type = teal.typeOf(obj[n]);
        if (key_type.match(/boolean|string|number|date/)) {
            if (key_type === 'date') {
                obj[n] = obj[n].toISOString();
            }
            if (teal.typeOf(new_obj[new_key_name]) !== "array") {
                new_obj[new_key_name] = [];
            }
            new_obj[new_key_name].push("" + obj[n]);
        } else if (key_type === 'object') {
            if ((new_key_name.indexOf(teal.nested_delimiter) > -1 && obj.length > 1) || parent_map) {
                teal.processDataObject(obj[n], new_obj, new_key_name, 1, parent_map);
            } else {
                teal.processDataObject(obj[n], new_obj, new_key_name, 1);
            }
        }
    }
}

teal.typeOf = function(e){return ({}).toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase();}

teal.flattenObject = function(obj,new_obj){
  //Make sure object exists
  if(typeof obj === 'undefined'){
    return false;
  }
  //Check to see if we want to flatten the same object and keep the reference
  var mergeObject = false;
  if(obj === new_obj){
    mergeObject = true;
    //Start off a clean copy of the object
    new_obj = {};
  }
  //Make sure new object exists
  if(typeof new_obj === 'undefined'){
    new_obj = {};
  }
  //Check to see if this object is an array
  if(teal.typeOf(obj) === 'array'){
    //Store a safe copy of this object in case we are processing the b object
    var temp_array = JSON.parse(JSON.stringify(obj));
    var temp_array_length = temp_array.length;
    //Clean up the object
    obj = {};
    //Let's see if the obj and new_obj are the same.  If so, going to assume we are using the b object
    if(obj == new_obj){
      //Let's ensure that we have the a object
      if(typeof a === 'undefined'){
        var a = 'view';
      }
      //Add the automatic utag data points
      utag.loader.RD(new_obj,a);
    }
    for(var i = 0; i < temp_array_length; i++){
        teal.processDataObject(temp_array[i],new_obj);
    }
  }else{
    teal.processDataObject(obj,new_obj);
  }
  if(mergeObject){
    //Need to delete everything out of obj and replace with new_obj
    Object.keys(obj).forEach(function(key){
      delete obj[key];
    });
    //Now that we have a clean original object, add everything from new_obj which allows the reference to be kept
    Object.keys(new_obj).forEach(function(key){
      obj[key] = new_obj[key];
    });
  }

  return new_obj;
}
