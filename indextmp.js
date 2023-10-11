const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const { isIPv4 } = require("net");

const printerIp = "10.20.30.101";

if (!isIPv4(printerIp)) {
  console.error("Invalid IP address provided for the printer.");
  process.exit(1);
}

app.use(express.json());
app.use(cors());

app.post("/print", (req, res) => {
  const { message } = req.body;

  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON, // or PrinterTypes.STAR, depending on your printer
    interface: `tcp://${printerIp}:9100`,
  });

  printer.alignCenter();
  printer.println(message);
  printer.cut();

  printer
    .execute()
    .then(() => {
      console.log("Printing completed successfully.");
      res.json({
        success: true,
        message: "Print request received and processed.",
      });
    })
    .catch((error) => {
      console.error("Error occurred while printing:", error);
      res
        .status(500)
        .json({ success: false, error: "Error occurred while printing." });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
