const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");

const escpos = require("escpos");
// install escpos-usb adapter module manually
escpos.USB = require("escpos-usb");
// Select the adapter based on your printer type
const device = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');

const options = { encoding: "GB18030" /* default */ };
const printer = new escpos.Printer(device, options);

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.post("/print", (req, res) => {
  const { message } = req.body;
  //printer usb
  device.open(function (error) {
    printer
      .font("a")
      .align("ct")
      .style("bu")
      .size(1, 1)
      .text(message)
      // .barcode("1234567", "EAN8")
      // .table(["One", "Two", "Three"])
      // .tableCustom(
      //   [
      //     { text: "Left", align: "LEFT", width: 0.33, style: "B" },
      //     { text: "Center", align: "CENTER", width: 0.33 },
      //     { text: "Right", align: "RIGHT", width: 0.33 },
      //   ],
      //   { encoding: "cp857", size: [1, 1] } // Optional
      // )
      .qrimage(message, function (err) {
        this.cut();
        this.close();
      });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
