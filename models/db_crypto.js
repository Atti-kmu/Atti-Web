var crypto = require('crypto');

exports.do_ciper = function(inputpass)
{
    // crypto salt
    var salt = "jkjahdkghasdubeuiwbvuyuwieo";
    // encryption iteration count
    var iterations = 30;
    // length of output
    var keylen = 24;

    // generate encrypted key
    var derivedKey = crypto.pbkdf2Sync(inputpass, salt, iterations, keylen);
    var paw = Buffer(derivedKey, 'binary').toString('hex');

    return paw;
};