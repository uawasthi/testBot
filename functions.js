var fs = require('fs');
//function readFile(callback){

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.includes(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}


function mainData (filename){
    
    var data= fs.readFileSync(filename);
    // fs.readFile(filename, 'utf8', function (err, data) {
    //     if (err) throw err;
       var obj = JSON.parse(data);
    //    callback(obj);
return obj
}
 console.log(mainData('agridata.txt')[0]);

// mainData('agridata.txt',
// })
// fs.readFile('agridata.txt', 'utf8', function (err, data) {
//   if (err) throw err;
//   obj = JSON.parse(data);
//  console.log(findStates('Onion',obj))
//  console.log(findMaximumPrice('Onion','Punjab',obj))
// });

function findStates(cropName ,data){
     var states =[]
     for (var i = 0; i < data.length; i++) {
        if(data[i].commodity == cropName)
        states.push(data[i].state)
        }
    var uniqueStates = states.unique();
     return uniqueStates;
}

function findMaximumPrice(cropName ,state ,data)
{  var maxPrice =[]
    for (var i = 0; i < data.length; i++) {
        if(data[i].commodity == cropName  && data[i].state ==state)
        maxPrice.push(data[i].max_price)
        }
      Price =  Math.max.apply(null, maxPrice) ;
        return Price;
}
exports.mainData = mainData;
exports.findStates = findStates;
exports.findMaximumPrice=findMaximumPrice;