const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const { isIPv4 } = require("net");

const printerIp = "10.20.30.101"; // Replace this with your printer's IP address

if (!isIPv4(printerIp)) {
  console.error("Invalid IP address provided for the printer.");
  process.exit(1);
}

const printer = new ThermalPrinter({
  type: PrinterTypes.EPSON, // or PrinterTypes.STAR, depending on your printer
  interface: `tcp://${printerIp}:9100`, // Port 9100 is commonly used for thermal printers
});

printer.alignCenter();
printer.println("halo halo hai hai");
printer.cut();

printer
  .execute()
  .then(() => {
    console.log("Printing completed successfully.");
  })
  .catch((error) => {
    console.error("Error occurred while printing:", error);
  });
