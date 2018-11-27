const express = require('express');
const router = express.Router();
const xlsx = require("node-xlsx").default;
const path = require("path");
const fs = require("fs");
const multiparty = require('multiparty');

// sheet name:ServiceCharges
const SHEET_INDEX = 2;

const HOTELCODE_COLINDEX = 1;
const STARTDATE_COLINDEX = 13;
const ENDDATE_COLINDEX = 14;
const TAXABLE_COLINDEX = 15;
const AMOUNT_COLINDEX = 16;
const TYPE_COLINDEX = 17;
const BASIS_COLINDEX = 18;
const PERIOD_COLINDEX = 19;
const DESC_COLINDEX = 20;

let sql = "";

router.get('/', function (req, res) {
    res.render("import");
});
router.post('/file-upload', function (req, res) {
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: './public/files/'});
    form.parse(req, function (err, fields, files) {
        //上传完成后处理
        var filesTmp = JSON.stringify(files, null, 2);

        if (err) {
            console.log('parse error: ' + err);
            res.send(500, err);
        } else {
            console.log('parse files: ' + filesTmp);
            var inputFile = files.inputFile[0];
            var uploadedPath = inputFile.path;
            var dstPath = './public/files/' + inputFile.originalFilename;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                    res.send(500, err);
                } else {
                    console.log('rename ok');

                    // Parse a file
                    const workSheetsFromFile = xlsx.parse(path.resolve(__dirname, "." + dstPath));
                    workSheetsFromFile[SHEET_INDEX].data.forEach(function (item, index) {
                        if (index > 0) {
                            let taxable = item[TAXABLE_COLINDEX] === 'N' ? '0' : '1';
                            sql += `insert into hotel_resort_fee (hilton_code,amount,start_date,end_date,tax_basis,tax_desc,tax_period,tax_type,taxable) values ('${item[HOTELCODE_COLINDEX]}','${item[AMOUNT_COLINDEX]}','${item[STARTDATE_COLINDEX]}','${item[ENDDATE_COLINDEX]}','${item[BASIS_COLINDEX]}','${item[DESC_COLINDEX]}','${item[PERIOD_COLINDEX]}','${item[TYPE_COLINDEX]}','${taxable}');
`;
                        }
                    });
                    res.send(200, sql);
                }
            });
        }
    });

});

module.exports = router;
