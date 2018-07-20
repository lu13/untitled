const express = require('express');
const router = express.Router();
const xlsx = require("node-xlsx").default;
const path = require("path");

// sheet name:ServiceCharges
const SHEET_INDEX = 2;

const HOTELCODE_COLINDEX = 0;
const STARTDATE_COLINDEX = 12;
const ENDDATE_COLINDEX = 13;
const TAXABLE_COLINDEX = 14;
const AMOUNT_COLINDEX = 15;
const TYPE_COLINDEX = 16;
const BASIS_COLINDEX = 17;
const PERIOD_COLINDEX = 18;
const DESC_COLINDEX = 19;

let sql = "";

router.get('/', function (req, res) {
    // Parse a file
    const workSheetsFromFile = xlsx.parse(path.resolve(__dirname, '../files/fee.xls'));
    workSheetsFromFile[SHEET_INDEX].data.forEach(function (item, index) {
        if (index > 0) {
            let taxable = item[TAXABLE_COLINDEX] === 'N' ? '0' : '1';
            sql += `insert into hotel_resort_fee (hilton_code,amount,start_date,end_date,tax_basis,tax_desc,tax_period,tax_type,taxable) values ('${item[HOTELCODE_COLINDEX]}','${item[AMOUNT_COLINDEX]}','${item[STARTDATE_COLINDEX]}','${item[ENDDATE_COLINDEX]}','${item[BASIS_COLINDEX]}','${item[DESC_COLINDEX]}','${item[PERIOD_COLINDEX]}','${item[TYPE_COLINDEX]}','${taxable}');
`;
        }
    });
    res.send(200, sql);
});

module.exports = router;
