const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.render("createRateRule");
});

router.post('/createFileSingleCountry', function (req, res) {
    let rslt = '<PrivateRates>';
    let prefix = req.body.prefix;
    let codes = req.body.countryCodes;
    let codeAry = codes.split(',');
    codeAry.forEach(function (code) {
        rslt += ` <RateRule id="${prefix}_${code}">
                    <UserRateCondition op="any">
                        <UserDeviceType>mobile</UserDeviceType>
                        <UserDeviceType>desktop</UserDeviceType>
		            	<UserDeviceType>tablet</UserDeviceType>
                        <UserCountry>${code}</UserCountry>
                    </UserRateCondition>
                  </RateRule>
`;
    });
    rslt += '</PrivateRates>';

    res.writeHead(200, {'Content-Type': 'application/xml'});
    res.end(rslt);

});

router.post('/createFileCountry', function (req, res) {
    let rslt = '<PrivateRates>';
    let prefix = req.body.prefix;
    let codes = req.body.countryCodes;
    let marketAry = req.body.market;
    let codeAry = codes.split(';');
    codeAry.forEach(function (codes, i) {
        let market = marketAry.split(';')[i];
        rslt += ` <RateRule id="${prefix}_${market}">
                    <UserRateCondition op="any">
                        <UserDeviceType>mobile</UserDeviceType>
                        <UserDeviceType>desktop</UserDeviceType>
		            	<UserDeviceType>tablet</UserDeviceType>`;
        codes.split(',').forEach(function (code) {
            rslt += `<UserCountry>${code}</UserCountry>`;
        });
        rslt += `</UserRateCondition>
                  </RateRule>`;
    });
    rslt += '</PrivateRates>';

    res.writeHead(200, {'Content-Type': 'application/xml'});
    res.end(rslt);

});

module.exports = router;
