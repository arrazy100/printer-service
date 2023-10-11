const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");

const escpos = require("escpos");
escpos.Network = require("escpos-network")
// install escpos-usb adapter module manually
// escpos.USB = require("escpos-usb");
// Select the adapter based on your printer type
// const device = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');

const options = { encoding: "GB18030" /* default */ };
// const printer = new escpos.Printer(device, options);

// const corsOptions = {
//   origin: "http://localhost:3000", // Allow requests from this origin
//   methods: "POST", // Allow only POST requests
// };

app.use(express.json());
// app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/print", (req, res) => {
  const { message, printerIp } = req.body;

  if (!printerIp) {
    return res.status(400).json({ error: "printerIp is required in the request body" });
  }

  const device = new escpos.Network(printerIp);

  // Printer setup and print code here
  device.open(function (error) {
    const printer = new escpos.Printer(device, options);
    printer
      .font("a")
      .align("ct")
      .style("bu")
      .size(1, 1)
      .text(message)
      .qrimage(message, function (err) {
        this.cut();
        this.close();
      });
  });
  
  res.json({ message: "Print request sent to the printer." });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
