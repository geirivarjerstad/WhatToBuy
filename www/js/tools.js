function getFunctionName(fun) {
    var ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
}

function isObjectValid(object) {
    if(typeof object === "undefined"){
        return false;
    }
    if(object === null){
        return false;
    }
    if(object === ""){
        return false;
    }
    return true;
};

function getMethods(obj)
{
    var res = [];
    for(var m in obj) {
        if(typeof obj[m] == "function") {
            res.push(m)
        }
    }
    return res.sort();
}

