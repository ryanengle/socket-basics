function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            // replace + with space
            // the two forward slashes mark the beginning & end of the regex
            // \+ means the string "+"
            // g = global 
            return decodeURIComponent(pair[1].replace(/\+/g, ' '));
        }
    }    
    return undefined;
}